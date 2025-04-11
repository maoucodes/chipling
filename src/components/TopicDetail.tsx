
import { FC, useState, useEffect } from 'react';
import { ArrowLeftIcon, BookmarkIcon, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Topic, Subtopic } from '@/types/knowledge';
import LoadingTopicDetail from './LoadingTopicDetail';
import { useHistory } from '@/contexts/HistoryContext';

interface TopicDetailProps {
  topic: Topic;
  onBack: () => void;
  streamingContent?: string;
  historyId?: string | null;
  moduleIndex?: number;
  topicIndex?: number;
}

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

  if (isLoading) {
    return <LoadingTopicDetail />;
  }

  const toggleSubtopic = (index: number) => {
    setExpandedSubtopics(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Display either the final content or the streaming content
  const displayContent = streamingContent || topic.content;

  return (
    <div className={`container mx-auto px-3 sm:px-4 lg:px-8 max-w-7xl mt-auto transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-3 sm:py-4 -mx-3 px-3 sm:-mx-4 sm:px-4 lg:-mx-8 lg:px-8 border-b border-border/50">
        <Button 
          variant="ghost" 
          size="sm" 
          className="transition-all duration-300 hover:translate-x-[-4px]" 
          onClick={onBack}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Back to all topics</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>

      <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-3 sm:p-4 lg:p-6 mt-3 sm:mt-4 mb-6 transition-all duration-300 hover:shadow-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold">{topic.title}</h1>
          <div className="flex gap-2 self-end sm:self-auto">
            <button className="p-2 rounded-full hover:bg-accent/20 transition-colors duration-300 hover:scale-110">
              <BookmarkIcon className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-accent/20 transition-colors duration-300 hover:scale-110">
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {topic.relevance > 0 && (
          <div className="mb-4 text-sm text-muted-foreground transition-opacity duration-300" style={{ animationDelay: '200ms' }}>
            Relevance: {topic.relevance}
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground mb-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            {topic.description}
          </p>
          
          <div className="text-foreground mb-8 animate-fade-in whitespace-pre-wrap" style={{ animationDelay: '400ms' }}>
            {displayContent}
            {streamingContent && <span className="ml-1 animate-pulse">▋</span>}
          </div>

          {!isLoading && topic.subtopics && topic.subtopics.length > 0 && (
            <div className="mt-8 animate-fade-in" style={{ animationDelay: '500ms' }}>
              <h2 className="text-xl font-medium mb-4">Explore Deeper</h2>
              <div className="space-y-4">
                {topic.subtopics.map((subtopic, index) => (
                  <SubtopicPanel 
                    key={index}
                    subtopic={subtopic}
                    isExpanded={!!expandedSubtopics[index]}
                    onClick={() => toggleSubtopic(index)}
                    animationDelay={600 + index * 100}
                  />
                ))}
              </div>
            </div>
          )}

          {!isLoading && topic.references && topic.references.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border/50 animate-fade-in" style={{ animationDelay: '700ms' }}>
              <h2 className="text-lg font-medium mb-2">References & Further Reading</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                {topic.references.map((reference, index) => (
                  <li key={index} className="animate-fade-in" style={{ animationDelay: `${800 + index * 100}ms` }}>{reference}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface SubtopicPanelProps {
  subtopic: Subtopic;
  isExpanded: boolean;
  onClick: () => void;
  animationDelay: number;
}

const SubtopicPanel: FC<SubtopicPanelProps> = ({ subtopic, isExpanded, onClick, animationDelay }) => {
  return (
    <div 
      className="border border-border/50 rounded-md overflow-hidden bg-card/20 hover:bg-card/40 transition-all duration-300 opacity-0 animate-fade-in"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <button 
        className="w-full text-left p-3 sm:p-4 flex justify-between items-center"
        onClick={onClick}
      >
        <h3 className="font-medium text-sm sm:text-base">{subtopic.title}</h3>
        <ChevronIcon className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="p-3 sm:p-4 pt-0 border-t border-border/50 animate-accordion-down">
          <p className="text-sm text-muted-foreground mb-4">{subtopic.description}</p>
          <div className="text-sm">{subtopic.content}</div>
        </div>
      )}
    </div>
  );
};

const ChevronIcon = ({ className }: { className?: string }) => (
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
);

export default TopicDetail;
