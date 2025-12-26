import { GameHistoryItem, PatternFlags } from '../types';
import { TOTAL_NODES } from '../constants';

const MONOTONIC_THRESHOLD = 0.8; // 80% of answers are the same position
const HIGH_SKIP_RATE_THRESHOLD = 0.4; // 40% of answers are skipped
const ROBOTIC_TIMING_STD_DEV_THRESHOLD = 500; // Standard deviation < 500ms is unnatural
const SOMATIC_VARIETY_THRESHOLD = 3; // Must use at least 3 different sensation types for a valid report
const EARLY_TERMINATION_THRESHOLD = 0.7; // Test must be at least 70% complete

// --- HELPERS ---
const calculate_std_dev = (arr: number[]) => {
    if (arr.length < 10) return 1000; // Not enough data for a reliable calculation
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / arr.length;
    return Math.sqrt(variance);
};

export const PatternDetector = {
  analyze(history: GameHistoryItem[]): PatternFlags {
    const totalAnswers = history.length;
    
    // 6. Early Termination Check
    const isEarlyTermination = totalAnswers < TOTAL_NODES * EARLY_TERMINATION_THRESHOLD;

    // We can still run other detectors, but if the test is too short, we return early
    if (totalAnswers < 5) { 
      return { isMonotonic: false, isHighSkipRate: false, isFlatline: false, isRoboticTiming: false, isSomaticMonotony: false, isEarlyTermination, dominantPosition: null };
    }

    // 1. Monotonic Pattern Detection (Positional Bias)
    const positionCounts = [0, 0, 0]; // Counts for choice 0, 1, 2
    let validPositionAnswers = 0;
    history.forEach(item => {
      if (item.choicePosition >= 0 && item.choicePosition <= 2) {
        positionCounts[item.choicePosition]++;
        validPositionAnswers++;
      }
    });
    
    let isMonotonic = false;
    let dominantPosition: number | null = null;
    
    if (validPositionAnswers > 10) { // needs enough data
        for (let i = 0; i < 3; i++) {
            if ((positionCounts[i] / validPositionAnswers) >= MONOTONIC_THRESHOLD) {
                isMonotonic = true;
                dominantPosition = i;
                break;
            }
        }
    }

    // 2. High Skip Rate Detection ("Grey Rock")
    const skippedCount = history.filter(h => h.beliefKey === 'default').length;
    const isHighSkipRate = (skippedCount / Math.max(totalAnswers, TOTAL_NODES)) >= HIGH_SKIP_RATE_THRESHOLD;

    // 3. Flatline Detection is handled by psychologyService now

    // 4. Robotic Timing Detection ("Metronome")
    const validLatencies = history.map(h => h.latency).filter(l => l > 300 && l < 30000);
    const latencyStdDev = calculate_std_dev(validLatencies);
    const isRoboticTiming = latencyStdDev < ROBOTIC_TIMING_STD_DEV_THRESHOLD;

    // 5. Somatic Monotony Detection
    const somaticResponses = history.map(h => h.sensation);
    const uniqueSensations = new Set(somaticResponses);
    let isSomaticMonotony = uniqueSensations.size < SOMATIC_VARIETY_THRESHOLD;
    if (uniqueSensations.size === 2 && uniqueSensations.has('s0')) {
        isSomaticMonotony = true;
    }
    
    return {
      isMonotonic,
      isHighSkipRate,
      isFlatline: false,
      isRoboticTiming,
      isSomaticMonotony,
      isEarlyTermination,
      dominantPosition
    };
  }
};