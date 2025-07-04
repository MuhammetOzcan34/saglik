
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coffee, Plus, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface NutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
}

interface FoodItem {
  name: string;
  amount: string;
  notes: string;
}

const NutritionModal = ({ isOpen, onClose, childId }: NutritionModalProps) => {
  const [mealType, setMealType] = useState('');
  const [time, setTime] = useState('');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([{ name: '', amount: '', notes: '' }]);
  const [liquidIntake, setLiquidIntake] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const { toast } = useToast();

  const addFoodItem = () => {
    setFoodItems([...foodItems, { name: '', amount: '', notes: '' }]);
  };

  const removeFoodItem = (index: number) => {
    setFoodItems(foodItems.filter((_, i) => i !== index));
  };

  const updateFoodItem = (index: number, field: keyof FoodItem, value: string) => {
    const updated = foodItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setFoodItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mealType && time && foodItems.some(item => item.name)) {
      const nutritionData = {
        id: Date.now().toString(),
        childId,
        mealType,
        time,
        foodItems: foodItems.filter(item => item.name),
        liquidIntake,
        generalNotes,
        date: new Date().toISOString().split('T')[0]
      };
      
      const existingNutrition = JSON.parse(localStorage.getItem('nutritionRecords') || '[]');
      existingNutrition.push(nutritionData);
      localStorage.setItem('nutritionRecords', JSON.stringify(existingNutrition));
      
      toast({
        title: "Beslenme kaydedildi!",
        description: `${mealType} başarıyla kaydedildi.`,
      });
      
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            Beslenme Kaydı
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
                <Select value={mealType} onValueChange={setMealType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Öğün türü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kahvalti">Kahvaltı</SelectItem>
                    <SelectItem value="ara_ogun_1">Ara Öğün (Kuşluk)</SelectItem>
                    <SelectItem value="ogle_yemegi">Öğle Yemeği</SelectItem>
                    <SelectItem value="ara_ogun_2">Ara Öğün (İkindi)</SelectItem>
                    <SelectItem value="aksam_yemegi">Akşam Yemeği</SelectItem>
                    <SelectItem value="atistirmalik">Atıştırmalık</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Saat</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
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
              
              {foodItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Gıda {index + 1}</h4>
                    {foodItems.length > 1 && (
                      <Button 
                        type="button" 
                        onClick={() => removeFoodItem(index)}
                        size="sm" 
                        variant="ghost"
                      >
                        <X className="h-4 w-4" />
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
                value={liquidIntake}
                onChange={(e) => setLiquidIntake(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="generalNotes">Genel Notlar</Label>
              <Textarea
                id="generalNotes"
                placeholder="İştah durumu, özel gözlemler..."
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                İptal
              </Button>
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                Kaydet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionModal;
