
import { AnalysisResult } from "../types";

// DETERMINISTIC SUPERVISOR ENGINE (NO AI IN RUNTIME)
// Adheres to Genesis OS Constitution v3.0: Absolute Determinism.

const SUPERVISOR_PATTERNS = {
  ru: {
    critical_foundation: {
      obs: "Обнаружен критический износ несущих конструкций личности.",
      risk: "Психотический срыв при повышении внешней нагрузки.",
      provocation: "Если завтра вы потеряете способность быть 'полезным', кто останется?"
    },
    manic_defense: {
      obs: "Высокая Агентность при дефиците Опор. Классическая 'Маниакальная Защита'.",
      risk: "Внезапное депрессивное обрушение (Crash) при остановке деятельности.",
      provocation: "От какой боли вы бежите с такой скоростью?"
    },
    frozen_state: {
      obs: "Паралич воли на фоне высокой энтропии. Энергия уходит на сдерживание аффекта.",
      risk: "Аутоагрессия и соматизация.",
      provocation: "Что самое страшное случится, если вы разрешите себе разозлиться?"
    },
    dissociation: {
      obs: "Разрыв связи 'Мозг-Тело'. Интеллектуализация как защитный бункер.",
      risk: "Потеря чувствительности к собственным потребностям, выгорание.",
      provocation: "Опишите физическое ощущение грусти в теле прямо сейчас. (Пауза)."
    },
    stable: {
      obs: "Система демонстрирует достаточный запас прочности.",
      risk: "Стагнация в зоне комфорта, 'Золотая Клетка'.",
      provocation: "Какой потенциал вы саботируете, сохраняя эту стабильность?"
    }
  },
  ka: {
    critical_foundation: {
      obs: "გამოვლენილია პიროვნული სტრუქტურის კრიტიკული ცვეთა.",
      risk: "ფსიქოზური გარღვევა დატვირთვის ზრდისას.",
      provocation: "ხვალ რომ 'სარგებლიანობა' დაკარგოთ, ვინ დარჩება?"
    },
    manic_defense: {
      obs: "მაღალი აგენტობა საყრდენების დეფიციტის ფონზე. კლასიკური 'მანიაკალური დაცვა'.",
      risk: "უეცარი დეპრესიული ჩავარდნა გაჩერების შემთხვევაში.",
      provocation: "რომელ ტკივილს გაურბიხართ ასეთი სისწრაფით?"
    },
    frozen_state: {
      obs: "ნების პარალიზი მაღალი ენტროპიის ფონზე.",
      risk: "აუტოაგრესია და სომატიზაცია.",
      provocation: "რა მოხდება ყველაზე საშინელი, თუ საკუთარ თავს გაბრაზების უფლებას მისცემთ?"
    },
    dissociation: {
      obs: "კავშირის გაწყვეტა გონებასა და სხეულს შორის.",
      risk: "საკუთარი საჭიროებების მიმართ მგრძნობელობის დაკარგვა.",
      provocation: "აღწერეთ სევდის ფიზიკური შეგრძნება სხეულში ახლავე."
    },
    stable: {
      obs: "სისტემა აჩვენებს მდგრადობის საკმარის მარაგს.",
      risk: "სტაგნაცია კომფორტის ზონაში.",
      provocation: "რომელ პოტენციალს აბლოკირებთ ამ სტაბილურობის შენარჩუნებით?"
    }
  }
};

export const GeminiService = {
  // Renamed conceptually to "Supervisor", keeping file name to avoid breaking imports for now.
  // In a full refactor, this should be renamed to 'SupervisorEngine.ts'
  async generateClinicalSupervision(result: AnalysisResult, lang: 'ru' | 'ka'): Promise<string> {
    
    // Simulate processing delay for "Compute" feel (UX only)
    await new Promise(resolve => setTimeout(resolve, 800));

    const t = SUPERVISOR_PATTERNS[lang];
    const { state, neuroSync } = result;
    const notes: string[] = [];

    // --- DETERMINISTIC LOGIC KERNEL ---
    
    let keyPattern = t.stable; // Default

    // Hierarchy of Severity checks
    if (state.foundation < 35) {
        keyPattern = t.critical_foundation;
    } else if (state.agency > 80 && state.foundation < 45) {
        keyPattern = t.manic_defense;
    } else if (state.agency < 35 && state.entropy > 50) {
        keyPattern = t.frozen_state;
    } else if (neuroSync < 45) {
        keyPattern = t.dissociation;
    }

    // Construct the "AI" Report
    let report = `**OBSERVATION:** ${keyPattern.obs}\n\n`;
    report += `**RISK:** ${keyPattern.risk}\n\n`;
    report += `**PROVOCATION:** ${keyPattern.provocation}`;

    // Add specific metric flags
    if (state.entropy > 65) {
        const entNote = lang === 'ru' ? "Высокий уровень системного шума." : "სისტემური ხმაურის მაღალი დონე.";
        report += `\n\n(Note: ${entNote})`;
    }

    return report;
  }
};
