import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { useNavigation } from '@/contexts/NavigationContext';
import { Calendar } from 'lucide-react';

const years = [
  { id: '1st Year', title: '1st Year' },
  { id: '2nd Year', title: '2nd Year' },
  { id: '3rd Year', title: '3rd Year' },
  { id: '4th Year', title: '4th Year' },
];

export default function YearSelection() {
  const navigate = useNavigate();
  const { setYear } = useNavigation();

  const handleSelect = (year: string) => {
    setYear(year);
    navigate('/semester');
  };

  return (
    <PageLayout title="Choose Year">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <p className="text-muted-foreground">Select your academic year</p>
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
      </div>
    </PageLayout>
  );
}
