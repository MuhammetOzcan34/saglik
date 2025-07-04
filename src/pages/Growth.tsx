import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, TrendingUp, Weight, Ruler, Activity } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface GrowthRecord {
  id: string;
  child_id: string;
  date: string;
  weight?: number;
  height?: number;
  head_circumference?: number;
  notes?: string;
  created_at: string;
}

const Growth = () => {
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    head_circumference: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get current user and child
  const [user, setUser] = useState<any>(null);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Get all children from localStorage for now
        const childrenData = localStorage.getItem('children');
        if (childrenData) {
          setChildren(JSON.parse(childrenData));
        }
        // Get selected child
        const childData = localStorage.getItem('selectedChild');
        if (childData) {
          setSelectedChild(JSON.parse(childData));
        }
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchGrowthRecords();
    }
  }, [selectedChild]);

  const fetchGrowthRecords = async () => {
    if (!selectedChild) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('growth_records')
        .select('*')
        .eq('child_id', selectedChild.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching growth records:', error);
      toast({
        title: "Hata",
        description: "Gelişim kayıtları yüklenirken hata oluştu.",
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
      const growthData = {
        child_id: selectedChild.id,
        date: formData.date,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        head_circumference: formData.head_circumference ? parseFloat(formData.head_circumference) : null,
        notes: formData.notes || null
      };

      const { error } = await supabase
        .from('growth_records')
        .insert([growthData]);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Gelişim kaydı eklendi.",
      });

      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        height: '',
        head_circumference: '',
        notes: ''
      });
      setShowForm(false);
      fetchGrowthRecords();
    } catch (error) {
      console.error('Error adding growth record:', error);
      toast({
        title: "Hata",
        description: "Gelişim kaydı eklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const chartData = records
    .filter(record => record.weight || record.height)
    .map(record => ({
      date: new Date(record.date).toLocaleDateString('tr-TR'),
      weight: record.weight,
      height: record.height,
      headCircumference: record.head_circumference
    }))
    .reverse();

  if (!selectedChild) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Gelişim Takibi için Çocuk Seçilmedi</h3>
            {children.length === 0 ? (
              <>
                <p className="text-gray-600 mb-4">Henüz hiç çocuk eklemediniz. Gelişim takibi için önce bir çocuk ekleyin.</p>
                <Button onClick={() => navigate('/family-setup')}>Çocuk Ekle</Button>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-4">Gelişim takibi için önce bir çocuk seçin.</p>
                <Button onClick={() => navigate('/child-selector')}>Çocuk Seç</Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gelişim Takibi</h1>
          <p className="text-gray-600">Çocuğunuzun büyüme ve gelişimini takip edin</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Ölçüm Ekle
        </Button>
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weight Chart */}
          {records.some(r => r.weight) && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Weight className="h-5 w-5" />
                  Kilo Takibi
                </CardTitle>
                <CardDescription>Kilo değişimi grafiği</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Height Chart */}
          {records.some(r => r.height) && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  Boy Takibi
                </CardTitle>
                <CardDescription>Boy değişimi grafiği</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="height" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Records Table */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Gelişim Kayıtları</CardTitle>
          <CardDescription>Tüm ölçüm kayıtları</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Yükleniyor...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz gelişim kaydı bulunmuyor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Kilo (kg)</TableHead>
                    <TableHead>Boy (cm)</TableHead>
                    <TableHead>Baş Çevresi (cm)</TableHead>
                    <TableHead>Notlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.date).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{record.weight || '-'}</TableCell>
                      <TableCell>{record.height || '-'}</TableCell>
                      <TableCell>{record.head_circumference || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate">{record.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Record Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Yeni Gelişim Kaydı</CardTitle>
              <CardDescription>Çocuğunuzun ölçümlerini kaydedin</CardDescription>
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Kilo (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="Örn: 12.5"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Boy (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      placeholder="Örn: 85.2"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="head_circumference">Baş Çevresi (cm)</Label>
                    <Input
                      id="head_circumference"
                      type="number"
                      step="0.1"
                      placeholder="Örn: 45.8"
                      value={formData.head_circumference}
                      onChange={(e) => setFormData({...formData, head_circumference: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notlar</Label>
                  <Input
                    id="notes"
                    placeholder="Özel durumlar, gözlemler..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
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

export default Growth; 