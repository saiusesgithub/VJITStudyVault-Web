import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { useNavigation } from '@/contexts/NavigationContext';
import { 
  Monitor, 
  Cpu, 
  Radio, 
  Zap, 
  Cog, 
  Building2, 
  Brain, 
  Database
} from 'lucide-react';

const branches = [
  { id: 'IT', title: 'IT', icon: Monitor },
  { id: 'CSE', title: 'CSE', icon: Cpu },
  { id: 'AIML', title: 'AIML', icon: Brain },
  { id: 'DS', title: 'DS', icon: Database },
  { id: 'ECE', title: 'ECE', icon: Radio },
  { id: 'EEE', title: 'EEE', icon: Zap },
  { id: 'MECH', title: 'MECH', icon: Cog },
  { id: 'CIVIL', title: 'CIVIL', icon: Building2 },
];

export default function BranchSelection() {
  const navigate = useNavigate();
  const { setBranch } = useNavigation();

  const handleSelect = (branch: string) => {
    setBranch(branch);
    navigate('/year');
  };

  return (
    <PageLayout title="Choose Branch">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold gradient-text mb-2">Select Your Department</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {branches.map((branch) => (
            <SelectionCard
              key={branch.id}
              title={branch.title}
              icon={branch.icon}
              onClick={() => handleSelect(branch.id)}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
