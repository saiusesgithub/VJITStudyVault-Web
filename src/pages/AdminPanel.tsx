import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Shield, Upload, Loader2 } from 'lucide-react';

const SECRET_CODE = import.meta.env.VITE_ADMIN_SECRET_CODE;

export default function AdminPanel() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    regulation: '',
    branch: '',
    year: '',
    sem: '',
    subject_name: '',
    credits: '3', // Default to 3 credits
    material_type: '',
    material_name: '',
    url: '',
    unit: '',
  });

  const handleAuth = () => {
    if (secretInput === SECRET_CODE) {
      setIsAuthenticated(true);
      toast({
        title: 'Access granted',
        description: 'Welcome to the admin panel.',
      });
    } else {
      toast({
        title: 'Access denied',
        description: 'Invalid secret code.',
        variant: 'destructive',
      });
    }
  };

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
      };

      // Add optional unit field
      if (formData.unit) {
        insertData.unit = parseInt(formData.unit);
      }

      // Insert into Supabase
      const { error } = await supabase.from('materials').insert(insertData);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success!',
        description: 'Material uploaded successfully.',
      });

      // Reset form
      setFormData({
        regulation: '',
        branch: '',
        year: '',
        sem: '',
        subject_name: '',
        credits: '3', // Keep default 3 credits
        material_type: '',
        material_name: '',
        url: '',
        unit: '',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <PageLayout title="Admin Access">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-lg">
            <div className="flex justify-center mb-6">
              <Shield className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-6">Admin Panel</h1>
            <div className="space-y-4">
              <div>
                <Label htmlFor="secret">Enter Secret Code</Label>
                <Input
                  id="secret"
                  type="password"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                  placeholder="****"
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              <Button onClick={handleAuth} className="w-full">
                Unlock
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Upload Material">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Upload Study Material</h1>
          </div>

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
                  placeholder="e.g., Notes, Question Bank, Important Questions"
                />
                <p className="text-xs text-muted-foreground mt-1">Common types: Notes, Question Bank, Important Questions, Reference Books, YouTube Videos, PYQs, Syllabus, MCQs</p>
              </div>
            </div>

            {/* Subject Name */}
            <div>
              <Label htmlFor="subject_name">Subject Name (Short Form) *</Label>
              <Input
                id="subject_name"
                value={formData.subject_name}
                onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                placeholder="e.g., PS, MFCS, DS, DBMS, PC, CSA"
              />
            </div>

            {/* Material Name */}
            <div>
              <Label htmlFor="material_name">Material Name *</Label>
              <Input
                id="material_name"
                value={formData.material_name}
                onChange={(e) => setFormData({ ...formData, material_name: e.target.value })}
                placeholder="e.g., Unit 1 Notes, Question Bank"
              />
            </div>

            {/* URL */}
            <div>
              <Label htmlFor="url">Drive/YouTube URL *</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://drive.google.com/..."
              />
            </div>

            {/* Unit (Optional) */}
            <div>
              <Label htmlFor="unit">Unit (Optional - for Notes/YouTube)</Label>
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

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Material
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
