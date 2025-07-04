
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThermometerIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface TemperatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
}

const TemperatureModal = ({ isOpen, onClose, childId }: TemperatureModalProps) => {
  const [temperature, setTemperature] = useState('');
  const [time, setTime] = useState('');
  const [method, setMethod] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (temperature && time && method) {
      const tempData = {
        id: Date.now().toString(),
        childId,
        temperature: parseFloat(temperature),
        time,
        method,
        symptoms,
        notes,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };
      
      const existingTemps = JSON.parse(localStorage.getItem('temperatureRecords') || '[]');
      existingTemps.push(tempData);
      localStorage.setItem('temperatureRecords', JSON.stringify(existingTemps));
      
      const temp = parseFloat(temperature);
      let message = `Ateş kaydedildi: ${temperature}°C`;
      if (temp >= 38) {
        message += ' - Yüksek ateş!';
      }
      
      toast({
        title: "Ateş ölçümü kaydedildi!",
        description: message,
      });
      
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThermometerIcon className="h-5 w-5" />
            Ateş Ölçümü
          </CardTitle>
          <CardDescription>
            Ölçülen ateş değerini kaydedin
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Ateş (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="Örn: 37.5"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Ölçüm Saati</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Ölçüm Yöntemi</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Ölçüm yöntemi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alın">Alından</SelectItem>
                  <SelectItem value="kulak">Kulaktan</SelectItem>
                  <SelectItem value="ağız">Ağızdan</SelectItem>
                  <SelectItem value="koltukaltı">Koltuk Altından</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptoms">Eşlik Eden Belirtiler</Label>
              <Textarea
                id="symptoms"
                placeholder="Öksürük, baş ağrısı, halsizlik vb..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Ek Notlar</Label>
              <Textarea
                id="notes"
                placeholder="Genel durum, alınan önlemler..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                İptal
              </Button>
              <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
                Kaydet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemperatureModal;
