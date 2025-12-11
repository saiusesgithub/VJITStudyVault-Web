import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { useNavigation } from '@/contexts/NavigationContext';
import { 
  Code, 
  Database, 
  Network, 
  Calculator, 
  FileCode, 
  Layers 
} from 'lucide-react';

// TODO: Fetch subjects from Supabase based on regulation, branch, year, semester
const placeholderSubjects = [
  { id: 'sub1', title: 'Data Structures', icon: Layers },
  { id: 'sub2', title: 'Database Systems', icon: Database },
  { id: 'sub3', title: 'Computer Networks', icon: Network },
  { id: 'sub4', title: 'Programming in C', icon: Code },
  { id: 'sub5', title: 'Discrete Mathematics', icon: Calculator },
  { id: 'sub6', title: 'Web Technologies', icon: FileCode },
];

export default function SubjectSelection() {
  const navigate = useNavigate();
  const { setSubject, getBreadcrumb } = useNavigation();

  const handleSelect = (subject: string) => {
    setSubject(subject);
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

        <div className="grid grid-cols-2 gap-4">
          {placeholderSubjects.map((subject) => (
            <SelectionCard
              key={subject.id}
              title={subject.title}
              icon={subject.icon}
              onClick={() => handleSelect(subject.title)}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
