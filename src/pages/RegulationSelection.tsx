import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { useNavigation } from '@/contexts/NavigationContext';
import { GraduationCap, BookMarked } from 'lucide-react';

const regulations = [
  { id: 'R22', title: 'R22', subtitle: 'For 2022, 2023 & 2024 Batches', icon: GraduationCap },
  { id: 'R25', title: 'R25', subtitle: 'For 2025 Batch Onwards', icon: BookMarked },
];

export default function RegulationSelection() {
  const navigate = useNavigate();
  const { setRegulation } = useNavigation();

  const handleSelect = (regulation: string) => {
    setRegulation(regulation);
    navigate('/branch');
  };

  return (
    <PageLayout title="VJIT Study Vault">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold gradient-text">Choose Regulation</h2>
          <p className="text-muted-foreground mt-2">Select your academic regulation</p>
        </div>

        <div className="grid gap-4">
          {regulations.map((reg) => (
            <SelectionCard
              key={reg.id}
              title={reg.title}
              subtitle={reg.subtitle}
              icon={reg.icon}
              onClick={() => handleSelect(reg.id)}
              large
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
