import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { useNavigation } from '@/contexts/NavigationContext';
import { 
  FileText, 
  HelpCircle, 
  Clock, 
  Star, 
  List, 
  FlaskConical, 
  BookOpen, 
  Presentation 
} from 'lucide-react';

const materialTypes = [
  { id: 'notes', title: 'Notes', icon: FileText, hasSubcategory: false },
  { id: 'qbank', title: 'Question Bank', icon: HelpCircle, hasSubcategory: false },
  { id: 'pyqs', title: 'PYQs', icon: Clock, hasSubcategory: true },
  { id: 'imp', title: 'Imp Questions', icon: Star, hasSubcategory: false },
  { id: 'syllabus', title: 'Syllabus', icon: List, hasSubcategory: false },
  { id: 'lab', title: 'Lab Manual', icon: FlaskConical, hasSubcategory: false },
  { id: 'textbook', title: 'Textbook', icon: BookOpen, hasSubcategory: false },
  { id: 'ppts', title: 'PPTs', icon: Presentation, hasSubcategory: false },
];

export default function MaterialTypeSelection() {
  const navigate = useNavigate();
  const { state, setMaterialType } = useNavigation();

  const handleSelect = (type: string, hasSubcategory: boolean) => {
    setMaterialType(type);
    if (hasSubcategory) {
      navigate('/subcategory');
    } else {
      navigate('/pdfs');
    }
  };

  return (
    <PageLayout title={`${state.subject || 'Subject'} Materials`}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {materialTypes.map((type) => (
            <SelectionCard
              key={type.id}
              title={type.title}
              icon={type.icon}
              onClick={() => handleSelect(type.title, type.hasSubcategory)}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
