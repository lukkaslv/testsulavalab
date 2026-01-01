
import { useState, memo, useMemo } from 'react';
import { AnalysisResult, Translations } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { RadarChart } from '../RadarChart';
import { ClinicalSynthesisView } from './ClinicalSynthesisView';
import { SomaticTopography } from '../SomaticTopography';
import { SessionEKG } from '../SessionEKG';
import { BifurcationTree } from '../BifurcationTree';
import { EmergenceMatrix } from '../EmergenceMatrix';
import { TeleologicalAttractor } from '../TeleologicalAttractor';
import { InterventionDashboard } from '../InterventionDashboard';
import { ShadowReveal } from '../ShadowReveal';
import { PhaseTransitionMap } from '../PhaseTransitionMap';
import { SovereigntyVector } from '../SovereigntyVector';
import { EnergyLeakMap } from '../EnergyLeakMap';
import { SingularityPoint } from '../SingularityPoint';
import { MetaphorDeck } from '../MetaphorDeck';
import { ResonanceScanner } from '../ResonanceScanner';
import { FeedbackLoopMap } from '../FeedbackLoopMap';
import { StabilityWell } from '../StabilityWell';
import { RefractionPrism } from '../RefractionPrism';
import { ResilienceMap } from '../ResilienceMap';
import { FractureMap } from '../FractureMap';
import { ResonanceLattice } from '../ResonanceLattice';
import { SystemicField } from '../SystemicField';
import { ReliefMap } from '../ReliefMap';
import { StrangeAttractor } from '../StrangeAttractor';
import { KineticFluxMap } from '../KineticFluxMap';
import { AutopoiesisNucleus } from '../AutopoiesisNucleus';
import { InterferenceMoire } from '../InterferenceMoire';
import { CoherenceHelix } from '../CoherenceHelix';
import { HysteresisLoop } from '../HysteresisLoop';
import { SystemicResonanceMap } from '../SystemicResonanceMap';
import { ResistanceGradient } from '../ResistanceGradient';
import { ConnectionRhythm } from '../ConnectionRhythm';
import { ElasticityMonitor } from '../ElasticityMonitor';
import { AmbivalenceMatrix } from '../AmbivalenceMatrix';
import { ThermalShiftMap } from '../ThermalShiftMap';
import { KineticDriftGauge } from '../KineticDriftGauge';
import { StructuralTensionMap } from '../StructuralTensionMap';
import { ConductivityGates } from '../ConductivityGates';
import { RootCouplingVisualizer } from '../RootCouplingVisualizer';
import { SupersystemVisualizer } from '../SupersystemVisualizer';
import { MythosMirror } from '../MythosMirror';
import { ConnectionEngine } from '../../services/ConnectionEngine';
import { ElasticityEngine } from '../../services/ElasticityEngine';
import { AmbivalenceEngine } from '../../services/AmbivalenceEngine';
import { ThermalShiftEngine } from '../../services/ThermalShiftEngine';
import { KineticDriftEngine } from '../../services/KineticDriftEngine';
import { StructuralTensionEngine } from '../../services/StructuralTensionEngine';
import { ConductivityEngine } from '../../services/ConductivityEngine';
import { RootCouplingEngine } from '../../services/RootCouplingEngine';
import { SystemicResonanceEngine } from '../../services/SystemicResonanceEngine';
import { SupersystemEngine } from '../../services/SupersystemEngine';
import { MythosEngine } from '../../services/MythosEngine';
import { SystemicSimulator } from '../SystemicSimulator';
import { SynthesisService } from '../../services/synthesisService';
import { ButterflyEngine } from '../../services/butterflyEngine';
import { EmergenceEngine } from '../../services/emergenceEngine';
import { TeleologyEngine } from '../../services/teleologyEngine';
import { ShadowEngine } from '../../services/shadowEngine';
import { SovereigntyEngine } from '../../services/sovereigntyEngine';
import { StabilityEngine } from '../../services/stabilityEngine';
import { RefractionEngine } from '../../services/refractionEngine';
import { LatticeEngine } from '../../services/latticeEngine';
import { calculatePhaseTransition, calculateMaintenance, calculateSingularity, calculateResonance, calculateFeedbackLoops, calculateResilience, calculateEntropyFlux, calculateAutopoiesis, calculateViscosity } from '../../services/psychologyService';
import { MetaphorEngine } from '../../services/metaphorEngine';
import { SYSTEM_METADATA } from '../../constants';

interface ResultsViewProps {
  t: Translations;
  result: AnalysisResult;
  isGlitchMode: boolean;
  onContinue: () => void;
  onShare: () => void | Promise<void>;
  onBack: () => void;
  onSetView: (view: string) => void;
  isPro: boolean;
}

type Режим = 'сводка' | 'слепок' | 'тело' | 'ритм' | 'резонанс' | 'упругость' | 'амбивалентность' | 'сдвиг' | 'дрейф' | 'натяжение' | 'шлюз' | 'сцепка' | 'сверхсистема' | 'миф' | 'ритмограмма' | 'лаборатория' | 'тектоника' | 'инерция' | 'искажение' | 'спираль' | 'синтез' | 'тень' | 'гравитация' | 'петли' | 'энергия' | 'излом' | 'поле' | 'динамика' | 'смысл' | 'модель' | 'финал' | 'досье' | 'выборы';

export const ResultsView = memo<ResultsViewProps>(({ 
  t, result, onShare, onBack, isPro
}) => {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [activeMode, setActiveMode] = useState<Режим>('сводка');
  
  const baseline = useMemo(() => {
    if (!result.history.length) return 2000;
    const samples = result.history.slice(0, 5);
    return samples.reduce((acc, h) => acc + h.latency, 0) / samples.length;
  }, [result.history]);

  const synthesis = useMemo(() => SynthesisService.generateSynthesis(result, t), [result, t]);
  const миф = useMemo(() => MythosEngine.собрать(result), [result]);
  const bifurcations = useMemo(() => ButterflyEngine.calculateBifurcations(result), [result]);
  const emergentPatterns = useMemo(() => EmergenceEngine.detectPatterns(result), [result]);
  const teleology = useMemo(() => TeleologyEngine.calculate(result), [result]);
  const shadowContract = useMemo(() => ShadowEngine.decode(result), [result]);
  const phaseReport = useMemo(() => calculatePhaseTransition(result), [result]);
  const sovereigntyMetrics = useMemo(() => SovereigntyEngine.calculate(result), [result]);
  const maintenanceReport = useMemo(() => calculateMaintenance(result), [result]);
  const singularity = useMemo(() => calculateSingularity(result.history), [result.history]);
  const metaphors = useMemo(() => MetaphorEngine.getPatterns(result), [result]);
  const resonancePoints = useMemo(() => calculateResonance(result.history), [result.history]);
  const feedbackLoops = useMemo(() => calculateFeedbackLoops(result), [result]);
  const stabilityMetrics = useMemo(() => StabilityEngine.calculate(result), [result]);
  const refractionVectors = useMemo(() => RefractionEngine.calculateVectors(result), [result]);
  const resilienceReport = useMemo(() => calculateResilience(result), [result]);
  const lattice = useMemo(() => LatticeEngine.calculate(result), [result]);
  const autopoiesis = useMemo(() => calculateAutopoiesis(result), [result]);
  const flux = useMemo(() => calculateEntropyFlux(result.history), [result.history]);
  const systemicResonance = useMemo(() => SystemicResonanceEngine.рассчитать(result), [result]);
  const сверхсистема = useMemo(() => SupersystemEngine.анализировать(result), [result]);
  const viscosity = useMemo(() => calculateViscosity(result), [result]);
  const ритмСвязи = useMemo(() => ConnectionEngine.анализировать(result.history), [result.history]);
  const упругость = useMemo(() => ElasticityEngine.рассчитать(result.history), [result.history]);
  const амбивалентность = useMemo(() => AmbivalenceEngine.анализировать(result.history, baseline), [result.history, baseline]);
  const термическийСдвиг = useMemo(() => ThermalShiftEngine.рассчитать(result.history, result.state.entropy), [result]);
  const кинетическийДрейф = useMemo(() => KineticDriftEngine.анализировать(result.history), [result.history]);
  const структурноеНатяжение = useMemo(() => StructuralTensionEngine.рассчитать(result.history), [result.history]);
  const проводимость = useMemo(() => ConductivityEngine.рассчитать(result), [result]);
  const корневаяСцепка = useMemo(() => RootCouplingEngine.рассчитать(result.history), [result.history]);

  const anomalies = useMemo(() => ({
      излом: result.fractures.length > 0,
      петли: feedbackLoops.loops.length > 0,
      энергия: maintenanceReport.leaks.length > 0,
      ритм: result.sessionPulse.some(p => p.isBlock),
      тень: result.state.entropy > 50,
      сверхсистема: сверхсистема.индексПроводимости < 40
  }), [result, feedbackLoops, maintenanceReport, сверхсистема]);

  if (!disclaimerAccepted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in px-6 text-center">
         <div className="w-20 h-20 bg-indigo-950/30 rounded-[2rem] flex items-center justify-center text-4xl border border-indigo-500/30 animate-pulse-slow">⚖️</div>
         <div className="space-y-4 max-w-sm">
            <h2 className="text-2xl font-black uppercase italic text-slate-200 tracking-tighter">ДИСКЛЕЙМЕР</h2>
            <p className="text-sm font-medium text-slate-400 leading-relaxed italic">Данный отчет сформирован алгоритмом на основе ваших реакций. Не является медицинской рекомендацией.</p>
         </div>
         <button onClick={() => { PlatformBridge.haptic.notification('success'); setDisclaimerAccepted(true); }} className="w-full max-w-xs py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-[0.98] transition-all">
            Я ПРИНИМАЮ УСЛОВИЯ
         </button>
      </div>
    );
  }

  const menuItems: Array<{ key: Режим, label: string, proOnly?: boolean }> = [
      { key: 'сводка', label: 'СВОДКА' },
      { key: 'слепок', label: 'СЛЕПОК' },
      { key: 'сверхсистема', label: 'СВЕРХСИСТЕМА', proOnly: true },
      { key: 'миф', label: 'МИФ', proOnly: true },
      { key: 'тело', label: 'ТЕЛО' },
      { key: 'ритм', label: 'РИТМ' },
      { key: 'резонанс', label: 'РЕЗОНАНС', proOnly: true },
      { key: 'амбивалентность', label: 'АМБИВАЛЕНТНОСТЬ', proOnly: true },
      { key: 'сдвиг', label: 'СДВИГ', proOnly: true },
      { key: 'дрейф', label: 'ДРЕЙФ', proOnly: true },
      { key: 'натяжение', label: 'НАТЯЖЕНИЕ', proOnly: true },
      { key: 'шлюз', label: 'ШЛЮЗ', proOnly: true },
      { key: 'сцепка', label: 'СЦЕПКА', proOnly: true },
      { key: 'упругость', label: 'УПРУГОСТЬ', proOnly: true },
      { key: 'ритмограмма', label: 'РИТМОГРАММА', proOnly: true },
      { key: 'лаборатория', label: 'ЛАБОРАТОРИЯ', proOnly: true },
      { key: 'инерция', label: 'ИНЕРЦИЯ', proOnly: true },
      { key: 'тектоника', label: 'ТЕКТОНИКА', proOnly: true },
      { key: 'излом', label: 'ИЗЛОМ', proOnly: true },
      { key: 'петли', label: 'ПЕТЛИ', proOnly: true },
      { key: 'тень', label: 'ТЕНЬ', proOnly: true },
      { key: 'поле', label: 'ПОЛЕ', proOnly: true },
      { key: 'энергия', label: 'ЭНЕРГИЯ', proOnly: true },
      { key: 'искажение', label: 'ИСКАЖЕНИЕ', proOnly: true },
      { key: 'спираль', label: 'СПИРАЛЬ', proOnly: true },
      { key: 'выборы', label: 'ВЫБОРЫ', proOnly: true },
      { key: 'синтез', label: 'СИНТЕЗ', proOnly: true },
      { key: 'гравитация', label: 'ГРАВИТАЦИЯ', proOnly: true },
      { key: 'динамика', label: 'ДИНАМИКА', proOnly: true },
      { key: 'смысл', label: 'СМЫСЛ', proOnly: true },
      { key: 'модель', label: 'МОДЕЛЬ', proOnly: true },
      { key: 'финал', label: 'ФИНАЛ', proOnly: true },
      { key: 'досье', label: 'ДОСЬЕ' }
  ];

  return (
    <div className="space-y-8 pb-32 animate-in pt-2 text-slate-100 relative">
      <header className={`p-8 rounded-[3rem] shadow-2xl relative overflow-hidden bg-slate-950 border border-white/5`}>
        <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-400">
                {activeMode.toUpperCase()}
              </span>
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar max-w-[160px]">
                {menuItems.filter(i => !i.proOnly || isPro).map(item => (
                    <button key={item.key} onClick={() => { setActiveMode(item.key); PlatformBridge.haptic.selection(); }} className={`px-3 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-widest transition-all shrink-0 relative ${activeMode === item.key ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>
                        {item.label}
                        {(anomalies as any)[item.key] && (
                            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                        )}
                    </button>
                ))}
              </div>
            </div>
            {activeMode === 'сводка' && (
                <div className="space-y-4 animate-in">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black italic uppercase text-white leading-none tracking-tighter">КЛИНИЧЕСКАЯ СВОДКА</h1>
                        <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Анализ состояния системы в реальном времени</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Индекс Адаптации</span>
                            <div className="text-xl font-black text-emerald-400">{result.systemHealth}%</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Уровень Хаоса</span>
                            <div className="text-xl font-black text-red-400">{result.state.entropy}%</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        
        <div className={`mt-8 relative w-full rounded-3xl overflow-hidden border bg-[#020617] border-slate-800`}>
            {activeMode === 'сводка' && (
                <div className="p-6 space-y-6 overflow-y-auto no-scrollbar max-h-[500px]">
                    <div className="flex justify-center">
                        <RadarChart points={result.graphPoints} shadowPoints={result.shadowPoints} showShadow={true} onLabelClick={() => {}} className="scale-90" />
                    </div>
                    <div className="p-5 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl space-y-2">
                         <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Приоритет проработки:</span>
                         <p className="text-sm font-bold text-white italic">"{synthesis.coreTension.analysis}"</p>
                         <p className="text-[10px] text-slate-400 font-medium">Рекомендуемая точка входа: {t.domains[resilienceReport.fragileDomains[0] || 'foundation']}</p>
                    </div>
                </div>
            )}
            {activeMode === 'миф' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[600px] animate-in">
                    <MythosMirror данные={миф} />
                </div>
            )}
            {activeMode === 'сверхсистема' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[600px] animate-in space-y-6">
                    <SupersystemVisualizer данные={сверхсистема} />
                    <div className="bg-violet-950/20 p-6 rounded-[2rem] border border-violet-500/30 space-y-4">
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-violet-400 uppercase tracking-widest block">Ваш Вклад:</span>
                            <p className="text-[14px] text-white leading-relaxed font-black uppercase italic">
                                {сверхсистема.типВклада}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest block">Вектор Смысла:</span>
                            <p className="text-[12px] text-slate-300 leading-relaxed font-medium italic">
                                "{сверхсистема.векторСмысла}"
                            </p>
                        </div>
                        <div className="pt-4 border-t border-violet-500/20">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Аттрактор Будущего:</span>
                            <p className="text-[11px] text-violet-200 font-mono uppercase tracking-tighter mt-1">
                                {сверхсистема.аттракторБудущего}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {activeMode === 'сцепка' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[600px] animate-in space-y-6">
                    <RootCouplingVisualizer отчет={корневаяСцепка} т={t} />
                    <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-3">
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block">Системный Анализ:</span>
                        <p className="text-[12px] text-slate-200 leading-relaxed font-bold italic">
                            "{корневаяСцепка.вердикт}"
                        </p>
                    </div>
                </div>
            )}
            {activeMode === 'шлюз' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[600px] animate-in space-y-6">
                    <ConductivityGates отчет={проводимость} т={t} />
                    <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-3">
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block">Вердикт по Доступу:</span>
                        <p className="text-[12px] text-slate-200 leading-relaxed font-bold italic">
                            "{проводимость.вердикт}"
                        </p>
                    </div>
                </div>
            )}
            {activeMode === 'натяжение' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[600px] animate-in space-y-6">
                    <StructuralTensionMap отчет={структурноеНатяжение} т={t} />
                    <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-3">
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block">Клинический вердикт:</span>
                        <p className="text-[12px] text-slate-200 leading-relaxed font-bold italic">
                            "{структурноеНатяжение.вердикт}"
                        </p>
                    </div>
                </div>
            )}
            {activeMode === 'дрейф' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[600px] animate-in space-y-6">
                    <KineticDriftGauge отчет={кинетическийДрейф} т={t} />
                    <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-3">
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block">Клинический вердикт:</span>
                        <p className="text-[12px] text-slate-200 leading-relaxed font-bold italic">
                            "{кинетическийДрейф.вердикт}"
                        </p>
                    </div>
                </div>
            )}
            {activeMode === 'сдвиг' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[600px] animate-in space-y-6">
                    <ThermalShiftMap отчет={термическийСдвиг} т={t} />
                    <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-3">
                        <span className="text-[8px] font-black text-red-400 uppercase tracking-widest block">Прогноз Стабильности:</span>
                        <p className="text-[12px] text-slate-200 leading-relaxed font-bold italic">
                            "{термическийСдвиг.вердикт}"
                        </p>
                    </div>
                </div>
            )}
            {activeMode === 'амбивалентность' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[600px] animate-in space-y-6">
                    <AmbivalenceMatrix отчет={амбивалентность} т={t} />
                    <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5">
                         <p className="text-[10px] text-slate-400 leading-relaxed italic">
                            Матрица показывает точки «расщепления». Чем дальше точка от левого нижнего угла, тем сильнее разрыв между словами клиента и его телом.
                         </p>
                    </div>
                </div>
            )}
            {activeMode === 'упругость' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[600px] animate-in space-y-6">
                    <ElasticityMonitor отчет={упругость} т={t} />
                    <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5">
                         <p className="text-[10px] text-slate-400 leading-relaxed italic">
                            График восстановления показывает, как быстро система "сбрасывает" напряжение после блоков. Низкая упругость — маркер того, что клиент застревает в защитной реакции.
                         </p>
                    </div>
                </div>
            )}
            {activeMode === 'ритмограмма' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[600px] animate-in space-y-6">
                    <ConnectionRhythm отчет={ритмСвязи} т={t} />
                    <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5">
                         <p className="text-[10px] text-slate-400 leading-relaxed italic">
                            Ритмограмма показывает "чистоту" сигнала связи ум-тело. Резкие провалы (красные точки) — это моменты, когда когнитивные защиты полностью подавили телесный отклик.
                         </p>
                    </div>
                </div>
            )}
            {activeMode === 'инерция' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[600px] animate-in space-y-6">
                    <ResistanceGradient report={viscosity} t={t} />
                    <HysteresisLoop history={result.history} className="h-64" />
                </div>
            )}
            {activeMode === 'резонанс' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[600px] animate-in space-y-6">
                    <SystemicResonanceMap данные={systemicResonance} т={t} />
                    <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 space-y-3">
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block">Вердикт Поля:</span>
                        <p className="text-[12px] text-slate-200 leading-relaxed font-bold italic">
                            "{systemicResonance.вердикт}"
                        </p>
                    </div>
                </div>
            )}
            {activeMode === 'лаборатория' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[600px] animate-in">
                    <InterventionDashboard result={result} t={t} />
                </div>
            )}
            {activeMode === 'слепок' && (
                <div className="aspect-square flex items-center justify-center">
                    <RadarChart points={result.graphPoints} shadowPoints={result.shadowPoints} showShadow={true} onLabelClick={() => {}} className="scale-110" />
                </div>
            )}
            {activeMode === 'тело' && (
                <div className="aspect-square p-4 flex flex-col justify-center animate-in">
                    <SomaticTopography result={result} className="w-full h-full" />
                </div>
            )}
            {activeMode === 'ритм' && (
                <div className="aspect-square p-4 flex flex-col justify-center">
                    <SessionEKG pulse={result.sessionPulse} t={t} />
                </div>
            )}
            {activeMode === 'тектоника' && (
                <div className="aspect-square p-4 flex flex-col justify-center animate-in space-y-4">
                    <ReliefMap result={result} className="w-full h-[60%]" />
                    <StrangeAttractor result={result} className="w-full h-[40%]" />
                </div>
            )}
            {activeMode === 'искажение' && (
                <div className="aspect-square p-4 flex flex-col justify-center animate-in">
                    <InterferenceMoire result={result} />
                </div>
            )}
            {activeMode === 'спираль' && (
                <div className="aspect-square p-4 flex flex-col justify-center animate-in">
                    <CoherenceHelix history={result.history} t={t} neuroSync={result.neuroSync} />
                </div>
            )}
            {activeMode === 'выборы' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[500px]">
                    <BifurcationTree nodes={bifurcations} t={t} />
                </div>
            )}
            {activeMode === 'синтез' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[500px]">
                    <EmergenceMatrix patterns={emergentPatterns} />
                </div>
            )}
            {activeMode === 'тень' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[500px]">
                    <ShadowReveal contract={shadowContract} t={t} />
                </div>
            )}
            {activeMode === 'гравитация' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[500px] space-y-8">
                    <StabilityWell metrics={stabilityMetrics} />
                    <RefractionPrism vectors={refractionVectors} currentArchetype={result.archetypeKey} t={t} />
                </div>
            )}
            {activeMode === 'петли' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[500px]">
                    <FeedbackLoopMap report={feedbackLoops} t={t} />
                </div>
            )}
            {activeMode === 'энергия' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[500px] space-y-8">
                    <PhaseTransitionMap report={phaseReport} t={t} />
                    <SovereigntyVector metrics={sovereigntyMetrics} t={t} />
                    <EnergyLeakMap report={maintenanceReport} t={t} />
                </div>
            )}
            {activeMode === 'излом' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[500px] space-y-8">
                    <ResilienceMap report={resilienceReport} t={t} />
                    <FractureMap fractures={result.fractures} t={t} />
                </div>
            )}
            {activeMode === 'поле' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[500px] space-y-8">
                    <ResonanceLattice lattice={lattice} t={t} className="h-64" />
                    <SystemicField metrics={result.extra?.systemicMetrics || { loyaltyIndex: 50, differentiationLevel: 50, ancestralPressure: 20, fieldTension: 15 }} t={t} interactive={true} />
                </div>
            )}
            {activeMode === 'динамика' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[500px] space-y-8">
                    <KineticFluxMap flux={flux} t={t} />
                    <AutopoiesisNucleus metrics={autopoiesis} />
                </div>
            )}
            {activeMode === 'смысл' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[500px] space-y-8">
                    <SingularityPoint point={singularity} t={t} />
                    <MetaphorDeck patterns={metaphors} />
                    <ResonanceScanner points={resonancePoints} t={t} />
                </div>
            )}
            {activeMode === 'модель' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[500px]">
                    <SystemicSimulator result={result} t={t} />
                </div>
            )}
            {activeMode === 'финал' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[500px]">
                    <TeleologicalAttractor metrics={teleology} />
                </div>
            )}
            {activeMode === 'досье' && (
                <div className="p-4 overflow-y-auto no-scrollbar max-h-[500px]">
                    <ClinicalSynthesisView synthesis={synthesis} t={t} />
                </div>
            )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 pt-4 px-2">
          <button onClick={onShare} className="py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-[0.97] transition-all">Поделиться</button>
          <button onClick={onBack} className="py-5 bg-slate-800 text-white border-2 border-slate-700 rounded-[2rem] font-black uppercase text-xs tracking-widest active:scale-[0.97] transition-all">Назад</button>
      </div>

      <footer className="pt-16 pb-12 text-center opacity-30">
          <p className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-500">ГЕНЕЗИС // ВЕРСИЯ {SYSTEM_METADATA.VERSION}</p>
      </footer>
    </div>
  );
});
