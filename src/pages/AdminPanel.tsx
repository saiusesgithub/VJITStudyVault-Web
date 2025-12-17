import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Shield, Upload, Loader2, ClipboardList, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const SECRET_CODE = import.meta.env.VITE_ADMIN_SECRET_CODE;

interface PendingSubmission {
  id: string;
  regulation: number;
  branch: string;
  year: number;
  sem: number;
  subject_name: string;
  credits: number;
  material_type: string;
  material_name: string;
  url: string;
  unit: number | null;
  contributor_name: string | null;
  contributor_email: string | null;
  submitted_at: string;
  status: string;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<PendingSubmission | null>(null);
  const [reviewUrl, setReviewUrl] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

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
      fetchPendingSubmissions();
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

  const fetchPendingSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_materials')
        .select('*')
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setPendingSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleApprove = (submission: PendingSubmission) => {
    setSelectedSubmission(submission);
    setReviewUrl(submission.url);
    setShowApproveDialog(true);
  };

  const confirmApprove = async () => {
    if (!selectedSubmission) return;
    setLoading(true);

    try {
      // Insert into materials table with reviewed URL
      const insertData: any = {
        regulation: selectedSubmission.regulation,
        branch: selectedSubmission.branch,
        year: selectedSubmission.year,
        sem: selectedSubmission.sem,
        subject_name: selectedSubmission.subject_name,
        credits: selectedSubmission.credits,
        material_type: selectedSubmission.material_type,
        material_name: selectedSubmission.material_name,
        url: reviewUrl,
      };

      if (selectedSubmission.unit) {
        insertData.unit = selectedSubmission.unit;
      }

      const { error: insertError } = await supabase.from('materials').insert(insertData);
      if (insertError) throw insertError;

      // Update pending_materials status
      const { error: updateError } = await supabase
        .from('pending_materials')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() })
        .eq('id', selectedSubmission.id);

      if (updateError) throw updateError;

      toast({
        title: 'Approved! ✅',
        description: 'Material has been published.',
      });

      setShowApproveDialog(false);
      fetchPendingSubmissions();
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: 'Approval failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = (submission: PendingSubmission) => {
    setSelectedSubmission(submission);
    setRejectNotes('');
    setShowRejectDialog(true);
  };

  const confirmReject = async () => {
    if (!selectedSubmission) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('pending_materials')
        .update({ 
          status: 'rejected', 
          admin_notes: rejectNotes,
          reviewed_at: new Date().toISOString() 
        })
        .eq('id', selectedSubmission.id);

      if (error) throw error;

      toast({
        title: 'Rejected',
        description: 'Submission has been rejected.',
      });

      setShowRejectDialog(false);
      fetchPendingSubmissions();
    } catch (error) {
      console.error('Rejection error:', error);
      toast({
        title: 'Rejection failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
    <PageLayout title="Admin Panel">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload Material
            </TabsTrigger>
            <TabsTrigger value="review" className="relative">
              <ClipboardList className="w-4 h-4 mr-2" />
              Review Submissions
              {pendingSubmissions.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingSubmissions.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload">
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
      </TabsContent>

      {/* Review Tab */}
      <TabsContent value="review">
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Pending Submissions</h1>
            </div>
            <Button variant="outline" size="sm" onClick={fetchPendingSubmissions}>
              <Loader2 className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {pendingSubmissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No pending submissions</p>
              <p className="text-sm">All contributions have been reviewed!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <div key={submission.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{submission.material_name}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <p><strong>Subject:</strong> {submission.subject_name}</p>
                        <p><strong>Type:</strong> {submission.material_type}</p>
                        <p><strong>Branch:</strong> {submission.branch}</p>
                        <p><strong>Year:</strong> {submission.year} | Sem {submission.sem}</p>
                        <p><strong>Regulation:</strong> R{submission.regulation}</p>
                        <p><strong>Credits:</strong> {submission.credits}</p>
                        {submission.unit && <p><strong>Unit:</strong> {submission.unit}</p>}
                      </div>
                    </div>
                    <Clock className="w-5 h-5 text-yellow-500" />
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm mb-1"><strong>URL:</strong></p>
                    <a 
                      href={submission.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline break-all"
                    >
                      {submission.url}
                    </a>
                  </div>

                  {(submission.contributor_name || submission.contributor_email) && (
                    <div className="pt-2 border-t text-sm text-muted-foreground">
                      {submission.contributor_name && <p><strong>Contributor:</strong> {submission.contributor_name}</p>}
                      {submission.contributor_email && <p><strong>Email:</strong> {submission.contributor_email}</p>}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="default" 
                      onClick={() => handleApprove(submission)}
                      className="flex-1"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleReject(submission)}
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>

    {/* Approve Dialog */}
    <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Submission</DialogTitle>
          <DialogDescription>
            Review and update the URL if needed. The material will be published with this URL.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="review-url">Material URL</Label>
            <Input
              id="review-url"
              value={reviewUrl}
              onChange={(e) => setReviewUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Update this if you've re-uploaded to your own Drive
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
            Cancel
          </Button>
          <Button onClick={confirmApprove} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Publish Material
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Reject Dialog */}
    <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Submission</DialogTitle>
          <DialogDescription>
            Add a note explaining why this submission was rejected (optional).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="reject-notes">Rejection Notes (Optional)</Label>
            <Textarea
              id="reject-notes"
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="e.g., Duplicate content, broken link, incorrect information..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmReject} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Reject Submission
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</PageLayout>
  );
}
