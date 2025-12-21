import { PageLayout } from '@/components/layout/PageLayout';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Info, Github, Linkedin, User, Upload } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

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

        {/* Contribute Section */}
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Upload className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Contribute Materials</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Help fellow students by sharing your study materials
              </p>
              <Button
                onClick={() => window.location.href = '/contribute'}
                className="mt-3 w-full sm:w-auto"
                variant="default"
              >
                Contribute Now
              </Button>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-medium gradient-text">VJIT Study Vault</h3>
              <p className="text-sm text-muted-foreground">Version 1.1</p>
            </div>
          </div>
        </div>

        {/* Developer Info */}
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Developed by</h3>
              <p className="text-sm font-medium gradient-text mt-1">Sai Srujan</p>
              <p className="text-xs text-muted-foreground mt-1">24-28 IT Student at VJIT</p>
              <div className="flex gap-3 mt-3">
                <a
                  href="https://github.com/saiusesgithub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/saisrujanpunati"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
