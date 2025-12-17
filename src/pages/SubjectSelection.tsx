import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { useNavigation } from '@/contexts/NavigationContext';
import { db, Subject } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen,
  Loader2
} from 'lucide-react';

export default function SubjectSelection() {
  const navigate = useNavigate();
  const { state, setSubject, getBreadcrumb } = useNavigation();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!state.regulation || !state.branch || !state.year || !state.semester) {
        toast({
          title: 'Selection incomplete',
          description: 'Please select regulation, branch, year, and semester first.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const data = await db.getSubjects(
          state.regulation,
          state.branch,
          state.year,
          state.semester
        );
        setSubjects(data);
        
        if (data.length === 0) {
          toast({
            title: 'No subjects found',
            description: 'No subjects available for this selection.',
          });
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast({
          title: 'Error loading subjects',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [state.regulation, state.branch, state.year, state.semester]);

  const handleSelect = (subject: Subject) => {
    setSubject(subject.name);
    navigate('/materials');
  };

  const breadcrumb = getBreadcrumb();

  return (
    <PageLayout title="Subjects">
      <div className="space-y-6">
        {breadcrumb && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-full px-4 py-2 inline-block">
              {breadcrumb}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading subjects...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-foreground font-medium mb-1">No subjects available yet</p>
            <p className="text-sm text-muted-foreground mb-4">Be the first to contribute!</p>
            <a
              href="/contribute"
              className="text-sm gradient-text hover:underline"
            >
              Help us add materials →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {subjects.map((subject) => (
              <SelectionCard
                key={subject.id}
                title={subject.name}
                subtitle={`${subject.credits} Credits`}
                icon={BookOpen}
                onClick={() => handleSelect(subject)}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
