import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Loader2, MessageCircle } from 'lucide-react';
import { formatYearForDB, formatSemesterForDB, toUpperCase } from '@/lib/urlHelpers';

export default function SubCategoryPage() {
  const navigate = useNavigate();
  const { regulation, branch, year, semester, subject, materialType } = useParams();
  const { toast } = useToast();
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectName, setSubjectName] = useState<string>('');

  useEffect(() => {
    const fetchYears = async () => {
      if (!regulation || !branch || !year || !semester || !subject) {
        toast({
          title: 'Selection incomplete',
          description: 'Please select a subject first.',
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
        
        const data = await db.getAvailableYears(
          toUpperCase(regulation),
          toUpperCase(branch),
          formatYearForDB(year),
          formatSemesterForDB(semester),
          matchedSubject.name
        );
        setYears(data);
        
        if (data.length === 0) {
          toast({
            title: 'No years found',
            description: 'No PYQ years available for this subject.',
          });
        }
      } catch (error) {
        console.error('Error fetching PYQ years:', error);
        toast({
          title: 'Error loading years',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, [regulation, branch, year, semester, subject]);

  const handleSelect = (yearOptional: string) => {
    navigate(`/${regulation}/${branch}/${year}/${semester}/${subject}/${materialType}/years/${yearOptional}`);
  };

  const handleReport = () => {
    const pageInfo = `Page: PYQ Years - ${subjectName} (${toUpperCase(regulation!)}, ${toUpperCase(branch!)}, Year ${year}, Sem ${semester})`;
    const message = encodeURIComponent(`Hi! I'd like to report an issue with materials.\n\n${pageInfo}\n\nIssue: `);
    window.open(`https://wa.me/917569799199?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageLayout title="Choose Year">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold gradient-text mb-2">Select PYQ Year</h2>
          <p className="text-muted-foreground text-sm">Choose the year for previous year question papers</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading years...</p>
          </div>
        ) : years.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No PYQ years available yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              We're constantly adding new materials. Check back later!
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Be the first to add resources!
            </p>
            <a
              href="/contribute"
              className="text-sm gradient-text hover:underline"
            >
              Share your materials →
            </a>
          </div>
        ) : (
          <div className="grid gap-4">
            {years.map((yr) => (
              <SelectionCard
                key={yr}
                title={yr}
                icon={Calendar}
                onClick={() => handleSelect(yr)}
              />
            ))}
          </div>
        )}

        {/* Report Button */}
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
      </div>
    </PageLayout>
  );
}
