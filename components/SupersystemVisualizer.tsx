
import React, { useRef, useEffect, memo } from 'react';
import { ОтчетСверхсистемы } from '../services/SupersystemEngine';

interface props {
    данные: ОтчетСверхсистемы;
    className?: string;
}

export const SupersystemVisualizer: React.FC<props> = memo(({ данные, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let кадр: number;
        let время = 0;

        const отрисовка = () => {
            const w = canvas.width, h = canvas.height;
            const cx = w / 2, cy = h / 2;
            ctx.clearRect(0, 0, w, h);

            // 1. Макро-Поле (Сверхсистема)
            const сетка = 40;
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < w; i += сетка) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                for (let j = 0; j < h; j += 10) {
                    const dx = i - cx;
                    const dy = j - cy;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const искривление = Math.sin(время + dist/50) * (данные.резонансПоля / 10);
                    ctx.lineTo(i + искривление, j);
                }
                ctx.stroke();
            }

            // 2. Векторы Проводимости (Избыточный вклад)
            const лучи = 8;
            for (let i = 0; i < лучи; i++) {
                const угол = (i * Math.PI * 2 / лучи) + время * 0.1;
                const длина = 50 + (данные.индексПроводимости / 100) * 100;
                
                const grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(угол) * длина, cy + Math.sin(угол) * длина);
                grad.addColorStop(0, 'rgba(250, 204, 21, 0.8)'); // Золото
                grad.addColorStop(1, 'transparent');

                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(угол) * длина, cy + Math.sin(угол) * длина);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Частицы ресурса (СВ1)
                const pPos = (время * 20 + i * 50) % длина;
                ctx.beginPath();
                ctx.arc(cx + Math.cos(угол) * pPos, cy + Math.sin(угол) * pPos, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#fbbf24';
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // 3. Ядро Субъекта (Проводник)
            const пульс = 20 + Math.sin(время * 3) * 3;
            ctx.beginPath();
            ctx.arc(cx, cy, пульс, 0, Math.PI * 2);
            ctx.fillStyle = '#1e1b4b';
            ctx.fill();
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Внутренний свет (Истинное Я)
            ctx.beginPath();
            ctx.arc(cx, cy, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#fff';
            ctx.fill();
            ctx.shadowBlur = 0;

            время += 0.02;
            кадр = requestAnimationFrame(отрисовка);
        };

        отрисовка();
        return () => cancelAnimationFrame(кадр);
    }, [данные]);

    return (
        <div className={`relative bg-slate-950 rounded-[3rem] border border-violet-500/20 overflow-hidden aspect-square ${className}`}>
            <div className="absolute top-8 left-8 z-10 space-y-1 pointer-events-none">
                <h4 className="text-[10px] font-black uppercase text-violet-400 tracking-[0.4em] animate-pulse">Supersystem_Vector_Map</h4>
                <p className="text-[7px] text-slate-500 font-mono uppercase italic">Протокол Обратной Причинности</p>
            </div>
            <canvas ref={canvasRef} width={400} height={400} className="w-full h-full object-contain" />
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
                <div className="space-y-1">
                    <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Проводимость Жизни</span>
                    <span className="text-xl font-black text-violet-400">{данные.индексПроводимости}%</span>
                </div>
                <div className="text-right space-y-1">
                    <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Резонанс Поля</span>
                    <span className="text-xl font-black text-amber-400">{данные.резонансПоля}%</span>
                </div>
            </div>
        </div>
    );
});
