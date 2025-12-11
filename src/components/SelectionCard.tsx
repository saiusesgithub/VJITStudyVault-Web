import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectionCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  onClick: () => void;
  className?: string;
  large?: boolean;
}

export function SelectionCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  onClick, 
  className,
  large = false 
}: SelectionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'gradient-card card-hover w-full text-left',
        'bg-card border border-border/50 shadow-sm',
        large ? 'p-8' : 'p-4',
        'rounded-2xl',
        className
      )}
    >
      <div className={cn(
        'flex items-center gap-4',
        large && 'flex-col text-center'
      )}>
        {Icon && (
          <div className={cn(
            'flex items-center justify-center rounded-xl bg-primary/10',
            large ? 'w-16 h-16' : 'w-12 h-12'
          )}>
            <Icon className={cn(
              'text-primary',
              large ? 'w-8 h-8' : 'w-6 h-6'
            )} />
          </div>
        )}
        <div>
          <h3 className={cn(
            'font-semibold text-foreground',
            large ? 'text-xl' : 'text-base'
          )}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </button>
  );
}
