
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface ChiplingLayoutProps {
  children: ReactNode;
}

const ChiplingLayout = ({ children }: ChiplingLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ChiplingLayout;
