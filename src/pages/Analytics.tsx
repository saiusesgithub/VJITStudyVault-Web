import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TrendingUp, Users, Smartphone, Globe, Calendar, FileText, Download, Eye, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SECRET_CODE = import.meta.env.VITE_ADMIN_SECRET_CODE;

interface AnalyticsData {
  totalOpens: number;
  uniqueUsers: number;
  todayOpens: number;
  weeklyOpens: number;
  topSubjects: Array<{ subject: string; count: number }>;
  topMaterials: Array<{ material_type: string; count: number }>;
  deviceBreakdown: Array<{ device_type: string; count: number }>;
  browserStats: Array<{ browser: string; count: number }>;
  osStats: Array<{ os: string; count: number }>;
  deviceManufacturers: Array<{ manufacturer: string; count: number }>;
  deviceModels: Array<{ model: string; count: number }>;
  branchStats: Array<{ branch: string; count: number }>;
  recentActivity: Array<{
    subject_name: string;
    material_type: string;
    material_name: string;
    device_type: string;
    created_at: string;
  }>;
  hourlyDistribution: Array<{ hour: number; count: number }>;
}

export default function Analytics() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = () => {
    if (secretInput === SECRET_CODE) {
      setIsAuthenticated(true);
      toast({
        title: 'Access granted',
        description: 'Welcome to analytics dashboard.',
      });
    } else {
      toast({
        title: 'Access denied',
        description: 'Invalid secret code.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Total opens
      const { count: totalOpens } = await supabase
        .from('file_opens')
        .select('*', { count: 'exact', head: true });

      // Today's opens
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayOpens } = await supabase
        .from('file_opens')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Weekly opens
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: weeklyOpens } = await supabase
        .from('file_opens')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      // Top subjects
      const { data: subjectData } = await supabase
        .from('file_opens')
        .select('subject_name')
        .not('subject_name', 'is', null);

      const subjectCounts = subjectData?.reduce((acc: any, item) => {
        acc[item.subject_name] = (acc[item.subject_name] || 0) + 1;
        return acc;
      }, {});

      const topSubjects = Object.entries(subjectCounts || {})
        .map(([subject, count]) => ({ subject, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Top material types
      const { data: materialData } = await supabase
        .from('file_opens')
        .select('material_type')
        .not('material_type', 'is', null);

      const materialCounts = materialData?.reduce((acc: any, item) => {
        acc[item.material_type] = (acc[item.material_type] || 0) + 1;
        return acc;
      }, {});

      const topMaterials = Object.entries(materialCounts || {})
        .map(([material_type, count]) => ({ material_type, count: count as number }))
        .sort((a, b) => b.count - a.count);

      // Device breakdown
      const { data: deviceData } = await supabase
        .from('file_opens')
        .select('device_type')
        .not('device_type', 'is', null);

      const deviceCounts = deviceData?.reduce((acc: any, item) => {
        acc[item.device_type] = (acc[item.device_type] || 0) + 1;
        return acc;
      }, {});

      const deviceBreakdown = Object.entries(deviceCounts || {})
        .map(([device_type, count]) => ({ device_type, count: count as number }))
        .sort((a, b) => b.count - a.count);

      // Browser stats
      const { data: browserData } = await supabase
        .from('file_opens')
        .select('browser')
        .not('browser', 'is', null);

      const browserCounts = browserData?.reduce((acc: any, item) => {
        acc[item.browser] = (acc[item.browser] || 0) + 1;
        return acc;
      }, {});

      const browserStats = Object.entries(browserCounts || {})
        .map(([browser, count]) => ({ browser, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // OS stats
      const { data: osData } = await supabase
        .from('file_opens')
        .select('os')
        .not('os', 'is', null);

      const osCounts = osData?.reduce((acc: any, item) => {
        acc[item.os] = (acc[item.os] || 0) + 1;
        return acc;
      }, {});

      const osStats = Object.entries(osCounts || {})
        .map(([os, count]) => ({ os, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Device manufacturers
      const { data: manufacturerData } = await supabase
        .from('file_opens')
        .select('device_manufacturer')
        .not('device_manufacturer', 'is', null);

      const manufacturerCounts = manufacturerData?.reduce((acc: any, item) => {
        acc[item.device_manufacturer] = (acc[item.device_manufacturer] || 0) + 1;
        return acc;
      }, {});

      const deviceManufacturers = Object.entries(manufacturerCounts || {})
        .map(([manufacturer, count]) => ({ manufacturer, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      // Device models
      const { data: modelData } = await supabase
        .from('file_opens')
        .select('device_model')
        .not('device_model', 'is', null);

      const modelCounts = modelData?.reduce((acc: any, item) => {
        acc[item.device_model] = (acc[item.device_model] || 0) + 1;
        return acc;
      }, {});

      const deviceModels = Object.entries(modelCounts || {})
        .map(([model, count]) => ({ model, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Branch stats
      const { data: branchData } = await supabase
        .from('file_opens')
        .select('branch')
        .not('branch', 'is', null);

      const branchCounts = branchData?.reduce((acc: any, item) => {
        acc[item.branch] = (acc[item.branch] || 0) + 1;
        return acc;
      }, {});

      const branchStats = Object.entries(branchCounts || {})
        .map(([branch, count]) => ({ branch, count: count as number }))
        .sort((a, b) => b.count - a.count);

      // Recent activity
      const { data: recentActivity } = await supabase
        .from('file_opens')
        .select('subject_name, material_type, material_name, device_type, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      // Hourly distribution
      const { data: allOpens } = await supabase
        .from('file_opens')
        .select('created_at')
        .not('created_at', 'is', null);

      const hourlyCounts = allOpens?.reduce((acc: any, item) => {
        const hour = new Date(item.created_at).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});

      const hourlyDistribution = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: hourlyCounts?.[i] || 0
      }));

      setData({
        totalOpens: totalOpens || 0,
        uniqueUsers: 0, // Can't track unique users without user IDs
        todayOpens: todayOpens || 0,
        weeklyOpens: weeklyOpens || 0,
        topSubjects,
        topMaterials,
        deviceBreakdown,
        browserStats,
        osStats,
        deviceManufacturers,
        deviceModels,
        branchStats,
        recentActivity: recentActivity || [],
        hourlyDistribution,
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (!isAuthenticated) {
    return (
      <PageLayout title="Analytics Access">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-lg">
            <div className="flex justify-center mb-6">
              <Shield className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-6">Analytics Dashboard</h1>
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

  if (loading) {
    return (
      <PageLayout title="Analytics">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !data) {
    return (
      <PageLayout title="Analytics">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-destructive">{error || 'Failed to load analytics'}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Analytics Dashboard">
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total File Opens</CardTitle>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalOpens.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.todayOpens.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.weeklyOpens.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Per Day</CardTitle>
              <Download className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(data.weeklyOpens / 7).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Weekly average</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="subjects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="time">Time Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="space-y-4">
            {/* Top Subjects */}
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Subjects</CardTitle>
                <CardDescription>Top 10 subjects by file opens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.topSubjects.map((item, index) => (
                    <div key={item.subject} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-medium">{item.subject}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.count.toLocaleString()} opens</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Material Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Material Types</CardTitle>
                  <CardDescription>Distribution by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.topMaterials.map((item) => (
                      <div key={item.material_type} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                        <span className="font-medium">{item.material_type}</span>
                        <span className="text-sm text-muted-foreground">{item.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Branch Stats</CardTitle>
                  <CardDescription>Usage by branch</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.branchStats.map((item) => (
                      <div key={item.branch} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                        <span className="font-medium">{item.branch}</span>
                        <span className="text-sm text-muted-foreground">{item.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            {/* Device Type */}
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>Mobile, Desktop, Tablet breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.deviceBreakdown.map((item) => {
                    const percentage = ((item.count / data.totalOpens) * 100).toFixed(1);
                    return (
                      <div key={item.device_type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-primary" />
                            <span className="font-medium capitalize">{item.device_type}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {item.count.toLocaleString()} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Browser Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Browsers</CardTitle>
                  <CardDescription>Most used browsers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.browserStats.map((item) => (
                      <div key={item.browser} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" />
                          <span className="font-medium">{item.browser}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* OS Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Operating Systems</CardTitle>
                  <CardDescription>Platform distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.osStats.map((item) => (
                      <div key={item.os} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                        <span className="font-medium">{item.os}</span>
                        <span className="text-sm text-muted-foreground">{item.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Device Manufacturers */}
            <Card>
              <CardHeader>
                <CardTitle>Device Manufacturers</CardTitle>
                <CardDescription>Top device brands</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {data.deviceManufacturers.map((item) => (
                    <div key={item.manufacturer} className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold">{item.count}</div>
                      <div className="text-sm text-muted-foreground mt-1">{item.manufacturer}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Models */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Device Models</CardTitle>
                <CardDescription>Top 10 device models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.deviceModels.map((item, index) => (
                    <div key={item.model} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                        <span className="font-medium">{item.model}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest file opens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.recentActivity.map((item, index) => (
                    <div key={index} className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.material_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.subject_name} • {item.material_type}
                        </div>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <div className="text-sm capitalize">{item.device_type}</div>
                        <div className="text-xs text-muted-foreground">{formatTime(item.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Distribution</CardTitle>
                <CardDescription>File opens by hour of day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.hourlyDistribution.map((item) => {
                    const maxCount = Math.max(...data.hourlyDistribution.map(h => h.count));
                    const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    const hour12 = item.hour === 0 ? 12 : item.hour > 12 ? item.hour - 12 : item.hour;
                    const ampm = item.hour >= 12 ? 'PM' : 'AM';

                    return (
                      <div key={item.hour} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-16">{hour12}:00 {ampm}</span>
                        <div className="flex-1 bg-muted rounded-full h-6 relative">
                          <div
                            className="bg-primary h-6 rounded-full transition-all flex items-center justify-end pr-2"
                            style={{ width: `${percentage}%` }}
                          >
                            {item.count > 0 && (
                              <span className="text-xs text-primary-foreground font-medium">
                                {item.count}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
