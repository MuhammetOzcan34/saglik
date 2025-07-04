import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  Check, 
  X, 
  Trash2, 
  Filter,
  Search,
  Clock,
  AlertTriangle,
  Heart,
  Pill,
  Thermometer,
  Calendar,
  Baby,
  Settings,
  MoreVertical
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'medication' | 'appointment' | 'temperature' | 'routine' | 'growth' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
  action?: string;
  childId?: string;
  childName?: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const { toast } = useToast();

  useEffect(() => {
    // Load notifications from localStorage or create sample data
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      // Create sample notifications
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          type: 'medication',
          title: 'İlaç Hatırlatıcısı',
          message: 'Ahmet için sabah ilacı zamanı geldi',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          isRead: false,
          isImportant: true,
          action: 'İlacı ver',
          childId: '1',
          childName: 'Ahmet'
        },
        {
          id: '2',
          type: 'appointment',
          title: 'Doktor Randevusu',
          message: 'Yarın saat 14:00\'da Dr. Ayşe ile randevunuz var',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          isRead: false,
          isImportant: true,
          action: 'Detayları gör',
          childId: '1',
          childName: 'Ahmet'
        },
        {
          id: '3',
          type: 'temperature',
          title: 'Ateş Uyarısı',
          message: 'Ahmet\'in ateşi 38.5°C - kontrol edilmesi gerekiyor',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          isRead: true,
          isImportant: true,
          action: 'Ölçüm yap',
          childId: '1',
          childName: 'Ahmet'
        },
        {
          id: '4',
          type: 'routine',
          title: 'Günlük Rutin',
          message: 'Günlük rutin kayıtları eksik - tamamlamayı unutmayın',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          isRead: true,
          isImportant: false,
          action: 'Rutin ekle'
        },
        {
          id: '5',
          type: 'growth',
          title: 'Gelişim Takibi',
          message: 'Bu hafta gelişim ölçümü yapılması gerekiyor',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          isRead: true,
          isImportant: false,
          action: 'Ölçüm yap',
          childId: '1',
          childName: 'Ahmet'
        },
        {
          id: '6',
          type: 'system',
          title: 'Sistem Güncellemesi',
          message: 'Uygulama yeni özelliklerle güncellendi',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          isRead: true,
          isImportant: false,
          action: 'Güncellemeleri gör'
        }
      ];
      setNotifications(sampleNotifications);
      localStorage.setItem('notifications', JSON.stringify(sampleNotifications));
    }
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'important') return notification.isImportant;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const importantCount = notifications.filter(n => n.isImportant).length;

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    toast({
      title: "Bildirim okundu",
      description: "Bildirim okundu olarak işaretlendi.",
    });
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    toast({
      title: "Tüm bildirimler okundu",
      description: "Tüm bildirimler okundu olarak işaretlendi.",
    });
  };

  const deleteNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    toast({
      title: "Bildirim silindi",
      description: "Bildirim başarıyla silindi.",
    });
  };

  const clearAllNotifications = () => {
    if (!confirm('Tüm bildirimleri silmek istediğinizden emin misiniz?')) return;
    
    setNotifications([]);
    localStorage.setItem('notifications', JSON.stringify([]));
    
    toast({
      title: "Tüm bildirimler silindi",
      description: "Tüm bildirimler başarıyla silindi.",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill className="h-5 w-5 text-blue-600" />;
      case 'appointment':
        return <Calendar className="h-5 w-5 text-green-600" />;
      case 'temperature':
        return <Thermometer className="h-5 w-5 text-red-600" />;
      case 'routine':
        return <Heart className="h-5 w-5 text-purple-600" />;
      case 'growth':
        return <Baby className="h-5 w-5 text-orange-600" />;
      case 'system':
        return <Settings className="h-5 w-5 text-gray-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'medication':
        return 'bg-blue-50 border-blue-200';
      case 'appointment':
        return 'bg-green-50 border-green-200';
      case 'temperature':
        return 'bg-red-50 border-red-200';
      case 'routine':
        return 'bg-purple-50 border-purple-200';
      case 'growth':
        return 'bg-orange-50 border-orange-200';
      case 'system':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Az önce';
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} gün önce`;
    
    return notificationTime.toLocaleDateString('tr-TR');
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bildirimler</h1>
          <p className="text-gray-600">Tüm bildirimlerinizi yönetin</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="h-4 w-4 mr-2" />
            Tümünü Okundu İşaretle
          </Button>
          <Button variant="outline" onClick={clearAllNotifications} disabled={notifications.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            Tümünü Sil
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Okunmamış</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Önemli</p>
                <p className="text-2xl font-bold">{importantCount}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bildirimler</CardTitle>
              <CardDescription>Son bildirimleriniz</CardDescription>
            </div>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
              <TabsList>
                <TabsTrigger value="all">Tümü ({notifications.length})</TabsTrigger>
                <TabsTrigger value="unread">Okunmamış ({unreadCount})</TabsTrigger>
                <TabsTrigger value="important">Önemli ({importantCount})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {filter === 'all' ? 'Henüz bildirim bulunmuyor.' : 
                 filter === 'unread' ? 'Okunmamış bildirim bulunmuyor.' : 
                 'Önemli bildirim bulunmuyor.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    getNotificationColor(notification.type)
                  } ${!notification.isRead ? 'ring-2 ring-blue-200' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {notification.title}
                            </h4>
                            {notification.isImportant && (
                              <Badge variant="destructive" className="text-xs">
                                Önemli
                              </Badge>
                            )}
                            {!notification.isRead && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                Yeni
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-2">
                            {notification.message}
                          </p>
                          
                          {notification.childName && (
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {notification.childName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-500">
                                {notification.childName}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            
                            {notification.action && (
                              <Button size="sm" variant="outline" className="h-6 text-xs">
                                {notification.action}
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications; 