import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';
import { HabitLog } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency in Indian Rupees (INR)
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Get current date string formatted as YYYY-MM-DD in Asia/Kolkata timezone
export function getTodayDateString(): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  const parts = new Intl.DateTimeFormat('en-CA', options).formatToParts(new Date());
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  return `${year}-${month}-${day}`;
}

// Format date nicely (e.g. 'Fri, 14 Nov 2026')
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  }).format(date);
}

// Dynamic greeting based on current hour in Asia/Kolkata
export function getGreeting(): string {
  const now = new Date();
  const kolkataHour = parseInt(
    new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'Asia/Kolkata'
    }).format(now),
    10
  );

  if (kolkataHour >= 4 && kolkataHour < 12) {
    return 'Good Morning';
  } else if (kolkataHour >= 12 && kolkataHour < 17) {
    return 'Good Afternoon';
  } else if (kolkataHour >= 17 && kolkataHour < 22) {
    return 'Good Evening';
  } else {
    return 'Night Owl';
  }
}

// Calculate streak stats from habit logs
export function calculateStreak(habitId: string, logs: HabitLog[]): { currentStreak: number; longestStreak: number } {
  const habitLogs = logs
    .filter(l => l.habit_id === habitId && l.completed)
    .map(l => l.date)
    .sort();

  if (habitLogs.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const uniqueDates = Array.from(new Set(habitLogs)).sort();
  const today = getTodayDateString();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < uniqueDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  // Check if streak is active today or yesterday
  const lastCompletedDate = uniqueDates[uniqueDates.length - 1];
  if (lastCompletedDate === today || lastCompletedDate === yesterday) {
    // Walk back to find current streak
    let streakCount = 1;
    let checkDate = new Date(lastCompletedDate);

    for (let j = uniqueDates.length - 2; j >= 0; j--) {
      checkDate.setDate(checkDate.getDate() - 1);
      const expectedStr = checkDate.toISOString().split('T')[0];
      if (uniqueDates[j] === expectedStr) {
        streakCount++;
      } else {
        break;
      }
    }
    currentStreak = streakCount;
  } else {
    currentStreak = 0;
  }

  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) };
}

// Trigger celebratory confetti
export function fireConfetti() {
  if (typeof window === 'undefined') return;
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563EB', '#FACC15', '#84CC16', '#EF4444', '#000000']
    });
  } catch (err) {
    console.error('Confetti error', err);
  }
}

// CSV Exporter for records
export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) {
    alert('No records available to export.');
    return;
  }

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      headers
        .map(h => {
          let val = row[h];
          if (val === null || val === undefined) val = '';
          if (typeof val === 'object') val = JSON.stringify(val);
          const escaped = ('' + val).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${getTodayDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
