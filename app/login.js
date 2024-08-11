import React from 'react';
import { signInWithGoogle, signOutFromGoogle, auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Box, Button, Typography, Avatar } from '@mui/material';

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
        backgroundImage: 'url(/path-to-your-image.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 3,
      }}
    >
      <Avatar
        src={user ? user.photoURL : '/path-to-default-icon.png'}
        alt={user ? user.displayName : 'Login'}
        sx={{ width: 80, height: 80, mb: 4 }}
      />

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
        Data Structures and Algorithms Helper AI Bot
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
        AI bot made to help you learn in-depth DSA skills
      </Typography>

      {user ? (
        <>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Welcome, {user.displayName}
          </Typography>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              bgcolor: '#009193',
              borderRadius: '7px',
              mb: 2,
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
              '&:hover': {
                bgcolor: '#007b7a',
              },
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              transform: 'translateY(0)',
              '&:active': {
                transform: 'translateY(2px)',
              },
            }}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Login
          </Typography>
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{
              bgcolor: '#009193',
              borderRadius: '7px',
              mb: 2,
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
              '&:hover': {
                bgcolor: '#007b7a',
              },
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              transform: 'translateY(0)',
              '&:active': {
                transform: 'translateY(2px)',
              },
            }}
          >
            Sign in with Google
          </Button>
        </>
      )}
    </Box>
  );
}

export default LoginPage;
