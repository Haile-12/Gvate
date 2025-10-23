/**
 * Main chat interface component - ChatGPT-style layout
 * Fixed sidebar, fixed header, scrollable messages, fixed input
 */

import { useState, useRef, useEffect } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatMessage } from './ChatMessage';
import { StarterPrompts } from './StarterPrompts';
import { ChatInput } from './ChatInput';
import { SettingsDialog } from './SettingsDialog';
import { RenameDialog } from './RenameDialog';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Settings, Share2, Download, MoreVertical, Menu } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useChatManagement } from '../../hooks/useChatManagement';
import { useAuth } from '../../hooks/useAuth';
import { copyToClipboard } from '../../utils/format';
import { Theme } from '../../types';

interface ChatInterfaceProps {
  onLogout: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export function ChatInterface({ onLogout, theme, onToggleTheme }: ChatInterfaceProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [chatToRename, setChatToRename] = useState<{ id: string; title: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const {
    chatHistory,
    currentChatId,
    messages,
    isLoading,
    createNewChat,
    selectChat,
    sendMessage,
    updateFeedback,
    renameChat,
    archiveChat,
    deleteChat,
    shareChat,
    exportChat,
  } = useChatManagement();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewChat = () => {
    createNewChat();
  };

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
  };

  const handleSendMessage = async (content: string, files?: File[]) => {
    // For now, we'll just send the message content
    // File handling can be extended in the future
    if (files && files.length > 0) {
      console.log('Files to upload:', files.map(f => f.name));
      // TODO: Implement file upload logic with your backend
    }
    await sendMessage(content);
  };

  const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    updateFeedback(messageId, feedback);
  };

  const handleShareChat = (chatId: string) => {
    const url = shareChat(chatId);
    copyToClipboard(url);
    toast.success('Share link copied to clipboard!');
  };

  const handleRenameChat = (chatId: string) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setChatToRename({ id: chatId, title: chat.title });
      setRenameDialogOpen(true);
    }
  };

  const confirmRename = (newTitle: string) => {
    if (chatToRename) {
      renameChat(chatToRename.id, newTitle);
      toast.success('Chat renamed!');
    }
    setRenameDialogOpen(false);
    setChatToRename(null);
  };

  const handleArchiveChat = (chatId: string) => {
    archiveChat(chatId);
    toast.success('Chat archived!');
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId);
    toast.success('Chat deleted!');
  };

  const handleExportChat = () => {
    if (!currentChatId) {
      toast.error('No active chat to export!');
      return;
    }

    const chatText = exportChat(currentChatId);
    if (!chatText) {
      toast.error('Failed to export chat!');
      return;
    }

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metta-chat-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Chat exported successfully!');
  };

  const handleShareCurrentChat = () => {
    if (currentChatId) {
      handleShareChat(currentChatId);
    } else {
      toast.error('No active chat to share!');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <ChatSidebar
        history={chatHistory}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onShareChat={handleShareChat}
        onRenameChat={handleRenameChat}
        onArchiveChat={handleArchiveChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="shrink-0"
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <h3 className="truncate text-sm">
              {currentChatId
                ? chatHistory.find((c) => c.id === currentChatId)?.title || 'Chat'
                : 'MeTTa AI Assistant'}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              aria-label="Open settings"
            >
              <Settings className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="More options">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleShareCurrentChat}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Chat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportChat}>
                  <Download className="mr-2 h-4 w-4" />
                  Export to Text
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Scrollable Messages Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden"
        >
          {messages.length === 0 ? (
            <StarterPrompts onSelectPrompt={handleSendMessage} />
          ) : (
            <div className="w-full">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onFeedback={handleFeedback}
                />
              ))}
              {isLoading && (
                <div className="px-4 py-8 bg-muted/30">
                  <div className="flex gap-4 max-w-3xl mx-auto">
                    <div className="h-8 w-8 rounded-full bg-secondary animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-secondary/50 rounded animate-pulse" />
                      <div className="h-4 w-full bg-secondary/50 rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-secondary/50 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Fixed Input Area */}
        <div className="sticky bottom-0 z-10 border-t border-border bg-background">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </div>

      {/* Dialogs */}
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        theme={theme}
        onToggleTheme={onToggleTheme}
        user={user}
      />

      <RenameDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        currentTitle={chatToRename?.title || ''}
        onConfirm={confirmRename}
      />
    </div>
  );
}
