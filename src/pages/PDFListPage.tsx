import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useNavigation } from '@/contexts/NavigationContext';
import { db, Material } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { getSelection } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Loader2 } from 'lucide-react';

export default function PDFListPage() {
  const navigate = useNavigate();
  const { state } = useNavigation();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!state.subjectId || !state.materialTypeId) {
        toast({
          title: 'Selection incomplete',
          description: 'Please select a subject and material type.',
          variant: 'destructive',
        });
        navigate('/subjects');
        return;
      }

      try {
        setLoading(true);
        // Get optional year filter (for PYQs)
        const yearOptional = getSelection('yearOptional');
        const data = await db.getMaterials(
          state.subjectId, 
          state.materialTypeId,
          yearOptional || undefined
        );
        setMaterials(data);
        
        if (data.length === 0) {
          toast({
            title: 'No materials found',
            description: 'No PDFs available for this selection.',
          });
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
        toast({
          title: 'Error loading materials',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [state.subjectId, state.materialTypeId]);

  const handleOpen = (driveUrl: string) => {
    window.open(driveUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageLayout title={`${state.materialType || 'Materials'} – ${state.subject || 'Subject'}`}>
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading materials...</p>
          </div>
        ) : materials.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No PDFs available</p>
          </div>
        ) : (
          materials.map((material) => (
            <div
              key={material.id}
              className="bg-card border border-border/50 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{material.name}</h3>
                  {material.description && (
                    <p className="text-sm text-muted-foreground mt-1">{material.description}</p>
                  )}
                  {material.year_optional && (
                    <p className="text-xs text-muted-foreground mt-1">Year: {material.year_optional}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpen(material.drive_url)}
                  className="flex-shrink-0 gap-2"
                >
                  Open
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}
