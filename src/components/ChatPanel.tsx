
import { useState } from 'react';
import { MessageCircleIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Chat from './Chat';

const ChatPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg"
          size="icon"
        >
          <MessageCircleIcon className="w-6 h-6" />
        </Button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] bg-card border border-border rounded-md shadow-lg flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border/50">
            <h3 className="font-medium">Chipling AI Chat</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <Chat />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPanel;
