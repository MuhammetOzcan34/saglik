import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Activity, Calendar, Download } from 'lucide-react';
import { supabase } from '../lib/utils';

interface ReportData {
  growth: any[];
  medications: any[];
  nutrition: any[];
  seizures: any[];
  temperatures: any[];
}

const Reports = () => {
  const [reportData, setReportData] = useState<ReportData>({
    growth: [],
    medications: [],
    nutrition: [],
    seizures: [],
    temperatures: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(false);
  const [selectedChild, setSelectedChild] = useState<any>(null);

  useEffect(() => {
    const getSelectedChild = () => {
      const childData = localStorage.getItem('selectedChild');
      if (childData) {
        setSelectedChild(JSON.parse(childData));
      }
    };
    getSelectedChild();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchReportData();
    }
  }, [selectedChild, selectedPeriod]);

  const fetchReportData = async () => {
    if (!selectedChild) return;
    
    setLoading(true);
    try {
      // Calculate date range based on selected period
      const now = new Date();
      let startDate = new Date();
      
      switch (selectedPeriod) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(now.getMonth() - 1);
      }

      const startDateStr = startDate.toISOString().split('T')[0];

      // Fetch all data types
      const [growthData, medicationData, nutritionData, seizureData, temperatureData] = await Promise.all([
        supabase.from('growth_records').select('*').eq('child_id', selectedChild.id).gte('date', startDateStr),
        supabase.from('medication_records').select('*').eq('child_id', selectedChild.id).gte('date', startDateStr),
        supabase.from('nutrition_records').select('*').eq('child_id', selectedChild.id).gte('date', startDateStr),
        supabase.from('seizure_records').select('*').eq('child_id', selectedChild.id).gte('date', startDateStr),
        supabase.from('temperature_records').select('*').eq('child_id', selectedChild.id).gte('date', startDateStr)
      ]);

      setReportData({
        growth: growthData.data || [],
        medications: medicationData.data || [],
        nutrition: nutritionData.data || [],
        seizures: seizureData.data || [],
        temperatures: temperatureData.data || []
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const prepareGrowthChartData = () => {
    return reportData.growth
      .filter(record => record.weight || record.height)
      .map(record => ({
        date: new Date(record.date).toLocaleDateString('tr-TR'),
        weight: record.weight,
        height: record.height
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const prepareMedicationChartData = () => {
    const medicationCounts: { [key: string]: number } = {};
    reportData.medications.forEach(med => {
      const name = med.medication_name || 'Bilinmeyen';
      medicationCounts[name] = (medicationCounts[name] || 0) + 1;
    });
    
    return Object.entries(medicationCounts).map(([name, count]) => ({
      name,
      count
    }));
  };

  const prepareTemperatureChartData = () => {
    return reportData.temperatures
      .map(record => ({
        date: new Date(record.date).toLocaleDateString('tr-TR'),
        temperature: record.temperature
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const prepareSeizureChartData = () => {
    const seizureCounts: { [key: string]: number } = {};
    reportData.seizures.forEach(seizure => {
      const type = seizure.type || 'Bilinmeyen';
      seizureCounts[type] = (seizureCounts[type] || 0) + 1;
    });
    
    return Object.entries(seizureCounts).map(([type, count]) => ({
      type,
      count
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (!selectedChild) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Çocuk Seçilmedi</h3>
            <p className="text-gray-600">Raporlar için önce bir çocuk seçin.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Raporlar & Veri Görselleştirme</h1>
          <p className="text-gray-600">Çocuğunuzun sağlık verilerinin analizi ve grafikleri</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Son 1 Hafta</SelectItem>
              <SelectItem value="month">Son 1 Ay</SelectItem>
              <SelectItem value="quarter">Son 3 Ay</SelectItem>
              <SelectItem value="year">Son 1 Yıl</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            PDF İndir
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gelişim Kayıtları</p>
                <p className="text-2xl font-bold">{reportData.growth.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">İlaç Kayıtları</p>
                <p className="text-2xl font-bold">{reportData.medications.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Atak Kayıtları</p>
                <p className="text-2xl font-bold">{reportData.seizures.length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ateş Ölçümleri</p>
                <p className="text-2xl font-bold">{reportData.temperatures.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        {prepareGrowthChartData().length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Gelişim Takibi</CardTitle>
              <CardDescription>Boy ve kilo değişimi</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={prepareGrowthChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} name="Kilo (kg)" />
                  <Line type="monotone" dataKey="height" stroke="#82ca9d" strokeWidth={2} name="Boy (cm)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Temperature Chart */}
        {prepareTemperatureChartData().length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Ateş Takibi</CardTitle>
              <CardDescription>Ateş değişimi</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={prepareTemperatureChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#ff7300" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Medication Chart */}
        {prepareMedicationChartData().length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>İlaç Kullanımı</CardTitle>
              <CardDescription>İlaç türlerine göre kullanım sıklığı</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prepareMedicationChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Seizure Chart */}
        {prepareSeizureChartData().length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Atak Türleri</CardTitle>
              <CardDescription>Atak türlerine göre dağılım</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={prepareSeizureChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {prepareSeizureChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* No Data Message */}
      {!loading && 
       prepareGrowthChartData().length === 0 && 
       prepareMedicationChartData().length === 0 && 
       prepareTemperatureChartData().length === 0 && 
       prepareSeizureChartData().length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Veri Bulunamadı</h3>
            <p className="text-gray-600">
              Seçilen dönem için rapor verisi bulunmuyor. 
              Önce sağlık kayıtları ekleyin.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Rapor verileri yükleniyor...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports; 