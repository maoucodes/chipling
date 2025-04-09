
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { streamChat } from '@/services/chatService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Initialize assistant response
    setCurrentResponse('');
    setIsLoading(true);
    
    try {
      // Start streaming response
      await streamChat(userMessage, (token) => {
        setCurrentResponse(prev => prev + token);
      });
      
      // When streaming is done, add the complete message
      setMessages(prev => [...prev, { role: 'assistant', content: currentResponse }]);
      setCurrentResponse('');
    } catch (error) {
      console.error('Error in chat:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary/20 text-foreground'
                  : 'bg-muted/30 text-foreground'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        
        {currentResponse && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-muted/30 text-foreground">
              <div className="whitespace-pre-wrap">{currentResponse}</div>
            </div>
          </div>
        )}
        
        {isLoading && !currentResponse && (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border/50 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about any topic..."
            className="flex-1 bg-card/30 backdrop-blur-sm border border-border/50 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !message.trim()}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
