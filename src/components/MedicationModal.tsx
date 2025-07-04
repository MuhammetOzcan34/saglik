
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PillIcon, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
}

const MedicationModal = ({ isOpen, onClose, childId }: MedicationModalProps) => {
  const [medicationName, setMedicationName] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medicationName && dose && time) {
      const medicationData = {
        id: Date.now().toString(),
        childId,
        medicationName,
        dose,
        time,
        notes,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };
      
      const existingMedications = JSON.parse(localStorage.getItem('medicationRecords') || '[]');
      existingMedications.push(medicationData);
      localStorage.setItem('medicationRecords', JSON.stringify(existingMedications));
      
      toast({
        title: "İlaç kaydedildi!",
        description: `${medicationName} başarıyla kaydedildi.`,
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
            <PillIcon className="h-5 w-5" />
            İlaç Takibi
          </CardTitle>
          <CardDescription>
            Verilen ilacı kaydedin
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medicationName">İlaç Adı</Label>
              <Input
                id="medicationName"
                placeholder="Örn: Paracetamol, Antibiyotik"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dose">Doz</Label>
              <Input
                id="dose"
                placeholder="Örn: 5ml, 1 tablet, 2 damla"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Verilme Saati</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notlar</Label>
              <Textarea
                id="notes"
                placeholder="Çocuğun reaksiyonu, özel durumlar..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                İptal
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Kaydet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationModal;
