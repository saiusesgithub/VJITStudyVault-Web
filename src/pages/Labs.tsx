import { PageLayout } from '@/components/layout/PageLayout';
import { FlaskConical } from 'lucide-react';

export default function Labs() {
  return (
    <PageLayout title="Labs">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <FlaskConical className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Labs Coming Soon</h2>
        <p className="text-muted-foreground max-w-xs">
          Lab manuals and practical resources will be available here soon.
        </p>
      </div>
    </PageLayout>
  );
}
