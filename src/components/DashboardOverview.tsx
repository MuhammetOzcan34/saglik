
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, User, Calendar, Baby } from 'lucide-react';

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

interface DashboardOverviewProps {
  selectedChild: Child | null;
  onAddChild: () => void;
  onChangeChild: () => void;
}

const DashboardOverview = ({ selectedChild, onAddChild, onChangeChild }: DashboardOverviewProps) => {
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
    <div className="mb-8">
      {/* Child Selection */}
      <Card className="mb-6 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Aktif Çocuk Profili</CardTitle>
              <CardDescription>
                Takip etmek istediğiniz çocuğu seçin
              </CardDescription>
            </div>
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={onAddChild}>
              <Plus className="h-4 w-4 mr-1" />
              Çocuk Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedChild ? (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Baby className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{selectedChild.name}</h3>
                    <p className="text-sm text-gray-600">
                      {calculateAge(selectedChild.birthDate)} • {selectedChild.gender === 'erkek' ? 'Erkek' : 'Kız'}
                    </p>
                    {selectedChild.weight && selectedChild.height && (
                      <p className="text-xs text-gray-500">
                        {selectedChild.weight} kg • {selectedChild.height} cm
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={onChangeChild}>
                  Değiştir
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-dashed border-blue-200">
              <div className="text-center">
                <User className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-3">
                  Henüz çocuk profili eklenmemiş
                </p>
                <Button variant="outline" size="sm" onClick={onAddChild}>
                  İlk Çocuk Profilini Ekle
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Bugünkü İlaçlar</p>
                <p className="text-2xl font-bold">0/0</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Öğün Sayısı</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Son Ateş</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
