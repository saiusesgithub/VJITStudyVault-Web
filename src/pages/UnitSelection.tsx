import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { SelectionCard } from '@/components/SelectionCard';
import { db, Material } from '@/lib/supabase';
import { Loader2, BookOpen, MessageCircle, FileText, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatYearForDB, formatSemesterForDB, toUpperCase } from '@/lib/urlHelpers';

function UnitSelection() {
  const navigate = useNavigate();
  const { regulation, branch, year, semester, subject, materialType } = useParams();
  const [units, setUnits] = useState<number[]>([]);
  const [generalMaterials, setGeneralMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectName, setSubjectName] = useState<string>('');
  const [materialTypeName, setMaterialTypeName] = useState<string>('');

  useEffect(() => {
    if (!regulation || !branch || !year || !semester || !subject || !materialType) {
      navigate('/');
      return;
    }

    const fetchUnits = async () => {
      setLoading(true);
      try {
        // Get actual subject name from DB
        const subjects = await db.getSubjects(
          toUpperCase(regulation),
          toUpperCase(branch),
          formatYearForDB(year),
          formatSemesterForDB(semester)
        );
        const matchedSubject = subjects.find(s => s.name.toLowerCase().replace(/\s+/g, '-') === subject);
        
        if (matchedSubject) {
          setSubjectName(matchedSubject.name);
          
          // Get material type name
          const materialTypes = await db.getAvailableMaterialTypes(
            toUpperCase(regulation),
            toUpperCase(branch),
            formatYearForDB(year),
            formatSemesterForDB(semester),
            matchedSubject.name
          );
          const matchedMaterialType = materialTypes.find(mt => mt.name.toLowerCase().replace(/\s+/g, '-') === materialType);
          
          if (matchedMaterialType) {
            setMaterialTypeName(matchedMaterialType.name);
            
            const availableUnits = await db.getAvailableUnits(
              toUpperCase(regulation),
              toUpperCase(branch),
              formatYearForDB(year),
              formatSemesterForDB(semester),
              matchedSubject.name,
              matchedMaterialType.name
            );
            setUnits(availableUnits);
            
            // Fetch materials without unit (general materials like all-in-one notes)
            const allMaterials = await db.getMaterials(
              toUpperCase(regulation),
              toUpperCase(branch),
              formatYearForDB(year),
              formatSemesterForDB(semester),
              matchedSubject.name,
              matchedMaterialType.name,
              undefined,
              undefined
            );
            // Filter for materials without a unit
            const noUnitMaterials = allMaterials.filter(m => m.unit === null);
            setGeneralMaterials(noUnitMaterials);
          }
        }
      } catch (error) {
        console.error('Error fetching units:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [regulation, branch, year, semester, subject, materialType, navigate]);

  const handleUnitSelect = (unit: number) => {
    navigate(`/${regulation}/${branch}/${year}/${semester}/${subject}/${materialType}/units/${unit}`);
  };

  const handleReport = () => {
    const pageInfo = `Page: Units - ${subjectName} - ${materialTypeName} (${toUpperCase(regulation!)}, ${toUpperCase(branch!)}, Year ${year}, Sem ${semester})`;
    const message = encodeURIComponent(`Hi! I'd like to report an issue with materials.\n\n${pageInfo}\n\nIssue: `);
    window.open(`https://wa.me/917569799199?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = (url: string) => {
    // Show download started notification
    toast({
      title: 'Download started',
      description: 'Your file is being downloaded...',
      duration: 4000,
    });

    // Handle Google Drive files
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/file\/d\/([^\/]+)/)?.[1];
      if (fileId) {
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        // Direct navigation works better on mobile
        window.location.href = downloadUrl;
        return;
      }
    }
    window.open(url, '_blank');
  };

  const handleOpen = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
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
        Choose a unit for {materialTypeName}
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
          {/* General Materials (no unit required) */}
          {generalMaterials.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">General Materials</h2>
              <div className="space-y-4">
                {generalMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="bg-card border border-border/50 rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground break-words">{material.material_name}</h3>
                      </div>
                      <div className="flex-shrink-0 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(material.url)}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpen(material.url)}
                          className="gap-2"
                        >
                          Open
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unit Selection */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Select by Unit</h2>
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
