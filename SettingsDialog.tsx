import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Moon, Sun, User, Mail } from 'lucide-react';
import { User as UserType } from '../../types';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  user: UserType | null;
}

export function SettingsDialog({ open, onOpenChange, theme, onToggleTheme, user }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your preferences and application settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Account Information */}
          {user && (
            <>
              <div className="space-y-4">
                <Label>Account Information</Label>
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">Name</p>
                      <p className="text-sm text-muted-foreground">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">Email</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  {user.id && (
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4" /> {/* Spacer */}
                      <div>
                        <p className="text-sm">User ID</p>
                        <p className="text-xs text-muted-foreground font-mono">{user.id}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                {theme === 'dark' ? 'Dark mode' : 'Light mode'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={onToggleTheme}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <Separator />

          {/* Additional Settings */}
          <div className="space-y-4">
            <div>
              <Label>About</Label>
              <p className="text-sm text-muted-foreground mt-1">
                MeTTa AI Assistant v1.0.0
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
