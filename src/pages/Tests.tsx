import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, FileCheck, Upload, Download, Activity } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '../lib/utils';

interface TestResult {
  id: string;
  child_id: string;
  test_type: string;
  test_date: string;
  result_summary: string;
  normal_range?: string;
  actual_value?: string;
  doctor_notes?: string;
  file_url?: string;
  file_name?: string;
  created_at: string;
}

const Tests = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    test_type: '',
    test_date: '',
    result_summary: '',
    normal_range: '',
    actual_value: '',
    doctor_notes: '',
    file: null as File | null
  });

  const [selectedChild, setSelectedChild] = useState<any>(null);

  const testTypes = [
    { value: 'blood_test', label: 'Kan Testi' },
    { value: 'urine_test', label: 'İdrar Testi' },
    { value: 'mri', label: 'MR' },
    { value: 'ct_scan', label: 'CT Taraması' },
    { value: 'xray', label: 'Röntgen' },
    { value: 'eeg', label: 'EEG' },
    { value: 'ecg', label: 'EKG' },
    { value: 'ultrasound', label: 'Ultrason' },
    { value: 'genetic_test', label: 'Genetik Test' },
    { value: 'allergy_test', label: 'Alerji Testi' },
    { value: 'other', label: 'Diğer' }
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
      fetchTests();
    }
  }, [selectedChild]);

  const fetchTests = async () => {
    if (!selectedChild) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('child_id', selectedChild.id)
        .order('test_date', { ascending: false });

      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast({
        title: "Hata",
        description: "Test sonuçları yüklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `test-results/${selectedChild.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return { url: data.publicUrl, fileName: file.name };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;

    setLoading(true);
    setUploading(true);
    try {
      let fileData = null;
      
      if (formData.file) {
        fileData = await uploadFile(formData.file);
      }

      const testData = {
        child_id: selectedChild.id,
        test_type: formData.test_type,
        test_date: formData.test_date,
        result_summary: formData.result_summary,
        normal_range: formData.normal_range || null,
        actual_value: formData.actual_value || null,
        doctor_notes: formData.doctor_notes || null,
        file_url: fileData?.url || null,
        file_name: fileData?.fileName || null
      };

      const { error } = await supabase
        .from('test_results')
        .insert([testData]);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Test sonucu eklendi.",
      });

      setFormData({
        test_type: '',
        test_date: '',
        result_summary: '',
        normal_range: '',
        actual_value: '',
        doctor_notes: '',
        file: null
      });
      setShowForm(false);
      fetchTests();
    } catch (error) {
      console.error('Error adding test result:', error);
      toast({
        title: "Hata",
        description: "Test sonucu eklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const getTestTypeLabel = (type: string) => {
    const found = testTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  const downloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Hata",
        description: "Dosya indirilirken hata oluştu.",
        variant: "destructive"
      });
    }
  };

  if (!selectedChild) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Çocuk Seçilmedi</h3>
            <p className="text-gray-600">Test sonuçları için önce bir çocuk seçin.</p>
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
          <h1 className="text-2xl font-bold text-gray-800">Test Sonuçları</h1>
          <p className="text-gray-600">Tıbbi test sonuçları ve belge yönetimi</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Test Sonucu Ekle
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Test</p>
                <p className="text-2xl font-bold">{tests.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bu Ay</p>
                <p className="text-2xl font-bold">
                  {tests.filter(test => {
                    const testDate = new Date(test.test_date);
                    const now = new Date();
                    return testDate.getMonth() === now.getMonth() && testDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Belgeli Test</p>
                <p className="text-2xl font-bold">
                  {tests.filter(test => test.file_url).length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Upload className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests Table */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Test Sonuçları</CardTitle>
          <CardDescription>Tüm tıbbi test sonuçları ve belgeler</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Yükleniyor...</p>
            </div>
          ) : tests.length === 0 ? (
            <div className="text-center py-8">
              <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz test sonucu bulunmuyor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Test Türü</TableHead>
                    <TableHead>Sonuç Özeti</TableHead>
                    <TableHead>Değer</TableHead>
                    <TableHead>Doktor Notları</TableHead>
                    <TableHead>Belge</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>{new Date(test.test_date).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getTestTypeLabel(test.test_type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{test.result_summary}</TableCell>
                      <TableCell>
                        {test.actual_value && (
                          <div className="text-sm">
                            <div>Değer: {test.actual_value}</div>
                            {test.normal_range && (
                              <div className="text-gray-500">Normal: {test.normal_range}</div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{test.doctor_notes || '-'}</TableCell>
                      <TableCell>
                        {test.file_url ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(test.file_url!, test.file_name || 'test-result')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            İndir
                          </Button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Test Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Yeni Test Sonucu Ekle</CardTitle>
              <CardDescription>Test bilgilerini ve sonuçlarını girin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="test_type">Test Türü</Label>
                    <Select value={formData.test_type} onValueChange={(value) => setFormData({...formData, test_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Test türü seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {testTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test_date">Test Tarihi</Label>
                    <Input
                      id="test_date"
                      type="date"
                      value={formData.test_date}
                      onChange={(e) => setFormData({...formData, test_date: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="result_summary">Sonuç Özeti</Label>
                  <Textarea
                    id="result_summary"
                    placeholder="Test sonucunun kısa özeti..."
                    value={formData.result_summary}
                    onChange={(e) => setFormData({...formData, result_summary: e.target.value})}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="actual_value">Test Değeri</Label>
                    <Input
                      id="actual_value"
                      placeholder="Örn: 120 mg/dL"
                      value={formData.actual_value}
                      onChange={(e) => setFormData({...formData, actual_value: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="normal_range">Normal Aralık</Label>
                    <Input
                      id="normal_range"
                      placeholder="Örn: 70-100 mg/dL"
                      value={formData.normal_range}
                      onChange={(e) => setFormData({...formData, normal_range: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor_notes">Doktor Notları</Label>
                  <Textarea
                    id="doctor_notes"
                    placeholder="Doktorun yorumları, önerileri..."
                    value={formData.doctor_notes}
                    onChange={(e) => setFormData({...formData, doctor_notes: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Test Belgesi (Opsiyonel)</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-gray-500">
                    PDF, resim veya doküman dosyaları yükleyebilirsiniz.
                  </p>
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
                    {loading ? (uploading ? 'Yükleniyor...' : 'Kaydediliyor...') : 'Kaydet'}
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

export default Tests; 