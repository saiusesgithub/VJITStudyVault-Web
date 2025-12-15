import { PageLayout } from '@/components/layout/PageLayout';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Moon, Sun, RotateCcw, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { reset } = useNavigation();
  const { toast } = useToast();

  const handleReset = () => {
    reset();
    toast({
      title: 'App Reset',
      description: 'All selections have been cleared.',
    });
  };

  return (
    <PageLayout title="Settings">
      <div className="space-y-6">
        {/* Theme Toggle */}
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-primary flex-shrink-0" />
              ) : (
                <Sun className="w-5 h-5 text-primary flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">Dark Mode</h3>
                <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <RotateCcw className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">Reset App</h3>
                <p className="text-sm text-muted-foreground">Clear all selections</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-medium text-foreground">VJIT Study Vault</h3>
              <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
