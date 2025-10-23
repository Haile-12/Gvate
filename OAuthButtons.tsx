/**
 * OAuth provider buttons
 */

import { Button } from '../ui/button';
import { Github, Mail } from 'lucide-react';
import { OAuthProvider } from '../../types';

interface OAuthButtonsProps {
  onOAuthLogin: (provider: OAuthProvider) => void;
}

export function OAuthButtons({ onOAuthLogin }: OAuthButtonsProps) {
  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => onOAuthLogin('google')}
      >
        <Mail className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => onOAuthLogin('github')}
      >
        <Github className="mr-2 h-4 w-4" />
        Continue with GitHub
      </Button>
    </div>
  );
}
