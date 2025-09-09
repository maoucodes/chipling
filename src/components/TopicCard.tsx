import { FC } from 'react';
import { BookmarkIcon, SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopicCardProps {
  title: string;
  relevance?: number;
  description: string;
  onClick?: () => void;
  isBookmarked?: boolean;
  onBookmark?: () => void;
}

const TopicCard: FC<TopicCardProps> = ({ 
  title, 
  relevance = 0, 
  description,
  onClick,
  isBookmarked = false,
  onBookmark
}) => {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookmark) {
      onBookmark();
    }
  };

  return (
    <div 
      className="chipling-card-hover cursor-pointer focus-ring"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold truncate">{title}</h3>
          <div className="flex gap-1">
            <button 
              className={cn(
                "p-1.5 rounded-full transition-colors focus-ring",
                isBookmarked ? "text-primary bg-primary/20" : "hover:bg-accent/20"
              )}
              onClick={handleBookmarkClick}
            >
              <BookmarkIcon className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-accent/20 transition-colors focus-ring">
              <SearchIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        {relevance > 0 && (
          <div className="mb-3 text-sm text-muted-foreground">
            Relevance: {relevance}/10
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
};

export default TopicCard;