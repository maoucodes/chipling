
import { FC, useState, useEffect } from 'react';
import { BookmarkIcon, HistoryIcon, User2Icon, LayersIcon, PlusIcon, ChevronRightIcon, ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Module, Topic } from '@/types/knowledge';

interface SidebarProps {
  currentModule?: Module | null;
  modules?: Module[];
  onSelectTopic?: (moduleIndex: number, topicIndex: number) => void;
  currentTopicIndices?: { moduleIndex: number, topicIndex: number } | null;
}

const Sidebar: FC<SidebarProps> = ({ 
  currentModule, 
  modules = [], 
  onSelectTopic,
  currentTopicIndices
}) => {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  
  // Calculate progress for the current module
  const calculateProgress = (moduleIndex: number) => {
    if (!modules || !modules[moduleIndex]) return 0;
    
    const module = modules[moduleIndex];
    const totalTopics = module.topics.length;
    if (totalTopics === 0) return 0;
    
    const completedCount = module.topics.filter((_, topicIndex) => 
      completedTopics[`${moduleIndex}-${topicIndex}`]
    ).length;
    
    return (completedCount / totalTopics) * 100;
  };
  
  // Toggle topic expansion
  const toggleTopic = (moduleIndex: number, topicIndex: number) => {
    const key = `${moduleIndex}-${topicIndex}`;
    setExpandedTopics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Mark topic as completed
  const markTopicCompleted = (moduleIndex: number, topicIndex: number) => {
    const key = `${moduleIndex}-${topicIndex}`;
    setCompletedTopics(prev => ({
      ...prev,
      [key]: true
    }));
  };
  
  // Auto-expand the current topic
  useEffect(() => {
    if (currentTopicIndices) {
      const { moduleIndex, topicIndex } = currentTopicIndices;
      const key = `${moduleIndex}-${topicIndex}`;
      setExpandedTopics(prev => ({
        ...prev,
        [key]: true
      }));
    }
  }, [currentTopicIndices]);
  
  return (
    <div className="chipling-sidebar">
      <div className="flex items-center p-4 gap-2 border-b border-border/50">
        <div className="bg-white/10 rounded-md p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-semibold text-lg">chipling</span>
      </div>

      <div className="p-4 border-b border-border/50">
        <button className={cn(
          "flex items-center gap-2 w-full p-2",
          "hover:bg-accent/10 rounded-md transition-all"
        )}>
          <PlusIcon className="w-5 h-5" />
          <span>New Search</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4 pt-6">
          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-sm mb-2">CURRENT LEARNING PATH</div>
            
            {modules && modules.length > 0 ? (
              <div className="space-y-4">
                {modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{module.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(calculateProgress(moduleIndex))}%
                      </div>
                    </div>
                    
                    <Progress value={calculateProgress(moduleIndex)} className="h-1.5 mb-2" />
                    
                    <div className="pl-2 space-y-1">
                      {module.topics.map((topic, topicIndex) => {
                        const isCompleted = completedTopics[`${moduleIndex}-${topicIndex}`];
                        const isExpanded = expandedTopics[`${moduleIndex}-${topicIndex}`];
                        const isActive = currentTopicIndices?.moduleIndex === moduleIndex && 
                                        currentTopicIndices?.topicIndex === topicIndex;
                        
                        return (
                          <Collapsible 
                            key={topicIndex} 
                            open={isExpanded}
                            onOpenChange={() => toggleTopic(moduleIndex, topicIndex)}
                          >
                            <div className={cn(
                              "flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm",
                              isActive ? "bg-primary/20" : "hover:bg-accent/10",
                              isCompleted ? "text-green-400" : ""
                            )}
                            onClick={() => onSelectTopic && onSelectTopic(moduleIndex, topicIndex)}
                            >
                              <CollapsibleTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <button className="size-5 flex items-center justify-center rounded hover:bg-accent/20">
                                  {isExpanded ? (
                                    <ChevronDownIcon className="size-4" />
                                  ) : (
                                    <ChevronRightIcon className="size-4" />
                                  )}
                                </button>
                              </CollapsibleTrigger>
                              
                              <div className="w-5 h-5 flex items-center justify-center">
                                {isCompleted ? (
                                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                                ) : (
                                  <div className="w-2 h-2 bg-muted rounded-full" />
                                )}
                              </div>
                              
                              <span className="truncate">{topic.title}</span>
                            </div>
                            
                            <CollapsibleContent>
                              {topic.subtopics && topic.subtopics.length > 0 ? (
                                <div className="pl-6 pt-1 pb-1 space-y-1">
                                  {topic.subtopics.map((subtopic, subtopicIndex) => (
                                    <div 
                                      key={subtopicIndex}
                                      className="flex items-center gap-2 p-1.5 text-xs rounded-md hover:bg-accent/10 cursor-pointer"
                                    >
                                      <div className="w-4 h-4 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-muted rounded-full" />
                                      </div>
                                      <span className="truncate">{subtopic.title}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="pl-6 pt-1 pb-1 text-xs text-muted-foreground">
                                  No subtopics available
                                </div>
                              )}
                              
                              {topicIndex < module.topics.length - 1 && (
                                <div 
                                  className="flex items-center gap-2 pl-6 p-1.5 text-xs text-primary hover:underline cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markTopicCompleted(moduleIndex, topicIndex);
                                    onSelectTopic && onSelectTopic(moduleIndex, topicIndex + 1);
                                  }}
                                >
                                  <span>Next topic</span>
                                  <ChevronRightIcon className="size-3" />
                                </div>
                              )}
                            </CollapsibleContent>
                          </Collapsible>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <LayersIcon className="size-10 mb-2 opacity-30" />
                <div className="text-sm">No current layers</div>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-6 px-2">
          <SidebarItem icon={<BookmarkIcon className="w-5 h-5" />} label="Notes" />
          <SidebarItem icon={<HistoryIcon className="w-5 h-5" />} label="Rabbit Holes" />
        </nav>
      </div>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="bg-muted rounded-full w-8 h-8 flex items-center justify-center">
            <User2Icon className="w-5 h-5" />
          </div>
          <span>User</span>
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
}

const SidebarItem: FC<SidebarItemProps> = ({ icon, label }) => {
  return (
    <div className={cn(
      "flex items-center gap-2 p-2 my-1",
      "hover:bg-accent/10 rounded-md transition-all cursor-pointer"
    )}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default Sidebar;
