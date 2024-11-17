import React, { useState, useEffect } from 'react';
import { Timer as TimerIcon, Pause, Play, RotateCcw } from 'lucide-react';
import useSound from 'use-sound';

interface TimerProps {
  duration: number; // Duration in minutes
  onComplete: () => void;
}

export default function Timer({ duration, onComplete }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [playComplete] = useSound('/complete.mp3', { volume: 0.5 });

  useEffect(() => {
    let interval: number;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            playComplete();
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete, playComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setTimeLeft(duration * 60); // Reset to initial duration in seconds
    setIsRunning(false);
  };

  const progress = (timeLeft / (duration * 60)) * 100;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="60"
            className="stroke-current text-gray-200"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="60"
            className="stroke-current text-indigo-600"
            strokeWidth="8"
            fill="none"
            strokeDasharray={2 * Math.PI * 60}
            strokeDashoffset={2 * Math.PI * 60 * (1 - progress / 100)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-indigo-600">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="p-3 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors text-indigo-600"
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={reset}
          className="p-3 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors text-indigo-600"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
}