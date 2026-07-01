import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Settings from '@/models/Settings';

// Helper to check admin authorization
function isAuthorized(req) {
  const password = req.headers.get('x-admin-password');
  return password === 'sollamatan';
}

export async function PUT(req) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized. Incorrect admin password.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { eventDate, registrationClosed } = body;

    await dbConnect();

    // Find the settings row and update it (or create it if it somehow doesn't exist)
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    if (eventDate !== undefined) {
      settings.eventDate = new Date(eventDate);
    }
    if (registrationClosed !== undefined) {
      settings.registrationClosed = registrationClosed;
    }

    await settings.save();

    return NextResponse.json({
      status: 'success',
      message: 'Administrative settings updated successfully.',
      data: settings
    });
  } catch (error) {
    console.error('Admin Settings PUT error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
