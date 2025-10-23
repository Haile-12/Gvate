/**
 * Message action buttons - ChatGPT-style compact actions
 */

import { useState } from 'react';
import { Button } from '../ui/button';
import { Copy, Edit2, Check } from 'lucide-react';
import { copyToClipboard } from '../../utils/format';
import { toast } from 'sonner@2.0.3';

interface MessageActionsProps {
  content: string;
  isUserMessage: boolean;
  onEdit?: () => void;
}

export function MessageActions({ content, isUserMessage, onEdit }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-md"
        onClick={handleCopy}
        aria-label="Copy message"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
      
      {isUserMessage && onEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-md"
          onClick={onEdit}
          aria-label="Edit message"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
