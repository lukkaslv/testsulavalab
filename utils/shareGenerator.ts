
import { AnalysisResult, Translations, SubscriptionTier, DomainType } from '../types';

const wrapText = (
  ctx: CanvasRenderingContext2D, 
  text: string, 
  x: number, 
  y: number, 
  maxWidth: number, 
  lineHeight: number
): number => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
};

const drawPentagonChart = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    profile: Record<DomainType, number>,
    t: Translations
) => {
    const keys: DomainType[] = ['foundation', 'agency', 'social', 'legacy', 'money'];
    const count = keys.length;
    
    // 1. Draw Grid (Web)
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.lineWidth = 2;
    const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
    
    levels.forEach(level => {
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
            const r = radius * level;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    });

    // 2. Draw Axes
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 3. Draw Data Polygon
    ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    keys.forEach((key, i) => {
        const value = profile[key] || 50;
        const normalized = value / 100;
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
        const r = radius * normalized;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 4. Draw Data Points & Labels
    ctx.font = 'bold 24px monospace'; // Fallback to monospace if system sans fails
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    keys.forEach((key, i) => {
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
        // Label position
        const labelR = radius + 50;
        const lx = centerX + Math.cos(angle) * labelR;
        const ly = centerY + Math.sin(angle) * labelR;
        
        // Defensive check for translation
        const label = (t.domains?.[key] || key).toUpperCase();
        const value = Math.round(profile[key] || 0);
        
        ctx.fillStyle = '#94a3b8';
        // Use system font for Georgian support
        ctx.font = 'bold 24px sans-serif'; 
        ctx.fillText(label, lx, ly - 15);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px monospace';
        ctx.fillText(`${value}%`, lx, ly + 15);

        // Dot on the chart
        const valNorm = (profile[key] || 50) / 100;
        const dotR = radius * valNorm;
        const dotX = centerX + Math.cos(angle) * dotR;
        const dotY = centerY + Math.sin(angle) * dotR;
        
        ctx.beginPath();
        ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    });
};

export const generateShareImage = async (
  result: AnalysisResult, 
  t: Translations,
  tier: SubscriptionTier = 'FREE'
): Promise<Blob | null> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  canvas.width = 1080;
  canvas.height = 1920;

  // SAFE LOOKUP with Fallbacks
  const defaultArchetype = { title: "UNKNOWN", desc: "System Analysis Pending", quote: "", superpower: "", shadow: "" };
  const archetype = t.archetypes?.[result.archetypeKey] || t.archetypes?.THE_ARCHITECT || defaultArchetype;
  
  const verdict = t.verdicts?.[result.verdictKey] || t.verdicts?.HEALTHY_SCALE || { label: "PENDING", impact: "" };
  
  // Use localized strings or fallback
  const ex = t.export_image || { header: "GENESIS OS", blueprint_title: "IDENTITY BLUEPRINT", footer: "CLINICAL SCREENING", metrics: { integrity: "INTEGRITY", entropy: "ENTROPY" } };

  // 1. Background (Deep Premium Gradient)
  const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
  gradient.addColorStop(0, '#020617');
  gradient.addColorStop(0.5, '#0f172a');
  gradient.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1920);

  // 2. Mesh Grid
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
  ctx.lineWidth = 1;
  for(let i=0; i<canvas.width; i+=120) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
  }
  for(let j=0; j<canvas.height; j+=120) {
    ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
  }

  // 3. Header (SYSTEM IDENTITY)
  ctx.fillStyle = '#6366f1'; 
  // Use sans-serif for better i18n support
  ctx.font = 'bold 32px sans-serif'; 
  ctx.textAlign = 'center';
  ctx.fillText(ex.header, 540, 100);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 64px sans-serif';
  // DYNAMIC NAME OR ID
  const displayName = tier === 'FREE' ? 'GENESIS USER' : `SESSION_${result.shareCode.substring(0, 6)}`;
  ctx.fillText(displayName, 540, 190);
  
  ctx.fillStyle = 'rgba(99, 102, 241, 0.8)';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(ex.blueprint_title, 540, 240);

  // 4. Archetype Box
  const boxX = 80, boxY = 300, boxW = 920, boxH = 500;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 60);
  ctx.fill();
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 60px sans-serif'; // Reduced slightly for longer localized titles
  wrapText(ctx, (archetype.title || "").toUpperCase(), 540, boxY + 100, 850, 70);
  
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'italic 30px serif';
  wrapText(ctx, `"${archetype.quote || ""}"`, 540, boxY + 200, 800, 40);

  ctx.font = '300 26px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  wrapText(ctx, archetype.desc || "", 540, boxY + 320, 820, 36);

  // 5. 5-AXIS RADAR CHART (Visual Core)
  const chartCenterY = 1200;
  const chartRadius = 250;
  
  // Use the domainProfile from result, or fallback to state mapping if missing (compatibility)
  const profile = result.domainProfile || {
      foundation: result.state.foundation,
      agency: result.state.agency,
      money: result.state.resource,
      social: 50,
      legacy: 50
  };

  drawPentagonChart(ctx, 540, chartCenterY, chartRadius, profile, t);

  // 6. Meta Metrics (Linear below chart)
  const metaY = 1580;
  const metaMetrics = [
      { label: ex.metrics.integrity, val: result.integrity, color: "#10b981" },
      { label: ex.metrics.entropy, val: result.entropyScore, color: "#ef4444" }
  ];
  
  metaMetrics.forEach((m, i) => {
      const x = i === 0 ? 300 : 780;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(m.label, x, metaY);
      
      ctx.fillStyle = m.color;
      ctx.font = '900 48px sans-serif';
      ctx.fillText(`${m.val}%`, x, metaY + 50);
  });

  // 7. Verdict Banner
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(0, 1700, 1080, 140);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = '900 42px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText((verdict.label || "").toUpperCase(), 540, 1770);

  // 8. Footer
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 24px sans-serif';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(`GENESIS-OS.APP // ${ex.footer}`, 540, 1890);

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
};
