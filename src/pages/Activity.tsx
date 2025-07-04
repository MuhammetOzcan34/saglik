import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Activity as ActivityIcon, Clock, TrendingUp, Zap } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '../lib/utils';

interface PhysicalActivity {
  id: string;
  child_id: string;
  date: string;
  activity_type: string;
  duration: number; // minutes
  intensity: 'low' | 'moderate' | 'high';
  description: string;
  notes: string;
  created_at: string;
}

const Activity = () => {
  const [activities, setActivities] = useState<PhysicalActivity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    activity_type: '',
    duration: '',
    intensity: '',
    description: '',
    notes: ''
  });

  const [selectedChild, setSelectedChild] = useState<any>(null);

  const activityTypes = [
    { value: 'walking', label: 'Yürüme' },
    { value: 'running', label: 'Koşma' },
    { value: 'cycling', label: 'Bisiklet' },
    { value: 'swimming', label: 'Yüzme' },
    { value: 'playing', label: 'Oyun' },
    { value: 'dancing', label: 'Dans' },
    { value: 'sports', label: 'Spor' },
    { value: 'exercise', label: 'Egzersiz' },
    { value: 'other', label: 'Diğer' }
  ];

  const intensityLevels = [
    { value: 'low', label: 'Düşük' },
    { value: 'moderate', label: 'Orta' },
    { value: 'high', label: 'Yüksek' }
  ];

  useEffect(() => {
    const getSelectedChild = () => {
      const childData = localStorage.getItem('selectedChild');
      if (childData) {
        setSelectedChild(JSON.parse(childData));
      }
    };
    getSelectedChild();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchActivities();
    }
  }, [selectedChild]);

  const fetchActivities = async () => {
    if (!selectedChild) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('physical_activities')
        .select('*')
        .eq('child_id', selectedChild.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Hata",
        description: "Aktivite kayıtları yüklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;

    setLoading(true);
    try {
      const activityData = {
        child_id: selectedChild.id,
        date: formData.date,
        activity_type: formData.activity_type,
        duration: parseInt(formData.duration),
        intensity: formData.intensity,
        description: formData.description,
        notes: formData.notes
      };

      const { error } = await supabase
        .from('physical_activities')
        .insert([activityData]);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Aktivite kaydı eklendi.",
      });

      setFormData({
        date: new Date().toISOString().split('T')[0],
        activity_type: '',
        duration: '',
        intensity: '',
        description: '',
        notes: ''
      });
      setShowForm(false);
      fetchActivities();
    } catch (error) {
      console.error('Error adding activity:', error);
      toast({
        title: "Hata",
        description: "Aktivite kaydı eklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getIntensityBadge = (intensity: string) => {
    switch (intensity) {
      case 'low':
        return <Badge variant="secondary">Düşük</Badge>;
      case 'moderate':
        return <Badge variant="default">Orta</Badge>;
      case 'high':
        return <Badge variant="destructive">Yüksek</Badge>;
      default:
        return <Badge variant="outline">{intensity}</Badge>;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    const found = activityTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  const prepareChartData = () => {
    return activities
      .map(activity => ({
        date: new Date(activity.date).toLocaleDateString('tr-TR'),
        duration: activity.duration,
        intensity: activity.intensity === 'low' ? 1 : activity.intensity === 'moderate' ? 2 : 3
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getWeeklyStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyActivities = activities.filter(activity => 
      new Date(activity.date) >= weekAgo
    );

    const totalDuration = weeklyActivities.reduce((sum, activity) => sum + activity.duration, 0);
    const averageDuration = weeklyActivities.length > 0 ? totalDuration / weeklyActivities.length : 0;
    const totalActivities = weeklyActivities.length;

    return { totalDuration, averageDuration, totalActivities };
  };

  if (!selectedChild) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <ActivityIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Çocuk Seçilmedi</h3>
            <p className="text-gray-600">Aktivite takibi için önce bir çocuk seçin.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const weeklyStats = getWeeklyStats();
  const chartData = prepareChartData();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fiziksel Aktivite Takibi</h1>
          <p className="text-gray-600">Günlük fiziksel aktivitelerin kaydı ve takibi</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Aktivite Ekle
        </Button>
      </div>

      {/* Weekly Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bu Hafta Toplam</p>
                <p className="text-2xl font-bold">{weeklyStats.totalDuration} dk</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ortalama Süre</p>
                <p className="text-2xl font-bold">{Math.round(weeklyStats.averageDuration)} dk</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktivite Sayısı</p>
                <p className="text-2xl font-bold">{weeklyStats.totalActivities}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      {chartData.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Aktivite Süresi Grafiği</CardTitle>
            <CardDescription>Son aktivitelerin süre takibi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="duration" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Activities Table */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Aktivite Kayıtları</CardTitle>
          <CardDescription>Tüm fiziksel aktivite kayıtları</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Yükleniyor...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8">
              <ActivityIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz aktivite kaydı bulunmuyor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Aktivite Türü</TableHead>
                    <TableHead>Süre (dk)</TableHead>
                    <TableHead>Yoğunluk</TableHead>
                    <TableHead>Açıklama</TableHead>
                    <TableHead>Notlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{new Date(activity.date).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{getActivityTypeLabel(activity.activity_type)}</TableCell>
                      <TableCell>{activity.duration}</TableCell>
                      <TableCell>{getIntensityBadge(activity.intensity)}</TableCell>
                      <TableCell className="max-w-xs truncate">{activity.description || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate">{activity.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Activity Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Yeni Aktivite Ekle</CardTitle>
              <CardDescription>Fiziksel aktivite bilgilerini girin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Tarih</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity_type">Aktivite Türü</Label>
                  <Select value={formData.activity_type} onValueChange={(value) => setFormData({...formData, activity_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Aktivite türü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Süre (Dakika)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      placeholder="Örn: 30"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intensity">Yoğunluk</Label>
                    <Select value={formData.intensity} onValueChange={(value) => setFormData({...formData, intensity: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Yoğunluk seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {intensityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    placeholder="Aktivitenin detayları, nerede yapıldığı..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea
                    id="notes"
                    placeholder="Özel durumlar, gözlemler, yorgunluk seviyesi..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)} 
                    className="flex-1"
                    disabled={loading}
                  >
                    İptal
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Activity; 