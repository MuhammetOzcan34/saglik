import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertTriangle, FileText, Activity } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '../lib/utils';

interface Allergy {
  id: string;
  child_id: string;
  type: 'food' | 'medication' | 'environmental' | 'other';
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  symptoms: string;
  notes: string;
  created_at: string;
}

interface HealthHistory {
  id: string;
  child_id: string;
  condition: string;
  diagnosis_date: string;
  status: 'active' | 'resolved' | 'chronic';
  description: string;
  treatment?: string;
  notes?: string;
  created_at: string;
}

const Allergy = () => {
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [healthHistory, setHealthHistory] = useState<HealthHistory[]>([]);
  const [showAllergyForm, setShowAllergyForm] = useState(false);
  const [showHistoryForm, setShowHistoryForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [allergyForm, setAllergyForm] = useState({
    type: '',
    name: '',
    severity: '',
    symptoms: '',
    notes: ''
  });

  const [historyForm, setHistoryForm] = useState({
    condition: '',
    diagnosis_date: '',
    status: '',
    description: '',
    treatment: '',
    notes: ''
  });

  const [selectedChild, setSelectedChild] = useState<any>(null);

  const allergyTypes = [
    { value: 'food', label: 'Gıda Alerjisi' },
    { value: 'medication', label: 'İlaç Alerjisi' },
    { value: 'environmental', label: 'Çevresel Alerji' },
    { value: 'other', label: 'Diğer' }
  ];

  const severityLevels = [
    { value: 'mild', label: 'Hafif' },
    { value: 'moderate', label: 'Orta' },
    { value: 'severe', label: 'Şiddetli' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Aktif' },
    { value: 'resolved', label: 'Çözüldü' },
    { value: 'chronic', label: 'Kronik' }
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
      fetchAllergies();
      fetchHealthHistory();
    }
  }, [selectedChild]);

  const fetchAllergies = async () => {
    if (!selectedChild) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('allergies')
        .select('*')
        .eq('child_id', selectedChild.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllergies(data || []);
    } catch (error) {
      console.error('Error fetching allergies:', error);
      toast({
        title: "Hata",
        description: "Alerji bilgileri yüklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthHistory = async () => {
    if (!selectedChild) return;
    
    try {
      const { data, error } = await supabase
        .from('health_history')
        .select('*')
        .eq('child_id', selectedChild.id)
        .order('diagnosis_date', { ascending: false });

      if (error) throw error;
      setHealthHistory(data || []);
    } catch (error) {
      console.error('Error fetching health history:', error);
    }
  };

  const handleAllergySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;

    setLoading(true);
    try {
      const allergyData = {
        child_id: selectedChild.id,
        ...allergyForm
      };

      const { error } = await supabase
        .from('allergies')
        .insert([allergyData]);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Alerji bilgisi eklendi.",
      });

      setAllergyForm({
        type: '',
        name: '',
        severity: '',
        symptoms: '',
        notes: ''
      });
      setShowAllergyForm(false);
      fetchAllergies();
    } catch (error) {
      console.error('Error adding allergy:', error);
      toast({
        title: "Hata",
        description: "Alerji bilgisi eklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;

    setLoading(true);
    try {
      const historyData = {
        child_id: selectedChild.id,
        ...historyForm
      };

      const { error } = await supabase
        .from('health_history')
        .insert([historyData]);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Sağlık geçmişi eklendi.",
      });

      setHistoryForm({
        condition: '',
        diagnosis_date: '',
        status: '',
        description: '',
        treatment: '',
        notes: ''
      });
      setShowHistoryForm(false);
      fetchHealthHistory();
    } catch (error) {
      console.error('Error adding health history:', error);
      toast({
        title: "Hata",
        description: "Sağlık geçmişi eklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'mild':
        return <Badge variant="secondary">Hafif</Badge>;
      case 'moderate':
        return <Badge variant="default">Orta</Badge>;
      case 'severe':
        return <Badge variant="destructive">Şiddetli</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="destructive">Aktif</Badge>;
      case 'resolved':
        return <Badge variant="secondary">Çözüldü</Badge>;
      case 'chronic':
        return <Badge variant="default">Kronik</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    const found = allergyTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  if (!selectedChild) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Çocuk Seçilmedi</h3>
            <p className="text-gray-600">Alerji bilgileri için önce bir çocuk seçin.</p>
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
          <h1 className="text-2xl font-bold text-gray-800">Alerjiler & Sağlık Geçmişi</h1>
          <p className="text-gray-600">Bilinen alerjiler ve önemli sağlık geçmişi</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={() => setShowAllergyForm(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Alerji Ekle
          </Button>
          <Button onClick={() => setShowHistoryForm(true)} variant="outline" className="w-full sm:w-auto">
            <FileText className="h-4 w-4 mr-2" />
            Sağlık Geçmişi Ekle
          </Button>
        </div>
      </div>

      {/* Emergency Alert */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Alerji Uyarısı</h3>
              <p className="text-sm text-red-600">
                Çocuğunuzun bilinen alerjileri: {allergies.map(a => a.name).join(', ') || 'Bilinmiyor'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alerjiler
          </CardTitle>
          <CardDescription>Bilinen gıda, ilaç ve çevresel alerjiler</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Yükleniyor...</p>
            </div>
          ) : allergies.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz alerji bilgisi eklenmemiş.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allergies.map((allergy) => (
                <Card key={allergy.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{allergy.name}</h3>
                      {getSeverityBadge(allergy.severity)}
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Tür:</span> {getTypeLabel(allergy.type)}
                      </p>
                      
                      {allergy.symptoms && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Belirtiler:</p>
                          <p className="text-sm text-gray-600">{allergy.symptoms}</p>
                        </div>
                      )}
                      
                      {allergy.notes && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Notlar:</p>
                          <p className="text-sm text-gray-600">{allergy.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health History */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sağlık Geçmişi
          </CardTitle>
          <CardDescription>Önemli hastalıklar ve tıbbi geçmiş</CardDescription>
        </CardHeader>
        <CardContent>
          {healthHistory.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz sağlık geçmişi eklenmemiş.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Durum</TableHead>
                    <TableHead>Teşhis Tarihi</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Açıklama</TableHead>
                    <TableHead>Tedavi</TableHead>
                    <TableHead>Notlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {healthHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell className="font-medium">{history.condition}</TableCell>
                      <TableCell>{new Date(history.diagnosis_date).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{getStatusBadge(history.status)}</TableCell>
                      <TableCell className="max-w-xs truncate">{history.description}</TableCell>
                      <TableCell className="max-w-xs truncate">{history.treatment || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate">{history.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Allergy Modal */}
      {showAllergyForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Yeni Alerji Ekle</CardTitle>
              <CardDescription>Alerji bilgilerini girin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAllergySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Alerji Türü</Label>
                  <Select value={allergyForm.type} onValueChange={(value) => setAllergyForm({...allergyForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Alerji türü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {allergyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Alerji Adı</Label>
                  <Input
                    id="name"
                    placeholder="Örn: Fıstık, Penisilin, Polen"
                    value={allergyForm.name}
                    onChange={(e) => setAllergyForm({...allergyForm, name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Şiddet</Label>
                  <Select value={allergyForm.severity} onValueChange={(value) => setAllergyForm({...allergyForm, severity: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Şiddet seviyesi seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {severityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Belirtiler</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Kaşıntı, kızarıklık, nefes darlığı, mide bulantısı vb..."
                    value={allergyForm.symptoms}
                    onChange={(e) => setAllergyForm({...allergyForm, symptoms: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea
                    id="notes"
                    placeholder="Özel durumlar, tetikleyiciler, alınan önlemler..."
                    value={allergyForm.notes}
                    onChange={(e) => setAllergyForm({...allergyForm, notes: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAllergyForm(false)} 
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

      {/* Add Health History Modal */}
      {showHistoryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Sağlık Geçmişi Ekle</CardTitle>
              <CardDescription>Hastalık veya tıbbi durum bilgilerini girin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleHistorySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="condition">Hastalık/Durum</Label>
                  <Input
                    id="condition"
                    placeholder="Örn: Astım, Diyabet, Epilepsi"
                    value={historyForm.condition}
                    onChange={(e) => setHistoryForm({...historyForm, condition: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis_date">Teşhis Tarihi</Label>
                    <Input
                      id="diagnosis_date"
                      type="date"
                      value={historyForm.diagnosis_date}
                      onChange={(e) => setHistoryForm({...historyForm, diagnosis_date: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Durum</Label>
                    <Select value={historyForm.status} onValueChange={(value) => setHistoryForm({...historyForm, status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Durum seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
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
                    placeholder="Hastalığın detayları, belirtileri..."
                    value={historyForm.description}
                    onChange={(e) => setHistoryForm({...historyForm, description: e.target.value})}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treatment">Tedavi</Label>
                  <Textarea
                    id="treatment"
                    placeholder="Uygulanan tedavi, ilaçlar..."
                    value={historyForm.treatment}
                    onChange={(e) => setHistoryForm({...historyForm, treatment: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea
                    id="notes"
                    placeholder="Özel durumlar, gözlemler..."
                    value={historyForm.notes}
                    onChange={(e) => setHistoryForm({...historyForm, notes: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowHistoryForm(false)} 
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

export default Allergy; 