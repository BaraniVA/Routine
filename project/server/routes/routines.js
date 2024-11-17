import express from 'express';
import { Routine } from '../models/routine.js';

const router = express.Router();

// Get all routines
router.get('/', async (req, res) => {
  try {
    const routines = await Routine.find();
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new routine
router.post('/', async (req, res) => {
  const routine = new Routine(req.body);
  try {
    const newRoutine = await routine.save();
    res.status(201).json(newRoutine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a routine
router.delete('/:id', async (req, res) => {
  try {
    const routine = await Routine.findOneAndDelete({ id: req.params.id });
    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }
    res.json({ message: 'Routine deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update routine step completion
router.patch('/:routineId/steps/:stepId', async (req, res) => {
  try {
    const routine = await Routine.findOne({ id: req.params.routineId });
    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    const step = routine.steps.id(req.params.stepId);
    if (!step) {
      return res.status(404).json({ message: 'Step not found' });
    }

    step.completed = req.body.completed;
    await routine.save();
    res.json(routine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const routineRouter = router;