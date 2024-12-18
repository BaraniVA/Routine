import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import Timer from './Timer';
import MusicPlayer from './MusicPlayer';
import { RoutineStep as RoutineStepType } from '../types';

interface RoutineStepProps {
  step: RoutineStepType;
  onComplete: () => void;
}

export default function RoutineStep({ step, onComplete }: RoutineStepProps) {
  return (
    <div className={`p-6 rounded-xl ${step.completed ? 'bg-green-50' : 'bg-white'} shadow-lg transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button onClick={onComplete}>
            {step.completed ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400" />
            )}
          </button>
          <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
        </div>
        {step.musicUrl && (
          <MusicPlayer
            platform={step.musicPlatform || 'spotify'}
            url={step.musicUrl}
          />
        )}
      </div>
      
      <Timer
        duration={step.duration}
        onComplete={onComplete}
      />
    </div>
  );
}