'use client';

import { useState, useEffect } from 'react';

export function useCountdown(expiresAt: number) {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, expiresAt - Date.now()));

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, expiresAt - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, timeLeft]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    timeLeft,
    minutes,
    seconds,
    isExpiring: timeLeft < 60000 && timeLeft > 0, // Less than 1 minute
    isUrgent: timeLeft < 30000 && timeLeft > 0, // Less than 30 seconds
    isExpired: timeLeft === 0,
  };
}
