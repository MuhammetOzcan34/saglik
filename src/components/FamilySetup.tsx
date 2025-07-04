
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, User } from 'lucide-react';

interface FamilySetupProps {
  onFamilyCreated: (familyData: any) => void;
}

const FamilySetup = ({ onFamilyCreated }: FamilySetupProps) => {
  const [familyName, setFamilyName] = useState('');
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (familyName && parentName && email) {
      onFamilyCreated({
        familyName,
        parentName,
        email,
        phone,
        createdDate: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-gray-800">
            Aile Profilinizi Oluşturun
          </CardTitle>
          <CardDescription>
            Çocuğunuzun sağlık takibine başlamak için önce aile bilgilerinizi giriniz
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="familyName">Aile Adı</Label>
              <Input
                id="familyName"
                type="text"
                placeholder="Örn: Yılmaz Ailesi"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentName">Ebeveyn Adı</Label>
              <Input
                id="parentName"
                type="text"
                placeholder="Adınız ve soyadınız"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta Adresi</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon Numarası (Opsiyonel)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0555 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Aile Profili Oluştur
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Verileriniz güvenli bir şekilde saklanır ve sadece sizin erişiminizde olur.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilySetup;
