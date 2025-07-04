import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Thermometer, Trash2, Edit, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface TemperatureRecord {
  id: string;
  childId: string;
  temperature: number;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
}

const Temperature = () => {
  const [records, setRecords] = useState<TemperatureRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TemperatureRecord | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    temperature: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    notes: ''
  });

  const [selectedChild, setSelectedChild] = useState<any>(null);

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
      fetchTemperatureRecords();
    }
  }, [selectedChild]);

  const fetchTemperatureRecords = () => {
    if (!selectedChild) return;
    
    const existingRecords = JSON.parse(localStorage.getItem('temperatureRecords') || '[]');
    const childRecords = existingRecords.filter((record: TemperatureRecord) => record.childId === selectedChild.id);
    setRecords(childRecords.sort((a: TemperatureRecord, b: TemperatureRecord) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;

    if (formData.temperature && formData.date && formData.time) {
      const temperatureData = {
        id: editingRecord ? editingRecord.id : Date.now().toString(),
        childId: selectedChild.id,
        temperature: parseFloat(formData.temperature),
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        createdAt: editingRecord ? editingRecord.createdAt : new Date().toISOString()
      };
      
      const existingRecords = JSON.parse(localStorage.getItem('temperatureRecords') || '[]');
      
      if (editingRecord) {
        const updatedRecords = existingRecords.map((record: TemperatureRecord) => 
          record.id === editingRecord.id ? temperatureData : record
        );
        localStorage.setItem('temperatureRecords', JSON.stringify(updatedRecords));
        toast({
          title: "Güncellendi!",
          description: "Ateş kaydı başarıyla güncellendi.",
        });
      } else {
        existingRecords.push(temperatureData);
        localStorage.setItem('temperatureRecords', JSON.stringify(existingRecords));
        toast({
          title: "Kaydedildi!",
          description: `${formData.temperature}°C ateş kaydı başarıyla kaydedildi.`,
        });
      }
      
      resetForm();
      fetchTemperatureRecords();
    }
  };

  const handleEdit = (record: TemperatureRecord) => {
    setEditingRecord(record);
    setFormData({
      temperature: record.temperature.toString(),
      date: record.date,
      time: record.time,
      notes: record.notes
    });
    setShowForm(true);
  };

  const handleDelete = (recordId: string) => {
    const existingRecords = JSON.parse(localStorage.getItem('temperatureRecords') || '[]');
    const updatedRecords = existingRecords.filter((record: TemperatureRecord) => record.id !== recordId);
    localStorage.setItem('temperatureRecords', JSON.stringify(updatedRecords));
    
    toast({
      title: "Silindi!",
      description: "Ateş kaydı başarıyla silindi.",
    });
    
    fetchTemperatureRecords();
  };

  const resetForm = () => {
    setFormData({
      temperature: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      notes: ''
    });
    setEditingRecord(null);
    setShowForm(false);
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp < 36.0) return { label: 'Düşük', color: 'bg-blue-100 text-blue-800' };
    if (temp >= 36.0 && temp < 37.5) return { label: 'Normal', color: 'bg-green-100 text-green-800' };
    if (temp >= 37.5 && temp < 38.5) return { label: 'Hafif Ateş', color: 'bg-yellow-100 text-yellow-800' };
    if (temp >= 38.5 && temp < 39.5) return { label: 'Ateş', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Yüksek Ateş', color: 'bg-red-100 text-red-800' };
  };

  const getLatestTemperature = () => {
    if (records.length === 0) return null;
    return records[0];
  };

  const getAverageTemperature = () => {
    if (records.length === 0) return 0;
    const sum = records.reduce((acc, record) => acc + record.temperature, 0);
    return (sum / records.length).toFixed(1);
  };

  if (!selectedChild) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Thermometer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Çocuk Seçilmedi</h3>
            <p className="text-gray-600">Ateş takibi için önce bir çocuk seçin.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const latestTemp = getLatestTemperature();
  const avgTemp = getAverageTemperature();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ateş Takibi</h1>
          <p className="text-gray-600">Çocuğun ateş ölçümleri ve takibi</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Ateş Ölçümü
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Son Ölçüm</p>
                <p className="text-2xl font-bold">
                  {latestTemp ? `${latestTemp.temperature}°C` : '-'}
                </p>
                {latestTemp && (
                  <Badge className={getTemperatureStatus(latestTemp.temperature).color}>
                    {getTemperatureStatus(latestTemp.temperature).label}
                  </Badge>
                )}
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Thermometer className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ortalama</p>
                <p className="text-2xl font-bold">{avgTemp}°C</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Thermometer className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Ölçüm</p>
                <p className="text-2xl font-bold">{records.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Thermometer className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Ateş Ölçüm Kayıtları</CardTitle>
          <CardDescription>Tüm ateş ölçümleri kronolojik sırayla</CardDescription>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-8">
              <Thermometer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz ateş ölçümü bulunmuyor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Saat</TableHead>
                    <TableHead>Sıcaklık</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Notlar</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => {
                    const status = getTemperatureStatus(record.temperature);
                    return (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.date).toLocaleDateString('tr-TR')}</TableCell>
                        <TableCell>{record.time}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {record.temperature}°C
                            {record.temperature >= 38.5 && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={status.color}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{record.notes || '-'}</TableCell>
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
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Record Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                {editingRecord ? 'Ateş Ölçümünü Düzenle' : 'Yeni Ateş Ölçümü'}
              </CardTitle>
              <CardDescription>
                Çocuğun ateş ölçümünü kaydedin
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Sıcaklık (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="30"
                      max="45"
                      placeholder="36.5"
                      value={formData.temperature}
                      onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Saat</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      required
                    />
                  </div>
                </div>

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
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea
                    id="notes"
                    placeholder="Belirtiler, ilaç kullanımı, gözlemler..."
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
                    className="flex-1 bg-red-600 hover:bg-red-700"
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

export default Temperature; 