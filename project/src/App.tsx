import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, Edit } from 'lucide-react';
import { Routine } from './types';
import RoutineStepComponent from './components/RoutineStep';
import NewRoutineForm from './components/NewRoutineForm';
import RoutineList from './components/RoutineList';

console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

function App() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [showNewRoutineForm, setShowNewRoutineForm] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/routines`);
      if (!response.ok) throw new Error('Failed to fetch routines');
      const data = await response.json();
      setRoutines(data);
    } catch (error) {
      console.error('Error fetching routines:', error);
    }
  };

  const handleNewRoutine = async (formData: { title: string; description: string }, steps: { id: string; title: string; duration: number; completed: boolean }[]) => {
    const newRoutine: Routine = {
      id: crypto.randomUUID(),
      ...formData,
      category: 'custom', // or any other default category
      steps,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/routines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoutine),
      });
      
      if (!response.ok) throw new Error('Failed to create routine');
      const savedRoutine = await response.json();
      setRoutines([...routines, savedRoutine]);
    } catch (error) {
      console.error('Error saving routine:', error);
    }
  };

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine(routine);
    setShowNewRoutineForm(true);
  };

  const handleSaveRoutine = async (updatedRoutine: Routine) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/routines/${updatedRoutine.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRoutine),
      });
      if (!response.ok) throw new Error('Failed to update routine');
      const savedRoutine = await response.json();
      setRoutines(routines.map(routine => (routine.id === savedRoutine.id ? savedRoutine : routine)));
      setEditingRoutine(null);
      setShowNewRoutineForm(false);
    } catch (error) {
      console.error('Error updating routine:', error);
    }
  };

  const handleDeleteRoutine = async (routineId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/routines/${routineId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete routine');
      setRoutines(routines.filter(routine => routine.id !== routineId));
      if (selectedRoutine?.id === routineId) {
        setSelectedRoutine(null);
      }
    } catch (error) {
      console.error('Error deleting routine:', error);
    }
  };

  const handleStepComplete = (routineId: string, stepId: string) => {
    setRoutines(prev => prev.map(routine => {
      if (routine.id === routineId) {
        return {
          ...routine,
          steps: routine.steps.map(step =>
            step.id === stepId ? { ...step, completed: true } : step
          )
        };
      }
      return routine;
    }));

    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          const step = selectedRoutine?.steps.find(s => s.id === stepId);
          new Notification('Step Complete!', {
            body: `Great job completing ${step?.title}!`,
            icon: '/notification-icon.png'
          });
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Self-Care Routines</h1>
          </div>
          <button
            onClick={() => setShowNewRoutineForm(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Routine</span>
          </button>
        </div>

        {selectedRoutine ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedRoutine(null)}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                ← Back to all routines
              </button>
                <button
                  onClick={() => handleEditRoutine(selectedRoutine)}
                  className="flex space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors ml-60"
                >
                  <Edit className="w-5 h-5" />
                  <span>Edit Routine</span>
                </button>

              <button
                onClick={() => handleDeleteRoutine(selectedRoutine.id)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Routine</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedRoutine.title}</h2>
                <p className="text-gray-600">{selectedRoutine.description}</p>
              </div>

              {selectedRoutine.steps.map(step => (
                <RoutineStepComponent
                  key={step.id}
                  step={step}
                  onComplete={() => handleStepComplete(selectedRoutine.id, step.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <RoutineList
            routines={routines}
            onSelect={setSelectedRoutine}
            onEdit={(routine: Routine) => handleEditRoutine(routine)}
            onDelete={handleDeleteRoutine}
          />
        )}

        {showNewRoutineForm && (
          <NewRoutineForm
            routine={editingRoutine ?? undefined}
            onSave={editingRoutine ? handleSaveRoutine : handleNewRoutine}
            onCancel={() => {
              setEditingRoutine(null);
              setShowNewRoutineForm(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;