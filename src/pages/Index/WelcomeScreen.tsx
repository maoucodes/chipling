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
    <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto text-center px-container">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Deep Dive into Knowledge</h1>
      <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
        Explore any academic or research topic in a structured, progressively expanding format designed for deep understanding.
      </p>
      <SearchInput onSearch={onSearch} onLoginRequired={onLoginRequired} />
      <div className="w-full mt-12">
        <h2 className="text-xl font-semibold mb-6 text-left">Popular Topics</h2>
        <div className="relative overflow-hidden">
          <div className="animate-carousel flex gap-4 py-2">
            {[...POPULAR_TOPICS, ...POPULAR_TOPICS].map((topic, index) => (
              <PopularTopic
                key={index}
                icon={topic.icon}
                title={topic.title}
                onClick={() => {
                  // Allow searches without authentication
                  onSearch(topic.title);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;