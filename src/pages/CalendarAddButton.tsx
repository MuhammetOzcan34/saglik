import React from 'react';
import { Button } from '@/components/ui/button';

function getGoogleCalendarUrl(event: { start: string; end: string; title: string; description?: string; location?: string }) {
  const start = encodeURIComponent(event.start);
  const end = encodeURIComponent(event.end);
  const text = encodeURIComponent(event.title);
  const details = encodeURIComponent(event.description || "");
  const location = encodeURIComponent(event.location || "");
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
}

export const CalendarAddButton = ({ event }: { event: { start: string; end: string; title: string; description?: string; location?: string } }) => (
  <Button asChild>
    <a href={getGoogleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
      Google Takvime Ekle
    </a>
  </Button>
); 