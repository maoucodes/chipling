
import { FC } from 'react';
import SearchInput from '@/components/SearchInput';
import PopularTopic from './PopularTopic';

interface WelcomeScreenProps {
  onSearch: (query: string) => void;
  onLoginRequired: () => void;
  setPendingSearch: (query: string) => void;
  isAuthenticated: boolean;
}

const POPULAR_TOPICS = [
  { icon: "🌌", title: "Black Hole Paradoxes" },
  { icon: "🔬", title: "Dark Matter Theory" },
  { icon: "💭", title: "Dream Science Research" },
  { icon: "🧘", title: "Meditation Neuroscience" },
  { icon: "🤖", title: "Quantum Computing" },
  { icon: "🚀", title: "Space Exploration" },
  { icon: "🧠", title: "AI Ethics" },
  { icon: "🔮", title: "Cognitive Science" },
  { icon: "🧬", title: "Genetic Engineering" },
  { icon: "🌍", title: "Climate Science" },
  { icon: "⚛️", title: "Particle Physics" },
  { icon: "🦠", title: "Microbiology" }
];

const WelcomeScreen: FC<WelcomeScreenProps> = ({ 
  onSearch, 
  onLoginRequired, 
  setPendingSearch,
  isAuthenticated 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Deep Dive into Knowledge</h1>
      <p className="text-lg text-muted-foreground mb-12">
        Explore any academic or research topic in a structured, progressively expanding format designed for deep understanding.
      </p>
      <SearchInput onSearch={onSearch} onLoginRequired={onLoginRequired} />
      <div className="relative w-full mt-8 overflow-hidden">
        <div className="animate-carousel flex gap-4 py-4">
          {POPULAR_TOPICS.map((topic, index) => (
            <PopularTopic
              key={index}
              icon={topic.icon}
              title={topic.title}
              onClick={() => {
                if (isAuthenticated) {
                  onSearch(topic.title);
                } else {
                  setPendingSearch(topic.title);
                  onLoginRequired();
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
