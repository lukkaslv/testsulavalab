import { AnalysisResult } from "../types";

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
      provocation: "რა მოხდება ყველაზე საშინელი, თუ საკუთარ თავს გაბრაზების უფლებავ მისცემთ?"
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
  async generateClinicalSupervision(result: AnalysisResult, lang: 'ru' | 'ka'): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const t = SUPERVISOR_PATTERNS[lang];
    const { state, neuroSync, context } = result;

    let keyPattern = t.stable; 
    if (state.foundation < 35) keyPattern = t.critical_foundation;
    else if (state.agency > 80 && state.foundation < 45) keyPattern = t.manic_defense;
    else if (state.agency < 35 && state.entropy > 50) keyPattern = t.frozen_state;
    else if (neuroSync < 45) keyPattern = t.dissociation;

    let report = `**OBSERVATION:** ${keyPattern.obs}\n\n`;
    report += `**RISK:** ${keyPattern.risk}\n\n`;

    // --- CONTEXT COGNITIVE DISSONANCE CHECK ---
    if (context === 'CRISIS' && state.entropy < 30) {
        const note = lang === 'ru' 
            ? "ВНИМАНИЕ: Клиент заявляет о Кризисе, но системный шум аномально низок. Вероятна депрессивная заморозка или глубокое отрицание тяжести ситуации." 
            : "ყურადღება: კლიენტი აცხადებს კრიზისს, მაგრამ ხმაური დაბალია. შესაძლოა დეპრესიული გაყინვა.";
        report += `**CONTEXT_ALERT:** ${note}\n\n`;
    }
    
    if (context === 'NORMAL' && state.foundation < 25) {
        const note = lang === 'ru' 
            ? "КРИТИЧНО: Клиент воспринимает текущее состояние (разрушение опор) как нормальное. Адаптация к дефициту." 
            : "კრიტიკული: დეფიციტის ნორმალიზაცია.";
        report += `**CONTEXT_ALERT:** ${note}\n\n`;
    }

    report += `**PROVOCATION:** ${keyPattern.provocation}`;
    return report;
  }
};
