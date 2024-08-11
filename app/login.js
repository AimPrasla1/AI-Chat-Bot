// src/LoginPage.js
import React from 'react';
import { signInWithGoogle, signOutFromGoogle, auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Box, Button, Typography } from '@mui/material';

function LoginPage() {
  const [user] = useAuthState(auth);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutFromGoogle();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'black',
        color: 'white',
      }}
    >
      {user ? (
        <>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Welcome, {user.displayName}
          </Typography>
          <Button variant="contained" onClick={handleLogout} sx={{ bgcolor: '#009193', borderRadius: '7px', mb: 2 }}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Login
          </Typography>
          <Button variant="contained" onClick={handleLogin} sx={{ bgcolor: '#009193', borderRadius: '7px', mb: 2 }}>
            Sign in with Google
          </Button>
        </>
      )}
    </Box>
  );
}

export default LoginPage;
