import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const hideBackButton = ['/', '/labs', '/settings'].includes(location.pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="h-full max-w-lg mx-auto px-4 flex items-center justify-center relative">
        <div className="absolute left-4">
          {!hideBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
        </div>

        <h1 className="text-base md:text-xl font-bold truncate gradient-text px-12">{title}</h1>
      </div>
    </header>
  );
}
