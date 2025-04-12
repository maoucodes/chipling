
import { FC } from 'react';
import SearchInput from '@/components/SearchInput';

interface NoResultsViewProps {
  onSearch: (query: string) => void;
  onLoginRequired: () => void;
}

const NoResultsView: FC<NoResultsViewProps> = ({ onSearch, onLoginRequired }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto text-center px-4">
      <h2 className="text-2xl font-bold mb-4">No Results Found</h2>
      <p className="text-muted-foreground mb-6">
        We couldn't generate knowledge modules for your query. Please try a different search term.
      </p>
      <SearchInput onSearch={onSearch} onLoginRequired={onLoginRequired} />
    </div>
  );
};

export default NoResultsView;
