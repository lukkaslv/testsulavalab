
import { AnalysisResult, Translations, SubscriptionTier, DomainType } from '../types';

/**
 * Генератор Шеринга Genesis OS v3.0 (Суверенный Холст)
 * Соответствие: Ст. 11.3 (Нулевая сетевая зависимость при экспорте)
 */

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

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    keys.forEach((key, i) => {
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
        const labelR = radius + 50;
        const lx = centerX + Math.cos(angle) * labelR;
        const ly = centerY + Math.sin(angle) * labelR;
        
        const label = (t.domains?.[key] || key).toUpperCase();
        const value = Math.round(profile[key] || 0);
        
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 24px ui-sans-serif, system-ui'; 
        ctx.fillText(label, lx, ly - 15);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px ui-monospace, SFMono-Regular';
        ctx.fillText(`${value}%`, lx, ly + 15);
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

  const verdict = t.verdicts?.[result.verdictKey] || t.verdicts?.HEALTHY_SCALE || { label: "ОЖИДАНИЕ" };
  const ex = t.export_image || { header: "GENESIS OS", blueprint_title: "СЛЕПОК", footer: "КЛИНИЧЕСКИЙ", metrics: { integrity: "INT", entropy: "ENT" } };

  // Фон
  const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
  gradient.addColorStop(0, '#020617');
  gradient.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1920);

  // Сетка (Art. 4.3 Эстетика)
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
  ctx.lineWidth = 1;
  for(let i=0; i<canvas.width; i+=120) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }

  // Заголовок
  ctx.fillStyle = '#6366f1'; 
  ctx.font = 'bold 32px ui-sans-serif'; 
  ctx.textAlign = 'center';
  ctx.fillText(ex.header, 540, 100);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 64px ui-sans-serif';
  const displayName = tier === 'FREE' ? 'ПОЛЬЗОВАТЕЛЬ GENESIS' : `СЕССИЯ_${result.shareCode.substring(0, 6)}`;
  ctx.fillText(displayName, 540, 190);

  // Лепестковая диаграмма
  const profile = result.domainProfile || { foundation: result.state.foundation, agency: result.state.agency, money: result.state.resource, social: 50, legacy: 50 };
  drawPentagonChart(ctx, 540, 1200, 250, profile, t);

  // Плашка вердикта
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(0, 1700, 1080, 140);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 42px ui-sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText((verdict.label || "").toUpperCase(), 540, 1770);

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.9));
};
