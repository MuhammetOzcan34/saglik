import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Bell,
  Settings,
  LogOut,
  Heart,
  Baby,
  Users
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';

interface Child {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  weight: string;
  height: string;
  allergies: string;
  medications: string;
  conditions: string;
  notes: string;
  photoUrl?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: 'Anne/Baba Adı',
    email: 'ornek@email.com',
    phone: '+90 555 123 4567',
    address: 'İstanbul, Türkiye',
    birthDate: '1990-01-01',
    emergencyContact: {
      name: 'Acil Durum Kişisi',
      phone: '+90 555 987 6543',
      relationship: 'Ebeveyn'
    }
  });

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showChildForm, setShowChildForm] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [childFormData, setChildFormData] = useState({
    name: '',
    birthDate: '',
    gender: '',
    weight: '',
    height: '',
    allergies: '',
    medications: '',
    conditions: '',
    notes: ''
  });

  useEffect(() => {
    fetchUserProfile();
    fetchChildren();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data && !error) {
          setUserProfile({
            id: data.id,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            birthDate: data.birth_date || '',
            emergencyContact: {
              name: data.emergency_contact_name || '',
              phone: data.emergency_contact_phone || '',
              relationship: data.emergency_contact_relationship || ''
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Önce kullanıcının aile üyeliğini kontrol et
        const { data: familyMember } = await supabase
          .from('family_members')
          .select('family_id')
          .eq('user_id', user.id)
          .single();

        if (familyMember) {
          // Aileye ait çocukları getir
          const { data: childrenData, error } = await supabase
            .from('children')
            .select('*')
            .eq('family_id', familyMember.family_id)
            .order('name');

          if (error) throw error;
          setChildren(childrenData || []);
        }
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        title: "Hata",
        description: "Çocuk bilgileri yüklenirken hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            name: userProfile.name,
            email: userProfile.email,
            phone: userProfile.phone,
            address: userProfile.address,
            birth_date: userProfile.birthDate,
            emergency_contact_name: userProfile.emergencyContact.name,
            emergency_contact_phone: userProfile.emergencyContact.phone,
            emergency_contact_relationship: userProfile.emergencyContact.relationship
          });

        if (error) throw error;
        
        setIsEditing(false);
        toast({
          title: "Profil güncellendi!",
          description: "Profil bilgileriniz başarıyla kaydedildi.",
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Hata",
        description: "Profil güncellenirken hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleChildSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Kullanıcının aile ID'sini al
      const { data: familyMember } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id)
        .single();

      if (!familyMember) {
        toast({
          title: "Hata",
          description: "Aile bilgisi bulunamadı.",
          variant: "destructive"
        });
        return;
      }

      if (editingChild) {
        // Update existing child
        const { error } = await supabase
          .from('children')
          .update({
            name: childFormData.name,
            birth_date: childFormData.birthDate,
            gender: childFormData.gender,
            weight: childFormData.weight ? parseFloat(childFormData.weight) : null,
            height: childFormData.height ? parseFloat(childFormData.height) : null,
            allergies: childFormData.allergies,
            medications: childFormData.medications,
            conditions: childFormData.conditions,
            notes: childFormData.notes
          })
          .eq('id', editingChild.id);

        if (error) throw error;
        
        toast({
          title: "Çocuk profili güncellendi!",
          description: `${childFormData.name} profil bilgileri güncellendi.`,
        });
      } else {
        // Add new child
        const { error } = await supabase
          .from('children')
          .insert({
            family_id: familyMember.family_id,
            name: childFormData.name,
            birth_date: childFormData.birthDate,
            gender: childFormData.gender,
            weight: childFormData.weight ? parseFloat(childFormData.weight) : null,
            height: childFormData.height ? parseFloat(childFormData.height) : null,
            allergies: childFormData.allergies,
            medications: childFormData.medications,
            conditions: childFormData.conditions,
            notes: childFormData.notes
          });

        if (error) throw error;
        
        toast({
          title: "Çocuk profili eklendi!",
          description: `${childFormData.name} profili başarıyla eklendi.`,
        });
      }
      
      resetChildForm();
      fetchChildren(); // Listeyi yenile
    } catch (error) {
      console.error('Error saving child:', error);
      toast({
        title: "Hata",
        description: "Çocuk profili kaydedilirken hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleChildDelete = async (childId: string) => {
    if (!confirm('Bu çocuk profilini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) return;
    
    try {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', childId);

      if (error) throw error;
      
      // Eğer silinen çocuk aktif çocuk ise, seçimi kaldır
      if (selectedChild?.id === childId) {
        setSelectedChild(null);
        localStorage.removeItem('selectedChild');
      }
      
      toast({
        title: "Profil silindi!",
        description: "Çocuk profili başarıyla silindi.",
      });
      
      fetchChildren(); // Listeyi yenile
    } catch (error) {
      console.error('Error deleting child:', error);
      toast({
        title: "Hata",
        description: "Çocuk profili silinirken hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleChildSelect = (child: Child) => {
    setSelectedChild(child);
    localStorage.setItem('selectedChild', JSON.stringify(child));
    toast({
      title: "Çocuk seçildi!",
      description: `${child.name} aktif çocuk olarak ayarlandı.`,
    });
  };

  const resetChildForm = () => {
    setChildFormData({
      name: '',
      birthDate: '',
      gender: '',
      weight: '',
      height: '',
      allergies: '',
      medications: '',
      conditions: '',
      notes: ''
    });
    setEditingChild(null);
    setShowChildForm(false);
  };

  const openChildForm = (child?: Child) => {
    if (child) {
      setEditingChild(child);
      setChildFormData({
        name: child.name,
        birthDate: child.birthDate,
        gender: child.gender,
        weight: child.weight,
        height: child.height,
        allergies: child.allergies,
        medications: child.medications,
        conditions: child.conditions,
        notes: child.notes
      });
    } else {
      setEditingChild(null);
      resetChildForm();
    }
    setShowChildForm(true);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} gün`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} ay`;
    } else {
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);
      return months > 0 ? `${years} yaş ${months} ay` : `${years} yaş`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profil & Ayarlar</h1>
          <p className="text-gray-600">Hesap bilgilerinizi ve çocuk profillerini yönetin</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="children" className="flex items-center gap-2">
            <Baby className="h-4 w-4" />
            Çocuklar
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Ayarlar
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Kişisel Bilgiler</CardTitle>
                  <CardDescription>Hesap bilgilerinizi güncelleyin</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  {isEditing ? 'İptal' : 'Düzenle'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userProfile.photoUrl} />
                  <AvatarFallback className="text-lg">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{userProfile.name}</h3>
                  <p className="text-gray-600">{userProfile.email}</p>
                  {!isEditing && (
                    <Button variant="outline" size="sm" className="mt-2">
                      <Camera className="h-4 w-4 mr-2" />
                      Fotoğraf Değiştir
                    </Button>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input
                    id="name"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Doğum Tarihi</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={userProfile.birthDate}
                    onChange={(e) => setUserProfile({...userProfile, birthDate: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Adres</Label>
                  <Textarea
                    id="address"
                    value={userProfile.address}
                    onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                    disabled={!isEditing}
                    rows={2}
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold mb-4">Acil Durum İletişim</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Ad Soyad</Label>
                    <Input
                      id="emergencyName"
                      value={userProfile.emergencyContact.name}
                      onChange={(e) => setUserProfile({
                        ...userProfile, 
                        emergencyContact: {...userProfile.emergencyContact, name: e.target.value}
                      })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Telefon</Label>
                    <Input
                      id="emergencyPhone"
                      value={userProfile.emergencyContact.phone}
                      onChange={(e) => setUserProfile({
                        ...userProfile, 
                        emergencyContact: {...userProfile.emergencyContact, phone: e.target.value}
                      })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship">İlişki</Label>
                    <Input
                      id="relationship"
                      value={userProfile.emergencyContact.relationship}
                      onChange={(e) => setUserProfile({
                        ...userProfile, 
                        emergencyContact: {...userProfile.emergencyContact, relationship: e.target.value}
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleProfileSave} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Kaydet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Children Tab */}
        <TabsContent value="children" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Çocuk Profilleri</CardTitle>
                  <CardDescription>Çocuk profillerini yönetin</CardDescription>
                </div>
                <Button onClick={() => openChildForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Çocuk
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Çocuklar yükleniyor...</p>
                </div>
              ) : children.length === 0 ? (
                <div className="text-center py-8">
                  <Baby className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Henüz çocuk profili eklenmemiş.</p>
                  <Button onClick={() => openChildForm()} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    İlk Çocuğu Ekle
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {children.map((child) => (
                    <Card key={child.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={child.photoUrl} />
                              <AvatarFallback>
                                {child.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{child.name}</h4>
                              <p className="text-sm text-gray-600">
                                {calculateAge(child.birthDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openChildForm(child)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleChildDelete(child.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cinsiyet:</span>
                            <span>{child.gender === 'male' ? 'Erkek' : 'Kız'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Kilo:</span>
                            <span>{child.weight} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Boy:</span>
                            <span>{child.height} cm</span>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button
                            size="sm"
                            variant={selectedChild?.id === child.id ? "default" : "outline"}
                            onClick={() => handleChildSelect(child)}
                            className="flex-1"
                          >
                            {selectedChild?.id === child.id ? 'Aktif' : 'Seç'}
                          </Button>
                        </div>

                        {selectedChild?.id === child.id && (
                          <Badge className="absolute top-2 right-2 bg-green-100 text-green-800">
                            Aktif
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification Settings */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Bildirim Ayarları
                </CardTitle>
                <CardDescription>Bildirim tercihlerinizi yönetin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">İlaç Hatırlatıcıları</p>
                    <p className="text-sm text-gray-600">İlaç saatlerinde bildirim al</p>
                  </div>
                  <Button variant="outline" size="sm">Açık</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Doktor Randevuları</p>
                    <p className="text-sm text-gray-600">Randevu öncesi hatırlatma</p>
                  </div>
                  <Button variant="outline" size="sm">Açık</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Günlük Özet</p>
                    <p className="text-sm text-gray-600">Günlük aktivite özeti</p>
                  </div>
                  <Button variant="outline" size="sm">Kapalı</Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Gizlilik & Güvenlik
                </CardTitle>
                <CardDescription>Hesap güvenlik ayarları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">İki Faktörlü Doğrulama</p>
                    <p className="text-sm text-gray-600">Hesabınızı koruyun</p>
                  </div>
                  <Button variant="outline" size="sm">Aktif</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Otomatik Çıkış</p>
                    <p className="text-sm text-gray-600">30 dakika hareketsizlik</p>
                  </div>
                  <Button variant="outline" size="sm">Açık</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Veri Yedekleme</p>
                    <p className="text-sm text-gray-600">Otomatik yedekleme</p>
                  </div>
                  <Button variant="outline" size="sm">Açık</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Actions */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Hesap İşlemleri</CardTitle>
              <CardDescription>Hesap yönetimi işlemleri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                E-posta Değiştir
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Şifre Değiştir
              </Button>
              
              <Button variant="outline" className="w-full justify-start text-orange-600">
                <Users className="h-4 w-4 mr-2" />
                Aile Üyelerini Yönet
              </Button>
              
              <Button variant="outline" className="w-full justify-start text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış Yap
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Child Form Modal */}
      {showChildForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-5 w-5" />
                {editingChild ? 'Çocuk Profilini Düzenle' : 'Yeni Çocuk Profili'}
              </CardTitle>
              <CardDescription>
                Çocuk bilgilerini detaylı olarak girin
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleChildSave(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="childName">Ad Soyad</Label>
                    <Input
                      id="childName"
                      value={childFormData.name}
                      onChange={(e) => setChildFormData({...childFormData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="childBirthDate">Doğum Tarihi</Label>
                    <Input
                      id="childBirthDate"
                      type="date"
                      value={childFormData.birthDate}
                      onChange={(e) => setChildFormData({...childFormData, birthDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="childGender">Cinsiyet</Label>
                    <Select value={childFormData.gender} onValueChange={(value) => setChildFormData({...childFormData, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Cinsiyet seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Erkek</SelectItem>
                        <SelectItem value="female">Kız</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="childWeight">Kilo (kg)</Label>
                    <Input
                      id="childWeight"
                      type="number"
                      step="0.1"
                      value={childFormData.weight}
                      onChange={(e) => setChildFormData({...childFormData, weight: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="childHeight">Boy (cm)</Label>
                    <Input
                      id="childHeight"
                      type="number"
                      value={childFormData.height}
                      onChange={(e) => setChildFormData({...childFormData, height: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="childAllergies">Alerjiler</Label>
                  <Textarea
                    id="childAllergies"
                    placeholder="Bilinen alerjiler..."
                    value={childFormData.allergies}
                    onChange={(e) => setChildFormData({...childFormData, allergies: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="childMedications">Kullandığı İlaçlar</Label>
                  <Textarea
                    id="childMedications"
                    placeholder="Düzenli kullandığı ilaçlar..."
                    value={childFormData.medications}
                    onChange={(e) => setChildFormData({...childFormData, medications: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="childConditions">Sağlık Durumu</Label>
                  <Textarea
                    id="childConditions"
                    placeholder="Özel sağlık durumları..."
                    value={childFormData.conditions}
                    onChange={(e) => setChildFormData({...childFormData, conditions: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="childNotes">Notlar</Label>
                  <Textarea
                    id="childNotes"
                    placeholder="Ek notlar..."
                    value={childFormData.notes}
                    onChange={(e) => setChildFormData({...childFormData, notes: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetChildForm} 
                    className="flex-1"
                  >
                    İptal
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                  >
                    {editingChild ? 'Güncelle' : 'Kaydet'}
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

export default Profile; 