
import { RawAnalysisResult, DomainType, LatticeMetrics, NeuralBond } from '../types';

/**
 * Genesis OS Lattice Engine v1.0
 * Анализ "проводимости" между частями системы.
 */
export const LatticeEngine = {
    calculate(raw: RawAnalysisResult): LatticeMetrics {
        const domains: DomainType[] = ['foundation', 'agency', 'money', 'social', 'legacy'];
        const profile = raw.domainProfile;
        const bonds: NeuralBond[] = [];

        // Перебор всех пар доменов (10 связей)
        for (let i = 0; i < domains.length; i++) {
            for (let j = i + 1; j < domains.length; j++) {
                const d1 = domains[i];
                const d2 = domains[j];
                const v1 = profile[d1];
                const v2 = profile[d2];

                const delta = Math.abs(v1 - v2);
                const strength = Math.round((v1 + v2) / 2);
                let status: NeuralBond['status'] = 'STABLE';
                let tension = delta;

                // Клиническая логика связей
                if (delta > 45) status = 'RUPTURED';
                else if (delta > 25) status = 'STRAINED';
                else if (strength > 70 && delta < 15) status = 'SYNERGETIC';

                bonds.push({ from: d1, to: d2, strength, tension, status });
            }
        }

        const coherence = Math.round(
            bonds.reduce((acc, b) => acc + (b.status === 'SYNERGETIC' ? 20 : b.status === 'STABLE' ? 10 : -10), 50)
        );

        return { bonds, coherence: Math.max(5, Math.min(95, coherence)) };
    }
};
