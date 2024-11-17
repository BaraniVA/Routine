import React from 'react';
import { Clock, Headphones, Trash2, Edit } from 'lucide-react';
import { Routine } from '../types';

interface RoutineListProps {
  routines: Routine[];
  onSelect: (routine: Routine) => void;
  onDelete: (id: string) => void;
  onEdit: (routine: Routine) => void;
}

export default function RoutineList({ routines, onSelect, onDelete, onEdit }: RoutineListProps) {
  const getCategoryColor = (category: Routine['category']) => {
    const colors = {
      morning: 'bg-yellow-100 text-yellow-800',
      evening: 'bg-purple-100 text-purple-800',
      workout: 'bg-red-100 text-red-800',
      meditation: 'bg-blue-100 text-blue-800',
      custom: 'bg-gray-100 text-gray-800',
    };
    return colors[category];
  };

  const handleDelete = (e: React.MouseEvent, routineId: string) => {
    e.stopPropagation();
    onDelete(routineId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {routines.map((routine) => (
        <div
          key={routine.id}
          onClick={() => onSelect(routine)}
          className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow relative group"
        >
          <button
            onClick={(e) => handleDelete(e, routine.id)}
            className="absolute top-6 right-5 p-2 hover:bg-red-50 rounded-full"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(routine);
            }}
            className="absolute top-6 right-14  p-2 hover:bg-blue-50 rounded-full"
          >
            <Edit className="w-5 h-5 text-blue-500" />
          </button>

          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{routine.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{routine.description}</p>
            </div>
            <div className='mt-1 mr-20'>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(routine.category)}`}>
                {routine.category.charAt(0).toUpperCase() + routine.category.slice(1)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {routine.steps.reduce((acc, step) => acc + step.duration, 0)} mins
            </div>
            <div className="flex items-center">
              <Headphones className="w-4 h-4 mr-1" />
              {routine.steps.filter(step => step.musicUrl).length} playlists
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {routine.steps.map((step) => (
              <span
                key={step.id}
                className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}