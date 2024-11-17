import { Schema } from 'mongoose';

const stepSchema = new Schema({
  id: String,
  title: String,
  duration: Number,
  completed: Boolean,
  musicUrl: String,
  musicPlatform: {
    type: String,
    enum: ['spotify', 'amazon']
  }
});

export const routineSchema = new Schema({
  id: String,
  title: String,
  description: String,
  category: {
    type: String,
    enum: ['morning', 'evening', 'workout', 'meditation', 'custom']
  },
  steps: [stepSchema]
}, {
  timestamps: true
});