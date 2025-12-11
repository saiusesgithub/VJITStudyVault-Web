import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface PageLayoutProps {
  title: string;
  children: ReactNode;
}

export function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header title={title} />
      <main className="pt-14 pb-20 px-4 max-w-lg mx-auto">
        <div className="page-enter py-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
