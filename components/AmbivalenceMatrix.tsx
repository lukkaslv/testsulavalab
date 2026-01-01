
import React, { useRef, useEffect, memo, useState } from 'react';
import { ОтчетАмбивалентности, УзелАмбивалентности } from '../services/AmbivalenceEngine';
// FIX: Added DomainType to the imports from types to fix the error on line 183
import { Translations, DomainType } from '../types';
import { PlatformBridge } from '../utils/helpers';

interface props {
    отчет: ОтчетАмбивалентности;
    т: Translations;
    className?: string;
}

const ЦВЕТА_СФЕР: Record<string, string> = {
    foundation: '#10b981',
    agency: '#6366f1',
    money: '#f59e0b',
    social: '#a855f7',
    legacy: '#ec4899'
};

export const AmbivalenceMatrix: React.FC<props> = memo(({ отчет, т, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [выбранныйУзел, setВыбранныйУзел] = useState<УзелАмбивалентности | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width, h = canvas.height;
        const padding = 50;
        const drawW = w - padding * 2;
        const drawH = h - padding * 2;

        ctx.clearRect(0, 0, w, h);

        // 1. Клиническая сетка (Оси координат)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Вертикальные (Трение)
        for (let i = 0; i <= 4; i++) {
            const x = padding + (i / 4) * drawW;
            ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, h - padding); ctx.stroke();
        }
        // Горизонтальные (Диссоциация)
        for (let i = 0; i <= 4; i++) {
            const y = padding + (i / 4) * drawH;
            ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(w - padding, y); ctx.stroke();
        }

        // 2. Зонирование (Квадранты)
        ctx.fillStyle = 'rgba(239, 68, 68, 0.05)'; // Зона Опастности (Прав. верх)
        ctx.fillRect(padding + drawW/2, padding, drawW/2, drawH/2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.05)'; // Зона Правды (Лев. нижн)
        ctx.fillRect(padding, padding + drawH/2, drawW/2, drawH/2);

        // 3. Отрисовка Точек Конфликта
        отчет.точки.forEach((точка) => {
            const x = padding + (точка.трение / 100) * drawW;
            const y = padding + drawH - (точка.диссоциация / 100) * drawH;
            const radius = 5 + (точка.интенсивность / 10);

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = ЦВЕТА_СФЕР[точка.сфера] || '#fff';
            ctx.globalAlpha = 0.6;
            ctx.fill();
            
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = выбранныйУзел?.узелId === точка.узелId ? 3 : 1;
            ctx.globalAlpha = 1;
            ctx.stroke();

            // Теневой шлейф
            if (точка.интенсивность > 60) {
                ctx.beginPath();
                ctx.arc(x, y, radius + 10, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
                ctx.setLineDash([2, 2]);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        });

        // 4. Подписи осей
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('← КОГЕРЕНТНОСТЬ (УМ) ТРЕНИЕ →', w/2, h - 15);
        
        ctx.save();
        ctx.translate(15, h/2);
        ctx.rotate(-Math.PI/2);
        ctx.fillText('← ПОТОК (ТЕЛО) ДИССОЦИАЦИЯ →', 0, 0);
        ctx.restore();

    }, [отчет, выбранныйУзел]);

    const handleКлик = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const xRaw = (e.clientX - rect.left) * (canvasRef.current!.width / rect.width);
        const yRaw = (e.clientY - rect.top) * (canvasRef.current!.height / rect.height);

        const padding = 50;
        const drawW = canvasRef.current!.width - padding * 2;
        const drawH = canvasRef.current!.height - padding * 2;

        const найденный = отчет.точки.find(t => {
            const tx = padding + (t.трение / 100) * drawW;
            const ty = padding + drawH - (t.диссоциация / 100) * drawH;
            const dist = Math.sqrt((tx - xRaw)**2 + (ty - yRaw)**2);
            return dist < 15;
        });

        if (найденный) {
            setВыбранныйУзел(найденный);
            PlatformBridge.haptic.selection();
        } else {
            setВыбранныйУзел(null);
        }
    };

    return (
        <div className={`space-y-6 animate-in ${className}`}>
            <header className="flex justify-between items-start px-2">
                <div className="space-y-1">
                    <span className="text-[8px] font-black text-red-500 uppercase tracking-[0.4em] animate-pulse">Ambivalence_Conflict_Map</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Матрица Амбивалентности</h3>
                </div>
                <div className="text-right">
                    <span className="text-[7px] text-slate-500 uppercase tracking-widest block">Индекс Расщепления</span>
                    <span className={`text-xl font-mono font-black ${отчет.индексРасщепления > 50 ? 'text-red-500' : 'text-emerald-400'}`}>
                        {отчет.индексРасщепления}%
                    </span>
                </div>
            </header>

            <div className="relative bg-slate-950/80 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                <canvas 
                    ref={canvasRef} 
                    width={400} 
                    height={400} 
                    className="w-full h-full object-contain cursor-crosshair"
                    onClick={handleКлик}
                />
                
                {выбранныйУзел && (
                    <div className="absolute bottom-6 left-6 right-6 bg-black/90 backdrop-blur-xl border border-red-500/30 p-5 rounded-2xl animate-in-up shadow-2xl">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">ОБНАРУЖЕНО РАСЩЕПЛЕНИЕ</span>
                            <span className="text-[8px] font-mono text-slate-500 uppercase">{т.domains[выбранныйУзел.сфера]}</span>
                        </div>
                        <h4 className="text-[11px] font-black text-white uppercase mb-1">
                            "{т.beliefs[выбранныйУзел.убеждение] || выбранныйУзел.убеждение}"
                        </h4>
                        <div className="flex gap-4 pt-2 border-t border-white/5 mt-2">
                            <div className="flex flex-col">
                                <span className="text-[6px] text-slate-500 uppercase">Трение (Ум)</span>
                                <span className="text-[10px] font-black text-amber-500">{выбранныйУзел.трение}%</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[6px] text-slate-500 uppercase">Слом (Тело)</span>
                                <span className="text-[10px] font-black text-red-500">{выбранныйУзел.диссоциация}%</span>
                            </div>
                            <div className="flex flex-col ml-auto text-right">
                                <span className="text-[6px] text-slate-500 uppercase">Общий вес</span>
                                <span className="text-[10px] font-black text-white">{выбранныйУзел.интенсивность}%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-black/40 p-6 rounded-[2.5rem] border border-white/5 space-y-3">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] block">Клинический вердикт:</span>
                <p className="text-[12px] text-slate-200 leading-relaxed font-bold italic">
                    "{отчет.вердикт}"
                </p>
                <div className="flex justify-between pt-2 border-t border-white/5">
                    {/* FIX: DomainType was missing from imports, now correctly imported from types.ts */}
                    <span className="text-[7px] text-slate-500 uppercase font-mono tracking-tighter">Доминанта конфликта: {т.domains[отчет.доминантаКонфликта as DomainType] || 'ОТСУТСТВУЕТ'}</span>
                    <span className="text-[7px] text-slate-600 uppercase font-black">СТ. 18.2 COMPLIANT</span>
                </div>
            </div>
        </div>
    );
});
