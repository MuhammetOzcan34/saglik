import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, User, Calendar, Heart, PillIcon, ThermometerIcon, LogOut, Coffee } from 'lucide-react';
import { SidebarProvider } from "@/components/ui/sidebar";
import FamilySetup from '@/components/FamilySetup';
import DashboardOverview from '@/components/DashboardOverview';
import LoginPage from '@/pages/LoginPage';
import ChildForm from '@/components/ChildForm';
import ChildSelector from '@/components/ChildSelector';
import AppSidebar from '@/components/AppSidebar';
import MobileNavigation from '@/components/MobileNavigation';
import DailyRoutineModal from '@/components/DailyRoutineModal';
import NutritionModal from '@/components/NutritionModal';
import MedicationModal from '@/components/MedicationModal';
import TemperatureModal from '@/components/TemperatureModal';
import { useToast } from "@/hooks/use-toast";
import Reports from './Reports';
import CalendarPage from './Calendar';
import Growth from './Growth';
import Doctor from './Doctor';
import Tests from './Tests';
import Allergy from './Allergy';
import Activity from './Activity';
import Seizure from './Seizure';
import DailyRoutine from './DailyRoutine';
import Nutrition from './Nutrition';
import Medication from './Medication';
import Temperature from './Temperature';
import Profile from './Profile';
import Notifications from './Notifications';
import Settings from './Settings';

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
}

const Index = () => {
  const [user, setUser] = useState(null);
  const [hasFamily, setHasFamily] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showChildForm, setShowChildForm] = useState(false);
  
  // Modal states
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [showTemperatureModal, setShowTemperatureModal] = useState(false);
  
  // Page navigation state
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const { toast } = useToast();

  // Uygulama başladığında localStorage'dan çocuk bilgisini yükle
  useEffect(() => {
    const savedChild = localStorage.getItem('selectedChild');
    if (savedChild) {
      setSelectedChild(JSON.parse(savedChild));
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    // Simulated data - check if user has family
    const hasExistingFamily = localStorage.getItem('familyData');
    if (hasExistingFamily) {
      setHasFamily(true);
      // Load existing children
      const existingChildren = localStorage.getItem('childrenData');
      if (existingChildren) {
        setChildren(JSON.parse(existingChildren));
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setHasFamily(false);
    setChildren([]);
    setSelectedChild(null);
    localStorage.removeItem('selectedChild');
    toast({
      title: "Çıkış yapıldı",
      description: "Güvenli bir şekilde çıkış yaptınız.",
    });
  };

  const handleFamilyCreated = (familyData: any) => {
    setHasFamily(true);
    localStorage.setItem('familyData', JSON.stringify(familyData));
    toast({
      title: "Aile başarıyla oluşturuldu!",
      description: "Artık çocuk profilleri ekleyebilirsiniz.",
    });
  };

  const handleChildAdded = (child: Child) => {
    const updatedChildren = [...children, child];
    setChildren(updatedChildren);
    localStorage.setItem('childrenData', JSON.stringify(updatedChildren));
    setShowChildForm(false);
    setSelectedChild(child);
    localStorage.setItem('selectedChild', JSON.stringify(child));
  };

  const handleChildSelect = (child: Child) => {
    setSelectedChild(child);
    localStorage.setItem('selectedChild', JSON.stringify(child));
  };

  const handleAddChild = () => {
    setShowChildForm(true);
  };

  const handleOpenModal = (modalType: string) => {
    switch (modalType) {
      case 'routine':
        setShowRoutineModal(true);
        break;
      case 'nutrition':
        setShowNutritionModal(true);
        break;
      case 'medication':
        setShowMedicationModal(true);
        break;
      case 'temperature':
        setShowTemperatureModal(true);
        break;
    }
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  // Login sayfasını göster
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Aile kurulumu
  if (!hasFamily) {
    return <FamilySetup onFamilyCreated={handleFamilyCreated} />;
  }

  // Çocuk ekleme formu
  if (showChildForm) {
    return (
      <ChildForm 
        onChildAdded={handleChildAdded}
        onCancel={() => setShowChildForm(false)}
      />
    );
  }

  // Çocuk seçimi
  if (!selectedChild) {
    return (
      <div>
        {/* Üst bar */}
        <div className="bg-white shadow-sm border-b px-4 py-3">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Çocuk Sağlığı Takip
            </h1>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış
            </Button>
          </div>
        </div>
        
        <ChildSelector 
          children={children}
          onChildSelect={handleChildSelect}
          onAddChild={handleAddChild}
        />
      </div>
    );
  }

  // Ana dashboard
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-green-50">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AppSidebar 
            selectedChild={selectedChild}
            onChangeChild={() => {
              setSelectedChild(null);
              localStorage.removeItem('selectedChild');
            }}
            onLogout={handleLogout}
            onOpenModal={handleOpenModal}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="md:hidden bg-white shadow-sm border-b px-4 py-3">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                {selectedChild.name} - Sağlık Takibi
              </h1>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-6 max-w-6xl pb-20 md:pb-6">
              {/* Desktop Header */}
              <div className="hidden md:flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {selectedChild.name} - Sağlık Takibi
                  </h1>
                  <p className="text-gray-600">
                    Çocuğunuzun sağlığını ve gelişimini takip edin
                  </p>
                </div>
              </div>

              {/* Page Content */}
              {currentPage === 'dashboard' && (
                <>
                  <DashboardOverview 
                    selectedChild={selectedChild}
                    onAddChild={handleAddChild}
                    onChangeChild={() => {
                      setSelectedChild(null);
                      localStorage.removeItem('selectedChild');
                    }}
                  />

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm"
                      onClick={() => setShowRoutineModal(true)}
                    >
                      <CardContent className="p-4 text-center">
                        <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <p className="text-sm font-medium">Günlük Rutin</p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm"
                      onClick={() => setShowMedicationModal(true)}
                    >
                      <CardContent className="p-4 text-center">
                        <PillIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm font-medium">İlaç Takibi</p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm"
                      onClick={() => setShowTemperatureModal(true)}
                    >
                      <CardContent className="p-4 text-center">
                        <ThermometerIcon className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                        <p className="text-sm font-medium">Ateş Ölçümü</p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm"
                      onClick={() => setShowNutritionModal(true)}
                    >
                      <CardContent className="p-4 text-center">
                        <Coffee className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm font-medium">Beslenme</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activities */}
                  <Card className="mb-6 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Son Aktiviteler</CardTitle>
                      <CardDescription>
                        Bugünün önemli kayıtları
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">Sabah ilacı verildi</span>
                          </div>
                          <span className="text-xs text-gray-500">08:30</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Kahvaltı yapıldı</span>
                          </div>
                          <span className="text-xs text-gray-500">09:15</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm">Ateş ölçüldü: 36.8°C</span>
                          </div>
                          <span className="text-xs text-gray-500">10:00</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {currentPage === 'reports' && <Reports />}
              {currentPage === 'calendar' && <CalendarPage />}
              {currentPage === 'growth' && <Growth />}
              {currentPage === 'doctor' && <Doctor />}
              {currentPage === 'tests' && <Tests />}
              {currentPage === 'allergy' && <Allergy />}
              {currentPage === 'activity' && <Activity />}
              {currentPage === 'seizure' && <Seizure />}
              {currentPage === 'daily-routine' && <DailyRoutine />}
              {currentPage === 'nutrition' && <Nutrition />}
              {currentPage === 'medication' && <Medication />}
              {currentPage === 'temperature' && <Temperature />}
              {currentPage === 'profile' && <Profile />}
              {currentPage === 'notifications' && <Notifications />}
              {currentPage === 'settings' && <Settings />}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation 
          selectedChild={selectedChild}
          onChangeChild={() => {
            setSelectedChild(null);
            localStorage.removeItem('selectedChild');
          }}
          onLogout={handleLogout}
          onOpenModal={handleOpenModal}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

        {/* Modals */}
        {showRoutineModal && (
          <DailyRoutineModal
            isOpen={showRoutineModal}
            onClose={() => setShowRoutineModal(false)}
            childId={selectedChild?.id || ''}
          />
        )}
        
        {showNutritionModal && (
          <NutritionModal
            isOpen={showNutritionModal}
            onClose={() => setShowNutritionModal(false)}
            childId={selectedChild?.id || ''}
          />
        )}
        
        {showMedicationModal && (
          <MedicationModal
            isOpen={showMedicationModal}
            onClose={() => setShowMedicationModal(false)}
            childId={selectedChild?.id || ''}
          />
        )}
        
        {showTemperatureModal && (
          <TemperatureModal
            isOpen={showTemperatureModal}
            onClose={() => setShowTemperatureModal(false)}
            childId={selectedChild?.id || ''}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default Index;
