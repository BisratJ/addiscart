'use client';

import { checkPasswordComplexity } from '@/app/lib/security';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const { score, feedback } = checkPasswordComplexity(password);

  const getStrengthColor = () => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthText = () => {
    switch (score) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const getStrengthTextColor = () => {
    switch (score) {
      case 0:
      case 1:
        return 'text-red-600';
      case 2:
        return 'text-orange-600';
      case 3:
        return 'text-yellow-600';
      case 4:
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors ${
              index < score ? getStrengthColor() : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Strength text */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${getStrengthTextColor()}`}>
          Password strength: {getStrengthText()}
        </span>
      </div>

      {/* Feedback */}
      {feedback.length > 0 && score < 4 && (
        <ul className="text-xs text-gray-600 space-y-1 mt-2">
          {feedback.slice(0, 2).map((item, index) => (
            <li key={index} className="flex items-start gap-1">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
