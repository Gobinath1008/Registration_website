import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Registration from '@/models/Registration';

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

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
      paymentMode,
      paymentScreenshot // Base64 string of the uploaded receipt
    } = data;

    // Server-side validation
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
      !paymentMode ||
      !paymentScreenshot
    ) {
      return NextResponse.json(
        { status: 'error', message: 'All required fields must be filled, including the transaction payment screenshot.' },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { status: 'error', message: 'Please enter a valid 10-digit phone number.' },
        { status: 400 }
      );
    }

    // Check for duplicate Roll Number (case-insensitive)
    const existingRoll = await Registration.findOne({ 
      rollNumber: { $regex: new RegExp(`^${rollNumber.trim()}$`, 'i') } 
    });
    if (existingRoll) {
      return NextResponse.json(
        { status: 'error', message: `Roll Number '${rollNumber}' is already registered.` },
        { status: 409 }
      );
    }

    // Check for duplicate Transaction ID (case-insensitive)
    const existingTx = await Registration.findOne({ 
      transactionId: { $regex: new RegExp(`^${transactionId.trim()}$`, 'i') } 
    });
    if (existingTx) {
      return NextResponse.json(
        { status: 'error', message: `Transaction ID '${transactionId}' has already been submitted.` },
        { status: 409 }
      );
    }

    // Create the registration entry
    const newRegistration = await Registration.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
      college: college.trim(),
      department,
      year,
      technicalEvent,
      nonTechnicalEvent,
      transactionId: transactionId.trim().toUpperCase(),
      paymentMode,
      paymentScreenshot, // Base64 data
      status: 'Payed'
    });

    return NextResponse.json(
      { status: 'success', message: 'Registration completed successfully!', data: newRegistration },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during registration API call:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
