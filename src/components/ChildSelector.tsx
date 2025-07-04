
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Baby, Plus, User } from 'lucide-react';

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

interface ChildSelectorProps {
  children: Child[];
  onChildSelect: (child: Child) => void;
  onAddChild: () => void;
}

const ChildSelector = ({ children, onChildSelect, onAddChild }: ChildSelectorProps) => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Çocuk Seçimi
          </h1>
          <p className="text-gray-600">
            Takip etmek istediğiniz çocuğu seçin veya yeni profil oluşturun
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {children.map((child) => (
            <Card 
              key={child.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow bg-white/90 backdrop-blur-sm"
              onClick={() => onChildSelect(child)}
            >
              <CardHeader className="text-center pb-3">
                <div className="mx-auto mb-3 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Baby className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{child.name}</CardTitle>
                <CardDescription>
                  {calculateAge(child.birthDate)} • {child.gender === 'erkek' ? 'Erkek' : 'Kız'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-gray-600">
                  {child.weight && (
                    <p><strong>Kilo:</strong> {child.weight} kg</p>
                  )}
                  {child.height && (
                    <p><strong>Boy:</strong> {child.height} cm</p>
                  )}
                  {child.conditions && (
                    <p><strong>Durumlar:</strong> {child.conditions.substring(0, 50)}...</p>
                  )}
                </div>
                
                <Button 
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChildSelect(child);
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Bu Çocuğu Seç
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Yeni çocuk ekleme kartı */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow bg-white/90 backdrop-blur-sm border-dashed border-2 border-gray-300"
            onClick={onAddChild}
          >
            <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl mb-2">Yeni Çocuk Ekle</CardTitle>
              <CardDescription className="mb-4">
                Yeni bir çocuk profili oluşturun
              </CardDescription>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Profil Oluştur
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChildSelector;
