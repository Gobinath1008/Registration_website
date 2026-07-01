'use client';

import { useState, useEffect } from 'react';
import JSZip from 'jszip';

const EVENT_DETAILS = {
  'BrainWave Summit': {
    type: 'Technical',
    badge: 'Technical',
    shortDesc: 'Present your research and innovative ideas on cutting-edge technologies.',
    teamSize: '2-3 Members',
    duration: '5 mins',
    description: 'Present your research and innovative ideas on cutting-edge technologies. Choose a topic from the list below!',
    topics: [
      '1. Biotechnology & AI in Healthcare',
      '2. Role of Robotics in Modern Society',
      '3. Digital Banking & FinTech Revolution',
      '4. Space Technology & India\'s Growth',
      '5. Cyber Security: Protecting the Digital World'
    ],
    rules: [
      'Each team can consist of 1–3 members.',
      'PPT must be submitted before the specified deadline.',
      'Presentation time: 8–10 minutes',
      'Judging will be based on content quality, clarity, innovation, presentation skills, and response to questions.',
      'The decision of the judges will be final.',
      'Slides: min 5 / max 12–15.',
      'Format: .ppt / .pdf / .pptx',
      'Keep a backup copy (USB/Email)',
      'Mail ID: mcakiot@gmail.com (share your PPT to this mail)'
    ],
    coordinators: [
      'DHARVIN A - 6374667418',
      'NANDHINI P - 8248529186',
      'GOBIKA K.S - 8754207260'
    ]
  },
  'Bug Busters': {
    type: 'Technical',
    badge: 'Technical',
    shortDesc: 'Test your debugging skills by finding and fixing bugs in code.',
    teamSize: 'Individual',
    duration: '30 mins',
    description: 'Test your debugging skills by finding and fixing bugs in code.',
    rules: [
      'Individual participation.',
      'There are Two rounds, Language- C, Java.',
      'Details will be revealed on the spot.',
      'Time limit will be strictly followed.',
      'No internet, mobile phones, or external devices allowed.',
      'Judging will be based on accuracy, output correctness & time taken.',
      'Decision of judges will be final.',
      'Be prepared for anything!'
    ],
    coordinators: [
      'GAUTHAM S - 8610264552',
      'GOBINATH S - 9790021257',
      'RITIKA V.B - 9750293191'
    ]
  },
  'Decode Logo': {
    type: 'Fun',
    badge: 'Fun',
    shortDesc: 'Identify the logo and prove your tech IQ!',
    teamSize: '2 Members',
    duration: '1 hour',
    description: 'Identify the logo and prove your tech IQ!',
    rules: [
      'Only two members per team are allowed.',
      'Each question must be answered within the given time (usually 10-15 seconds).',
      'No talking or discussing answers with other teams.',
      'Only one answer is allowed per question. Once submitted, it cannot be changed.',
      'Each correct answer earns 1 point (or as decided by the quiz master).',
      'The decision of the quiz master is final in case of disputes or tie-breakers.'
    ],
    coordinators: [
      'SANDHIYA P - 6383035794',
      'DIHEESH S - 9677373855',
      'GOPIKA S.R - 8248318813'
    ]
  },
  'Mystic Meet': {
    type: 'Fun',
    badge: 'Fun',
    shortDesc: 'A fun and challenging surprise event that combines creativity and technical skill.',
    teamSize: 'Individual',
    duration: 'Flexible',
    description: 'A fun and challenging event that combines creativity and technical skill (Surprise event).',
    rules: [
      'Individual participation.',
      'Decision of judges will be final.',
      'Be prepared for anything!'
    ],
    coordinators: [
      'VIJAY E - 7639318911',
      'GAUTAM N.M - 7639317742'
    ]
  }
};

export default function Home() {
  // Navigation & Scroll states
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Global Settings state
  const [settings, setSettings] = useState({
    eventDate: '2026-03-12T09:00:00.000Z',
    registrationClosed: false
  });

  // Countdown timer state
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: 'upcoming' // 'upcoming' | 'live' | 'completed'
  });

  // Modal state
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  // Form registration states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    college: '',
    department: '',
    year: '',
    technicalEvent: '',
    nonTechnicalEvent: '',
    transactionId: '',
    paymentMode: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Secret admin state variables
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [isAdminView, setIsAdminView] = useState(false);
  
  // Admin dashboard state variables
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState('list'); // 'list' | 'gallery'
  
  // Admin dynamic Settings Panel state
  const [adminSettingsInput, setAdminSettingsInput] = useState({
    eventDate: '',
    registrationClosed: false
  });

  // Admin edit, delete, & screenshot viewer modal states
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [viewingScreenshot, setViewingScreenshot] = useState(null); // Registration object
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteAllConfirmText, setDeleteAllConfirmText] = useState('');
  
  // Print helper state
  const [printItem, setPrintItem] = useState(null); // 'all', or student object, or null

  // Custom Modal Notification Popup state
  const [notification, setNotification] = useState({
    show: false,
    type: 'success', // 'success' | 'error'
    title: '',
    message: ''
  });

  // Fetch settings on load
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSettings(data.data);
        // Format for HTML date input: YYYY-MM-DDThh:mm
        const dateObj = new Date(data.data.eventDate);
        // adjust to local time ISO split
        const tzOffset = dateObj.getTimezoneOffset() * 60000; // offset in milliseconds
        const localISOTime = (new Date(dateObj.getTime() - tzOffset)).toISOString().slice(0, 16);
        setAdminSettingsInput({
          eventDate: localISOTime,
          registrationClosed: data.data.registrationClosed
        });
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Helper to trigger custom popup
  const showNotification = (type, title, message) => {
    setNotification({
      show: true,
      type,
      title,
      message
    });
  };

  // Close notification helper
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
    
    // Switch to admin view if access was granted
    if (notification.type === 'success' && notification.title === 'Access Granted') {
      setIsAdminView(true);
      fetchRegistrations();
    }
  };

  // Countdown Timer effect reacting to fetched Settings
  useEffect(() => {
    const updateCountdown = () => {
      const eventDateObj = new Date(settings.eventDate);
      const now = new Date();
      const distance = eventDateObj.getTime() - now.getTime();

      const eventDateStr = eventDateObj.toDateString();
      const nowDateStr = now.toDateString();

      // If manually closed
      if (settings.registrationClosed) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'completed' });
        return;
      }

      // If today is the event day (Day is active)
      if (nowDateStr === eventDateStr) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'live' });
        return;
      }

      // If the event has passed
      if (now > eventDateObj) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'completed' });
        return;
      }

      // Upcoming countdown math
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds, status: 'upcoming' });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [settings]);

  // Scroll listener for sticky navbar & back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }

      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter registrations when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRegistrations(registrations);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = registrations.filter((reg) => {
        return (
          reg.name?.toLowerCase().includes(lowerQuery) ||
          reg.rollNumber?.toLowerCase().includes(lowerQuery) ||
          reg.college?.toLowerCase().includes(lowerQuery) ||
          reg.department?.toLowerCase().includes(lowerQuery) ||
          reg.technicalEvent?.toLowerCase().includes(lowerQuery) ||
          reg.nonTechnicalEvent?.toLowerCase().includes(lowerQuery) ||
          reg.transactionId?.toLowerCase().includes(lowerQuery)
        );
      });
      setFilteredRegistrations(filtered);
    }
  }, [searchQuery, registrations]);

  // Scroll to section smoothly
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Logo secret entrance trigger (5 clicks)
  const handleLogoClick = () => {
    if (isAdminView) {
      setIsAdminView(false);
      return;
    }
    
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    
    if (newCount >= 5) {
      setLogoClickCount(0);
      setShowPasswordModal(true);
    }
  };

  // Password submission for admin dashboard access
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setShowPasswordModal(false);
    
    if (adminPasswordInput === 'sollamatan') {
      setAdminPasswordInput('');
      showNotification(
        'success', 
        'Access Granted', 
        'Welcome back! Unlocking the administrative control dashboard.'
      );
    } else {
      setAdminPasswordInput('');
      showNotification(
        'error', 
        'Access Denied', 
        'Incorrect administrator password. Access verification failed.'
      );
    }
  };

  // Fetch registrations from database
  const fetchRegistrations = async () => {
    setAdminLoading(true);
    try {
      const res = await fetch('/api/admin/registrations', {
        headers: {
          'x-admin-password': 'sollamatan'
        }
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setRegistrations(data.data);
      } else {
        showNotification('error', 'Data Retrieval Failed', data.message || 'Could not fetch records.');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Database Error', 'A connection error occurred while retrieving registrations.');
    } finally {
      setAdminLoading(false);
    }
  };

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  // Form submit handler (Public User Registration)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      phone,
      rollNumber,
      college,
      department,
      year,
      technicalEvent,
      nonTechnicalEvent,
      transactionId,
      paymentMode
    } = formData;

    if (
      !name ||
      !email ||
      !phone ||
      !rollNumber ||
      !college ||
      !department ||
      !year ||
      !technicalEvent ||
      !nonTechnicalEvent ||
      !transactionId ||
      !paymentMode
    ) {
      showNotification('error', 'Incomplete Form', 'Please fill in all required fields.');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      showNotification('error', 'Invalid Input', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        showNotification(
          'success', 
          'Registration Successful!', 
          'Thank you for registering! Your registration is pending payment validation. Please ensure you have sent your screenshot in the WhatsApp group.'
        );
        setFormData({
          name: '',
          email: '',
          phone: '',
          rollNumber: '',
          college: '',
          department: '',
          year: '',
          technicalEvent: '',
          nonTechnicalEvent: '',
          transactionId: '',
          paymentMode: ''
        });
      } else {
        showNotification('error', 'Registration Failed', result.message || 'An error occurred during submission.');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      showNotification('error', 'Connection Error', 'Failed to contact the server. Please check your internet connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit registrant details in admin panel
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations/${editingStudent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': 'sollamatan'
        },
        body: JSON.stringify(editingStudent)
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setEditingStudent(null);
        showNotification('success', 'Details Updated', 'Student registration details have been updated successfully.');
        fetchRegistrations(); // refresh list
      } else {
        showNotification('error', 'Update Failed', data.message || 'Could not update the record.');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Connection Failure', 'Failed to submit modifications to the database.');
    } finally {
      setAdminLoading(false);
    }
  };

  // Delete individual registrant
  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    setAdminLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations/${deletingStudent._id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': 'sollamatan'
        }
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setDeletingStudent(null);
        showNotification('success', 'Record Deleted', 'The student record has been permanently removed.');
        fetchRegistrations(); // refresh list
      } else {
        showNotification('error', 'Deletion Failed', data.message || 'Could not delete the record.');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Database Error', 'Failed to communicate deletion to MongoDB.');
    } finally {
      setAdminLoading(false);
    }
  };

  // Delete ALL records
  const handleDeleteAllConfirm = async () => {
    if (deleteAllConfirmText !== 'DELETE ALL INEXON') {
      showNotification('error', 'Validation Error', 'Confirmation text mismatch. Database wipe cancelled.');
      return;
    }
    setAdminLoading(true);
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'DELETE',
        headers: {
          'x-admin-password': 'sollamatan'
        }
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setShowDeleteAllModal(false);
        setDeleteAllConfirmText('');
        showNotification('success', 'Database Cleared', `Successfully removed all ${data.count} student registration records.`);
        fetchRegistrations(); // refresh
      } else {
        showNotification('error', 'Wipe Failed', data.message || 'Could not wipe records.');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Connection Error', 'A database communication failure occurred.');
    } finally {
      setAdminLoading(false);
    }
  };

  // Admin settings update date/time & manual closure
  const handleAdminSettingsSubmit = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': 'sollamatan'
        },
        body: JSON.stringify({
          eventDate: adminSettingsInput.eventDate,
          registrationClosed: adminSettingsInput.registrationClosed
        })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSettings(data.data);
        const dateObj = new Date(data.data.eventDate);
        const tzOffset = dateObj.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(dateObj.getTime() - tzOffset)).toISOString().slice(0, 16);
        setAdminSettingsInput({
          eventDate: localISOTime,
          registrationClosed: data.data.registrationClosed
        });
        showNotification('success', 'Configurations Saved', 'Global symposium date/time and closure settings updated.');
      } else {
        showNotification('error', 'Update Failed', data.message || 'Could not save configurations.');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Network Error', 'Failed to communicate configurations to the server.');
    } finally {
      setAdminLoading(false);
    }
  };

  // Batch download payment screenshots using JSZip
  const handleDownloadAllScreenshots = async () => {
    try {
      setAdminLoading(true);
      const zip = new JSZip();
      let fileCount = 0;

      registrations.forEach((reg) => {
        if (reg.paymentScreenshot) {
          const parts = reg.paymentScreenshot.split(',');
          if (parts.length === 2) {
            const metadata = parts[0];
            const base64Data = parts[1];

            // Extract file extension from base64 metadata header, fallback to png
            let extension = 'png';
            const matches = metadata.match(/image\/([a-zA-Z0-9+]+);/);
            if (matches && matches.length > 1) {
              extension = matches[1];
              if (extension === 'jpeg') extension = 'jpg';
            }

            // Filename format: ROLLNUMBER_STUDENTNAME.ext
            const cleanRoll = reg.rollNumber.trim().toUpperCase().replace(/[^a-zA-Z0-9]/g, '_');
            const cleanName = reg.name.trim().replace(/[^a-zA-Z0-9]/g, '_');
            const filename = `${cleanRoll}_${cleanName}.${extension}`;

            zip.file(filename, base64Data, { base64: true });
            fileCount++;
          }
        }
      });

      if (fileCount === 0) {
        showNotification('error', 'Download Cancelled', 'No payment screenshots have been uploaded by students yet.');
        setAdminLoading(false);
        return;
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = 'INEXON26_Payment_Receipts.zip';
      link.click();

      showNotification('success', 'Download Complete', `Successfully compiled and downloaded ${fileCount} screenshot files inside a single ZIP folder.`);
    } catch (err) {
      console.error('JSZip Error:', err);
      showNotification('error', 'ZIP Failed', 'An error occurred while compiling screenshots into the ZIP file.');
    } finally {
      setAdminLoading(false);
    }
  };

  // Handle printing triggers
  const triggerPrintList = () => {
    setPrintItem('all');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const triggerPrintPass = (student) => {
    setPrintItem(student);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Render Admin View Layout
  if (isAdminView) {
    return (
      <>
        {/* Printable Area Section (hidden by screen CSS, visible during printing) */}
        <div id="print-section">
          {printItem && (
            <div className="print-page-wrapper">
              <div className="print-header">
                <img src="/media/image.png" alt="College Logo" className="print-logo" />
                <div className="print-header-text">
                  <h2>KNOWLEDGE INSTITUTE OF TECHNOLOGY</h2>
                  <h3>Department of Master of Computer Applications (MCA)</h3>
                  <p>National Level Technical & Non-Technical Symposium - INEXON'26</p>
                </div>
              </div>
              <div className="print-divider"></div>

              {printItem === 'all' ? (
                // Print all students summary list
                <div className="print-list-container">
                  <h2 className="print-title">INEXON'26 - Registered Students Report</h2>
                  <p className="print-metadata">Total Registered: {filteredRegistrations.length} Students | Generated on: {new Date().toLocaleDateString()}</p>
                  
                  <table className="print-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>College Name</th>
                        <th>Department</th>
                        <th>Technical Event</th>
                        <th>Non-Technical Event</th>
                        <th>Phone</th>
                        <th>Transaction ID</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrations.map((reg, idx) => (
                        <tr key={reg._id}>
                          <td>{idx + 1}</td>
                          <td>{reg.name}</td>
                          <td>{reg.rollNumber}</td>
                          <td>{reg.college}</td>
                          <td>{reg.department} ({reg.year})</td>
                          <td>{reg.technicalEvent}</td>
                          <td>{reg.nonTechnicalEvent}</td>
                          <td>{reg.phone}</td>
                          <td>{reg.transactionId}</td>
                          <td>{reg.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // Print individual student pass/ticket
                <div className="print-pass-card">
                  <div className="ticket-badge">ENTRY PASS</div>
                  <h2>REGISTRATION CONFIRMATION</h2>
                  
                  <div className="print-pass-grid">
                    <div className="pass-row">
                      <span className="pass-label">Participant Name:</span>
                      <span className="pass-val">{printItem.name}</span>
                    </div>
                    <div className="pass-row">
                      <span className="pass-label">Roll Number:</span>
                      <span className="pass-val">{printItem.rollNumber}</span>
                    </div>
                    <div className="pass-row">
                      <span className="pass-label">Institution:</span>
                      <span className="pass-val">{printItem.college}</span>
                    </div>
                    <div className="pass-row">
                      <span className="pass-label">Department & Year:</span>
                      <span className="pass-val">{printItem.department} - {printItem.year}</span>
                    </div>
                    <div className="pass-row">
                      <span className="pass-label">Phone & Email:</span>
                      <span className="pass-val">{printItem.phone} / {printItem.email}</span>
                    </div>
                    <div className="pass-row border-highlight">
                      <span className="pass-label">Selected Tech Event:</span>
                      <span className="pass-val highlight-purple">{printItem.technicalEvent}</span>
                    </div>
                    <div className="pass-row border-highlight">
                      <span className="pass-label">Selected Fun Event:</span>
                      <span className="pass-val highlight-cyan">{printItem.nonTechnicalEvent}</span>
                    </div>
                    <div className="pass-row">
                      <span className="pass-label">Transaction ID:</span>
                      <span className="pass-val">{printItem.transactionId} ({printItem.paymentMode})</span>
                    </div>
                    <div className="pass-row">
                      <span className="pass-label">Registration Status:</span>
                      <span className="pass-val status-pill">{printItem.status}</span>
                    </div>
                  </div>

                  <div className="print-pass-footer">
                    <div className="footer-signature">
                      <p>_______________________</p>
                      <p>Faculty Coordinator Signature</p>
                    </div>
                    <div className="footer-instructions">
                      <p>⚠️ Join WhatsApp Group for Event Schedule timings.</p>
                      <p>⚠️ Produce this entry pass during check-in on March 12, 2026.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Admin Dashboard Screen Page */}
        <div className="admin-dashboard-container">
          <header className="admin-header">
            <div className="admin-header-left">
              <img src="/media/image.png" alt="KIOT Logo" className="admin-logo" onClick={handleLogoClick} title="Exit Admin Panel" />
              <div>
                <h1>INEXON'26 - Administrative Portal</h1>
                <p className="admin-subtitle">MCA Department Symposium Manager • Knowledge Institute of Technology</p>
              </div>
            </div>
            <div className="admin-header-actions">
              <button className="btn btn-secondary" onClick={() => setIsAdminView(false)}>
                ← Back to Website
              </button>
            </div>
          </header>

          <main className="admin-main container">
            
            {/* Admin Date Configuration Toolbar settings */}
            <div className="admin-settings-panel" style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              padding: '2rem',
              borderRadius: '16px',
              marginBottom: '2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}>
              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem', marginBottom: '1.5rem', color: '#fff' }}>
                ⚙️ Symposium Settings
              </h3>
              <form onSubmit={handleAdminSettingsSubmit} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ marginBottom: 0, minWidth: '250px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Event Date &amp; Time Configuration</label>
                  <input 
                    type="datetime-local" 
                    value={adminSettingsInput.eventDate}
                    onChange={(e) => setAdminSettingsInput({ ...adminSettingsInput, eventDate: e.target.value })}
                    required
                    style={{ marginTop: '0.5rem', width: '100%', padding: '0.8rem' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0, flexDirection: 'row', gap: '0.6rem', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    id="registrationClosedCheck"
                    checked={adminSettingsInput.registrationClosed}
                    onChange={(e) => setAdminSettingsInput({ ...adminSettingsInput, registrationClosed: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--color-secondary)' }}
                  />
                  <label htmlFor="registrationClosedCheck" style={{ cursor: 'pointer', fontWeight: 600 }}>Force Close Public Registrations</label>
                </div>
                <button type="submit" className="submit-btn" style={{ width: 'auto', padding: '0.9rem 2rem', marginTop: 0 }} disabled={adminLoading}>
                  Save Settings
                </button>
              </form>
            </div>

            <div className="admin-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <button 
                className={`btn ${adminActiveTab === 'list' ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => setAdminActiveTab('list')}
                style={{ borderRadius: '8px', padding: '0.8rem 1.5rem' }}
              >
                📋 Registrations List ({filteredRegistrations.length})
              </button>
              <button 
                className={`btn ${adminActiveTab === 'gallery' ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => setAdminActiveTab('gallery')}
                style={{ borderRadius: '8px', padding: '0.8rem 1.5rem' }}
              >
                🖼️ Receipt Gallery ({filteredRegistrations.filter(r => r.paymentScreenshot).length})
              </button>
            </div>

            <div className="admin-toolbar">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search students by name, roll no, college, event, transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="toolbar-buttons">
                <button className="btn btn-secondary" onClick={fetchRegistrations} disabled={adminLoading}>
                  🔄 Refresh Data
                </button>
                <button className="btn btn-primary" onClick={handleDownloadAllScreenshots} disabled={registrations.length === 0 || adminLoading}>
                  📦 Download Zip Receipts
                </button>
                <button className="btn btn-primary" onClick={triggerPrintList} disabled={filteredRegistrations.length === 0}>
                  🖨️ Print List ({filteredRegistrations.length})
                </button>
                <button className="btn btn-danger" style={{ backgroundColor: '#ff0055', color: '#fff', border: 'none' }} onClick={() => setShowDeleteAllModal(true)}>
                  🗑️ Delete All Records
                </button>
              </div>
            </div>

            {adminLoading ? (
              <div className="admin-message-box">
                <h2>Processing database query...</h2>
              </div>
            ) : adminActiveTab === 'list' ? (
              filteredRegistrations.length === 0 ? (
                <div className="admin-message-box">
                  <h2>No registration records found.</h2>
                  <p>Try refreshing or adjust your search filter query.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>College</th>
                        <th>Dept & Year</th>
                        <th>Technical Event</th>
                        <th>Non-Technical Event</th>
                        <th>Phone / Email</th>
                        <th>Transaction Details</th>
                        <th>Screenshot</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrations.map((student, idx) => (
                        <tr key={student._id}>
                          <td>{idx + 1}</td>
                          <td><strong>{student.name}</strong></td>
                          <td><code>{student.rollNumber}</code></td>
                          <td>{student.college}</td>
                          <td>{student.department} - {student.year}</td>
                          <td><span className="badge badge-tech">{student.technicalEvent}</span></td>
                          <td><span className="badge badge-fun">{student.nonTechnicalEvent}</span></td>
                          <td>
                            <div>{student.phone}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.email}</div>
                          </td>
                          <td>
                            <div><code>{student.transactionId}</code></div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.paymentMode}</div>
                          </td>
                          <td>
                            {student.paymentScreenshot ? (
                              <div 
                                className="admin-screenshot-thumbnail" 
                                onClick={() => setViewingScreenshot(student)}
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  borderRadius: '4px',
                                  overflow: 'hidden',
                                  cursor: 'pointer',
                                  border: '1px solid var(--border)',
                                  position: 'relative'
                                }}
                                title="Click to view full screenshot"
                              >
                                <img 
                                  src={student.paymentScreenshot} 
                                  alt="Thumb" 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: '#ff0055' }}>No Image</span>
                            )}
                          </td>
                          <td>
                            <span className={`status-tag status-${student.status?.toLowerCase()}`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="table-actions">
                            <button className="icon-btn btn-edit" title="Edit Student" onClick={() => setEditingStudent({ ...student, status: 'Payed' })}>
                              ✏️
                            </button>
                            <button className="icon-btn btn-print" title="Print entry pass" onClick={() => triggerPrintPass(student)}>
                              🖨️
                            </button>
                            <button className="icon-btn btn-delete" title="Delete record" onClick={() => setDeletingStudent(student)}>
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              // Receipt Gallery Tab View
              filteredRegistrations.filter(r => r.paymentScreenshot).length === 0 ? (
                <div className="admin-message-box">
                  <h2>No payment screenshots uploaded yet.</h2>
                  <p>Students must upload a receipt during registration to populate this gallery.</p>
                </div>
              ) : (
                <div className="admin-screenshot-gallery-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '1.5rem',
                  marginTop: '1rem'
                }}>
                  {filteredRegistrations.filter(r => r.paymentScreenshot).map((student) => (
                    <div className="admin-gallery-card" key={student._id} style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      transition: 'var(--transition)'
                    }}>
                      <div className="gallery-image-wrapper" onClick={() => setViewingScreenshot(student)} style={{
                        height: '180px',
                        background: 'rgba(0,0,0,0.2)',
                        borderBottom: '1px solid var(--border)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        position: 'relative'
                      }}>
                        <img 
                          src={student.paymentScreenshot} 
                          alt={`${student.name} receipt`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.3s ease' }}
                        />
                        <div className="gallery-hover-overlay" style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'rgba(0, 0, 0, 0.4)',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: '0.3s ease',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.9rem'
                        }}>
                          🔍 View Fullscreen
                        </div>
                      </div>
                      <div className="gallery-card-info" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                        <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {student.name}
                        </h4>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          <code>{student.rollNumber}</code>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          🔑 Tx: {student.transactionId}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          🏫 {student.college}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', flex: 1, minWidth: 0 }}
                            onClick={() => setViewingScreenshot(student)}
                          >
                            View
                          </button>
                          <a 
                            href={student.paymentScreenshot} 
                            download={`${student.rollNumber}_receipt`} 
                            className="btn btn-primary"
                            style={{ 
                              padding: '0.4rem 0.8rem', 
                              fontSize: '0.78rem', 
                              flex: 1, 
                              textAlign: 'center', 
                              textDecoration: 'none', 
                              background: 'linear-gradient(135deg, var(--color-primary), #6300a8)',
                              minWidth: 0
                            }}
                          >
                            Save
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </main>

          {/* Admin Edit Modal */}
          {editingStudent && (
            <div className="modal show" style={{ display: 'block' }} onClick={() => setEditingStudent(null)}>
              <div className="modal-content admin-modal" onClick={(e) => e.stopPropagation()}>
                <span className="close-button" onClick={() => setEditingStudent(null)}>&times;</span>
                <h3>Edit Student Details</h3>
                <form onSubmit={handleEditSubmit} className="admin-edit-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        value={editingStudent.name} 
                        required
                        onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input 
                        type="email" 
                        value={editingStudent.email} 
                        required
                        onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input 
                        type="text" 
                        value={editingStudent.phone} 
                        required
                        onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Roll Number</label>
                      <input 
                        type="text" 
                        value={editingStudent.rollNumber} 
                        required
                        onChange={(e) => setEditingStudent({...editingStudent, rollNumber: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>College/Institution</label>
                    <input 
                      type="text" 
                      value={editingStudent.college} 
                      required
                      onChange={(e) => setEditingStudent({...editingStudent, college: e.target.value})} 
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Department</label>
                      <select 
                        value={editingStudent.department} 
                        required
                        onChange={(e) => setEditingStudent({...editingStudent, department: e.target.value})}
                      >
                        <option value="MCA">MCA</option>
                        <option value="M.Sc (CS)">M.Sc (CS)</option>
                        <option value="BCA">BCA</option>
                        <option value="B.Sc (CS)">B.Sc (CS)</option>
                        <option value="B.Sc (IT)">B.Sc (IT)</option>
                        <option value="B.Sc (AI & DS)">B.Sc (AI & DS)</option>
                        <option value="B.Sc (Maths)">B.Sc (Maths)</option>
                        <option value="B.Sc (Physics)">B.Sc (Physics)</option>
                        <option value="B.Sc (Chemistry)">B.Sc (Chemistry)</option>
                        <option value="BCOM">BCOM</option>
                        <option value="BCOM-CA">BCOM-CA</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Year</label>
                      <select 
                        value={editingStudent.year} 
                        required
                        onChange={(e) => setEditingStudent({...editingStudent, year: e.target.value})}
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Technical Event</label>
                      <select 
                        value={editingStudent.technicalEvent} 
                        required
                        onChange={(e) => setEditingStudent({...editingStudent, technicalEvent: e.target.value})}
                      >
                        <option value="BrainWave Summit">BrainWave Summit</option>
                        <option value="Bug Busters">Bug Busters</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Non-Technical Event</label>
                      <select 
                        value={editingStudent.nonTechnicalEvent} 
                        required
                        onChange={(e) => setEditingStudent({...editingStudent, nonTechnicalEvent: e.target.value})}
                      >
                        <option value="Decode Logo">Decode Logo</option>
                        <option value="Mystic Meet">Mystic Meet</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Transaction ID</label>
                      <input 
                        type="text" 
                        value={editingStudent.transactionId} 
                        required
                        onChange={(e) => setEditingStudent({...editingStudent, transactionId: e.target.value})} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Payment Mode</label>
                      <select 
                        value={editingStudent.paymentMode} 
                        required
                        onChange={(e) => setEditingStudent({...editingStudent, paymentMode: e.target.value})}
                      >
                        <option value="Google Pay">Google Pay</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="Paytm">Paytm</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Registration Approval Status</label>
                    <select 
                      value={editingStudent.status || 'Payed'} 
                      required
                      onChange={(e) => setEditingStudent({...editingStudent, status: e.target.value})}
                    >
                      <option value="Payed">Payed</option>
                    </select>
                  </div>

                  <button type="submit" className="submit-btn" disabled={adminLoading}>
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Admin Payment Screenshot Viewer Modal */}
          {viewingScreenshot && (
            <div className="modal show" style={{ display: 'block' }} onClick={() => setViewingScreenshot(null)}>
              <div className="modal-content admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <span className="close-button" onClick={() => setViewingScreenshot(null)}>&times;</span>
                <h3>Payment Verification Screenshot</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
                  Participant: <strong>{viewingScreenshot.name}</strong> ({viewingScreenshot.rollNumber})
                </p>
                <div className="screenshot-display-container" style={{
                  maxHeight: '450px',
                  overflowY: 'auto',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '10px',
                  textAlign: 'center'
                }}>
                  <img 
                    src={viewingScreenshot.paymentScreenshot} 
                    alt="Receipt Screenshot" 
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} 
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button className="submit-btn" style={{ background: '#333', boxShadow: 'none' }} onClick={() => setViewingScreenshot(null)}>
                    Close
                  </button>
                  <a 
                    href={viewingScreenshot.paymentScreenshot} 
                    download={`${viewingScreenshot.rollNumber}_receipt`} 
                    className="submit-btn" 
                    style={{ 
                      background: 'linear-gradient(135deg, var(--color-primary), #6300a8)',
                      textAlign: 'center',
                      textDecoration: 'none'
                    }}
                  >
                    Download Image
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Delete Single Student Confirmation Modal */}
          {deletingStudent && (
            <div className="modal show" style={{ display: 'block' }} onClick={() => setDeletingStudent(null)}>
              <div className="modal-content admin-modal delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
                <span className="close-button" onClick={() => setDeletingStudent(null)}>&times;</span>
                <h3 style={{ color: '#ff0055' }}>Confirm Deletion</h3>
                <p style={{ marginTop: '1rem', color: '#fff' }}>
                  Are you sure you want to delete the registration record for:
                </p>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', margin: '1rem 0', border: '1px solid var(--border)' }}>
                  <p><strong>Name:</strong> {deletingStudent.name}</p>
                  <p><strong>Roll Number:</strong> {deletingStudent.rollNumber}</p>
                  <p><strong>College:</strong> {deletingStudent.college}</p>
                </div>
                <p style={{ color: '#ffc107', fontSize: '0.85rem' }}>
                  ⚠️ WARNING: This action cannot be undone and will permanently delete the student data from MongoDB.
                </p>
                <div className="confirm-btn-group" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button className="submit-btn" style={{ background: '#333', boxShadow: 'none' }} onClick={() => setDeletingStudent(null)}>
                    Cancel
                  </button>
                  <button className="submit-btn" style={{ background: '#ff0055', boxShadow: '0 4px 15px rgba(255, 0, 85, 0.4)' }} onClick={handleDeleteConfirm}>
                    Yes, Delete Record
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete ALL Students Confirmation Modal */}
          {showDeleteAllModal && (
            <div className="modal show" style={{ display: 'block' }} onClick={() => setShowDeleteAllModal(false)}>
              <div className="modal-content admin-modal delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
                <span className="close-button" onClick={() => setShowDeleteAllModal(false)}>&times;</span>
                <h3 style={{ color: '#ff0055' }}>⚠️ CRITICAL: Delete All Records</h3>
                <p style={{ marginTop: '1rem', color: '#fff' }}>
                  You are about to delete <strong>ALL registrations</strong> from the database.
                </p>
                <p style={{ color: '#ffb703', margin: '0.8rem 0' }}>
                  This operation is highly dangerous. To confirm deletion, type the exact phrase <strong>DELETE ALL INEXON</strong> below:
                </p>
                
                <input 
                  type="text" 
                  placeholder="Type 'DELETE ALL INEXON'"
                  className="delete-all-input"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid #ff0055',
                    borderRadius: '8px',
                    color: '#fff',
                    marginBottom: '1rem',
                    fontSize: '1rem'
                  }}
                  value={deleteAllConfirmText}
                  onChange={(e) => setDeleteAllConfirmText(e.target.value)}
                />

                <div className="confirm-btn-group" style={{ display: 'flex', gap: '1rem' }}>
                  <button className="submit-btn" style={{ background: '#333', boxShadow: 'none' }} onClick={() => { setShowDeleteAllModal(false); setDeleteAllConfirmText(''); }}>
                    Cancel
                  </button>
                  <button 
                    className="submit-btn" 
                    style={{ background: '#ff0055', boxShadow: '0 4px 15px rgba(255, 0, 85, 0.4)' }} 
                    disabled={deleteAllConfirmText !== 'DELETE ALL INEXON'}
                    onClick={handleDeleteAllConfirm}
                  >
                    Yes, Wipe Entire Database
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Integrated Custom Notification Modal */}
        {notification.show && (
          <div className="modal show" style={{ display: 'block', zIndex: 2000 }} onClick={closeNotification}>
            <div className={`modal-content notification-modal ${notification.type === 'success' ? 'border-success' : 'border-error'}`} onClick={(e) => e.stopPropagation()}>
              <span className="close-button" onClick={closeNotification}>&times;</span>
              <div className="notification-icon-container">
                {notification.type === 'success' ? (
                  <span className="notification-icon success-icon">✓</span>
                ) : (
                  <span className="notification-icon error-icon">✕</span>
                )}
              </div>
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <button 
                className="submit-btn" 
                style={{ 
                  background: notification.type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  boxShadow: notification.type === 'success' ? '0 4px 15px rgba(16, 185, 129, 0.4)' : '0 4px 15px rgba(239, 68, 68, 0.4)',
                  marginTop: '1.5rem'
                }} 
                onClick={closeNotification}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Render Public Website View
  return (
    <>
      {/* Global Background Video */}
      <div className="hero-background">
        <video autoPlay muted loop playsInline className="hero-video">
          <source src="/media/bgVideo.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
      </div>

      {/* Navigation */}
      <nav className={navScrolled ? 'scrolled' : ''}>
        <div className="nav-container">
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="nav-brand">
            <img src="/media/image.png" alt="INEXON'26 Logo" className="nav-logo" onClick={handleLogoClick} title="Department of MCA" style={{ cursor: 'pointer' }} />
            <span className="nav-brand-text">INEXON'26</span>
          </a>
          <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
            <li><a href="#events" onClick={(e) => { e.preventDefault(); scrollToSection('events'); }}>Events</a></li>
            <li><a href="#registration" onClick={(e) => { e.preventDefault(); scrollToSection('registration'); }}>Register</a></li>
            <li><a href="#prizes" onClick={(e) => { e.preventDefault(); scrollToSection('prizes'); }}>Prizes</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
          </ul>
          <div 
            className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>INEXON'26</h1>
          <p className="tagline">Innovate | Integrate | Inspire</p>
          <p className="subtext">
            Technical & Non-Technical Symposium <br /> by <br />
            <b>Department of Master of Computer Applications</b><br />
            KIOT Salem
          </p>

          <div className="hero-info">
            <span className="hero-info-item">📅 March 12, 2026</span>
            <a 
              href="https://maps.app.goo.gl/p3vt5QAnekvjXvyb6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hero-info-item hero-info-button"
            >
              📍 KIOT-Campus, Salem
            </a>
          </div>

          {/* Countdown Clock */}
          <div className="countdown">
            {countdown.status === 'live' ? (
              <div style={{ textAlign: 'center', color: 'white', width: '100%', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', textShadow: '0 0 15px var(--color-secondary-glow)', color: 'var(--color-secondary)' }}>
                  EVENT IS LIVE!
                </h2>
              </div>
            ) : countdown.status === 'completed' ? (
              <div style={{ textAlign: 'center', color: 'white', width: '100%', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.2rem', textShadow: '0 0 15px rgba(255,0,85,0.4)', color: '#ff0055' }}>
                  EVENT SUCCESSFULLY COMPLETED!
                </h2>
              </div>
            ) : (
              <>
                <div className="countdown-item">
                  <div className="countdown-number">{countdown.days}</div>
                  <div className="countdown-label">Days</div>
                </div>
                <div className="countdown-item">
                  <div className="countdown-number">{countdown.hours}</div>
                  <div className="countdown-label">Hours</div>
                </div>
                <div className="countdown-item">
                  <div className="countdown-number">{countdown.minutes}</div>
                  <div className="countdown-label">Minutes</div>
                </div>
                <div className="countdown-item">
                  <div className="countdown-number">{countdown.seconds}</div>
                  <div className="countdown-label">Seconds</div>
                </div>
              </>
            )}
          </div>

          <div className="btn-group">
            {countdown.status !== 'completed' && (
              <button className="btn btn-primary" onClick={() => scrollToSection('registration')}>
                Register Now
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => scrollToSection('events')}>
              Explore Events
            </button>
            <a href="/media/Brouchers-final.jpeg" className="btn btn-secondary" download>
              Download Brochure
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="container">
          <h2>About INEXON'26</h2>
          <div className="section-subtitle">Learn more about our symposium</div>

          <div className="about-content">
            <div className="about-text">
              <h3>What is INEXON'26?</h3>
              <p>
                INEXON'26 is a National Level Technical & Non-Technical Symposium organized by the Department of Master of
                Computer Applications (MCA) at Knowledge Institute of Technology, Salem. It represents a focal platform for
                innovation, collaboration, and learning in the field of modern computing and applications.
              </p>
              <p>
                The symposium gathers students, coding champions, and technology enthusiasts from across the state to showcase their 
                skills, engage in friendly competition, and interact with academic and industrial peers.
              </p>

              <div className="about-features">
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div>
                    <strong>Technical Competitions</strong>
                    <p style={{ fontSize: '0.9rem', margin: '0.3rem 0 0 0' }}>
                      Compete in paper presentation, debug scenarios, and core algorithmic coding.
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div>
                    <strong>Networking Opportunities</strong>
                    <p style={{ fontSize: '0.9rem', margin: '0.3rem 0 0 0' }}>
                      Connect with fellow tech enthusiasts, build teams, and explore developer communities.
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div>
                    <strong>Skill Validation</strong>
                    <p style={{ fontSize: '0.9rem', margin: '0.3rem 0 0 0' }}>
                      Test your intelligence against strict timer deadlines and gain recognition from expert judges.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-brochure-box">
              <a href="/media/Brouchers-final.jpeg" target="_blank" rel="noopener noreferrer">
                <img src="/media/Brouchers-final.jpeg" alt="INEXON'26 Brochure" className="brochure-img" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="events" id="events">
        <div className="container">
          <h2>Events</h2>
          <div className="section-subtitle">Technical & Non-Technical Events (Click cards for details & rules)</div>

          <div className="events-container">
            {Object.entries(EVENT_DETAILS).map(([name, event]) => (
              <div 
                key={name} 
                className="event-card" 
                onClick={() => setActiveModalEvent({ name, ...event })}
              >
                <div className="event-header">
                  <span className="event-badge">{event.badge}</span>
                  <h3>{name}</h3>
                </div>
                <div className="event-body">
                  <p>{event.shortDesc}</p>
                  <div className="event-details">
                    <div>
                      <div className="detail-label">Team Size</div>
                      <div className="detail-item">{event.teamSize}</div>
                    </div>
                    <div>
                      <div className="detail-label">Duration</div>
                      <div className="detail-item">{event.duration}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="registration" id="registration">
        <div className="container">
          <h2>Register Now</h2>
          <div className="section-subtitle">Join the National Level Technical Symposium</div>

          <div className="registration-form" style={{ position: 'relative' }}>
            
            {/* If registrations are closed, render blocking overlay */}
            {countdown.status === 'completed' ? (
              <div className="registration-closed-overlay" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(6, 7, 19, 0.9)',
                backdropFilter: 'blur(12px)',
                borderRadius: '24px',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔒</div>
                <h3 style={{ fontSize: '2rem', color: '#ff0055', marginBottom: '0.8rem' }}>Registrations Closed</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '450px', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  The registration portal for INEXON'26 has officially closed. We look forward to seeing you at our upcoming symposia.
                </p>
              </div>
            ) : null}

            <form onSubmit={handleFormSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    placeholder="10-digit mobile number"
                    pattern="[0-9]{10}" 
                    maxLength={10} 
                    title="Please enter a 10-digit mobile number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Roll Number *</label>
                  <input 
                    type="text" 
                    name="rollNumber" 
                    required 
                    placeholder="Your roll number"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>College/Institution *</label>
                <input 
                  type="text" 
                  name="college" 
                  required 
                  placeholder="Your college name"
                  value={formData.college}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <select 
                    name="department" 
                    required
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Dept</option>
                    <option value="MCA">MCA</option>
                    <option value="M.Sc (CS)">M.Sc (CS)</option>
                    <option value="BCA">BCA</option>
                    <option value="B.Sc (CS)">B.Sc (CS)</option>
                    <option value="B.Sc (IT)">B.Sc (IT)</option>
                    <option value="B.Sc (AI & DS)">B.Sc (AI & DS)</option>
                    <option value="B.Sc (Maths)">B.Sc (Maths)</option>
                    <option value="B.Sc (Physics)">B.Sc (Physics)</option>
                    <option value="B.Sc (Chemistry)">B.Sc (Chemistry)</option>
                    <option value="BCOM">BCOM</option>
                    <option value="BCOM-CA">BCOM-CA</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Year *</label>
                  <select 
                    name="year" 
                    required
                    value={formData.year}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                  </select>
                </div>
              </div>

              {/* Event selection */}
              <div className="form-group">
                <label>Select Events (One from each category) *</label>
                <div className="event-selection-grid">
                  <div className="event-group">
                    <label className="event-group-title">Technical</label>
                    <label className={`event-checkbox-label ${formData.technicalEvent === 'BrainWave Summit' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="technicalEvent" 
                        value="BrainWave Summit" 
                        required
                        checked={formData.technicalEvent === 'BrainWave Summit'}
                        onChange={handleInputChange}
                      />
                      <span>BrainWave Summit</span>
                    </label>
                    <label className={`event-checkbox-label ${formData.technicalEvent === 'Bug Busters' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="technicalEvent" 
                        value="Bug Busters" 
                        required
                        checked={formData.technicalEvent === 'Bug Busters'}
                        onChange={handleInputChange}
                      />
                      <span>Bug Busters</span>
                    </label>
                  </div>
                  <div className="event-group">
                    <label className="event-group-title">Non-Technical</label>
                    <label className={`event-checkbox-label ${formData.nonTechnicalEvent === 'Decode Logo' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="nonTechnicalEvent" 
                        value="Decode Logo" 
                        required
                        checked={formData.nonTechnicalEvent === 'Decode Logo'}
                        onChange={handleInputChange}
                      />
                      <span>Decode Logo</span>
                    </label>
                    <label className={`event-checkbox-label ${formData.nonTechnicalEvent === 'Mystic Meet' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="nonTechnicalEvent" 
                        value="Mystic Meet" 
                        required
                        checked={formData.nonTechnicalEvent === 'Mystic Meet'}
                        onChange={handleInputChange}
                      />
                      <span>Mystic Meet (Surprise)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="form-group">
                <label>Registration Fee &amp; Payment</label>
                <div className="payment-box">
                  <p className="payment-title">🎉 Registration Fee: <strong>₹150 (Including GST)</strong></p>
                  <p className="payment-subtitle">Please scan the QR code to complete the payment.</p>
                  
                  <a href="/media/Qr_image (2).jpeg" target="_blank" rel="noopener noreferrer" className="qr-link" title="Click to view QR code">
                    <img src="/media/Qr_image (2).jpeg" alt="Payment QR Code" className="qr-img" />
                  </a>

                  <div className="payment-instructions">
                    <p>📌 After payment:</p>
                    <ul>
                      <li>Enter your <strong>reference Transaction ID</strong> below.</li>
                      <li>Select the payment mode you used.</li>
                      <li>Submit the form to confirm your registration.</li>
                      <li>Keep the reference ID ready for any follow-up.</li>
                    </ul>
                  </div>
                  <p className="payment-warning">⚠️ Payment once made is non-refundable. Ensure the Transaction ID is correct.</p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Transaction ID *</label>
                  <input 
                    type="text" 
                    name="transactionId" 
                    required 
                    placeholder="Enter transaction ID"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Payment Mode *</label>
                  <select 
                    name="paymentMode" 
                    required
                    value={formData.paymentMode}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="Google Pay">Google Pay</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Paytm">Paytm</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Payment screenshot file upload */}


              {/* WhatsApp & Submit */}
              <div className="form-group" style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                <a 
                  href="https://chat.whatsapp.com/IcZsaBcj1fEDilyg4qB4ab" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn" 
                  style={{ 
                    backgroundColor: '#25D366', 
                    color: 'white', 
                    borderColor: '#25D366', 
                    padding: '12px 24px', 
                    textDecoration: 'none', 
                    fontWeight: '600',
                    borderRadius: '8px'
                  }}
                >
                  Join WhatsApp Group
                </a>
                <p style={{ fontSize: '0.9rem', color: '#e7e2e2', marginTop: '1rem' }}>
                  Join the WhatsApp group for payment support and registration updates.
                </p>
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Processing Registration...' : 'Complete Registration'}
              </button>
              <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Enter the transaction reference ID from your payment receipt.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section className="prizes" id="prizes">
        <div className="container">
          <h2>Prizes & Rewards</h2>
          <div className="section-subtitle">Exciting prizes awaiting the winners</div>

          <div className="prizes-container">
            <div className="prize-card gold-card">
              <div className="prize-rank">🥇</div>
              <div className="prize-title">First Prize</div>
              <div className="prize-amount">₹1,500</div>
              <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>+ Certificate of Honor</p>
            </div>

            <div className="prize-card silver-card">
              <div className="prize-rank">🥈</div>
              <div className="prize-title">Second Prize</div>
              <div className="prize-amount">₹1,000</div>
              <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>+ Certificate of Distinction</p>
            </div>

            <div className="prize-card bronze-card">
              <div className="prize-rank">🥉</div>
              <div className="prize-title">Third Prize</div>
              <div className="prize-amount">₹750</div>
              <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>+ Certificate of Excellence</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <p style={{ color: '#f8f2f2', fontSize: '1.05rem' }}>All participants receive official participation certificates</p>
            <p style={{ color: 'var(--color-secondary)', fontWeight: 600, marginTop: '0.6rem' }}>
              Prizes awarded per event category • Multiple entries = Multiple chances to win!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="container">
          <h2>Get In Touch</h2>
          <div className="section-subtitle">Have questions? We're here to help</div>

          <div className="contact-content">
            <div className="contact-card">
              <h3>📍 Location</h3>
              <p>Knowledge Institute of Technology</p>
              <p>KIOT-Campus, NH544, Kakapalayam,</p>
              <p>Salem - 637-504, Tamil Nadu, India</p>
              <a 
                href="https://maps.app.goo.gl/p3vt5QAnekvjXvyb6" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ marginTop: '1rem' }}
              >
                View on Map
              </a>
            </div>

            <div className="contact-card">
              <h3>📞 Faculty Coordinator</h3>
              <p><strong>Mrs. G. SOWNDARYA</strong></p>
              <p>Assistant Professor, Department of MCA</p>
              <a href="tel:+919500452670" style={{ display: 'block', marginTop: '0.5rem' }}>+91 9500452670</a>
              <a href="mailto:gsmca@kiot.ac.in" style={{ display: 'block', marginTop: '0.5rem' }}>gsmca@kiot.ac.in</a>
            </div>

            <div className="contact-card">
              <h3>👥 Student Coordinators</h3>
              <div>
                <p><strong>S. RAJA VISHAGAN</strong></p>
                <a href="tel:+919500533173">+91 9500533173</a>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <p><strong>P. SUDHARSAN</strong></p>
                <a href="tel:+918825451523">+91 8825451523</a>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <p><strong>S. GOBINATH</strong></p>
                <a href="tel:+919790021257">+91 9790021257</a>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <p><strong>K.M. CHANDRU</strong></p>
                <a href="tel:+919361195679">+91 9361195679</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>About INEXON</h4>
              <p>National Level Technical & Non-Technical Symposium by the Department of MCA, KIOT Salem. Elevating engineering and computing standards since inception.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a><br />
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a><br />
              <a href="#events" onClick={(e) => { e.preventDefault(); scrollToSection('events'); }}>Events</a><br />
              <a href="#registration" onClick={(e) => { e.preventDefault(); scrollToSection('registration'); }}>Register</a><br />
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
            </div>
          </div>

          <div className="social-links">
            <a 
              href="https://www.instagram.com/inexon26" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon" 
              title="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.917 3.917 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.703.01 5.556 0 5.829 0 8s.01 2.444.048 3.297c.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.556 15.99 5.829 16 8 16s2.444-.01 3.297-.048c.852-.04 1.433-.174 1.942-.372.526-.205.972-.478 1.417-.923.445-.444.718-.891.923-1.417.198-.51.333-1.09.372-1.942C15.99 10.444 16 10.171 16 8s-.01-2.444-.048-3.297c-.04-.852-.174-1.433-.372-1.942a3.916 3.916 0 0 0-.923-1.417A3.916 3.916 0 0 0 13.24.42c-.51-.198-1.092-.333-1.942-.372C10.444.01 10.171 0 8 0M8 1.44c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.282.24.705.275 1.486.039.843.047 1.096.047 3.232s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.486a2.478 2.478 0 0 1-.599.92c-.28.28-.546.453-.92.598-.282.11-.705.24-1.486.275-.843.038-1.096.047-3.232.047s-2.389-.009-3.232-.047c-.78-.036-1.203-.166-1.486-.275a2.478 2.478 0 0 1-.92-.598 2.478 2.478 0 0 1-.598-.92c-.11-.282-.24-.705-.275-1.486-.038-.843-.046-1.096-.046-3.232s.008-2.389.046-3.232c.036-.78.166-1.204.275-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.486-.275.843-.039 1.096-.046 3.232-.046z"/>
                <path d="M8 4.654a3.346 3.346 0 1 0 0 6.692 3.346 3.346 0 0 0 0-6.692zM8 9.346a1.346 1.346 0 1 1 0-2.692 1.346 1.346 0 0 1 0 2.692z"/>
                <path d="M12.5 4.158a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"/>
              </svg>
            </a>
            <a 
              href="mailto:mcakiot@gmail.com" 
              className="social-icon" 
              title="Email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/>
              </svg>
            </a>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 INEXON - Department of MCA, KIOT Salem. All rights reserved.</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              Designed & Developed by <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} style={{ color: 'var(--color-secondary)', textDecoration: 'none' }}>GOBINATH S</a>, Department of MCA at KIOT
            </p>
          </div>
        </div>
      </footer>

      {/* Secret Password Entry Modal */}
      {showPasswordModal && (
        <div className="modal show" style={{ display: 'block' }} onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content admin-unlock-modal" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={() => setShowPasswordModal(false)}>&times;</span>
            <h3 style={{ textShadow: '0 0 10px rgba(0, 242, 254, 0.4)' }}>🔒 Administrative Unlock</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Enter the administrator password to unlock the registration portal dashboard.
            </p>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Admin Password</label>
                <input 
                  type="password" 
                  placeholder="Enter secret password" 
                  required
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <button type="submit" className="submit-btn" style={{ marginTop: '0.5rem' }}>
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      <div 
        className={`modal ${activeModalEvent ? 'show' : ''}`}
        onClick={() => setActiveModalEvent(null)}
      >
        {activeModalEvent && (
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={() => setActiveModalEvent(null)}>&times;</span>
            <h3>{activeModalEvent.name}</h3>
            <p>{activeModalEvent.description}</p>
            
            {activeModalEvent.topics && activeModalEvent.topics.length > 0 && (
              <div>
                <h4>📋 Topics:</h4>
                <ul id="modalEventTopics">
                  {activeModalEvent.topics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>
            )}

            <h4>📜 Rules:</h4>
            <ul>
              {activeModalEvent.rules.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>

            <h4>📞 Coordinators:</h4>
            <ul>
              {activeModalEvent.coordinators.map((coord, i) => (
                <li key={i}>{coord}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Integrated Custom Notification Modal */}
      {notification.show && (
        <div className="modal show" style={{ display: 'block', zIndex: 2000 }} onClick={closeNotification}>
          <div className={`modal-content notification-modal ${notification.type === 'success' ? 'border-success' : 'border-error'}`} onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeNotification}>&times;</span>
            <div className="notification-icon-container">
              {notification.type === 'success' ? (
                <span className="notification-icon success-icon">✓</span>
              ) : (
                <span className="notification-icon error-icon">✕</span>
              )}
            </div>
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            <button 
              className="submit-btn" 
              style={{ 
                background: notification.type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                boxShadow: notification.type === 'success' ? '0 4px 15px rgba(16, 185, 129, 0.4)' : '0 4px 15px rgba(239, 68, 68, 0.4)',
                marginTop: '1.5rem'
              }} 
              onClick={closeNotification}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </>
  );
}
