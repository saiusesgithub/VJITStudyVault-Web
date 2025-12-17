import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Heart, Loader2, CheckCircle2 } from 'lucide-react';

export default function Contribute() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    regulation: '',
    branch: '',
    year: '',
    sem: '',
    subject_name: '',
    credits: '4',
    material_type: '',
    material_name: '',
    url: '',
    unit: '',
    contributor_name: '',
    contributor_email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.regulation || !formData.branch || !formData.year || !formData.sem ||
          !formData.subject_name || !formData.credits || !formData.material_type ||
          !formData.material_name || !formData.url) {
        toast({
          title: 'Missing fields',
          description: 'Please fill all required fields.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Prepare data for insert
      const insertData: any = {
        regulation: parseInt(formData.regulation),
        branch: formData.branch,
        year: parseInt(formData.year),
        sem: parseInt(formData.sem),
        subject_name: formData.subject_name,
        credits: parseInt(formData.credits),
        material_type: formData.material_type,
        material_name: formData.material_name,
        url: formData.url,
        contributor_name: formData.contributor_name || null,
        contributor_email: formData.contributor_email || null,
        status: 'pending',
      };

      // Add optional unit field
      if (formData.unit) {
        insertData.unit = parseInt(formData.unit);
      }

      // Insert into pending_materials table
      const { error } = await supabase.from('pending_materials').insert(insertData);

      if (error) {
        throw error;
      }

      setSubmitted(true);
      toast({
        title: 'Submission received! 🎉',
        description: 'Your contribution will be reviewed shortly.',
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          regulation: '',
          branch: '',
          year: '',
          sem: '',
          subject_name: '',
          credits: '4',
          material_type: '',
          material_name: '',
          url: '',
          unit: '',
          contributor_name: '',
          contributor_email: '',
        });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <PageLayout title="Contribute">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Thank You! 🎉</h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-md">
            Your contribution has been submitted and will be reviewed by our team.
            We appreciate your help in making study materials accessible to everyone!
          </p>
          <Button onClick={() => setSubmitted(false)}>
            Submit Another Material
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Contribute">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-bold">Contribute Study Material</h1>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Help fellow students by sharing your study materials! Upload files to your Google Drive 
            and share the link below. Your submission will be reviewed before publishing.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Regulation */}
              <div>
                <Label htmlFor="regulation">Regulation *</Label>
                <Select value={formData.regulation} onValueChange={(value) => setFormData({ ...formData, regulation: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select regulation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="22">R22</SelectItem>
                    <SelectItem value="25">R25</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Branch */}
              <div>
                <Label htmlFor="branch">Branch *</Label>
                <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="AIML">AIML</SelectItem>
                    <SelectItem value="DS">DS</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="EEE">EEE</SelectItem>
                    <SelectItem value="MECH">MECH</SelectItem>
                    <SelectItem value="CIVIL">CIVIL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Year */}
              <div>
                <Label htmlFor="year">Year *</Label>
                <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Semester */}
              <div>
                <Label htmlFor="sem">Semester *</Label>
                <Select value={formData.sem} onValueChange={(value) => setFormData({ ...formData, sem: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Sem 1</SelectItem>
                    <SelectItem value="2">Sem 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Credits */}
              <div>
                <Label htmlFor="credits">Credits * (Default: 4)</Label>
                <Select value={formData.credits} onValueChange={(value) => setFormData({ ...formData, credits: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select credits" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Credit</SelectItem>
                    <SelectItem value="2">2 Credits</SelectItem>
                    <SelectItem value="3">3 Credits</SelectItem>
                    <SelectItem value="4">4 Credits</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Material Type */}
              <div>
                <Label htmlFor="material_type">Material Type *</Label>
                <Input
                  id="material_type"
                  value={formData.material_type}
                  onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
                  placeholder="e.g., Notes, Question Bank"
                />
                <p className="text-xs text-muted-foreground mt-1">Notes, Question Bank, Important Questions, etc.</p>
              </div>
            </div>

            {/* Subject Name */}
            <div>
              <Label htmlFor="subject_name">Subject Name (Short Form) *</Label>
              <Input
                id="subject_name"
                value={formData.subject_name}
                onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                placeholder="e.g., PS, MFCS, DS, DBMS"
              />
            </div>

            {/* Material Name */}
            <div>
              <Label htmlFor="material_name">Material Name *</Label>
              <Input
                id="material_name"
                value={formData.material_name}
                onChange={(e) => setFormData({ ...formData, material_name: e.target.value })}
                placeholder="e.g., Unit 1 Notes, Mid-1 Question Bank"
              />
            </div>

            {/* URL */}
            <div>
              <Label htmlFor="url">Google Drive/YouTube URL *</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://drive.google.com/..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Make sure the link is set to "Anyone with the link can view"
              </p>
            </div>

            {/* Unit (Optional) */}
            <div>
              <Label htmlFor="unit">Unit (Optional - for Notes/Videos)</Label>
              <Select value={formData.unit || undefined} onValueChange={(value) => setFormData({ ...formData, unit: value === 'none' ? '' : value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Unit</SelectItem>
                  <SelectItem value="1">Unit 1</SelectItem>
                  <SelectItem value="2">Unit 2</SelectItem>
                  <SelectItem value="3">Unit 3</SelectItem>
                  <SelectItem value="4">Unit 4</SelectItem>
                  <SelectItem value="5">Unit 5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contributor Info (Optional) */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Your Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contributor_name">Your Name</Label>
                  <Input
                    id="contributor_name"
                    value={formData.contributor_name}
                    onChange={(e) => setFormData({ ...formData, contributor_name: e.target.value })}
                    placeholder="Anonymous"
                  />
                </div>
                <div>
                  <Label htmlFor="contributor_email">Your Email</Label>
                  <Input
                    id="contributor_email"
                    type="email"
                    value={formData.contributor_email}
                    onChange={(e) => setFormData({ ...formData, contributor_email: e.target.value })}
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-muted-foreground mt-1">For submission updates only</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Submit Contribution
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
