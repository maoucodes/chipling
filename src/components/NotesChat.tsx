import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { streamChat } from '@/services/chatService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

interface NotesChatProps {
  notesContext: string;
  topicTitle?: string;
}

const NotesChat = ({ notesContext, topicTitle }: NotesChatProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');
    
    // Add user message with unique ID
    const userMessageId = `user-${Date.now()}`;
    setMessages(prev => [...prev, { role: 'user', content: userMessage, id: userMessageId }]);
    
    // Reset streaming message and set loading state
    setStreamingMessage('');
    setIsLoading(true);
    
    try {
      // Create context message with notes
      const contextMessage = `I'm asking about the topic "${topicTitle || 'this topic'}". Here are my notes:\n\n${notesContext}\n\nPlease answer my question based on these notes: ${userMessage}`;
      
      // Stream the response token by token
      await streamChat(contextMessage, (token) => {
        setStreamingMessage(prev => prev + token);
      });
      
      // When streaming is complete, add the assistant message
      const assistantMessageId = `assistant-${Date.now()}`;
      setMessages(prev => [...prev, { role: 'assistant', content: streamingMessage, id: assistantMessageId }]);
      setStreamingMessage('');
    } catch (error) {
      console.error('Error in chat:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom when messages change or when streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-2 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-primary/20 text-foreground'
                  : 'bg-muted/30 text-foreground'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        
        {streamingMessage && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-2 rounded-lg bg-muted/30 text-foreground text-sm">
              <div className="whitespace-pre-wrap">
                {streamingMessage}
                <span className="ml-1 animate-pulse">▋</span>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && !streamingMessage && (
          <div className="flex justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 p-2 border-t border-border/30">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about your notes..."
          className="flex-1 text-sm"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !message.trim()} 
          size="sm"
          className="h-8"
        >
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
        </Button>
      </form>
    </div>
  );
};

export default NotesChat;