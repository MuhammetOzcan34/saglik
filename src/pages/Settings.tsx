import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Upload, 
  Trash2, 
  User, 
  Lock, 
  Eye, 
  Moon, 
  Sun,
  Smartphone,
  Monitor,
  Database,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [settings, setSettings] = useState({
    // Notification Settings
    medicationReminders: true,
    appointmentReminders: true,
    dailySummary: false,
    weeklyReport: true,
    emergencyAlerts: true,
    
    // Privacy Settings
    twoFactorAuth: true,
    autoLogout: true,
    autoLogoutTime: '30',
    dataBackup: true,
    analytics: false,
    
    // Display Settings
    theme: 'light',
    language: 'tr',
    fontSize: 'medium',
    compactMode: false,
    
    // Data Settings
    autoSync: true,
    syncInterval: '15',
    dataRetention: '1_year',
    exportFormat: 'json'
  });

  const { toast } = useToast();

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Ayar güncellendi",
      description: `${key} ayarı başarıyla güncellendi.`,
    });
  };

  const exportData = () => {
    // Simulate data export
    const data = {
      children: JSON.parse(localStorage.getItem('childrenData') || '[]'),
      nutritionRecords: JSON.parse(localStorage.getItem('nutritionRecords') || '[]'),
      medicationRecords: JSON.parse(localStorage.getItem('medicationRecords') || '[]'),
      temperatureRecords: JSON.parse(localStorage.getItem('temperatureRecords') || '[]'),
      dailyRoutines: JSON.parse(localStorage.getItem('dailyRoutines') || '[]'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saglik-takipci-veri-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Veri dışa aktarıldı",
      description: "Tüm verileriniz başarıyla dışa aktarıldı.",
    });
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            // Import data to localStorage
            if (data.children) localStorage.setItem('childrenData', JSON.stringify(data.children));
            if (data.nutritionRecords) localStorage.setItem('nutritionRecords', JSON.stringify(data.nutritionRecords));
            if (data.medicationRecords) localStorage.setItem('medicationRecords', JSON.stringify(data.medicationRecords));
            if (data.temperatureRecords) localStorage.setItem('temperatureRecords', JSON.stringify(data.temperatureRecords));
            if (data.dailyRoutines) localStorage.setItem('dailyRoutines', JSON.stringify(data.dailyRoutines));
            
            toast({
              title: "Veri içe aktarıldı",
              description: "Verileriniz başarıyla içe aktarıldı.",
            });
          } catch (error) {
            toast({
              title: "Hata",
              description: "Veri dosyası okunamadı.",
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const clearAllData = () => {
    if (!confirm('Tüm verilerinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) return;
    
    localStorage.clear();
    toast({
      title: "Veriler silindi",
      description: "Tüm verileriniz başarıyla silindi.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ayarlar</h1>
          <p className="text-gray-600">Uygulama ayarlarınızı özelleştirin</p>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Bildirimler
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Gizlilik
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Görünüm
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Veri
          </TabsTrigger>
        </TabsList>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Bildirim Ayarları
              </CardTitle>
              <CardDescription>
                Hangi bildirimleri almak istediğinizi seçin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="medication-reminders" className="text-base font-medium">
                      İlaç Hatırlatıcıları
                    </Label>
                    <p className="text-sm text-gray-600">
                      İlaç saatlerinde bildirim al
                    </p>
                  </div>
                  <Switch
                    id="medication-reminders"
                    checked={settings.medicationReminders}
                    onCheckedChange={(checked) => handleSettingChange('medicationReminders', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="appointment-reminders" className="text-base font-medium">
                      Doktor Randevuları
                    </Label>
                    <p className="text-sm text-gray-600">
                      Randevu öncesi hatırlatma
                    </p>
                  </div>
                  <Switch
                    id="appointment-reminders"
                    checked={settings.appointmentReminders}
                    onCheckedChange={(checked) => handleSettingChange('appointmentReminders', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-summary" className="text-base font-medium">
                      Günlük Özet
                    </Label>
                    <p className="text-sm text-gray-600">
                      Günlük aktivite özeti
                    </p>
                  </div>
                  <Switch
                    id="daily-summary"
                    checked={settings.dailySummary}
                    onCheckedChange={(checked) => handleSettingChange('dailySummary', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-report" className="text-base font-medium">
                      Haftalık Rapor
                    </Label>
                    <p className="text-sm text-gray-600">
                      Haftalık sağlık raporu
                    </p>
                  </div>
                  <Switch
                    id="weekly-report"
                    checked={settings.weeklyReport}
                    onCheckedChange={(checked) => handleSettingChange('weeklyReport', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emergency-alerts" className="text-base font-medium">
                      Acil Durum Uyarıları
                    </Label>
                    <p className="text-sm text-gray-600">
                      Yüksek ateş, alerji vb. durumlar
                    </p>
                  </div>
                  <Switch
                    id="emergency-alerts"
                    checked={settings.emergencyAlerts}
                    onCheckedChange={(checked) => handleSettingChange('emergencyAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Gizlilik & Güvenlik
              </CardTitle>
              <CardDescription>
                Hesap güvenlik ayarlarınızı yönetin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor-auth" className="text-base font-medium">
                      İki Faktörlü Doğrulama
                    </Label>
                    <p className="text-sm text-gray-600">
                      Hesabınızı ekstra güvenlikle koruyun
                    </p>
                  </div>
                  <Switch
                    id="two-factor-auth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-logout" className="text-base font-medium">
                      Otomatik Çıkış
                    </Label>
                    <p className="text-sm text-gray-600">
                      Hareketsizlik sonrası otomatik çıkış
                    </p>
                  </div>
                  <Switch
                    id="auto-logout"
                    checked={settings.autoLogout}
                    onCheckedChange={(checked) => handleSettingChange('autoLogout', checked)}
                  />
                </div>

                {settings.autoLogout && (
                  <div className="ml-6">
                    <Label htmlFor="auto-logout-time">Çıkış Süresi</Label>
                    <Select 
                      value={settings.autoLogoutTime} 
                      onValueChange={(value) => handleSettingChange('autoLogoutTime', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 dakika</SelectItem>
                        <SelectItem value="30">30 dakika</SelectItem>
                        <SelectItem value="60">1 saat</SelectItem>
                        <SelectItem value="120">2 saat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-backup" className="text-base font-medium">
                      Otomatik Yedekleme
                    </Label>
                    <p className="text-sm text-gray-600">
                      Verilerinizi otomatik olarak yedekleyin
                    </p>
                  </div>
                  <Switch
                    id="data-backup"
                    checked={settings.dataBackup}
                    onCheckedChange={(checked) => handleSettingChange('dataBackup', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics" className="text-base font-medium">
                      Analitik Veriler
                    </Label>
                    <p className="text-sm text-gray-600">
                      Kullanım istatistiklerini paylaş
                    </p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={settings.analytics}
                    onCheckedChange={(checked) => handleSettingChange('analytics', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Görünüm Ayarları
              </CardTitle>
              <CardDescription>
                Uygulama görünümünü özelleştirin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme">Tema</Label>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value) => handleSettingChange('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Açık
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Koyu
                        </div>
                      </SelectItem>
                      <SelectItem value="auto">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          Otomatik
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="language">Dil</Label>
                  <Select 
                    value={settings.language} 
                    onValueChange={(value) => handleSettingChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tr">Türkçe</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="font-size">Yazı Boyutu</Label>
                  <Select 
                    value={settings.fontSize} 
                    onValueChange={(value) => handleSettingChange('fontSize', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Küçük</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="large">Büyük</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-mode" className="text-base font-medium">
                      Kompakt Mod
                    </Label>
                    <p className="text-sm text-gray-600">
                      Daha az boşluklu görünüm
                    </p>
                  </div>
                  <Switch
                    id="compact-mode"
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Settings */}
        <TabsContent value="data" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data Management */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Veri Yönetimi
                </CardTitle>
                <CardDescription>
                  Verilerinizi yedekleyin ve yönetin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-sync" className="text-base font-medium">
                        Otomatik Senkronizasyon
                      </Label>
                      <p className="text-sm text-gray-600">
                        Verileri otomatik olarak senkronize et
                      </p>
                    </div>
                    <Switch
                      id="auto-sync"
                      checked={settings.autoSync}
                      onCheckedChange={(checked) => handleSettingChange('autoSync', checked)}
                    />
                  </div>

                  {settings.autoSync && (
                    <div>
                      <Label htmlFor="sync-interval">Senkronizasyon Aralığı</Label>
                      <Select 
                        value={settings.syncInterval} 
                        onValueChange={(value) => handleSettingChange('syncInterval', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 dakika</SelectItem>
                          <SelectItem value="15">15 dakika</SelectItem>
                          <SelectItem value="30">30 dakika</SelectItem>
                          <SelectItem value="60">1 saat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="data-retention">Veri Saklama Süresi</Label>
                    <Select 
                      value={settings.dataRetention} 
                      onValueChange={(value) => handleSettingChange('dataRetention', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6_months">6 ay</SelectItem>
                        <SelectItem value="1_year">1 yıl</SelectItem>
                        <SelectItem value="2_years">2 yıl</SelectItem>
                        <SelectItem value="forever">Süresiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Actions */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Veri İşlemleri</CardTitle>
                <CardDescription>
                  Verilerinizi dışa aktarın veya içe aktarın
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={exportData} className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Verileri Dışa Aktar
                </Button>
                
                <Button onClick={importData} className="w-full" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Verileri İçe Aktar
                </Button>
                
                <Button onClick={clearAllData} className="w-full" variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Tüm Verileri Sil
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* System Info */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Sistem Bilgileri</CardTitle>
              <CardDescription>
                Uygulama ve sistem bilgileri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Uygulama Versiyonu:</span>
                  <span>1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Son Güncelleme:</span>
                  <span>2024-01-15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam Veri:</span>
                  <span>2.5 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Çocuk Sayısı:</span>
                  <span>{JSON.parse(localStorage.getItem('childrenData') || '[]').length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings; 