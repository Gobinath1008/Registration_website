import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address.'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide your 10-digit phone number.'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number.'],
  },
  rollNumber: {
    type: String,
    required: [true, 'Please provide your roll number.'],
    uppercase: true,
    trim: true,
  },
  college: {
    type: String,
    required: [true, 'Please provide your college or institution name.'],
  },
  department: {
    type: String,
    required: [true, 'Please select your department.'],
  },
  year: {
    type: String,
    required: [true, 'Please select your academic year.'],
  },
  technicalEvent: {
    type: String,
    required: [true, 'Please select a technical event.'],
  },
  nonTechnicalEvent: {
    type: String,
    required: [true, 'Please select a non-technical event.'],
  },
  transactionId: {
    type: String,
    required: [true, 'Please provide the transaction ID.'],
    trim: true,
  },
  paymentMode: {
    type: String,
    required: [true, 'Please select the payment mode.'],
  },
  paymentScreenshot: {
    type: String,
    required: [true, 'Please upload your payment screenshot.'],
  },
  status: {
    type: String,
    enum: ['Payed'],
    default: 'Payed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

if (mongoose.models.Registration) {
  delete mongoose.models.Registration;
}

export default mongoose.model('Registration', RegistrationSchema);
