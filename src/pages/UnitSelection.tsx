import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '@/contexts/NavigationContext';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { db } from '@/lib/supabase';
import { Loader2, BookOpen, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function UnitSelection() {
  const navigate = useNavigate();
  const { state, setSelectedUnit } = useNavigation();
  const [units, setUnits] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.regulation || !state.branch || !state.year || !state.semester || !state.subject || !state.materialType) {
      navigate('/');
      return;
    }

    const fetchUnits = async () => {
      setLoading(true);
      try {
        const availableUnits = await db.getAvailableUnits(
          state.regulation!,
          state.branch!,
          state.year!,
          state.semester!,
          state.subject!,
          state.materialType!
        );
        setUnits(availableUnits);
      } catch (error) {
        console.error('Error fetching units:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [state.regulation, state.branch, state.year, state.semester, state.subject, state.materialType, navigate]);

  const handleUnitSelect = (unit: number) => {
    setSelectedUnit(unit);
    navigate('/pdfs');
  };

  const handleReport = () => {
    const pageInfo = `Page: Units - ${state.subject || ''} - ${state.materialType || ''} (${state.regulation || ''}, ${state.branch || ''}, Year ${state.year || ''}, Sem ${state.semester || ''})`;
    const message = encodeURIComponent(`Hi! I'd like to report an issue with materials.\n\n${pageInfo}\n\nIssue: `);
    window.open(`https://wa.me/917569799199?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <PageLayout title="Select Unit">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Select Unit">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
        Select Unit
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
        Choose a unit for {state.materialType}
      </p>

      {units.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            No units found yet! 📚
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
            We're constantly adding new materials. Check back later!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
            Want to contribute materials?
          </p>
          <a
            href="/contribute"
            className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-500 underline"
          >
            Contact us on GitHub
          </a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {units.map((unit) => (
              <SelectionCard
                key={unit}
                title={`Unit ${unit}`}
                icon={BookOpen}
                onClick={() => handleUnitSelect(unit)}
              />
            ))}
          </div>

          {/* Report Button */}
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReport}
              className="text-xs"
            >
              <MessageCircle className="w-3 h-3 mr-2" />
              Materials not working? Report issue
            </Button>
          </div>
        </>
      )}
    </PageLayout>
  );
}

export default UnitSelection;
