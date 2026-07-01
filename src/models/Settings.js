import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  eventDate: {
    type: Date,
    required: true,
    default: new Date('2026-03-12T09:00:00')
  },
  registrationClosed: {
    type: Boolean,
    required: true,
    default: false
  }
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
