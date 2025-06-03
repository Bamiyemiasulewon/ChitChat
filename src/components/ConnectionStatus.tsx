
import React from 'react';
import { ConnectionState } from './Chat';

interface ConnectionStatusProps {
  connectionState: ConnectionState;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ connectionState }) => {
  const getStatusConfig = (state: ConnectionState) => {
    switch (state) {
      case 'connected':
        return {
          color: 'bg-green-500',
          text: 'Connected',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          pulse: false
        };
      case 'connecting':
        return {
          color: 'bg-yellow-500',
          text: 'Connecting',
          icon: (
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ),
          pulse: true
        };
      case 'disconnected':
        return {
          color: 'bg-gray-500',
          text: 'Disconnected',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          ),
          pulse: false
        };
      case 'error':
        return {
          color: 'bg-red-500',
          text: 'Error',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.729-.833-2.499 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          pulse: false
        };
      default:
        return {
          color: 'bg-gray-500',
          text: 'Unknown',
          icon: null,
          pulse: false
        };
    }
  };

  const config = getStatusConfig(connectionState);

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="flex items-center space-x-1">
        <div
          className={`w-3 h-3 rounded-full ${config.color} ${
            config.pulse ? 'animate-pulse' : ''
          }`}
        />
        <span className="text-white/90 hidden sm:inline">{config.text}</span>
      </div>
      {config.icon && (
        <div className="text-white/80">
          {config.icon}
        </div>
      )}
    </div>
  );
};
