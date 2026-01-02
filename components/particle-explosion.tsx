'use client';

import { useEffect, useRef } from 'react';

interface DisintegrationEffectProps {
  rect: DOMRect;
  onComplete?: () => void;
}

export function DisintegrationEffect({
  rect,
  onComplete,
}: DisintegrationEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const container = containerRef.current;
    if (!container) return;

    // Grid-based particles that form the exact shape of the element
    const particleSize = 4;
    const cols = Math.ceil(rect.width / particleSize);
    const rows = Math.ceil(rect.height / particleSize);
    const borderRadius = 6; // matches rounded-md

    // Colors matching the sensitive woop styling
    const baseColors = ['#fafafa', '#f4f4f5', '#e4e4e7'];
    const accentColors = ['#fdba74', '#fb923c', '#f97316'];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Check if this particle is within the rounded corners
        const localX = col * particleSize;
        const localY = row * particleSize;

        // Skip particles outside rounded corners
        if (!isInsideRoundedRect(localX, localY, rect.width, rect.height, borderRadius, particleSize)) {
          continue;
        }

        const particle = document.createElement('div');

        // Exact position on screen
        const x = rect.left + localX;
        const y = rect.top + localY;

        // Progress across the element (0 = left, 1 = right)
        const xProgress = col / cols;
        const yProgress = row / rows;

        // Color - mix of base and accent, more accent on edges
        const isEdge = row === 0 || row === rows - 1 || col === 0 || col === cols - 1;
        const colors = isEdge ? accentColors : baseColors;
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Animation trajectory - particles fly right and scatter
        const angle = (Math.random() - 0.3) * Math.PI * 0.8; // mostly rightward
        const distance = 80 + Math.random() * 120;
        const tx = Math.cos(angle) * distance + xProgress * 50;
        const ty = Math.sin(angle) * distance - 30;
        const rotation = (Math.random() - 0.5) * 720;

        // Stagger: right side goes first (Thanos snap effect)
        const delay = (1 - xProgress) * 300 + Math.random() * 100;
        const duration = 500 + Math.random() * 300;

        particle.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          width: ${particleSize}px;
          height: ${particleSize}px;
          background: ${color};
          border-radius: 1px;
          pointer-events: none;
          z-index: 10000;
          opacity: 1;
          transform: translate(0, 0) rotate(0deg) scale(1);
        `;

        container.appendChild(particle);

        // Trigger animation after delay
        setTimeout(() => {
          particle.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${duration}ms ease-out`;
          particle.style.transform = `translate(${tx}px, ${ty}px) rotate(${rotation}deg) scale(0.2)`;
          particle.style.opacity = '0';
        }, delay);
      }
    }

    // Cleanup after animation completes
    setTimeout(() => {
      onComplete?.();
    }, 1200);
  }, [rect, onComplete]);

  return <div ref={containerRef} />;
}

// Helper to check if a point is inside a rounded rectangle
function isInsideRoundedRect(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  particleSize: number
): boolean {
  const centerX = x + particleSize / 2;
  const centerY = y + particleSize / 2;

  // Check corners
  if (centerX < radius && centerY < radius) {
    // Top-left corner
    return Math.hypot(centerX - radius, centerY - radius) <= radius;
  }
  if (centerX > width - radius && centerY < radius) {
    // Top-right corner
    return Math.hypot(centerX - (width - radius), centerY - radius) <= radius;
  }
  if (centerX < radius && centerY > height - radius) {
    // Bottom-left corner
    return Math.hypot(centerX - radius, centerY - (height - radius)) <= radius;
  }
  if (centerX > width - radius && centerY > height - radius) {
    // Bottom-right corner
    return Math.hypot(centerX - (width - radius), centerY - (height - radius)) <= radius;
  }

  return true;
}
