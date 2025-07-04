import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Bell, Plus, AlertTriangle, Search, Filter, CalendarDays, List, Grid3X3, Edit, Trash2, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '../lib/utils';

interface CalendarEvent {
  id: string;
  child_id: string;
  type: 'medication' | 'appointment' | 'reminder' | 'routine';
  title: string;
  date: string;
  time?: string;
  description?: string;
  status: 'pending' | 'completed' | 'missed';
  created_at: string;
}

const CalendarPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    description: '',
    status: 'pending'
  });

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
      fetchEvents();
    }
  }, [selectedChild]);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, typeFilter, statusFilter]);

  const fetchEvents = async () => {
    if (!selectedChild) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('child_id', selectedChild.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Hata",
        description: "Takvim verileri yüklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tip filtresi
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === typeFilter);
    }

    // Durum filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;

    setLoading(true);
    try {
      const eventData = {
        child_id: selectedChild.id,
        title: formData.title,
        type: formData.type as 'medication' | 'appointment' | 'reminder' | 'routine',
        date: formData.date,
        time: formData.time || null,
        description: formData.description || null,
        status: formData.status as 'pending' | 'completed' | 'missed'
      };

      let error;
      if (editingEvent) {
        // Güncelleme
        const { error: updateError } = await supabase
          .from('calendar_events')
          .update(eventData)
          .eq('id', editingEvent.id);
        error = updateError;
      } else {
        // Yeni kayıt
        const { error: insertError } = await supabase
          .from('calendar_events')
          .insert([eventData]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: editingEvent ? "Etkinlik güncellendi." : "Yeni etkinlik eklendi.",
      });

      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Hata",
        description: "Etkinlik kaydedilirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Etkinlik silindi.",
      });

      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Hata",
        description: "Etkinlik silinirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      type: event.type,
      date: event.date,
      time: event.time || '',
      description: event.description || '',
      status: event.status
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      description: '',
      status: 'pending'
    });
    setEditingEvent(null);
    setShowModal(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default">Bekliyor</Badge>;
      case 'completed':
        return <Badge variant="secondary">Tamamlandı</Badge>;
      case 'missed':
        return <Badge variant="destructive">Kaçırıldı</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'appointment':
        return <Calendar className="h-4 w-4 text-green-600" />;
      case 'reminder':
        return <Bell className="h-4 w-4 text-orange-600" />;
      case 'routine':
        return <AlertTriangle className="h-4 w-4 text-purple-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'medication':
        return 'bg-blue-50 border-blue-200';
      case 'appointment':
        return 'bg-green-50 border-green-200';
      case 'reminder':
        return 'bg-orange-50 border-orange-200';
      case 'routine':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'medication':
        return 'İlaç';
      case 'appointment':
        return 'Randevu';
      case 'reminder':
        return 'Hatırlatıcı';
      case 'routine':
        return 'Rutin';
      default:
        return type;
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === selectedDate.getMonth();
  };

  if (!selectedChild) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Çocuk Seçilmedi</h3>
            <p className="text-gray-600">Takvim için önce bir çocuk seçin.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calendarDays = generateCalendarDays();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Günlük Rutin & Hatırlatıcılar</h1>
          <p className="text-gray-600">Tüm etkinlikler ve hatırlatıcılar</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Etkinlik
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-2" />
            Liste
          </Button>
          <Button 
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Takvim
          </Button>
        </div>
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
            {/* Arama */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Etkinlik ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tip Filtresi */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tüm tipler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm tipler</SelectItem>
                <SelectItem value="medication">İlaç</SelectItem>
                <SelectItem value="appointment">Randevu</SelectItem>
                <SelectItem value="reminder">Hatırlatıcı</SelectItem>
                <SelectItem value="routine">Rutin</SelectItem>
              </SelectContent>
            </Select>

            {/* Durum Filtresi */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tüm durumlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm durumlar</SelectItem>
                <SelectItem value="pending">Bekliyor</SelectItem>
                <SelectItem value="completed">Tamamlandı</SelectItem>
                <SelectItem value="missed">Kaçırıldı</SelectItem>
              </SelectContent>
            </Select>

            {/* Temizle Butonu */}
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setStatusFilter('all');
              }}
            >
              Filtreleri Temizle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* List View */}
      {viewMode === 'list' && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Etkinlik Listesi</CardTitle>
            <CardDescription>
              {filteredEvents.length} etkinlik bulundu
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Yükleniyor...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Etkinlik bulunamadı.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`
                      p-4 rounded-lg border ${getEventColor(event.type)}
                      hover:shadow-md transition-shadow
                    `}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {getEventIcon(event.type)}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{event.title}</h4>
                            <Badge variant="outline" className="w-fit">
                              {getTypeLabel(event.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {new Date(event.date).toLocaleDateString('tr-TR', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                            {event.time && ` - ${event.time}`}
                          </p>
                          {event.description && (
                            <p className="text-sm text-gray-700">{event.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(event.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <>
          {/* Month Navigation */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setSelectedDate(newDate);
                  }}
                >
                  Önceki Ay
                </Button>
                <h2 className="text-xl font-semibold">{formatDate(selectedDate)}</h2>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setSelectedDate(newDate);
                  }}
                >
                  Sonraki Ay
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 p-2">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((date, index) => {
                  const dayEvents = getEventsForDate(date);
                  const isCurrentMonthDay = isCurrentMonth(date);
                  const isTodayDate = isToday(date);
                  
                  return (
                    <div
                      key={index}
                      className={`
                        min-h-[120px] p-2 border rounded-lg text-sm
                        ${isCurrentMonthDay ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                        ${isTodayDate ? 'ring-2 ring-blue-500' : ''}
                        ${dayEvents.length > 0 ? 'border-blue-300' : 'border-gray-200'}
                        hover:shadow-md transition-shadow cursor-pointer
                      `}
                    >
                      <div className="text-right mb-2">
                        <span className={`
                          ${isTodayDate ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}
                        `}>
                          {date.getDate()}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={`
                              p-1 rounded text-xs border ${getEventColor(event.type)}
                              flex items-center gap-1
                            `}
                          >
                            {getEventIcon(event.type)}
                            <span className="truncate">{event.title}</span>
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayEvents.length - 3} daha
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Today's Events */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Bugünün Etkinlikleri
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('tr-TR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getEventsForDate(new Date()).length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Bugün için etkinlik bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getEventsForDate(new Date()).map((event) => (
                    <div
                      key={event.id}
                      className={`
                        p-4 rounded-lg border ${getEventColor(event.type)}
                        flex items-center justify-between
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {getEventIcon(event.type)}
                        <div>
                          <h4 className="font-semibold">{event.title}</h4>
                          {event.time && (
                            <p className="text-sm text-gray-600">{event.time}</p>
                          )}
                          {event.description && (
                            <p className="text-sm text-gray-600">{event.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(event.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Add/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingEvent ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Ekle'}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Etkinlik bilgilerini girin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Etkinlik Tipi</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Etkinlik tipi seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medication">İlaç</SelectItem>
                      <SelectItem value="appointment">Randevu</SelectItem>
                      <SelectItem value="reminder">Hatırlatıcı</SelectItem>
                      <SelectItem value="routine">Rutin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <Label htmlFor="time">Saat (İsteğe bağlı)</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Bekliyor</SelectItem>
                      <SelectItem value="completed">Tamamlandı</SelectItem>
                      <SelectItem value="missed">Kaçırıldı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama (İsteğe bağlı)</Label>
                  <Textarea
                    id="description"
                    placeholder="Etkinlik hakkında detaylar..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm} 
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
                    {loading ? 'Kaydediliyor...' : (editingEvent ? 'Güncelle' : 'Kaydet')}
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

export default CalendarPage; 