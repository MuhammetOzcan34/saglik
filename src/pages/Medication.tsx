import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pill, Trash2, Edit, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface MedicationRecord {
  id: string;
  childId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  notes: string;
  status: 'active' | 'completed' | 'discontinued';
  createdAt: string;
}

const Medication = () => {
  const [records, setRecords] = useState<MedicationRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicationRecord | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: '',
    status: 'active' as 'active' | 'completed' | 'discontinued'
  });

  const [selectedChild, setSelectedChild] = useState<any>(null);

  const frequencyOptions = [
    { value: 'once_daily', label: 'Günde 1 kez' },
    { value: 'twice_daily', label: 'Günde 2 kez' },
    { value: 'three_times_daily', label: 'Günde 3 kez' },
    { value: 'as_needed', label: 'İhtiyaç halinde' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Aktif', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Tamamlandı', color: 'bg-blue-100 text-blue-800' },
    { value: 'discontinued', label: 'Durduruldu', color: 'bg-red-100 text-red-800' }
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
      fetchMedicationRecords();
    }
  }, [selectedChild]);

  const fetchMedicationRecords = () => {
    if (!selectedChild) return;
    
    const existingRecords = JSON.parse(localStorage.getItem('medicationRecords') || '[]');
    const childRecords = existingRecords.filter((record: MedicationRecord) => record.childId === selectedChild.id);
    setRecords(childRecords.sort((a: MedicationRecord, b: MedicationRecord) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;

    if (formData.medicationName && formData.dosage && formData.frequency && formData.startDate) {
      const medicationData = {
        id: editingRecord ? editingRecord.id : Date.now().toString(),
        childId: selectedChild.id,
        medicationName: formData.medicationName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        startDate: formData.startDate,
        endDate: formData.endDate,
        notes: formData.notes,
        status: formData.status,
        createdAt: editingRecord ? editingRecord.createdAt : new Date().toISOString()
      };
      
      const existingRecords = JSON.parse(localStorage.getItem('medicationRecords') || '[]');
      
      if (editingRecord) {
        const updatedRecords = existingRecords.map((record: MedicationRecord) => 
          record.id === editingRecord.id ? medicationData : record
        );
        localStorage.setItem('medicationRecords', JSON.stringify(updatedRecords));
        toast({
          title: "Güncellendi!",
          description: "İlaç kaydı başarıyla güncellendi.",
        });
      } else {
        existingRecords.push(medicationData);
        localStorage.setItem('medicationRecords', JSON.stringify(existingRecords));
        toast({
          title: "Kaydedildi!",
          description: `${formData.medicationName} başarıyla kaydedildi.`,
        });
      }
      
      resetForm();
      fetchMedicationRecords();
    }
  };

  const handleEdit = (record: MedicationRecord) => {
    setEditingRecord(record);
    setFormData({
      medicationName: record.medicationName,
      dosage: record.dosage,
      frequency: record.frequency,
      startDate: record.startDate,
      endDate: record.endDate,
      notes: record.notes,
      status: record.status
    });
    setShowForm(true);
  };

  const handleDelete = (recordId: string) => {
    const existingRecords = JSON.parse(localStorage.getItem('medicationRecords') || '[]');
    const updatedRecords = existingRecords.filter((record: MedicationRecord) => record.id !== recordId);
    localStorage.setItem('medicationRecords', JSON.stringify(updatedRecords));
    
    toast({
      title: "Silindi!",
      description: "İlaç kaydı başarıyla silindi.",
    });
    
    fetchMedicationRecords();
  };

  const resetForm = () => {
    setFormData({
      medicationName: '',
      dosage: '',
      frequency: '',
      startDate: '',
      endDate: '',
      notes: '',
      status: 'active'
    });
    setEditingRecord(null);
    setShowForm(false);
  };

  const getFrequencyLabel = (frequency: string) => {
    const found = frequencyOptions.find(f => f.value === frequency);
    return found ? found.label : frequency;
  };

  const getStatusBadge = (status: string) => {
    const found = statusOptions.find(s => s.value === status);
    return found ? (
      <Badge className={found.color}>
        {found.label}
      </Badge>
    ) : (
      <Badge variant="outline">{status}</Badge>
    );
  };

  if (!selectedChild) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Çocuk Seçilmedi</h3>
            <p className="text-gray-600">İlaç takibi için önce bir çocuk seçin.</p>
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
          <h1 className="text-2xl font-bold text-gray-800">İlaç Takibi</h1>
          <p className="text-gray-600">Çocuğun ilaç kullanımı ve takibi</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Yeni İlaç Kaydı
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif İlaçlar</p>
                <p className="text-2xl font-bold">{records.filter(r => r.status === 'active').length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Pill className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tamamlanan</p>
                <p className="text-2xl font-bold">{records.filter(r => r.status === 'completed').length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Pill className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam</p>
                <p className="text-2xl font-bold">{records.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Pill className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>İlaç Kayıtları</CardTitle>
          <CardDescription>Tüm ilaç kayıtları kronolojik sırayla</CardDescription>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-8">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz ilaç kaydı bulunmuyor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>İlaç Adı</TableHead>
                    <TableHead>Doz</TableHead>
                    <TableHead>Sıklık</TableHead>
                    <TableHead>Başlangıç</TableHead>
                    <TableHead>Bitiş</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.medicationName}</TableCell>
                      <TableCell>{record.dosage}</TableCell>
                      <TableCell>{getFrequencyLabel(record.frequency)}</TableCell>
                      <TableCell>{new Date(record.startDate).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>
                        {record.endDate ? new Date(record.endDate).toLocaleDateString('tr-TR') : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(record)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(record.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Record Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                {editingRecord ? 'İlaç Kaydını Düzenle' : 'Yeni İlaç Kaydı'}
              </CardTitle>
              <CardDescription>
                Çocuğun ilaç kullanım bilgilerini detaylı olarak kaydedin
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicationName">İlaç Adı</Label>
                    <Input
                      id="medicationName"
                      placeholder="İlaç adını girin"
                      value={formData.medicationName}
                      onChange={(e) => setFormData({...formData, medicationName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dosage">Doz</Label>
                    <Input
                      id="dosage"
                      placeholder="Örn: 5ml, 1 tablet"
                      value={formData.dosage}
                      onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Kullanım Sıklığı</Label>
                    <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sıklık seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Durum</Label>
                    <Select value={formData.status} onValueChange={(value: 'active' | 'completed' | 'discontinued') => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Durum seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Bitiş Tarihi (Opsiyonel)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea
                    id="notes"
                    placeholder="Yan etkiler, özel talimatlar..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm} 
                    className="flex-1"
                  >
                    İptal
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {editingRecord ? 'Güncelle' : 'Kaydet'}
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

export default Medication; 