import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { db, MaterialTypeInfo, getMaterialTypeIcon } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  HelpCircle, 
  Clock, 
  Star, 
  List, 
  FlaskConical, 
  BookOpen, 
  Presentation,
  Loader2,
  Youtube
} from 'lucide-react';

const iconMap: Record<string, any> = {
  'FileText': FileText,
  'HelpCircle': HelpCircle,
  'Clock': Clock,
  'Star': Star,
  'List': List,
  'FlaskConical': FlaskConical,
  'BookOpen': BookOpen,
  'Presentation': Presentation,
  'Youtube': Youtube,
};

export default function MaterialTypeSelection() {
  const navigate = useNavigate();
  const { regulation, branch, year, semester, subject } = useParams<{ regulation: string; branch: string; year: string; semester: string; subject: string }>();
  const { toast } = useToast();
  const [materialTypes, setMaterialTypes] = useState<MaterialTypeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [actualSubjectName, setActualSubjectName] = useState<string>('');

  useEffect(() => {
    const fetchMaterialTypes = async () => {
      if (!regulation || !branch || !year || !semester || !subject) {
        toast({
          title: 'Selection incomplete',
          description: 'Please complete your selection first.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        // First get all subjects to match the URL slug to actual name
        const subjects = await db.getSubjects(
          regulation.toUpperCase(),
          branch.toUpperCase(),
          `${year}${year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th'} Year`,
          `Sem ${semester}`
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
        
        setActualSubjectName(matchedSubject.name);
        
        const data = await db.getAvailableMaterialTypes(
          regulation.toUpperCase(),
          branch.toUpperCase(),
          `${year}${year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th'} Year`,
          `Sem ${semester}`,
          matchedSubject.name
        );
        setMaterialTypes(data);
        
        if (data.length === 0) {
          toast({
            title: 'No materials found',
            description: 'No study materials available for this subject yet.',
          });
        }
      } catch (error) {
        console.error('Error fetching material types:', error);
        toast({
          title: 'Error loading materials',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialTypes();
  }, [regulation, branch, year, semester, subject]);

  const handleSelect = (type: MaterialTypeInfo) => {
    const materialTypeSlug = type.name.toLowerCase().replace(/\s+/g, '-');
    if (type.has_units) {
      // For Notes and YouTube Videos, go to unit selection
      navigate(`/${regulation}/${branch}/${year}/${semester}/${subject}/${materialTypeSlug}/units`);
    } else if (type.name === 'PYQs') {
      // For PYQs, go to year selection
      navigate(`/${regulation}/${branch}/${year}/${semester}/${subject}/${materialTypeSlug}/years`);
    } else {
      // For others, go directly to materials list
      navigate(`/${regulation}/${branch}/${year}/${semester}/${subject}/${materialTypeSlug}`);
    }
  };

  return (
    <PageLayout title={`${actualSubjectName || 'Subject'} Materials`}>
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading materials...</p>
          </div>
        ) : materialTypes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-foreground font-medium mb-1">No materials available yet</p>
            <p className="text-sm text-muted-foreground mb-6">We're constantly adding new materials. Check back later!</p>
            <p className="text-sm text-muted-foreground mb-2">Help us build the library!</p>
            <a
              href="/contribute"
              className="text-sm gradient-text hover:underline"
            >
              Contribute materials →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {materialTypes.map((type) => {
              const iconName = getMaterialTypeIcon(type.name);
              const IconComponent = iconMap[iconName] || FileText;
              return (
                <SelectionCard
                  key={type.name}
                  title={type.name}
                  icon={IconComponent}
                  onClick={() => handleSelect(type)}
                />
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
