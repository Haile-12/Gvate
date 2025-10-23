/**
 * Chat input component - Fixed container with scrollable textarea and file upload
 */

import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { VoiceInput } from './VoiceInput';
import { FilePreview } from './FilePreview';
import { Send, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { validateFile } from '../../services/fileService';

interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSend, 
  disabled = false,
  placeholder = 'Message MeTTa AI...' 
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((input.trim() || files.length > 0) && !disabled) {
      onSend(input.trim(), files.length > 0 ? files : undefined);
      setInput('');
      setFiles([]);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(prev => prev + (prev ? ' ' : '') + transcript);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate files
    const validFiles: File[] = [];
    selectedFiles.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        toast.error(`${file.name}: ${validation.error}`);
      }
    });

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) added`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px';
    }
  }, [input]);

  return (
    <div className="w-full px-4 py-4">
      <div className="max-w-4xl mx-auto">
        {/* File Previews */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 p-2 bg-muted/30 rounded-lg">
            {files.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                onRemove={() => handleRemoveFile(index)}
              />
            ))}
          </div>
        )}

        <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-background shadow-sm p-2">
          {/* Plus Button for File Upload */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handlePlusClick}
            disabled={disabled}
            className="h-8 w-8 rounded-lg shrink-0 hover:bg-accent"
            aria-label="Upload files"
          >
            <Plus className="h-5 w-5" />
          </Button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="File upload input"
          />
          
          {/* Scrollable Textarea */}
          <div className="flex-1 max-h-[200px] overflow-y-auto">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="min-h-[24px] max-h-[200px] resize-none border-0 bg-transparent p-0 pr-2 focus-visible:ring-0 focus-visible:ring-offset-0 overflow-y-auto"
              rows={1}
              aria-label="Chat message input"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <VoiceInput 
              onTranscript={handleVoiceTranscript} 
              disabled={disabled}
            />
            
            <Button
              onClick={handleSend}
              disabled={disabled || (!input.trim() && files.length === 0)}
              size="icon"
              className="h-8 w-8 rounded-lg"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Helper text */}
        <p className="text-xs text-center text-muted-foreground mt-2 px-2">
          MeTTa AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
