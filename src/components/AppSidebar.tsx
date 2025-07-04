
import { 
  Home, 
  Heart, 
  Calendar, 
  Activity, 
  FileText, 
  User, 
  Settings, 
  LogOut,
  BarChart3,
  TrendingUp,
  Stethoscope,
  FileCheck,
  AlertTriangle,
  Zap,
  Brain,
  Bell
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Child } from '@/types/child';

interface AppSidebarProps {
  selectedChild: Child | null;
  onChangeChild: () => void;
  onLogout: () => void;
  onOpenModal: (modalType: string) => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const AppSidebar = ({ selectedChild, onChangeChild, onLogout, onOpenModal, currentPage, onPageChange }: AppSidebarProps) => {
  const mainMenuItems = [
    {
      title: "Ana Sayfa",
      icon: Home,
      action: () => onPageChange('dashboard'),
      isActive: currentPage === 'dashboard'
    },
    {
      title: "Günlük Rutin",
      icon: Heart,
      action: () => onPageChange('daily-routine'),
      isActive: currentPage === 'daily-routine'
    },
    {
      title: "Beslenme",
      icon: Calendar,
      action: () => onPageChange('nutrition'),
      isActive: currentPage === 'nutrition'
    },
    {
      title: "İlaç Takibi",
      icon: Activity,
      action: () => onPageChange('medication'),
      isActive: currentPage === 'medication'
    },
    {
      title: "Ateş Ölçümü",
      icon: FileText,
      action: () => onPageChange('temperature'),
      isActive: currentPage === 'temperature'
    },
    {
      title: "Gelişim Takibi",
      icon: TrendingUp,
      action: () => onPageChange('growth'),
      isActive: currentPage === 'growth'
    },
    {
      title: "Raporlar",
      icon: BarChart3,
      action: () => onPageChange('reports'),
      isActive: currentPage === 'reports'
    },
    {
      title: "Takvim",
      icon: Calendar,
      action: () => onPageChange('calendar'),
      isActive: currentPage === 'calendar'
    },
    {
      title: "Doktor & Randevular",
      icon: Stethoscope,
      action: () => onPageChange('doctor'),
      isActive: currentPage === 'doctor'
    },
    {
      title: "Test Sonuçları",
      icon: FileCheck,
      action: () => onPageChange('tests'),
      isActive: currentPage === 'tests'
    },
    {
      title: "Alerjiler",
      icon: AlertTriangle,
      action: () => onPageChange('allergy'),
      isActive: currentPage === 'allergy'
    },
    {
      title: "Fiziksel Aktivite",
      icon: Zap,
      action: () => onPageChange('activity'),
      isActive: currentPage === 'activity'
    },
    {
      title: "Epilepsi Atakları",
      icon: Brain,
      action: () => onPageChange('seizure'),
      isActive: currentPage === 'seizure'
    }
  ];

  const settingsItems = [
    {
      title: "Profil",
      icon: User,
      action: () => onPageChange('profile'),
      isActive: currentPage === 'profile'
    },
    {
      title: "Bildirimler",
      icon: Bell,
      action: () => onPageChange('notifications'),
      isActive: currentPage === 'notifications'
    },
    {
      title: "Ayarlar",
      icon: Settings,
      action: () => onPageChange('settings'),
      isActive: currentPage === 'settings'
    },
    {
      title: "Çocuk Değiştir",
      icon: User,
      action: onChangeChild
    }
  ];

  return (
    <Sidebar className="w-64 border-r bg-white">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Heart className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Sağlık Takibi</h2>
            {selectedChild && (
              <p className="text-sm text-gray-600">{selectedChild.name}</p>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
            Ana Menü
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={item.action}
                    isActive={item.isActive}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
            Profil & Ayarlar
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={item.action}
                    isActive={item.isActive}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t">
        <Button 
          variant="ghost" 
          onClick={onLogout}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Çıkış Yap
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
