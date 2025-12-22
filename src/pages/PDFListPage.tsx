import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { db, Material } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { trackFileOpen } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Loader2, Youtube, MessageCircle, Download } from 'lucide-react';
import { formatYearForDB, formatSemesterForDB, toUpperCase } from '@/lib/urlHelpers';

export default function PDFListPage() {
  const navigate = useNavigate();
  const { regulation, branch, year, semester, subject, materialType, unit, yearOptional } = useParams();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectName, setSubjectName] = useState<string>('');
  const [materialTypeName, setMaterialTypeName] = useState<string>('');

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!regulation || !branch || !year || !semester || !subject || !materialType) {
        toast({
          title: 'Selection incomplete',
          description: 'Please complete your selection.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        
        // Get actual subject name from DB
        const subjects = await db.getSubjects(
          toUpperCase(regulation),
          toUpperCase(branch),
          formatYearForDB(year),
          formatSemesterForDB(semester)
        );
        const matchedSubject = subjects.find(s => s.name.toLowerCase().replace(/\s+/g, '-') === subject);
        
        if (!matchedSubject) {
          toast({
            title: 'Subject not found',
            description: 'Could not find the selected subject.',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }
        
        setSubjectName(matchedSubject.name);
        
        // Get material type name
        const materialTypes = await db.getAvailableMaterialTypes(
          toUpperCase(regulation),
          toUpperCase(branch),
          formatYearForDB(year),
          formatSemesterForDB(semester),
          matchedSubject.name
        );
        const matchedMaterialType = materialTypes.find(mt => mt.name.toLowerCase().replace(/\s+/g, '-') === materialType);
        
        if (!matchedMaterialType) {
          toast({
            title: 'Material type not found',
            description: 'Could not find the selected material type.',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }
        
        setMaterialTypeName(matchedMaterialType.name);
        
        const data = await db.getMaterials(
          toUpperCase(regulation),
          toUpperCase(branch),
          formatYearForDB(year),
          formatSemesterForDB(semester),
          matchedSubject.name,
          matchedMaterialType.name,
          yearOptional || undefined,
          unit ? parseInt(unit) : undefined
        );
        setMaterials(data);
        
        if (data.length === 0) {
          toast({
            title: 'No materials found',
            description: 'No materials available for this selection.',
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
  }, [regulation, branch, year, semester, subject, materialType, unit, yearOptional]);

  const isYouTubeLink = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const handleOpen = (url: string) => {
    // Find the material being opened
    const material = materials.find(m => m.url === url);
    
    if (material) {
      // Track the file open event
      const regulationNum = parseInt(regulation?.replace('r', '') || '22');
      const yearNum = parseInt(year || '1');
      const semesterNum = parseInt(semester || '1');
      
      trackFileOpen({
        regulation: regulationNum,
        branch: toUpperCase(branch!),
        year: yearNum,
        sem: semesterNum,
        subject_name: subjectName,
        material_type: materialTypeName,
        material_name: material.material_name,
        url: material.url,
        unit: material.unit,
      });
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = (url: string) => {
    // Show download started notification
    toast({
      title: 'Download started',
      description: 'Your file is being downloaded...',
      duration: 4000,
    });

    // Handle Google Drive files
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/file\/d\/([^\/]+)/)?.[1];
      if (fileId) {
        // Use download link that forces download
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        // Direct navigation works better on mobile
        window.location.href = downloadUrl;
        return;
      }
    }
    
    // Handle Google Docs
    if (url.includes('docs.google.com/document')) {
      const docId = url.match(/\/document\/d\/([^\/]+)/)?.[1];
      if (docId) {
        // Export as PDF
        window.open(`https://docs.google.com/document/d/${docId}/export?format=pdf`, '_blank');
        return;
      }
    }
    
    // Handle Google Drive folders (can't download, just open)
    if (url.includes('drive.google.com/drive/folders')) {
      window.open(url, '_blank');
      return;
    }
    
    // For non-Drive URLs, open directly
    window.open(url, '_blank');
  };

  const handleReport = () => {
    const pageInfo = `Page: Materials - ${subjectName} - ${materialTypeName} (${toUpperCase(regulation!)}, ${toUpperCase(branch!)}, Year ${year}, Sem ${semester})`;
    const message = encodeURIComponent(`Hi! I'd like to report an issue with materials.\n\n${pageInfo}\n\nIssue: `);
    window.open(`https://wa.me/917569799199?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageLayout title={`${materialTypeName || 'Materials'} – ${subjectName || 'Subject'}`}>
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading materials...</p>
          </div>
        ) : materials.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-foreground font-medium mb-1">No PDFs available yet</p>
            <p className="text-sm text-muted-foreground mb-6">We're constantly adding new materials. Check back later!</p>
            <p className="text-sm text-muted-foreground mb-2">Be the first to add resources!</p>
            <a
              href="/contribute"
              className="text-sm gradient-text hover:underline"
            >
              Share your materials →
            </a>
          </div>
        ) : (
          materials.map((material) => {
            const isYouTube = isYouTubeLink(material.url);
            return (
              <div
                key={material.id}
                className="bg-card border border-border/50 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {isYouTube ? (
                      <Youtube className="w-5 h-5 text-red-500" />
                    ) : (
                      <FileText className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground break-words">{material.material_name}</h3>
                    {material.year_optional && (
                      <p className="text-xs text-muted-foreground mt-1">Year: {material.year_optional}</p>
                    )}
                    {material.unit && (
                      <p className="text-xs text-muted-foreground mt-1">Unit {material.unit}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(material.url)}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpen(material.url)}
                      className="gap-2"
                    >
                      Open
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Report Button */}
        {materials.length > 0 && (
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReport}
              className="text-xs"
            >
              <MessageCircle className="w-3 h-3 mr-2" />
              Materials not working? Report issue
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
