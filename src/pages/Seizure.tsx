import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Brain, AlertTriangle, Clock, Activity } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '../lib/utils';

interface SeizureRecord {
  id: string;
  child_id: string;
  date: string;
  time: string;
  duration: number; // minutes
  type: string;
  symptoms: string;
  post_seizure_state: string;
  notes: string;
  created_at: string;
}

const Seizure = () => {
  const [records, setRecords] = useState<SeizureRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    duration: '',
    type: '',
    symptoms: '',
    post_seizure_state: '',
    notes: ''
  });

  const [selectedChild, setSelectedChild] = useState<any>(null);

  const seizureTypes = [
    { value: 'miyoklonik_absans', label: 'Miyoklonik Absans' },
    { value: 'klonik', label: 'Klonik' },
    { value: 'tonik', label: 'Tonik' },
    { value: 'atonik', label: 'Atonik' },
    { value: 'tonik_klonik', label: 'Tonik-Klonik' },
    { value: 'diger', label: 'Diğer' }
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
      fetchSeizureRecords();
    }
  }, [selectedChild]);

  const fetchSeizureRecords = async () => {
    if (!selectedChild) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('seizure_records')
        .select('*')
        .eq('child_id', selectedChild.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching seizure records:', error);
      toast({
        title: "Hata",
        description: "Atak kayıtları yüklenirken hata oluştu.",
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
      const seizureData = {
        child_id: selectedChild.id,
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration),
        type: formData.type,
        symptoms: formData.symptoms,
        post_seizure_state: formData.post_seizure_state,
        notes: formData.notes
      };

      const { error } = await supabase
        .from('seizure_records')
        .insert([seizureData]);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Atak kaydı eklendi.",
      });

      setFormData({
        date: new Date().toISOString().split('T')[0],
        time: '',
        duration: '',
        type: '',
        symptoms: '',
        post_seizure_state: '',
        notes: ''
      });
      setShowForm(false);
      fetchSeizureRecords();
    } catch (error) {
      console.error('Error adding seizure record:', error);
      toast({
        title: "Hata",
        description: "Atak kaydı eklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeizureTypeLabel = (type: string) => {
    const found = seizureTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  if (!selectedChild) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Çocuk Seçilmedi</h3>
            <p className="text-gray-600">Atak takibi için önce bir çocuk seçin.</p>
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
          <h1 className="text-2xl font-bold text-gray-800">Epilepsi Atak Takibi</h1>
          <p className="text-gray-600">Atakların detaylı kaydı ve takibi</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Atak Kaydı
        </Button>
      </div>

      {/* Emergency Button */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Acil Durum</h3>
                <p className="text-sm text-red-600">Atak sırasında acil müdahale gerekirse</p>
              </div>
            </div>
            <Button variant="destructive" size="lg">
              ACİL ÇAĞRI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bu Ay</p>
                <p className="text-2xl font-bold">{records.filter(r => {
                  const recordDate = new Date(r.date);
                  const now = new Date();
                  return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
                }).length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Son Atak</p>
                <p className="text-2xl font-bold">
                  {records.length > 0 ? new Date(records[0].date).toLocaleDateString('tr-TR') : '-'}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Kayıt</p>
                <p className="text-2xl font-bold">{records.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Atak Kayıtları</CardTitle>
          <CardDescription>Tüm atak kayıtları kronolojik sırayla</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Yükleniyor...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz atak kaydı bulunmuyor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Saat</TableHead>
                    <TableHead>Süre (sn)</TableHead>
                    <TableHead>Tür</TableHead>
                    <TableHead>Belirtiler</TableHead>
                    <TableHead>Sonrası Durum</TableHead>
                    <TableHead>Notlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.date).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{record.time}</TableCell>
                      <TableCell>{record.duration}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getSeizureTypeLabel(record.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{record.symptoms || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate">{record.post_seizure_state || '-'}</TableCell>
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
          <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Yeni Atak Kaydı</CardTitle>
              <CardDescription>Atak detaylarını kaydedin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <Label htmlFor="time">Başlangıç Saati</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Süre (Saniye)</Label>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Atak Türü</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Atak türü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {seizureTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Atak Sırasında Gözlemlenenler</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Titreme, bilinç kaybı, göz devirme, kasılma vb..."
                    value={formData.symptoms}
                    onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="post_seizure_state">Atak Sonrası Durum</Label>
                  <Textarea
                    id="post_seizure_state"
                    placeholder="Uyku hali, yorgunluk, kafa karışıklığı vb..."
                    value={formData.post_seizure_state}
                    onChange={(e) => setFormData({...formData, post_seizure_state: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Ek Notlar</Label>
                  <Textarea
                    id="notes"
                    placeholder="Özel durumlar, tetikleyiciler, alınan önlemler..."
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

export default Seizure; 