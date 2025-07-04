import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Stethoscope, Phone, Mail, MapPin, Calendar, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '../lib/utils';

interface Doctor {
  id: string;
  child_id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  created_at: string;
}

interface Appointment {
  id: string;
  child_id: string;
  doctor_id: string;
  doctor_name: string;
  date: string;
  time: string;
  reason: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

const Doctor = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialty: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  const [appointmentForm, setAppointmentForm] = useState({
    doctor_id: '',
    date: '',
    time: '',
    reason: '',
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
      fetchDoctors();
      fetchAppointments();
    }
  }, [selectedChild]);

  const fetchDoctors = async () => {
    if (!selectedChild) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('child_id', selectedChild.id)
        .order('name', { ascending: true });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Hata",
        description: "Doktor bilgileri yüklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    if (!selectedChild) return;
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('child_id', selectedChild.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;

    setLoading(true);
    try {
      const doctorData = {
        child_id: selectedChild.id,
        ...doctorForm
      };

      const { error } = await supabase
        .from('doctors')
        .insert([doctorData]);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Doktor bilgisi eklendi.",
      });

      setDoctorForm({
        name: '',
        specialty: '',
        phone: '',
        email: '',
        address: '',
        notes: ''
      });
      setShowDoctorForm(false);
      fetchDoctors();
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast({
        title: "Hata",
        description: "Doktor bilgisi eklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;

    setLoading(true);
    try {
      const selectedDoctor = doctors.find(d => d.id === appointmentForm.doctor_id);
      const appointmentData = {
        child_id: selectedChild.id,
        doctor_id: appointmentForm.doctor_id,
        doctor_name: selectedDoctor?.name || '',
        date: appointmentForm.date,
        time: appointmentForm.time,
        reason: appointmentForm.reason,
        notes: appointmentForm.notes,
        status: 'scheduled'
      };

      const { error } = await supabase
        .from('appointments')
        .insert([appointmentData]);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Randevu eklendi.",
      });

      setAppointmentForm({
        doctor_id: '',
        date: '',
        time: '',
        reason: '',
        notes: ''
      });
      setShowAppointmentForm(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error adding appointment:', error);
      toast({
        title: "Hata",
        description: "Randevu eklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="default">Planlandı</Badge>;
      case 'completed':
        return <Badge variant="secondary">Tamamlandı</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">İptal Edildi</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!selectedChild) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Çocuk Seçilmedi</h3>
            <p className="text-gray-600">Doktor bilgileri için önce bir çocuk seçin.</p>
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
          <h1 className="text-2xl font-bold text-gray-800">Doktor Bilgileri & Randevular</h1>
          <p className="text-gray-600">Takip eden doktorların bilgileri ve randevular</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={() => setShowDoctorForm(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Doktor Ekle
          </Button>
          <Button onClick={() => setShowAppointmentForm(true)} variant="outline" className="w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2" />
            Randevu Ekle
          </Button>
        </div>
      </div>

      {/* Doctors */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Doktor Bilgileri
          </CardTitle>
          <CardDescription>Takip eden doktorların iletişim bilgileri</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Yükleniyor...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-8">
              <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz doktor bilgisi eklenmemiş.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      {doctor.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{doctor.phone}</span>
                        </div>
                      )}
                      {doctor.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{doctor.email}</span>
                        </div>
                      )}
                      {doctor.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-xs">{doctor.address}</span>
                        </div>
                      )}
                    </div>
                    
                    {doctor.notes && (
                      <p className="text-xs text-gray-500">{doctor.notes}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointments */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Randevular
          </CardTitle>
          <CardDescription>Geçmiş ve gelecek randevular</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Henüz randevu bulunmuyor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Saat</TableHead>
                    <TableHead>Doktor</TableHead>
                    <TableHead>Sebep</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Notlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{new Date(appointment.date).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.doctor_name}</TableCell>
                      <TableCell className="max-w-xs truncate">{appointment.reason}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell className="max-w-xs truncate">{appointment.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Doctor Modal */}
      {showDoctorForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Yeni Doktor Ekle</CardTitle>
              <CardDescription>Doktor bilgilerini girin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDoctorSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Doktor Adı</Label>
                  <Input
                    id="name"
                    placeholder="Dr. Ad Soyad"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Uzmanlık Alanı</Label>
                  <Input
                    id="specialty"
                    placeholder="Örn: Çocuk Nörolojisi, Pediatri"
                    value={doctorForm.specialty}
                    onChange={(e) => setDoctorForm({...doctorForm, specialty: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0555 123 45 67"
                      value={doctorForm.phone}
                      onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="doktor@email.com"
                      value={doctorForm.email}
                      onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Textarea
                    id="address"
                    placeholder="Klinik/hastane adresi"
                    value={doctorForm.address}
                    onChange={(e) => setDoctorForm({...doctorForm, address: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea
                    id="notes"
                    placeholder="Özel durumlar, hatırlatmalar..."
                    value={doctorForm.notes}
                    onChange={(e) => setDoctorForm({...doctorForm, notes: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowDoctorForm(false)} 
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

      {/* Add Appointment Modal */}
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Yeni Randevu Ekle</CardTitle>
              <CardDescription>Randevu bilgilerini girin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor_id">Doktor</Label>
                  <Select value={appointmentForm.doctor_id} onValueChange={(value) => setAppointmentForm({...appointmentForm, doctor_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Doktor seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Tarih</Label>
                    <Input
                      id="date"
                      type="date"
                      value={appointmentForm.date}
                      onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Saat</Label>
                    <Input
                      id="time"
                      type="time"
                      value={appointmentForm.time}
                      onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Randevu Sebebi</Label>
                  <Input
                    id="reason"
                    placeholder="Kontrol, test, şikayet..."
                    value={appointmentForm.reason}
                    onChange={(e) => setAppointmentForm({...appointmentForm, reason: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea
                    id="notes"
                    placeholder="Hazırlık, sorular, özel durumlar..."
                    value={appointmentForm.notes}
                    onChange={(e) => setAppointmentForm({...appointmentForm, notes: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAppointmentForm(false)} 
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

export default Doctor; 