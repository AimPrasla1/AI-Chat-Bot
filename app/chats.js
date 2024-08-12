
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Function to save chats for a specific user
export const saveChats = async (userId, chats) => {
  try {
    const userDoc = doc(db, "users", userId);
    await setDoc(userDoc, { chats }, { merge: true });
  } catch (error) {
    console.error("Error saving chats: ", error);
  }
};

// Function to load chats for a specific user
export const loadChats = async (userId) => {
  try {
    const userDoc = doc(db, "users", userId);
    const docSnapshot = await getDoc(userDoc);
    if (docSnapshot.exists()) {
      return docSnapshot.data().chats || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error loading chats: ", error);
    return [];
  }
};
