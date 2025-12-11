import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { useNavigation } from '@/contexts/NavigationContext';
import { BookOpen } from 'lucide-react';

const semesters = [
  { id: 'Sem 1', title: 'Semester 1' },
  { id: 'Sem 2', title: 'Semester 2' },
];

export default function SemesterSelection() {
  const navigate = useNavigate();
  const { setSemester } = useNavigation();

  const handleSelect = (semester: string) => {
    setSemester(semester);
    navigate('/subjects');
  };

  return (
    <PageLayout title="Choose Semester">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <p className="text-muted-foreground">Select your semester</p>
        </div>

        <div className="grid gap-4">
          {semesters.map((sem) => (
            <SelectionCard
              key={sem.id}
              title={sem.title}
              icon={BookOpen}
              onClick={() => handleSelect(sem.id)}
              large
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
