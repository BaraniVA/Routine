import React, { useState, useEffect } from 'react';
import { Plus, X, Headphones } from 'lucide-react';
import { Routine, RoutineStep, NewRoutineFormData } from '../types';

interface NewRoutineFormProps {
  routine?: Routine;
  onSave: (routine: Routine, steps: RoutineStep[]) => void;
  onCancel: () => void;
}

const NewRoutineForm: React.FC<NewRoutineFormProps> = ({ routine, onSave, onCancel }) => {
  const [formData, setFormData] = useState<NewRoutineFormData>({
    title: routine?.title || '',
    description: routine?.description || '',
    category: routine?.category || 'custom',
  });

  const [steps, setSteps] = useState<RoutineStep[]>(routine?.steps || []);
  const [newStep, setNewStep] = useState({
    title: '',
    duration: 5,
    musicUrl: '',
    musicPlatform: 'spotify' as const,
  });

  useEffect(() => {
    if (routine) {
      setFormData({
        title: routine.title,
        description: routine.description,
        category: routine.category,
      });
      setSteps(routine.steps || []);
    }
  }, [routine]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStepChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewStep((prevStep) => ({
      ...prevStep,
      [name]: name === 'duration' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...routine, ...formData, id: routine?.id || crypto.randomUUID(), steps: steps }, steps);
    onCancel();
  };

  const addStep = () => {
    if (newStep.title) {
      setSteps((prevSteps) => [
        ...prevSteps,
        {
          id: crypto.randomUUID(),
          ...newStep,
          completed: false,
        },
      ]);
      setNewStep({
        title: '',
        duration: 5,
        musicUrl: '',
        musicPlatform: 'spotify',
      });
    }
  };

  const removeStep = (index: number) => {
    setSteps((prevSteps) => prevSteps.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Routine</h2>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Routine Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={3}
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="morning">Morning Routine</option>
                <option value="evening">Evening Routine</option>
                <option value="workout">Workout Routine</option>
                <option value="meditation">Meditation Routine</option>
                <option value="custom">Custom Routine</option>
              </select>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Steps</h3>
              
              <div className="space-y-4 mb-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm text-gray-500">
                        {step.duration} minutes
                        {step.musicUrl && (
                          <span className="ml-2 flex items-center">
                            <Headphones className="w-4 h-4 mr-1" />
                            {step.musicPlatform}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Step Title"
                  value={newStep.title}
                  onChange={handleStepChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />

                <div className="flex space-x-4">
                  <input
                    type="number"
                    name="duration"
                    min="1"
                    placeholder="Duration (minutes)"
                    value={newStep.duration}
                    onChange={handleStepChange}
                    className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />

                  <input
                    type="text"
                    name="musicUrl"
                    placeholder="Music Playlist URL"
                    value={newStep.musicUrl}
                    onChange={handleStepChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />

                  <select
                    name="musicPlatform"
                    value={newStep.musicPlatform}
                    onChange={handleStepChange}
                    className="w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="spotify">Spotify</option>
                    <option value="amazon">Amazon</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={addStep}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Step</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Routine
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewRoutineForm;
