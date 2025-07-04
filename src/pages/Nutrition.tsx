import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Coffee, Utensils, Trash2, Edit } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FoodItem {
  name: string;
  amount: string;
  notes: string;
}

interface NutritionRecord {
  id: string;
  childId: string;
  mealType: string;
  time: string;
  foodItems: FoodItem[];
  liquidIntake: string;
  generalNotes: string;
  date: string;
}

const Nutrition = () => {
  const [records, setRecords] = useState<NutritionRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<NutritionRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    mealType: '',
    time: '',
    foodItems: [{ name: '', amount: '', notes: '' }] as FoodItem[],
    liquidIntake: '',
    generalNotes: ''
  });

  const [selectedChild, setSelectedChild] = useState<any>(null);

  const mealTypes = [
    { value: 'kahvalti', label: 'Kahvaltı' },
    { value: 'ara_ogun_1', label: 'Ara Öğün (Kuşluk)' },
    { value: 'ogle_yemegi', label: 'Öğle Yemeği' },
    { value: 'ara_ogun_2', label: 'Ara Öğün (İkindi)' },
    { value: 'aksam_yemegi', label: 'Akşam Yemeği' },
    { value: 'atistirmalik', label: 'Atıştırmalık' }
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
      fetchNutritionRecords();
    }
  }, [selectedChild]);

  const fetchNutritionRecords = () => {
    if (!selectedChild) return;
    
    const existingRecords = JSON.parse(localStorage.getItem('nutritionRecords') || '[]');
    const childRecords = existingRecords.filter((record: NutritionRecord) => record.childId === selectedChild.id);
    setRecords(childRecords.sort((a: NutritionRecord, b: NutritionRecord) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const addFoodItem = () => {
    setFormData({
      ...formData,
      foodItems: [...formData.foodItems, { name: '', amount: '', notes: '' }]
    });
  };

  const removeFoodItem = (index: number) => {
    setFormData({
      ...formData,
      foodItems: formData.foodItems.filter((_, i) => i !== index)
    });
  };

  const updateFoodItem = (index: number, field: keyof FoodItem, value: string) => {
    const updated = formData.foodItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, foodItems: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;

    if (formData.mealType && formData.time && formData.foodItems.some(item => item.name)) {
      const nutritionData = {
        id: editingRecord ? editingRecord.id : Date.now().toString(),
        childId: selectedChild.id,
        mealType: formData.mealType,
        time: formData.time,
        foodItems: formData.foodItems.filter(item => item.name),
        liquidIntake: formData.liquidIntake,
        generalNotes: formData.generalNotes,
        date: new Date().toISOString().split('T')[0]
      };
      
      const existingRecords = JSON.parse(localStorage.getItem('nutritionRecords') || '[]');
      
      if (editingRecord) {
        // Update existing record
        const updatedRecords = existingRecords.map((record: NutritionRecord) => 
          record.id === editingRecord.id ? nutritionData : record
        );
        localStorage.setItem('nutritionRecords', JSON.stringify(updatedRecords));
        toast({
          title: "Güncellendi!",
          description: "Beslenme kaydı başarıyla güncellendi.",
        });
      } else {
        // Add new record
        existingRecords.push(nutritionData);
        localStorage.setItem('nutritionRecords', JSON.stringify(existingRecords));
        toast({
          title: "Kaydedildi!",
          description: `${formData.mealType} başarıyla kaydedildi.`,
        });
      }
      
      resetForm();
      fetchNutritionRecords();
    }
  };

  const handleEdit = (record: NutritionRecord) => {
    setEditingRecord(record);
    setFormData({
      mealType: record.mealType,
      time: record.time,
      foodItems: record.foodItems.length > 0 ? record.foodItems : [{ name: '', amount: '', notes: '' }],
      liquidIntake: record.liquidIntake,
      generalNotes: record.generalNotes
    });
    setShowForm(true);
  };

  const handleDelete = (recordId: string) => {
    const existingRecords = JSON.parse(localStorage.getItem('nutritionRecords') || '[]');
    const updatedRecords = existingRecords.filter((record: NutritionRecord) => record.id !== recordId);
    localStorage.setItem('nutritionRecords', JSON.stringify(updatedRecords));
    
    toast({
      title: "Silindi!",
      description: "Beslenme kaydı başarıyla silindi.",
    });
    
    fetchNutritionRecords();
  };

  const resetForm = () => {
    setFormData({
      mealType: '',
      time: '',
      foodItems: [{ name: '', amount: '', notes: '' }],
      liquidIntake: '',
      generalNotes: ''
    });
    setEditingRecord(null);
    setShowForm(false);
  };

  const getMealTypeLabel = (type: string) => {
    const found = mealTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  if (!selectedChild) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Coffee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Çocuk Seçilmedi</h3>
            <p className="text-gray-600">Beslenme takibi için önce bir çocuk seçin.</p>
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
          <h1 className="text-2xl font-bold text-gray-800">Beslenme Takibi</h1>
          <p className="text-gray-600">Çocuğun beslenme kayıtları ve takibi</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Beslenme Kaydı
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bugün</p>
                <p className="text-2xl font-bold">{records.filter(r => r.date === new Date().toISOString().split('T')[0]).length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Coffee className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bu Hafta</p>
                <p className="text-2xl font-bold">{records.filter(r => {
                  const recordDate = new Date(r.date);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return recordDate >= weekAgo;
                }).length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Utensils className="h-6 w-6 text-blue-600" />
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
              <div className="bg-orange-100 p-3 rounded-full">
                <Coffee className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Beslenme Kayıtları</CardTitle>
          <CardDescription>Tüm beslenme kayıtları kronolojik sırayla</CardDescription>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-8">
              <Coffee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz beslenme kaydı bulunmuyor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Saat</TableHead>
                    <TableHead>Öğün</TableHead>
                    <TableHead>Gıdalar</TableHead>
                    <TableHead>Sıvı</TableHead>
                    <TableHead>Notlar</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.date).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{record.time}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getMealTypeLabel(record.mealType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="space-y-1">
                          {record.foodItems.map((item, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium">{item.name}</span>
                              {item.amount && <span className="text-gray-500"> - {item.amount}</span>}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{record.liquidIntake || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate">{record.generalNotes || '-'}</TableCell>
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
                <Coffee className="h-5 w-5" />
                {editingRecord ? 'Beslenme Kaydını Düzenle' : 'Yeni Beslenme Kaydı'}
              </CardTitle>
              <CardDescription>
                Çocuğun beslenme bilgilerini detaylı olarak kaydedin
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mealType">Öğün Türü</Label>
                    <Select value={formData.mealType} onValueChange={(value) => setFormData({...formData, mealType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Öğün türü seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {mealTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Yenilen/İçilen Gıdalar</Label>
                    <Button type="button" onClick={addFoodItem} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Gıda Ekle
                    </Button>
                  </div>
                  
                  {formData.foodItems.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Gıda {index + 1}</h4>
                        {formData.foodItems.length > 1 && (
                          <Button 
                            type="button" 
                            onClick={() => removeFoodItem(index)}
                            size="sm" 
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Gıda Adı</Label>
                          <Input
                            placeholder="Örn: Çorba, Ekmek, Muz"
                            value={item.name}
                            onChange={(e) => updateFoodItem(index, 'name', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Miktar</Label>
                          <Input
                            placeholder="Örn: 1 kase, 2 dilim, 1 adet"
                            value={item.amount}
                            onChange={(e) => updateFoodItem(index, 'amount', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Notlar (Alerji, reaksiyon vb.)</Label>
                        <Input
                          placeholder="Özel durumlar..."
                          value={item.notes}
                          onChange={(e) => updateFoodItem(index, 'notes', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="liquidIntake">Sıvı Tüketimi</Label>
                  <Input
                    id="liquidIntake"
                    placeholder="Örn: 2 bardak su, 1 bardak süt"
                    value={formData.liquidIntake}
                    onChange={(e) => setFormData({...formData, liquidIntake: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="generalNotes">Genel Notlar</Label>
                  <Textarea
                    id="generalNotes"
                    placeholder="İştah durumu, özel gözlemler..."
                    value={formData.generalNotes}
                    onChange={(e) => setFormData({...formData, generalNotes: e.target.value})}
                    rows={2}
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
                    className="flex-1 bg-green-600 hover:bg-green-700"
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

export default Nutrition; 