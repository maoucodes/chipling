import { FC, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface SearchInputProps {
  onSearch: (query: string) => void;
  onLoginRequired: () => void;
}

const SearchInput: FC<SearchInputProps> = ({ onSearch, onLoginRequired }) => {
  const [query, setQuery] = useState('');
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    
    // Allow searches without authentication, but prompt for login to save history
    try {
      // Proceed with the search
      onSearch(query);
    } catch (error) {
      console.error("Error processing search:", error);
      toast.error("An error occurred while processing your search");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Explore a topic..."
            className="w-full chipling-card py-4 px-4 pl-12 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
          />
        </div>
        <Button 
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6 focus-ring"
        >
          Explore
        </Button>
      </form>
    </div>
  );
};

export default SearchInput;