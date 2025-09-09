import { ref, set, get, push, update, remove, query, orderByChild, equalTo } from "firebase/database";
import { database } from "./firebaseService";
import { Note } from "@/types/knowledge";

// Save a new note
export const saveNote = async (uid: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const notesRef = ref(database, `notes/${uid}`);
    const newNoteRef = push(notesRef);
    
    const noteWithTimestamps: Note = {
      ...note,
      id: newNoteRef.key as string,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await set(newNoteRef, noteWithTimestamps);
    return newNoteRef.key as string;
  } catch (error) {
    console.error("Error saving note", error);
    throw error;
  }
};

// Update an existing note
export const updateNote = async (uid: string, noteId: string, updates: Partial<Note>): Promise<void> => {
  try {
    const noteRef = ref(database, `notes/${uid}/${noteId}`);
    await update(noteRef, { ...updates, updatedAt: Date.now() });
  } catch (error) {
    console.error("Error updating note", error);
    throw error;
  }
};

// Delete a note
export const deleteNote = async (uid: string, noteId: string): Promise<void> => {
  try {
    const noteRef = ref(database, `notes/${uid}/${noteId}`);
    await remove(noteRef);
  } catch (error) {
    console.error("Error deleting note", error);
    throw error;
  }
};

// Get all notes for a user
export const getNotes = async (uid: string): Promise<Note[]> => {
  try {
    const notesRef = ref(database, `notes/${uid}`);
    const snapshot = await get(notesRef);
    
    if (snapshot.exists()) {
      const notesData = snapshot.val();
      const notes = Object.keys(notesData).map(key => ({
        ...notesData[key],
        id: key
      }));
      return notes.sort((a, b) => b.updatedAt - a.updatedAt);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error getting notes", error);
    throw error;
  }
};

// Get notes for a specific topic
export const getNotesForTopic = async (uid: string, topicId: string): Promise<Note[]> => {
  try {
    const notesRef = ref(database, `notes/${uid}`);
    const notesQuery = query(notesRef, orderByChild('topicId'), equalTo(topicId));
    const snapshot = await get(notesQuery);
    
    if (snapshot.exists()) {
      const notesData = snapshot.val();
      const notes = Object.keys(notesData).map(key => ({
        ...notesData[key],
        id: key
      }));
      return notes.sort((a, b) => b.updatedAt - a.updatedAt);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error getting notes for topic", error);
    throw error;
  }
};

// Get notes for a specific module
export const getNotesForModule = async (uid: string, moduleId: string): Promise<Note[]> => {
  try {
    const notesRef = ref(database, `notes/${uid}`);
    const notesQuery = query(notesRef, orderByChild('moduleId'), equalTo(moduleId));
    const snapshot = await get(notesQuery);
    
    if (snapshot.exists()) {
      const notesData = snapshot.val();
      const notes = Object.keys(notesData).map(key => ({
        ...notesData[key],
        id: key
      }));
      return notes.sort((a, b) => b.updatedAt - a.updatedAt);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error getting notes for module", error);
    throw error;
  }
};