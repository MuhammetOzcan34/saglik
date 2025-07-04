
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, Smile, Frown, Meh, Angry, Heart, Coffee, Bed, Sun, Moon, Droplets, BookOpen, Gamepad2, Utensils, Activity } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface DailyRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
}

const DailyRoutineModal = ({ isOpen, onClose, childId }: DailyRoutineModalProps) => {
  const [activeCategory, setActiveCategory] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    activity: '',
    time: '',
    duration: '',
    mood: '',
    quality: '',
    notes: ''
  });
  const { toast } = useToast();

  const categories = [
    {
      id: 'sleep',
      title: 'Uyku Düzeni',
      icon: Bed,
      color: 'text-purple-600',
      activities: [
        { value: 'wake_up', label: 'Uyanma', icon: Sun },
        { value: 'bedtime', label: 'Yatma', icon: Moon },
        { value: 'nap', label: 'Gündüz Uykusu', icon: Bed },
        { value: 'sleep_quality', label: 'Uyku Kalitesi', icon: Activity }
      ],
      fields: ['time', 'duration', 'quality', 'mood', 'notes']
    },
    {
      id: 'hygiene',
      title: 'Hijyen & Bakım',
      icon: Droplets,
      color: 'text-blue-600',
      activities: [
        { value: 'bath', label: 'Banyo', icon: Droplets },
        { value: 'brush_teeth', label: 'Diş Fırçalama', icon: Activity },
        { value: 'hair_care', label: 'Saç Bakımı', icon: Activity },
        { value: 'nail_care', label: 'Tırnak Bakımı', icon: Activity }
      ],
      fields: ['time', 'duration', 'mood', 'notes']
    },

    {
      id: 'activities',
      title: 'Aktiviteler',
      icon: Gamepad2,
      color: 'text-orange-600',
      activities: [
        { value: 'play', label: 'Oyun Zamanı', icon: Gamepad2 },
        { value: 'study', label: 'Ders/Eğitim', icon: BookOpen },
        { value: 'exercise', label: 'Egzersiz', icon: Activity },
        { value: 'outdoor', label: 'Dışarı Çıkma', icon: Sun }
      ],
      fields: ['time', 'duration', 'mood', 'notes']
    },
    {
      id: 'mood',
      title: 'Ruh Hali',
      icon: Heart,
      color: 'text-pink-600',
      activities: [
        { value: 'mood_check', label: 'Ruh Hali Kontrolü', icon: Heart },
        { value: 'behavior', label: 'Davranış', icon: Activity },
        { value: 'social', label: 'Sosyal Etkileşim', icon: Activity }
      ],
      fields: ['time', 'mood', 'notes']
    }
  ];

  const moodOptions = [
    { value: 'very_happy', label: 'Çok Mutlu', icon: Smile, color: 'text-green-500' },
    { value: 'happy', label: 'Mutlu', icon: Smile, color: 'text-green-400' },
    { value: 'normal', label: 'Normal', icon: Meh, color: 'text-gray-500' },
    { value: 'sad', label: 'Üzgün', icon: Frown, color: 'text-blue-500' },
    { value: 'angry', label: 'Sinirli', icon: Angry, color: 'text-red-500' },
    { value: 'energetic', label: 'Enerjik', icon: Heart, color: 'text-orange-500' },
  ];

  const qualityOptions = [
    { value: 'excellent', label: 'Mükemmel' },
    { value: 'good', label: 'İyi' },
    { value: 'average', label: 'Orta' },
    { value: 'poor', label: 'Kötü' },
    { value: 'very_poor', label: 'Çok Kötü' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category && formData.activity && formData.time) {
      const routineData = {
        id: Date.now().toString(),
        childId,
        ...formData,
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      const existingRoutines = JSON.parse(localStorage.getItem('dailyRoutines') || '[]');
      existingRoutines.push(routineData);
      localStorage.setItem('dailyRoutines', JSON.stringify(existingRoutines));
      
      toast({
        title: "Rutin kaydedildi!",
        description: `${formData.activity} aktivitesi başarıyla kaydedildi.`,
      });
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: '',
        activity: '',
        time: '',
        duration: '',
        mood: '',
        quality: '',
        notes: ''
      });
      setActiveCategory('');
      onClose();
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    setFormData(prev => ({ ...prev, category: categoryId }));
  };

  const handleActivitySelect = (activity: string) => {
    setFormData(prev => ({ ...prev, activity }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Günlük Rutin Kaydı
          </CardTitle>
          <CardDescription>
            Çocuğun günlük aktivitelerini kategorilere göre kaydedin
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
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

            {/* Category Selection */}
            <div className="space-y-3">
              <Label>Kategori Seçin</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategorySelect(category.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        activeCategory === category.id 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <IconComponent className={`h-6 w-6 mx-auto mb-2 ${category.color}`} />
                      <p className="text-sm font-medium text-center">{category.title}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Activity Selection */}
            {activeCategory && (
              <div className="space-y-3">
                <Label>Aktivite Seçin</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.find(c => c.id === activeCategory)?.activities.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <button
                        key={activity.value}
                        type="button"
                        onClick={() => handleActivitySelect(activity.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.activity === activity.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className="h-5 w-5 mx-auto mb-1" />
                        <p className="text-xs text-center">{activity.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dynamic Fields Based on Category */}
            {activeCategory && formData.activity && (
              <div className="space-y-4">
                {/* Time */}
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

                {/* Duration - for activities that need it */}
                {categories.find(c => c.id === activeCategory)?.fields.includes('duration') && (
                  <div className="space-y-2">
                    <Label htmlFor="duration">Süre (Dakika)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      placeholder="Örn: 30"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    />
                  </div>
                )}

                {/* Quality - for sleep activities */}
                {activeCategory === 'sleep' && (
                  <div className="space-y-2">
                    <Label>Uyku Kalitesi</Label>
                    <Select value={formData.quality} onValueChange={(value) => setFormData({...formData, quality: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kalite seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Mood */}
                {categories.find(c => c.id === activeCategory)?.fields.includes('mood') && (
                  <div className="space-y-2">
                    <Label>Ruh Hali</Label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {moodOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({...formData, mood: option.value})}
                            className={`p-3 rounded-lg border-2 transition-colors ${
                              formData.mood === option.value 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <IconComponent className={`h-5 w-5 mx-auto ${option.color}`} />
                            <p className="text-xs mt-1 text-center">{option.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notlar (Opsiyonel)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Özel durumlar, gözlemler, detaylar..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                İptal
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!formData.category || !formData.activity || !formData.time}
              >
                Kaydet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyRoutineModal;
