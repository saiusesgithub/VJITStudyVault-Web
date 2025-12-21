import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { useNavigation } from '@/contexts/NavigationContext';
import { Calendar, FileText, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

const years = [
  { id: '1st Year', title: '1st Year' },
  { id: '2nd Year', title: '2nd Year' },
  { id: '3rd Year', title: '3rd Year' },
  { id: '4th Year', title: '4th Year' },
];

export default function YearSelection() {
  const navigate = useNavigate();
  const { state, setYear } = useNavigation();
  const [syllabusUrl, setSyllabusUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSyllabus = async () => {
      if (!state.regulation || !state.branch) return;

      try {
        // Convert R22 to 22 for database query
        const regNum = parseInt(state.regulation.replace('R', ''));
        
        const { data, error } = await supabase
          .from('materials')
          .select('url')
          .eq('regulation', regNum)
          .eq('branch', state.branch)
          .eq('material_type', 'Syllabus')
          .limit(1)
          .single();

        if (data && !error) {
          setSyllabusUrl(data.url);
        }
      } catch (error) {
        console.error('Error fetching syllabus:', error);
      }
    };

    fetchSyllabus();
  }, [state.regulation, state.branch]);

  const handleSelect = (year: string) => {
    setYear(year);
    navigate('/semester');
  };

  const handleOpenSyllabus = () => {
    if (syllabusUrl) {
      window.open(syllabusUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <PageLayout title="Choose Year">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold gradient-text mb-2">Select Academic Year</h2>
        </div>

        <div className="grid gap-4">
          {years.map((year) => (
            <SelectionCard
              key={year.id}
              title={year.title}
              icon={Calendar}
              onClick={() => handleSelect(year.id)}
            />
          ))}
        </div>

        {syllabusUrl && (
          <div className="mt-8 bg-card border border-border/50 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground mb-1">Complete Syllabus</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {state.branch} - R{state.regulation} (All Years & Semesters)
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenSyllabus}
                  className="gap-2"
                >
                  View Syllabus
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
