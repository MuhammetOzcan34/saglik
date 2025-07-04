import React from 'react';
import { Button } from './ui/button';

export const ThemeToggle = () => {
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };
  return <Button onClick={toggleTheme}>Tema Değiştir</Button>;
}; 