
import { FC } from 'react';

interface PopularTopicProps {
  icon: string;
  title: string;
  onClick: () => void;
}

const PopularTopic: FC<PopularTopicProps> = ({ icon, title, onClick }) => {
  return (
    <button 
      className="popular-topic group"
      onClick={onClick}
    >
      <span className="popular-topic-icon">{icon}</span>
      <span className="popular-topic-title">{title}</span>
    </button>
  );
};

export default PopularTopic;
