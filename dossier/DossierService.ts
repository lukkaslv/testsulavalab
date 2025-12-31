
import { AnalysisResult, Translations, GameHistoryItem, DomainType, BeliefKey } from "../types";
import { ClinicalDecoder } from "../services/clinicalDecoder";
import { WEIGHTS } from "../services/psychologyService";
import { BifurcationEngine } from "../services/bifurcationEngine";
import { LatticeEngine } from "../services/latticeEngine";

/**
 * Genesis OS Forensic Dossier Generator v18.0 "Lattice"
 * Реализует анализ системных связей (Ст. 4.1).
 */
export const DossierService = {
  generateDossier(result: AnalysisResult, t: Translations): string {
    const interpretation = ClinicalDecoder.decode(result, t);
    const { history, state, neuroSync, archetypeKey, shareCode, domainProfile, forecast } = result;
    const bifurcations = BifurcationEngine.detect(history);
    const lattice = LatticeEngine.calculate(result);

    let d = "";
    const L = "================================================================================\n";
    const S = "--------------------------------------------------------------------------------\n";
    const NL = "\n";

    // --- 1. ТИТУЛЬНЫЙ ЛИСТ ---
    d += L;
    d += `🧬 GENESIS OS // ФОРЕНЗИЧЕСКОЕ ПСИХОМЕТРИЧЕСКОЕ ДОСЬЕ // ВЕРСИЯ 18.0\n`;
    d += `ПРОТОКОЛ СИСТЕМНЫХ СВЯЗЕЙ (RESONANCE LATTICE) // СТАТУС: СТРОГО КОНФИДЕНЦИАЛЬНО\n`;
    d += L;
    d += `СУБЪЕКТ_ID: ${shareCode}\n`;
    d += `ИНДЕКС КОГЕРЕНТНОСТИ: ${lattice.coherence}%\n`;
    d += L + NL;

    // --- 2. НОВЫЙ РАЗДЕЛ: АНАЛИЗ РЕШЕТКИ (Ст. 4.1) ---
    d += `[I. АРХИТЕКТУРА СВЯЗЕЙ: РЕЗОНАНСНАЯ РЕШЕТКА]\n`;
    d += `Анализ натяжения между функциональными блоками психики.\n`;
    d += S;
    
    const strained = lattice.bonds.filter(b => b.status === 'STRAINED' || b.status === 'RUPTURED');
    if (strained.length === 0) {
        d += `СИСТЕМА СБАЛАНСИРОВАНА. Все домены работают в режиме взаимной поддержки. Низкий уровень внутреннего конфликта.\n`;
    } else {
        strained.forEach(b => {
            d += `КОНФЛИКТ: ${t.domains[b.from]} ⚡ ${t.domains[b.to]}\n`;
            d += `СТАТУС: ${b.status === 'RUPTURED' ? 'РАЗРЫВ (КРИТИЧНО)' : 'НАПРЯЖЕНИЕ'}\n`;
            d += `АНАЛИЗ: Противоречие между целями в "${t.domains[b.from]}" и возможностями в "${t.domains[b.to]}". `;
            if (b.from === 'foundation' || b.to === 'foundation') d += `Отсутствие базовой безопасности блокирует реализацию потенциала. `;
            d += `Требуется выравнивание векторов через ${t.roadmap.tasks.sanitation_2}.\n`;
            d += S;
        });
    }
    d += NL;

    // --- 3. СЦЕНАРНЫЙ ПРОГНОЗ ---
    d += `[II. ВРЕМЕННОЙ ГОРИЗОНТ: СЦЕНАРНАЯ ПРОЕКЦИЯ]\n`;
    if (forecast) {
        d += `1. ИНЕРЦИОННЫЙ ТРЕК: Система сохранит текущий паттерн. Прогноз целостности: ${forecast.inertialPath[6]}%.\n`;
        d += `2. ВЕКТОР ТРАНСФОРМАЦИИ: При проработке связи "${strained[0]?.from || 'foundation'}", потенциал роста: ${forecast.growthPath[6]}%.\n`;
    }
    d += NL;

    // --- 4. МИКРО-УРОВЕНЬ ---
    d += L;
    d += `[III. МИКРО-УРОВЕНЬ: НЕЙРОННЫЙ СЛЕД (50 УЗЛОВ)]\n`;
    d += L + NL;

    const latencies = history.map(h => h.latency).filter(l => l > 300);
    const mean = latencies.reduce((a,b) => a+b, 0) / (latencies.length || 1);
    const stdDev = Math.sqrt(latencies.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / (latencies.length || 1)) || 500;

    history.forEach((h, i) => {
        const z = (h.latency - mean) / stdDev;
        const belief = t.beliefs[h.beliefKey as keyof typeof t.beliefs] || h.beliefKey;
        const isBifurcation = bifurcations.some(b => b.nodeId === h.nodeId);
        d += `${isBifurcation ? '>>> ' : ''}УЗЕЛ #${String(i + 1).padStart(2, '0')} | ${belief.toUpperCase()} | Z:${z.toFixed(2)}\n`;
    });

    d += NL + L;
    d += `КОНЕЦ ПРОТОКОЛА. ХЕШ: LATTICE_V18_ФИНАЛ\n`;
    d += L;

    return d;
  }
};
