import { BookOpen, FlaskConical, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: BookOpen, label: 'Materials', path: '/' },
  { icon: FlaskConical, label: 'Labs', path: '/labs' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || 
        location.pathname.startsWith('/branch') ||
        location.pathname.startsWith('/year') ||
        location.pathname.startsWith('/semester') ||
        location.pathname.startsWith('/subjects') ||
        location.pathname.startsWith('/materials') ||
        location.pathname.startsWith('/subcategory') ||
        location.pathname.startsWith('/pdfs');
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-lg border-t border-border">
      <div className="h-full max-w-lg mx-auto flex items-center justify-around">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              'flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors',
              isActive(path)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className={cn('h-5 w-5', isActive(path) && 'fill-primary/20')} />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
