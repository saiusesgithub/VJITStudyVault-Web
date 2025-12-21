import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { Calendar, FileText, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

const years = [
  { id: '1', title: '1st Year' },
  { id: '2', title: '2nd Year' },
  { id: '3', title: '3rd Year' },
  { id: '4', title: '4th Year' },
];

export default function YearSelection() {
  const navigate = useNavigate();
  const { regulation, branch } = useParams<{ regulation: string; branch: string }>();
  const [syllabusUrl, setSyllabusUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSyllabus = async () => {
      if (!regulation || !branch) return;

      try {
        const { data, error } = await supabase
          .from('materials')
          .select('url')
          .eq('regulation', regulation.toUpperCase())
          .eq('branch', branch.toUpperCase())
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
  }, [regulation, branch]);

  const handleSelect = (year: string) => {
    navigate(`/${regulation}/${branch}/${year}`);
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
