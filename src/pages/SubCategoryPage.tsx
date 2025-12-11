import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { useNavigation } from '@/contexts/NavigationContext';
import { Calendar } from 'lucide-react';

// TODO: Fetch years dynamically from Supabase
const pyqYears = ['2025', '2024', '2023', '2022'];

export default function SubCategoryPage() {
  const navigate = useNavigate();
  const { state } = useNavigation();

  const handleSelect = () => {
    navigate('/pdfs');
  };

  return (
    <PageLayout title={`${state.subject || 'Subject'} PYQs`}>
      <div className="space-y-6">
        <div className="text-center mb-6">
          <p className="text-muted-foreground">Select exam year</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {pyqYears.map((year) => (
            <SelectionCard
              key={year}
              title={year}
              icon={Calendar}
              onClick={handleSelect}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
