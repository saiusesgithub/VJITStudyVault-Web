import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="h-full max-w-lg mx-auto px-4 flex items-center justify-between">
        <div className="w-10">
          {!isHome && (
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

        <h1 className="text-lg font-semibold truncate">{title}</h1>

        <div className="w-10">
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
