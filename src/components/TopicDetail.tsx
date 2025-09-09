import { FC, useState, useEffect, memo } from 'react';
import { ArrowLeftIcon, BookmarkIcon, SearchIcon, BookOpenIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Topic, Subtopic } from '@/types/knowledge';
import LoadingTopicDetail from './LoadingTopicDetail';
import { useHistory } from '@/contexts/HistoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { saveNote } from '@/services/notesService';
import { toast } from 'sonner';

interface TopicDetailProps {
  topic: Topic;
  onBack: () => void;
  streamingContent?: string;
  historyId?: string | null;
  moduleIndex?: number;
  topicIndex?: number;
}

// Memoized SubtopicPanel component to prevent unnecessary re-renders
const SubtopicPanel = memo(({ subtopic, isExpanded, onClick }: { subtopic: Subtopic; isExpanded: boolean; onClick: () => void }) => {
  return (
    <div 
      className="border border-border rounded-md overflow-hidden bg-card/20 hover:bg-card/40 transition-all duration-300"
    >
      <button 
        className="w-full text-left p-4 flex justify-between items-center focus-ring"
        onClick={onClick}
      >
        <h3 className="font-medium text-base">{subtopic.title}</h3>
        <ChevronIcon className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-border/50 animate-accordion-down">
          <p className="text-sm text-muted-foreground mb-4">{subtopic.description}</p>
          <div className="text-sm prose dark:prose-invert">{subtopic.content}</div>
        </div>
      )}
    </div>
  );
});

const ChevronIcon = memo(({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6 9 6 6 6-6"/>
  </svg>
));

const TopicDetail: FC<TopicDetailProps> = ({ 
  topic, 
  onBack, 
  streamingContent,
  historyId,
  moduleIndex,
  topicIndex
}) => {
  const [expandedSubtopics, setExpandedSubtopics] = useState<Record<number, boolean>>({});
  const [isVisible, setIsVisible] = useState(false);
  const isLoading = !topic || (!topic.content && !streamingContent);
  const { saveTopicDetail } = useHistory();
  const { user } = useAuth();
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  // Save the topic details to Firebase when content is loaded
  useEffect(() => {
    if (!isLoading && topic.content && historyId !== undefined && moduleIndex !== undefined && topicIndex !== undefined) {
      const saveTopic = async () => {
        try {
          await saveTopicDetail(historyId!, moduleIndex, topicIndex, topic);
        } catch (error) {
          console.error("Error saving topic detail:", error);
        }
      };
      
      saveTopic();
    }
  }, [topic.content, isLoading, historyId, moduleIndex, topicIndex, topic, saveTopicDetail]);

  const toggleSubtopic = (index: number) => {
    setExpandedSubtopics(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Display either the final content or the streaming content
  const displayContent = streamingContent || topic.content;

  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onBack();
  };

  const handleSaveToNotes = async () => {
    if (!user?.uid || isSavingNote) return;
    
    setIsSavingNote(true);
    try {
      await saveNote(user.uid, {
        title: `Notes on ${topic.title}`,
        content: displayContent || '',
        topicId: topicIndex !== undefined ? `${moduleIndex}-${topicIndex}` : undefined,
        moduleId: moduleIndex !== undefined ? moduleIndex.toString() : undefined
      });
      toast.success('Saved to notes successfully');
    } catch (error) {
      console.error('Error saving to notes:', error);
      toast.error('Failed to save to notes');
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="mb-4 focus-ring"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Topics
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
            <p className="text-muted-foreground">{topic.description}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSaveToNotes}
            disabled={isSavingNote || !user}
            className="gap-2"
          >
            <BookOpenIcon className="w-4 h-4" />
            {isSavingNote ? 'Saving...' : 'Save to Notes'}
          </Button>
        </div>
      </div>

      <div className="prose prose-invert max-w-none dark:prose-invert">
        <div className="text-foreground mb-8 whitespace-pre-wrap">
          {displayContent}
          {streamingContent && <span className="ml-1 animate-pulse-subtle">▋</span>}
        </div>

        {!isLoading && topic.subtopics && topic.subtopics.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Explore Deeper</h2>
            <div className="space-y-4">
              {topic.subtopics.map((subtopic, index) => (
                <SubtopicPanel 
                  key={index}
                  subtopic={subtopic}
                  isExpanded={!!expandedSubtopics[index]}
                  onClick={() => toggleSubtopic(index)}
                />
              ))}
            </div>
          </div>
        )}

        {!isLoading && topic.references && topic.references.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border/50">
            <h2 className="text-lg font-bold mb-3">References & Further Reading</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              {topic.references.map((reference, index) => (
                <li key={index} className="text-sm">{reference}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(TopicDetail);