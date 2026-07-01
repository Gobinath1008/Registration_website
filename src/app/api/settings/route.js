import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Settings from '@/models/Settings';

export async function GET() {
  try {
    await dbConnect();
    
    // Find the global settings row, or initialize a default row if empty
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        eventDate: new Date('2026-03-12T09:00:00'),
        registrationClosed: false
      });
    }

    return NextResponse.json({
      status: 'success',
      data: settings
    });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to fetch settings.' },
      { status: 500 }
    );
  }
}
