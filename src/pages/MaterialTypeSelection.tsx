import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { useNavigation } from '@/contexts/NavigationContext';
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
  const { state, setMaterialType } = useNavigation();
  const { toast } = useToast();
  const [materialTypes, setMaterialTypes] = useState<MaterialTypeInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterialTypes = async () => {
      if (!state.regulation || !state.branch || !state.year || !state.semester || !state.subject) {
        toast({
          title: 'Selection incomplete',
          description: 'Please complete your selection first.',
          variant: 'destructive',
        });
        navigate('/subjects');
        return;
      }

      try {
        setLoading(true);
        const data = await db.getAvailableMaterialTypes(
          state.regulation,
          state.branch,
          state.year,
          state.semester,
          state.subject
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
  }, [state.regulation, state.branch, state.year, state.semester, state.subject]);

  const handleSelect = (type: MaterialTypeInfo) => {
    setMaterialType(type.name, type.has_units);
    if (type.has_units) {
      // For Notes and YouTube Videos, go to unit selection
      navigate('/units');
    } else if (type.name === 'PYQs') {
      // For PYQs, go to year selection
      navigate('/subcategory');
    } else {
      // For others, go directly to materials list
      navigate('/pdfs');
    }
  };

  return (
    <PageLayout title={`${state.subject || 'Subject'} Materials`}>
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
            <p className="text-sm text-muted-foreground mb-4">Help us build the library!</p>
            <a
              href="/contribute"
              className="text-sm gradient-text hover:underline"
            >
              Contribute materials →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
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
