
import React, { useRef, useEffect, memo } from 'react';

interface BioSignatureProps {
  f: number; // Foundation
  a: number; // Agency
  r: number; // Resource
  e: number; // Entropy
  width?: number;
  height?: number;
  className?: string;
}

export const BioSignature: React.FC<BioSignatureProps> = memo(({ f, a, r, e, width = 200, height = 100, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;

    // 1. FOUNDATION CORE (The Anchor)
    // Low F = Fragmented/Transparent core. High F = Solid core.
    const coreRadius = 10 + (f / 100) * 15;
    const coreOpacity = 0.2 + (f / 100) * 0.8;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(16, 185, 129, ${coreOpacity})`; // Emerald
    if (f < 30) {
        // Warning Red Core for critical deficit
        ctx.fillStyle = `rgba(239, 68, 68, ${coreOpacity})`;
    }
    ctx.fill();

    // 2. AGENCY ORBIT (The Motion)
    // High A = Tight, fast frequency rings. Low A = Loose, wide rings.
    const rings = 3;
    ctx.lineWidth = 1.5;
    
    for (let i = 0; i < rings; i++) {
        ctx.beginPath();
        const radius = coreRadius + 10 + (i * 8);
        
        // Entropy Distortion
        // High Entropy makes the rings jagged (not smooth circles)
        const distortion = (e / 100) * 10; 
        
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
            const xOffset = Math.cos(angle * (a / 20)) * distortion; // Agency affects frequency
            const yOffset = Math.sin(angle * (a / 20)) * distortion;
            
            const x = centerX + Math.cos(angle) * (radius + xOffset);
            const y = centerY + Math.sin(angle) * (radius + yOffset);
            
            if (angle === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.3 + (a/200)})`; // Indigo
        ctx.stroke();
    }

    // 3. RESOURCE FIELD (The Capacity)
    // High R = Large outer glow/particles.
    const particleCount = Math.floor(r / 2);
    for (let i = 0; i < particleCount; i++) {
        // Deterministic placement based on index (simulated)
        const angle = (i * 137.5) * (Math.PI / 180); 
        const dist = coreRadius + 40 + (i % 5) * 5;
        
        const px = centerX + Math.cos(angle) * dist;
        const py = centerY + Math.sin(angle) * dist;
        
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.6)'; // Amber
        ctx.fill();
    }

    // 4. ENTROPY NOISE (The Interference)
    // High E = Random static lines crossing the signature
    if (e > 30) {
        const lines = Math.floor(e / 10);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'; // Red interference
        ctx.lineWidth = 0.5;
        for (let i = 0; i < lines; i++) {
            ctx.beginPath();
            // Deterministic "random" lines
            const y1 = (i * 17) % height;
            const y2 = (i * 23) % height;
            ctx.moveTo(0, y1);
            ctx.lineTo(width, y2);
            ctx.stroke();
        }
    }

    // 5. SIGNATURE TEXT (The Hash)
    ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.textAlign = 'center';
    ctx.fillText(`SIG: ${f}.${a}.${r}.${e}`, centerX, height - 5);

  }, [f, a, r, e, width, height]);

  return (
    <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        className={className}
    />
  );
});
