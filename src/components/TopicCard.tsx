
import { FC } from 'react';
import { BookmarkIcon, SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopicCardProps {
  title: string;
  relevance?: number;
  description: string;
  onClick?: () => void;
}

const TopicCard: FC<TopicCardProps> = ({ 
  title, 
  relevance = 0, 
  description,
  onClick 
}) => {
  return (
    <div 
      className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-md overflow-hidden hover:bg-card/50 transition-all duration-300 opacity-0 animate-fade-in"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-accent/20 transition-colors">
              <BookmarkIcon className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-accent/20 transition-colors">
              <SearchIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        {relevance > 0 && (
          <div className="mb-4 text-sm text-muted-foreground">
            Relevance: {relevance}
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

export default TopicCard;
