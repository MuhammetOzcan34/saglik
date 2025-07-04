import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, Plus, Search, Filter, Bed, Sun, Moon, Droplets, BookOpen, Gamepad2, Utensils, Activity, Heart, Edit, Trash2, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import DailyRoutineModal from '@/components/DailyRoutineModal';

interface RoutineRecord {
  id: string;
  childId: string;
  date: string;
  category: string;
  activity: string;
  time: string;
  duration?: string;
  mood?: string;
  quality?: string;
  notes?: string;
  createdAt: string;
}

const DailyRoutine = () => {
  const [routines, setRoutines] = useState<RoutineRecord[]>([]);
  const [filteredRoutines, setFilteredRoutines] = useState<RoutineRecord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');
  const { toast } = useToast();
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
      fetchRoutines();
    }
  }, [selectedChild]);

  useEffect(() => {
    filterRoutines();
  }, [routines, searchTerm, categoryFilter, dateFilter]);

  const fetchRoutines = () => {
    if (!selectedChild) return;
    
    setLoading(true);
    try {
      const savedRoutines = JSON.parse(localStorage.getItem('dailyRoutines') || '[]');
      const childRoutines = savedRoutines.filter((routine: RoutineRecord) => routine.childId === selectedChild.id);
      setRoutines(childRoutines);
    } catch (error) {
      console.error('Error fetching routines:', error);
      toast({
        title: "Hata",
        description: "Rutin kayıtları yüklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterRoutines = () => {
    let filtered = [...routines];

    if (searchTerm) {
      filtered = filtered.filter(routine =>
        routine.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        routine.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(routine => routine.category === categoryFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(routine => routine.date === dateFilter);
    }

    setFilteredRoutines(filtered);
  };

  const handleDelete = async (routineId: string) => {
    if (!confirm('Bu rutin kaydını silmek istediğinizden emin misiniz?')) return;

    try {
      const savedRoutines = JSON.parse(localStorage.getItem('dailyRoutines') || '[]');
      const updatedRoutines = savedRoutines.filter((routine: RoutineRecord) => routine.id !== routineId);
      localStorage.setItem('dailyRoutines', JSON.stringify(updatedRoutines));
      
      toast({
        title: "Başarılı",
        description: "Rutin kaydı silindi.",
      });

      fetchRoutines();
    } catch (error) {
      console.error('Error deleting routine:', error);
      toast({
        title: "Hata",
        description: "Rutin kaydı silinirken hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      sleep: 'Uyku Düzeni',
      hygiene: 'Hijyen & Bakım',
      meals: 'Beslenme',
      activities: 'Aktiviteler',
      mood: 'Ruh Hali'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getActivityLabel = (activity: string) => {
    const activities = {
      wake_up: 'Uyanma',
      bedtime: 'Yatma',
      nap: 'Gündüz Uykusu',
      sleep_quality: 'Uyku Kalitesi',
      bath: 'Banyo',
      brush_teeth: 'Diş Fırçalama',
      hair_care: 'Saç Bakımı',
      nail_care: 'Tırnak Bakımı',
      breakfast: 'Kahvaltı',
      lunch: 'Öğle Yemeği',
      dinner: 'Akşam Yemeği',
      snack: 'Ara Öğün',
      play: 'Oyun Zamanı',
      study: 'Ders/Eğitim',
      exercise: 'Egzersiz',
      outdoor: 'Dışarı Çıkma',
      mood_check: 'Ruh Hali Kontrolü',
      behavior: 'Davranış',
      social: 'Sosyal Etkileşim'
    };
    return activities[activity as keyof typeof activities] || activity;
  };

  const getMoodLabel = (mood: string) => {
    const moods = {
      very_happy: 'Çok Mutlu',
      happy: 'Mutlu',
      normal: 'Normal',
      sad: 'Üzgün',
      angry: 'Sinirli',
      energetic: 'Enerjik'
    };
    return moods[mood as keyof typeof moods] || mood;
  };

  const getQualityLabel = (quality: string) => {
    const qualities = {
      excellent: 'Mükemmel',
      good: 'İyi',
      average: 'Orta',
      poor: 'Kötü',
      very_poor: 'Çok Kötü'
    };
    return qualities[quality as keyof typeof qualities] || quality;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      sleep: 'bg-purple-100 text-purple-800',
      hygiene: 'bg-blue-100 text-blue-800',
      meals: 'bg-green-100 text-green-800',
      activities: 'bg-orange-100 text-orange-800',
      mood: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMoodColor = (mood: string) => {
    const colors = {
      very_happy: 'bg-green-100 text-green-800',
      happy: 'bg-green-50 text-green-700',
      normal: 'bg-gray-100 text-gray-800',
      sad: 'bg-blue-100 text-blue-800',
      angry: 'bg-red-100 text-red-800',
      energetic: 'bg-orange-100 text-orange-800'
    };
    return colors[mood as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const groupRoutinesByDate = () => {
    const grouped: { [key: string]: RoutineRecord[] } = {};
    filteredRoutines.forEach(routine => {
      if (!grouped[routine.date]) {
        grouped[routine.date] = [];
      }
      grouped[routine.date].push(routine);
    });
    return grouped;
  };

  if (!selectedChild) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Çocuk Seçilmedi</h3>
            <p className="text-gray-600">Günlük rutin takibi için önce bir çocuk seçin.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const groupedRoutines = groupRoutinesByDate();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Günlük Rutin Takibi</h1>
          <p className="text-gray-600">Çocuğunuzun günlük aktivitelerini kategorilere göre takip edin</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Rutin Ekle
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtreler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Aktivite ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tüm kategoriler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm kategoriler</SelectItem>
                <SelectItem value="sleep">Uyku Düzeni</SelectItem>
                <SelectItem value="hygiene">Hijyen & Bakım</SelectItem>
                <SelectItem value="meals">Beslenme</SelectItem>
                <SelectItem value="activities">Aktiviteler</SelectItem>
                <SelectItem value="mood">Ruh Hali</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Tarih seçin"
            />

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setDateFilter('');
              }}
            >
              Filtreleri Temizle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Kayıt</p>
                <p className="text-2xl font-bold">{routines.length}</p>
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
                <p className="text-sm text-gray-600">Bu Ay</p>
                <p className="text-2xl font-bold">
                  {routines.filter(r => {
                    const routineDate = new Date(r.date);
                    const now = new Date();
                    return routineDate.getMonth() === now.getMonth() && 
                           routineDate.getFullYear() === now.getFullYear();
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
                <p className="text-sm text-gray-600">Bugün</p>
                <p className="text-2xl font-bold">
                  {routines.filter(r => r.date === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Sun className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Kategoriler</p>
                <p className="text-2xl font-bold">
                  {new Set(routines.map(r => r.category)).size}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routines List */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Rutin Kayıtları</CardTitle>
          <CardDescription>
            {filteredRoutines.length} kayıt bulundu
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Yükleniyor...</p>
            </div>
          ) : filteredRoutines.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Rutin kaydı bulunamadı.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedRoutines).map(([date, dateRoutines]) => (
                <Accordion key={date} type="single" collapsible>
                  <AccordionItem value={date}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            {new Date(date).toLocaleDateString('tr-TR', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          <Badge variant="secondary">{dateRoutines.length} aktivite</Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {dateRoutines.map((routine) => (
                          <div
                            key={routine.id}
                            className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                    <h4 className="font-semibold text-lg">{getActivityLabel(routine.activity)}</h4>
                                    <Badge className={getCategoryColor(routine.category)}>
                                      {getCategoryLabel(routine.category)}
                                    </Badge>
                                  </div>
                                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                                    <span>🕐 {routine.time}</span>
                                    {routine.duration && <span>⏱️ {routine.duration} dk</span>}
                                    {routine.quality && <span>⭐ {getQualityLabel(routine.quality)}</span>}
                                  </div>
                                  {routine.mood && (
                                    <Badge className={getMoodColor(routine.mood)}>
                                      {getMoodLabel(routine.mood)}
                                    </Badge>
                                  )}
                                  {routine.notes && (
                                    <p className="text-sm text-gray-700 mt-2">{routine.notes}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(routine.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Routine Modal */}
      {showModal && (
        <DailyRoutineModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingRoutine(null);
          }}
          childId={selectedChild.id}
        />
      )}
    </div>
  );
};

export default DailyRoutine; 