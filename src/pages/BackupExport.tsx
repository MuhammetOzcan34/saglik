import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '../lib/utils';

export const BackupExport = () => {
  const exportAllData = async () => {
    const tables = ['children', 'growth_records', 'test_results', 'medication_records', 'nutrition_records', 'routines', 'moods'];
    const allData: Record<string, any> = {};
    for (const table of tables) {
      const { data } = await supabase.from(table).select('*');
      allData[table] = data;
    }
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saglik_takip_yedek.json';
    a.click();
  };
  return <Button onClick={exportAllData}>Tüm Verileri İndir (JSON)</Button>;
}; 