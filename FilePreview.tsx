/**
 * File preview component for uploaded files
 */

import { useState, useEffect } from 'react';
import { X, File, FileText, FileSpreadsheet, FileJson } from 'lucide-react';
import { Button } from '../ui/button';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isImage = file.type.startsWith('image/');

  useEffect(() => {
    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);

  const getFileIcon = () => {
    if (isImage) return null;
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'csv':
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'json':
        return <FileJson className="h-5 w-5 text-yellow-500" />;
      default:
        return <File className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="relative group inline-block">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-colors max-w-[200px]">
        {isImage && previewUrl ? (
          <div className="h-10 w-10 rounded overflow-hidden shrink-0 bg-secondary">
            <img
              src={previewUrl}
              alt={file.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-10 w-10 bg-secondary rounded flex items-center justify-center shrink-0">
            {getFileIcon()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>
      <Button
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2 h-5 w-5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
        aria-label="Remove file"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
