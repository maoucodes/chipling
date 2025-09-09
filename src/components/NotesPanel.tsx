import { useState, useEffect } from 'react';
import { Send, Loader2, Plus, Edit3, Trash2, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { getNotes, saveNote, updateNote, deleteNote } from '@/services/notesService';
import { Note } from '@/types/knowledge';
import { toast } from 'sonner';
import NotesChat from '@/components/NotesChat';

interface NotesPanelProps {
  topicId?: string;
  moduleId?: string;
  topicTitle?: string;
}

const NotesPanel = ({ topicId, moduleId, topicTitle }: NotesPanelProps) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  // Load notes when component mounts or when topic/module changes
  useEffect(() => {
    if (user?.uid) {
      loadNotes();
    }
  }, [user?.uid, topicId, moduleId]);

  const loadNotes = async () => {
    try {
      if (!user?.uid) return;
      
      let loadedNotes: Note[] = [];
      if (topicId) {
        loadedNotes = await getNotesForTopic(user.uid, topicId);
      } else if (moduleId) {
        loadedNotes = await getNotesForModule(user.uid, moduleId);
      } else {
        loadedNotes = await getNotes(user.uid);
      }
      
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast.error('Failed to load notes');
    }
  };

  const getNotesForTopic = async (uid: string, topicId: string) => {
    return (await getNotes(uid)).filter(note => note.topicId === topicId);
  };

  const getNotesForModule = async (uid: string, moduleId: string) => {
    return (await getNotes(uid)).filter(note => note.moduleId === moduleId);
  };

  const handleAddNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim() || !user?.uid) return;

    try {
      const noteData = {
        title: newNote.title,
        content: newNote.content,
        topicId,
        moduleId
      };

      await saveNote(user.uid, noteData);
      setNewNote({ title: '', content: '' });
      setIsAddingNote(false);
      await loadNotes();
      toast.success('Note saved successfully');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editingContent.trim() || !user?.uid) return;

    try {
      await updateNote(user.uid, noteId, { content: editingContent });
      setEditingNoteId(null);
      setEditingContent('');
      await loadNotes();
      toast.success('Note updated successfully');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!user?.uid) return;

    try {
      await deleteNote(user.uid, noteId);
      await loadNotes();
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const toggleNoteExpansion = (noteId: string) => {
    setExpandedNotes(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };

  // Create context from notes for the chat
  const notesContext = notes.map(note => `Note: ${note.title}\n${note.content}`).join('\n\n');

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border/50 p-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Notes & Chat
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Save notes and chat with them
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4">
          {/* Notes Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Your Notes</h3>
              <Button 
                size="sm" 
                onClick={() => setIsAddingNote(true)}
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Note
              </Button>
            </div>

            {isAddingNote && (
              <div className="border border-border/50 rounded-lg p-3 space-y-2">
                <Input
                  placeholder="Note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                />
                <Textarea
                  placeholder="Note content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddNote}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setIsAddingNote(false)}>Cancel</Button>
                </div>
              </div>
            )}

            {notes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto opacity-50 mb-2" />
                <p>No notes yet</p>
                <p className="text-sm">Add your first note to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div 
                    key={note.id} 
                    className="border border-border/50 rounded-lg hover:bg-accent/5 transition-colors"
                  >
                    {editingNoteId === note.id ? (
                      <div className="p-3 space-y-2">
                        <Textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleUpdateNote(note.id)}>Save</Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setEditingNoteId(null);
                              setEditingContent('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div 
                          className="flex justify-between items-center p-3 cursor-pointer"
                          onClick={() => toggleNoteExpansion(note.id)}
                        >
                          <div className="flex items-center gap-2">
                            {expandedNotes[note.id] ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                            <h4 className="font-medium">{note.title}</h4>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="w-8 h-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingNoteId(note.id);
                                setEditingContent(note.content);
                              }}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="w-8 h-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNote(note.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {expandedNotes[note.id] && (
                          <div className="px-3 pb-3 pt-0 border-t border-border/50">
                            <p className="text-sm text-muted-foreground mt-2">
                              {new Date(note.updatedAt).toLocaleDateString()}
                            </p>
                            <p className="mt-2 text-sm whitespace-pre-wrap">{note.content}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Section */}
          <div className="space-y-3 pt-4 border-t border-border/30">
            <h3 className="font-medium">Chat with Your Notes</h3>
            
            <div className="border border-border/50 rounded-lg h-64 overflow-hidden">
              <NotesChat notesContext={notesContext} topicTitle={topicTitle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;