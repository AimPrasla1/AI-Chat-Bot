"use client";
import { useState, useEffect, useRef } from "react";
import { Box, Button, Stack, TextField, Typography, Grid } from "@mui/material";
import LoginPage from './login'; // Import the login page
import { auth, signOutFromGoogle } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function ChatHistory({ chats, onSelectChat, onAddChat }) {
  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: '#333', p: 2, borderRadius: '7px', color: 'white' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Chat History
      </Typography>
      {chats.map((chat, index) => (
        <Box
          key={chat.id}
          sx={{
            mb: 2,
            p: 2,
            borderRadius: '7px',
            bgcolor: '#444',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: '#555',
            },
          }}
          onClick={() => onSelectChat(index)}
        >
          <Typography variant="body2">Chat {chat.id}</Typography>
        </Box>
      ))}
      <Button variant="contained" sx={{ mt: 2, bgcolor: '#009193', borderRadius: '7px' }} onClick={onAddChat}>
        New Chat
      </Button>
    </Box>
  );
}

function ChatBox({ chat, onSendMessage, message, setMessage, isLoading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#000',
        borderRadius: '7px',
        p: 2,
      }}
    >
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
        {chat.messages.map((message, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: message.role === 'user' ? 'white' : '#009193' }}>
              {message.content}
            </Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') onSendMessage();
          }}
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#009193',
                borderRadius: '7px',
              },
              '&:hover fieldset': {
                borderColor: '#009193',
                borderRadius: '7px',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#009193',
                borderRadius: '7px',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'white',
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
          }}
        />
        <Button
          variant="contained"
          onClick={onSendMessage}
          disabled={isLoading}
          sx={{
            bgcolor: '#009193',
            color: 'black',
            borderRadius: '7px',
            '&:hover': {
              bgcolor: '#009193',
            },
          }}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </Stack>
    </Box>
  );
}

export default function Home() {
  const [user] = useAuthState(auth); // Firebase authentication state
  const [currentUser, setCurrentUser] = useState({
    username: user?.displayName || 'Guest',
    chats: [
      {
        id: 1,
        messages: [{ role: 'assistant', content: "Hello! I'm here to help you with data structures and algorithms. To get started, could you please let me know which programming language you'd like to use for our discussions (e.g., Python, Java, C++)? Also, what language would you prefer for our conversation? This will help me tailor my responses to your preferences."' }]
      }
    ]
  });
  const [selectedChatIndex, setSelectedChatIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectChat = (index) => {
    setSelectedChatIndex(index);
  };

  const handleAddChat = () => {
    const newChat = {
      id: currentUser.chats.length + 1,
      messages: [{ role: 'assistant', content: "Hello! I'm here to help you with data structures and algorithms. To get started, could you please let me know which programming language you'd like to use for our discussions (e.g., Python, Java, C++)? Also, what language would you prefer for our conversation? This will help me tailor my responses to your preferences." }],
    };
    setCurrentUser({
      ...currentUser,
      chats: [...currentUser.chats, newChat],
    });
    setSelectedChatIndex(currentUser.chats.length); // Select the new chat
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { role: 'user', content: message };
    setMessage('');
    const updatedChats = currentUser.chats.map((chat, index) =>
      index === selectedChatIndex
        ? { ...chat, messages: [...chat.messages, newMessage, { role: 'assistant', content: '' }] }
        : chat
    );

    setCurrentUser({ ...currentUser, chats: updatedChats });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedChats[selectedChatIndex].messages),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });

        setCurrentUser((prevUser) => {
          const updatedMessages = prevUser.chats[selectedChatIndex].messages;
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          const otherMessages = updatedMessages.slice(0, updatedMessages.length - 1);

          const updatedChats = prevUser.chats.map((chat, index) =>
            index === selectedChatIndex
              ? { ...chat, messages: [...otherMessages, { ...lastMessage, content: lastMessage.content + text }] }
              : chat
          );

          return { ...prevUser, chats: updatedChats };
        });

        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    } catch (error) {
      console.error('Error:', error);
      setCurrentUser((prevUser) => {
        const updatedChats = prevUser.chats.map((chat, index) =>
          index === selectedChatIndex
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
                ],
              }
            : chat
        );
        return { ...prevUser, chats: updatedChats };
      });
    }
  };

  const handleLogout = async () => {
    await signOutFromGoogle();
  };

  if (!user) {
    return <LoginPage />; // Render login page if user is not authenticated
  }

  return (
    <Box
      sx={{
        backgroundColor: 'black',
        minHeight: '100vh',
        color: 'white',
        p: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          width: '100%',
          bgcolor: 'white',
          color: 'black',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5">My Chat Application</Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Chat History Section */}
        <Grid item xs={4}>
          <ChatHistory
            chats={currentUser.chats}
            onSelectChat={handleSelectChat}
            onAddChat={handleAddChat}
          />
        </Grid>

        {/* Chat Box Section */}
        <Grid item xs={8}>
          <ChatBox
            chat={currentUser.chats[selectedChatIndex]}
            onSendMessage={handleSendMessage}
            message={message}
            setMessage={setMessage}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
