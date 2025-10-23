/**
 * Chat sidebar - ChatGPT-style fixed layout with scrollable history
 */

import { useState } from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { MessageSquare, Plus, LogOut, X, Search } from 'lucide-react';
import { ChatActionsMenu } from './ChatActionsMenu';
import { ChatHistory } from '../../types';
import { formatDate } from '../../utils/format';

interface ChatSidebarProps {
  history: ChatHistory[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onShareChat: (chatId: string) => void;
  onRenameChat: (chatId: string) => void;
  onArchiveChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatSidebar({
  history,
  currentChatId,
  onSelectChat,
  onNewChat,
  onLogout,
  isOpen,
  onToggle,
  onShareChat,
  onRenameChat,
  onArchiveChat,
  onDeleteChat,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter((chat) =>
    !chat.archived && chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 
          w-64 bg-sidebar border-r border-sidebar-border
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${!isOpen && 'lg:w-0 lg:border-0'}
          flex flex-col h-screen overflow-hidden
        `}
        aria-label="Chat sidebar"
      >
        {/* Fixed Header with New Chat Button */}
        <div className="shrink-0 p-3 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sidebar-foreground px-1">MeTTa AI</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Fixed New Chat Button */}
          <Button 
            onClick={onNewChat} 
            className="w-full justify-start gap-2 bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground"
            variant="ghost"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Fixed Search Bar */}
        <div className="shrink-0 p-3 pt-2 border-b border-sidebar-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground"
              aria-label="Search chats"
            />
          </div>
        </div>

        {/* Scrollable Chat History */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2">
          {filteredHistory.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              {searchQuery ? 'No chats found' : 'No chat history yet'}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`
                    group relative rounded-lg transition-all duration-200
                    ${
                      currentChatId === chat.id
                        ? 'bg-sidebar-accent'
                        : 'hover:bg-sidebar-accent/50'
                    }
                  `}
                >
                  <button
                    onClick={() => onSelectChat(chat.id)}
                    className="w-full px-3 py-2.5 flex items-start gap-3 text-left"
                    aria-label={`Open chat: ${chat.title}`}
                  >
                    <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 text-sidebar-foreground/70" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-sidebar-foreground truncate pr-8">
                        {chat.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(chat.timestamp)}
                      </div>
                    </div>
                  </button>
                  
                  {/* Three-dot menu */}
                  <div className="absolute right-2 top-2">
                    <ChatActionsMenu
                      chatId={chat.id}
                      onShare={onShareChat}
                      onRename={onRenameChat}
                      onArchive={onArchiveChat}
                      onDelete={onDeleteChat}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator className="shrink-0" />

        {/* Fixed Logout Button */}
        <div className="shrink-0 p-3">
          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
