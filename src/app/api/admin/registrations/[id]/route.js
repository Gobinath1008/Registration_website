import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Registration from '@/models/Registration';

// Helper to check admin authorization
function isAuthorized(req) {
  const password = req.headers.get('x-admin-password');
  return password === 'sollamatan';
}

export async function PUT(req, { params }) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized. Incorrect admin password.' },
        { status: 401 }
      );
    }

    const { id } = await params; // Next.js dynamic routing params is an async object in newer releases
    const body = await req.json();

    await dbConnect();

    // Find and update the registration record
    const updatedRegistration = await Registration.findByIdAndUpdate(
      id,
      {
        name: body.name?.trim(),
        email: body.email?.trim().toLowerCase(),
        phone: body.phone?.trim(),
        rollNumber: body.rollNumber?.trim().toUpperCase(),
        college: body.college?.trim(),
        department: body.department,
        year: body.year,
        technicalEvent: body.technicalEvent,
        nonTechnicalEvent: body.nonTechnicalEvent,
        transactionId: body.transactionId?.trim().toUpperCase(),
        paymentMode: body.paymentMode,
        status: 'Payed'
      },
      { new: true, runValidators: true }
    );

    if (!updatedRegistration) {
      return NextResponse.json(
        { status: 'error', message: 'Registration record not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'Registration updated successfully.',
      data: updatedRegistration
    });
  } catch (error) {
    console.error('Admin PUT record error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized. Incorrect admin password.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    console.log('=== ADMIN DELETE REGISTER ===');
    console.log('Received ID param:', id);

    await dbConnect();
    console.log('Connected to DB. Querying Registration.findById(', id, ')');
    const checkDoc = await Registration.findById(id);
    console.log('Check document found:', checkDoc);

    const deletedRegistration = await Registration.findByIdAndDelete(id);
    console.log('Deleted registration result:', deletedRegistration);

    if (!deletedRegistration) {
      return NextResponse.json(
        { status: 'error', message: `Registration record not found for ID: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'Registration deleted successfully.',
      data: deletedRegistration
    });
  } catch (error) {
    console.error('Admin DELETE record error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
