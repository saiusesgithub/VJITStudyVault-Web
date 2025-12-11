import { PageLayout } from '@/components/layout/PageLayout';
import { useNavigation } from '@/contexts/NavigationContext';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';

// TODO: Fetch PDFs from Supabase based on material type and subject
const placeholderPDFs = [
  { id: '1', name: 'Unit 1 - Introduction.pdf', description: 'Basic concepts and fundamentals' },
  { id: '2', name: 'Unit 2 - Advanced Topics.pdf', description: 'In-depth analysis and examples' },
  { id: '3', name: 'Unit 3 - Applications.pdf', description: 'Real-world applications' },
  { id: '4', name: 'Unit 4 - Case Studies.pdf', description: 'Practical case studies' },
  { id: '5', name: 'Complete Notes.pdf', description: 'All units combined' },
];

export default function PDFListPage() {
  const { state } = useNavigation();

  const handleOpen = (pdfId: string) => {
    // TODO: Open PDF link from Supabase
    console.log('Opening PDF:', pdfId);
  };

  return (
    <PageLayout title={`${state.materialType || 'Materials'} – ${state.subject || 'Subject'}`}>
      <div className="space-y-4">
        {placeholderPDFs.map((pdf) => (
          <div
            key={pdf.id}
            className="bg-card border border-border/50 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{pdf.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{pdf.description}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpen(pdf.id)}
                className="flex-shrink-0 gap-2"
              >
                Open
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
