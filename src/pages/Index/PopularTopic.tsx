import { FC } from 'react';

interface PopularTopicProps {
  icon: string;
  title: string;
  onClick: () => void;
}

const PopularTopic: FC<PopularTopicProps> = ({ icon, title, onClick }) => {
  return (
    <button 
      className="popular-topic group focus-ring chipling-card-hover flex flex-col items-center justify-center p-4 min-w-[140px] transition-all duration-300 hover:scale-105"
      onClick={onClick}
    >
      <span className="popular-topic-icon text-2xl mb-2">{icon}</span>
      <span className="popular-topic-title text-sm font-medium text-center">{title}</span>
    </button>
  );
};

export default PopularTopic;