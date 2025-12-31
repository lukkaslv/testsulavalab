
import { AnalysisResult, ClinicalInterpretation, Translations, InterventionMode, SystemicMetrics, StatisticalMarkers, NeuropsychMarkers } from '../types';
import { calculateEntropyFlux, calculateAutopoiesis } from './psychologyService';

const calculateStats = (history: any[]): StatisticalMarkers => {
    const latencies = history.map(h => h.latency).filter(l => l > 300);
    if (latencies.length < 5) return { variance: 0, standardDeviation: 0, skewness: 0, kurtosis: 0, zScoreDistribution: [] };

    const n = latencies.length;
    const mean = latencies.reduce((a, b) => a + b, 0) / n;
    const variance = latencies.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    const zScores = latencies.map(l => (l - mean) / stdDev);

    // Моделирование асимметрии (Skewness)
    const skewness = (latencies.reduce((a, b) => a + Math.pow(b - mean, 3), 0) / n) / Math.pow(stdDev, 3);

    return {
        variance: Math.round(variance),
        standardDeviation: Math.round(stdDev),
        skewness: Number(skewness.toFixed(3)),
        kurtosis: 0, // Упрощено
        zScoreDistribution: zScores.map(z => Number(z.toFixed(2)))
    };
};

const calculateNeuro = (result: AnalysisResult): NeuropsychMarkers => {
    const { history, state } = result;
    const neutralSomaCount = history.filter(h => h.sensation === 's0').length;
    const alexithymiaIndex = Math.round((neutralSomaCount / (history.length || 1)) * 100);

    const frictionNodes = history.filter(h => h.latency > 3500).map(h => h.nodeId);
    
    return {
        alexithymiaIndex,
        cognitiveFriction: Math.round(result.state.entropy * 0.8),
        prefrontalExhaustion: history.slice(-10).every(h => h.latency < 1200) && state.agency > 70,
        amygdalaTriggerNodes: frictionNodes
    };
};

export const ClinicalDecoder = {
  decode(result: AnalysisResult, t: Translations): ClinicalInterpretation {
    const { state, neuroSync, activePatterns, archetypeKey, domainProfile, history } = result;
    const f = state.foundation, a = state.agency, e = state.entropy;

    const stats = calculateStats(history || []);
    const neuro = calculateNeuro(result);

    const homeostasisCost = Math.round((e * 0.6) + ((100 - neuroSync) * 0.4));
    
    const loyaltyIndex = Math.round(((domainProfile?.legacy || 50) * 0.6) + (activePatterns.includes('family_loyalty') ? 40 : 0));
    const systemicMetrics: SystemicMetrics = {
        loyaltyIndex,
        differentiationLevel: 100 - loyaltyIndex,
        ancestralPressure: Math.round((loyaltyIndex * 0.7) + (e * 0.3)),
        fieldTension: Math.round((loyaltyIndex + e) / 2)
    };

    let transferenceType = "Нейтральный / Рабочий";
    let allianceRisk = 20;
    
    if (a > 85 && f < 40) {
        allianceRisk = 85;
        transferenceType = "Контрзависимый (Борьба за власть, обесценивание специалиста)";
    } else if (f < 30 && neuroSync < 40) {
        allianceRisk = 60;
        transferenceType = "Пограничный (Риск слияния и мгновенного разочарования)";
    }

    let mode: InterventionMode = 'HOLDING';
    if (f < 35) mode = 'STABILIZING';
    else if (a > 80 && neuroSync > 50) mode = 'CONFRONTING';

    const directives: string[] = [];
    if (neuroSync < 35) directives.push("ВЕРБАЛЬНАЯ ТЕРАПИЯ МАЛОЭФФЕКТИВНА: Работайте через тело/дыхание.");
    if (a > 80 && f < 40) directives.push("ЗАПРЕТ НА КОНФРОНТАЦИЮ: Риск психотического эпизода или срыва в манию.");
    if (e > 75) directives.push("ЭКСТРЕННАЯ СТАБИЛИЗАЦИЯ: Ресурс системы исчерпан.");

    const autopoiesis = calculateAutopoiesis(result);
    const entropyFlux = calculateEntropyFlux(history || []);

    return {
        systemConfiguration: { 
            title: f < 30 ? "ДЕФИЦИТАРНАЯ" : isNaN(a/f) ? "НЕСТАБИЛЬНАЯ" : a/f > 2 ? "КОМПЕНСАТОРНАЯ" : "АДАПТИВНАЯ",
            description: "Общая конфигурация психического аппарата клиента.",
            limitingFactor: e > 65 ? "Внутренний хаос (Энтропия)" : f < 40 ? "Отсутствие опор (Фундамент)" : "Нет явных блоков"
        },
        deepMechanism: { title: "Механизм", analysis: [] },
        metricInteractions: { 
            farDescription: `Соотношение Воля/База: ${(a/f).toFixed(2)}. Ресурсная емкость: ${state.resource}%`,
            syncDescription: neuroSync < 50 ? "Сигнал тела заблокирован умом." : "Высокая связность Ум-Тело." 
        },
        archetypeClinical: { 
            strategy: t.archetypes[archetypeKey]?.superpower || "Адаптация",
            functionality: "Сохранение гомеостаза",
            limit: "Неспособность к интеграции нового опыта"
        },
        beliefImpact: activePatterns.join(", "),
        hypotheses: [], 
        risks: allianceRisk > 70 ? ["Высокий риск прерывания терапии", "Обесценивание сеттинга"] : [],
        sessionEntry: f < 40 ? "Терапевтическая поддержка" : "Провокация / Рост",
        priority: f < 35 ? "🛑 КРИТИЧЕСКАЯ" : "✅ НОРМА",
        priorityLevel: f < 35 ? 'high' : 'low',
        riskProfile: { label: e > 80 ? "ВЫСОКИЙ" : "НОМИНАЛ", level: e > 80 ? 'critical' : 'nominal' },
        stats,
        neuro,
        extra: { 
            diffProb: {}, criticalNodes: [], trapType: "OBS", provocation: "", bifurcations: [], evidence: [],
            homeostasisCost,
            systemicPressure: systemicMetrics.ancestralPressure, 
            systemicMetrics,
            directives, 
            clusters: [], 
            shadowContract: t.clinical_narratives?.shadow_contracts?.[`${archetypeKey.toLowerCase()}`] || "Скрытая выгода от неуспеха", 
            antidote: t.pattern_library[activePatterns[0]]?.antidote || "Осознанность",
            contraindications: directives.filter(d => d.includes("ЗАПРЕТ")),
            interventionMode: mode, 
            somaticMap: [], 
            trajectory: [], 
            transference: transferenceType,
            prognosis: { 
                integrationDifficulty: Math.round(e * 1.2), 
                allianceRisk, 
                stabilizationPath: f < 40 ? 'LONG' : 'FAST', 
                primaryObstacle: a > 80 ? "Гордыня / Контроль" : "Страх / Бессилие" 
            },
            entropyFlux,
            autopoiesis
        }
    };
  },

  generatePrepQuestions(result: AnalysisResult, _t: Translations): string[] {
      const q = [];
      if (result.state.foundation < 35) q.push("Что в вашей жизни сейчас является 'незыблемым'?");
      if (result.neuroSync < 50) q.push("Когда вы говорите 'я хочу', какая часть тела сжимается?");
      return q;
  }
};
