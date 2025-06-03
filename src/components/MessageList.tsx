
import React, { useEffect, useRef } from 'react';
import { Message } from './Chat';

interface MessageListProps {
  messages: Message[];
  currentUsername: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUsername }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm">Be the first to start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.username === currentUsername;
        
        return (
          <div
            key={message.id}
            className={`flex w-full animate-fade-in ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end space-x-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 ${
                isCurrentUser 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                  : 'bg-gradient-to-r from-gray-400 to-gray-600'
              }`}>
                {message.username.charAt(0).toUpperCase()}
              </div>
              
              {/* Message bubble */}
              <div className={`relative px-4 py-3 rounded-2xl shadow-sm ${
                isCurrentUser
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
              }`}>
                {/* Username and time */}
                <div className={`flex items-center space-x-2 mb-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <span className={`text-xs font-medium ${isCurrentUser ? 'text-white/80' : 'text-gray-600'}`}>
                    {isCurrentUser ? 'You' : message.username}
                  </span>
                  <span className={`text-xs ${isCurrentUser ? 'text-white/60' : 'text-gray-400'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                
                {/* Message content */}
                <p className="text-sm leading-relaxed break-words">{message.content}</p>
                
                {/* Message tail */}
                <div className={`absolute bottom-0 w-3 h-3 ${
                  isCurrentUser 
                    ? 'right-0 bg-gradient-to-r from-blue-500 to-purple-600 transform rotate-45 translate-x-1 translate-y-1' 
                    : 'left-0 bg-white border-l border-b border-gray-200 transform rotate-45 -translate-x-1 translate-y-1'
                }`} />
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
