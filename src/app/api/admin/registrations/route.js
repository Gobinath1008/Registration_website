import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Registration from '@/models/Registration';

// Helper to check admin authorization
function isAuthorized(req) {
  const password = req.headers.get('x-admin-password');
  return password === 'sollamatan';
}

export async function GET(req) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized. Incorrect admin password.' },
        { status: 401 }
      );
    }

    await dbConnect();
    const registrations = await Registration.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      status: 'success',
      data: registrations
    });
  } catch (error) {
    console.error('Admin GET registrations error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized. Incorrect admin password.' },
        { status: 401 }
      );
    }

    await dbConnect();
    const result = await Registration.deleteMany({});

    return NextResponse.json({
      status: 'success',
      message: `All ${result.deletedCount} registrations have been deleted successfully.`,
      count: result.deletedCount
    });
  } catch (error) {
    console.error('Admin DELETE ALL registrations error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
