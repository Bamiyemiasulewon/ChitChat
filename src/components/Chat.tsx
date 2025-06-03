
import React, { useState, useEffect, useRef } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ConnectionStatus } from './ConnectionStatus';
import { LoginForm } from './LoginForm';

export interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
}

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

interface User {
  name: string;
  password: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionState('connecting');
    
    try {
      const ws = new WebSocket('ws://localhost:3001/ws');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionState('connected');
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as Message;
          setMessages(prev => [...prev, {
            ...message,
            timestamp: new Date(message.timestamp)
          }]);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setConnectionState('disconnected');
        attemptReconnect();
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionState('error');
        attemptReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionState('error');
      attemptReconnect();
    }
  };

  const attemptReconnect = () => {
    if (reconnectAttemptsRef.current < 5) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
      console.log(`Attempting to reconnect in ${delay}ms...`);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectAttemptsRef.current++;
        connectWebSocket();
      }, delay);
    }
  };

  const sendMessage = (content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && content.trim() && user) {
      const message: Message = {
        id: Date.now().toString(),
        username: user.name,
        content: content.trim(),
        timestamp: new Date()
      };

      wsRef.current.send(JSON.stringify(message));
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    connectWebSocket();
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setMessages([]);
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto p-4 h-screen flex flex-col max-w-6xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl flex-1 flex flex-col overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">ChitChat</h1>
                  <p className="text-white/90 text-sm">Welcome back, {user?.name}!</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <ConnectionStatus connectionState={connectionState} />
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-200 text-sm font-medium backdrop-blur-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <MessageList messages={messages} currentUsername={user?.name || ''} />

          {/* Input */}
          <MessageInput 
            onSendMessage={sendMessage} 
            disabled={connectionState !== 'connected'} 
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
