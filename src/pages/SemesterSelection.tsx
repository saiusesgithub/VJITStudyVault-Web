import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { BookOpen } from 'lucide-react';

const semesters = [
  { id: '1', title: 'Semester 1' },
  { id: '2', title: 'Semester 2' },
];

export default function SemesterSelection() {
  const navigate = useNavigate();
  const { regulation, branch, year } = useParams<{ regulation: string; branch: string; year: string }>();

  const handleSelect = (semester: string) => {
    navigate(`/${regulation}/${branch}/${year}/${semester}`);
  };

  return (
    <PageLayout title="Choose Semester">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold gradient-text mb-2">Select Semester</h2>
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
