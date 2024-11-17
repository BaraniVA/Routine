import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  musicUrl: String,
  musicPlatform: {
    type: String,
    enum: ['spotify', 'amazon'],
    default: 'spotify'
  }
});

const routineSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  category: {
    type: String,
    enum: ['morning', 'evening', 'workout', 'meditation', 'custom'],
    default: 'custom'
  },
  steps: [stepSchema]
}, {
  timestamps: true
});

export const Routine = mongoose.model('Routine', routineSchema);