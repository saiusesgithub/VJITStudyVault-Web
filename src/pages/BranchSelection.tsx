import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
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
  { id: 'it', title: 'IT', icon: Monitor },
  { id: 'cse', title: 'CSE', icon: Cpu },
  { id: 'aiml', title: 'AIML', icon: Brain },
  { id: 'ds', title: 'DS', icon: Database },
  { id: 'ece', title: 'ECE', icon: Radio },
  { id: 'eee', title: 'EEE', icon: Zap },
  { id: 'mech', title: 'MECH', icon: Cog },
  { id: 'civil', title: 'CIVIL', icon: Building2 },
];

export default function BranchSelection() {
  const navigate = useNavigate();
  const { regulation } = useParams<{ regulation: string }>();

  const handleSelect = (branch: string) => {
    navigate(`/${regulation}/${branch}`);
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
