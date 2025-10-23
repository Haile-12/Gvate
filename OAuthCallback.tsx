/**
 * OAuth callback handler
 * This page receives the OAuth redirect and sends the token to the parent window
 */

import { useEffect } from 'react';

export function OAuthCallback() {
  useEffect(() => {
    // Get token and error from URL parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');
    const user = params.get('user');

    if (window.opener) {
      if (token && user) {
        // Parse user data
        let userData;
        try {
          userData = JSON.parse(decodeURIComponent(user));
        } catch (e) {
          window.opener.postMessage(
            {
              type: 'oauth-error',
              error: 'Failed to parse user data'
            },
            window.location.origin
          );
          return;
        }

        // Send success message to parent window
        window.opener.postMessage(
          {
            type: 'oauth-success',
            token,
            user: userData
          },
          window.location.origin
        );
      } else if (error) {
        // Send error message to parent window
        window.opener.postMessage(
          {
            type: 'oauth-error',
            error: decodeURIComponent(error)
          },
          window.location.origin
        );
      } else {
        // No token or error found
        window.opener.postMessage(
          {
            type: 'oauth-error',
            error: 'No authentication data received'
          },
          window.location.origin
        );
      }
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}
