/**
 * Chat message component - ChatGPT-style message bubbles
 */

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, User, Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { MessageActions } from './MessageActions';
import { Message } from '../../types';

interface ChatMessageProps {
  message: Message;
  onFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
  onEdit?: (messageId: string) => void;
}

export function ChatMessage({ message, onFeedback, onEdit }: ChatMessageProps) {
  const [currentFeedback, setCurrentFeedback] = useState<'like' | 'dislike' | undefined>(
    message.feedback
  );

  const handleFeedback = (feedback: 'like' | 'dislike') => {
    const newFeedback = currentFeedback === feedback ? undefined : feedback;
    setCurrentFeedback(newFeedback);
    if (newFeedback) {
      onFeedback(message.id, newFeedback);
    }
  };

  const isUser = message.role === 'user';

  return (
    <div
      className={`group w-full border-b border-border/40 ${
        isUser ? 'bg-background' : 'bg-muted/30'
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
        <div className="flex gap-4 md:gap-6">
          {/* Avatar */}
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback 
              className={`${
                isUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-green-600 text-white dark:bg-green-500'
              }`}
            >
              {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>

          {/* Message Content */}
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {isUser ? 'You' : 'MeTTa Assistant'}
                </span>
              </div>
              
              <MessageActions
                content={message.content}
                isUserMessage={isUser}
                onEdit={onEdit ? () => onEdit(message.id) : undefined}
              />
            </div>

            {/* Message text with proper wrapping */}
            <div className="prose prose-sm dark:prose-invert max-w-none break-words">
              <p className="whitespace-pre-wrap m-0 leading-relaxed">{message.content}</p>
            </div>

            {/* Feedback buttons for AI messages */}
            {!isUser && (
              <div className="flex items-center gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('like')}
                  className={`h-8 px-2 ${
                    currentFeedback === 'like'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label="Like response"
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('dislike')}
                  className={`h-8 px-2 ${
                    currentFeedback === 'dislike'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label="Dislike response"
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(date: Date | string | number): string {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    return '';
  }
}
