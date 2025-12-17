import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { useNavigation } from '@/contexts/NavigationContext';
import { db } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Loader2 } from 'lucide-react';
import { saveSelection } from '@/lib/storage';

export default function SubCategoryPage() {
  const navigate = useNavigate();
  const { state } = useNavigation();
  const { toast } = useToast();
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYears = async () => {
      if (!state.regulation || !state.branch || !state.year || !state.semester || !state.subject) {
        toast({
          title: 'Selection incomplete',
          description: 'Please select a subject first.',
          variant: 'destructive',
        });
        navigate('/subjects');
        return;
      }

      try {
        setLoading(true);
        const data = await db.getAvailableYears(
          state.regulation,
          state.branch,
          state.year,
          state.semester,
          state.subject
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
  }, [state.regulation, state.branch, state.year, state.semester, state.subject]);

  const handleSelect = (year: string) => {
    // Store the selected year for filtering in PDFListPage
    saveSelection('yearOptional', year);
    navigate('/pdfs');
  };

  return (
    <PageLayout title={`${state.subject || 'Subject'} PYQs`}>
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold gradient-text mb-2">Select Exam Year</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading years...</p>
          </div>
        ) : years.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-foreground font-medium mb-1">No PYQ years available yet</p>
            <p className="text-sm text-muted-foreground mb-4">Help us add previous papers!</p>
            <a
              href="#contribute"
              className="text-sm gradient-text hover:underline"
            >
              Contribute PYQs →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {years.map((year) => (
              <SelectionCard
                key={year}
                title={year}
                icon={Calendar}
                onClick={() => handleSelect(year)}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
