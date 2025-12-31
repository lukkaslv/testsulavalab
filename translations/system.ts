export const systemTranslations = {
    safety: { title: "Безопасность", alert_title: "Внимание", alert_message: "Риск дестабилизации." },
    crisis_view: { title: "РЕЖИМ ЗАЩИТЫ", message: "Критическое истощение.", recommendation: "Обратитесь к специалисту.", ru_helpline_name: "Служба экстренной помощи", ru_helpline_number: "112", ru_helpline_desc: "Круглосуточно", exit_button_text: "ВЫХОД" },
    integrity_audit: { 
        title: "ЦЕЛОСТНОСТЬ", version_label: "V2.0", exit_btn: "ВЫХОД", initializing: "...", dynamics_label: "ДИНАМИКА", system_narrative: "ЛОГ", no_anomalies: "НЕТ", efficiency: "Эффективность", optimal: "ОК", verdict_healthy: "ЗДОРОВ", verdict_unstable: "РИСКИ", 
        metrics: { emergence: "ЭМЕРДЖ", synergy: "СИНЕРГИЯ", phase_risk: "РИСК СРЫВА" }, 
        organs: { NERVOUS_SYSTEM: "НС", METABOLISM: "ОБМЕН", VOICE: "ГОЛОС", IMMUNITY: "ИММУН", STRUCTURE: "СТРУКТ", NETWORK: "СЕТЬ" }, 
        anomalies: { DEAD_CODE: "МЕРТВЫЙ", SPOF: "ОТКАЗ", BUTTERFLY: "БАБОЧКА", DOMINO: "ДОМИНО", HYSTERESIS: "ГИСТЕРЕЗИС", TECH_DEBT: "ДОЛГ", COUPLING: "СВЯЗЬ", CONWAY: "КОНВЕЙ", DETERMINISM: "ДЕТЕРМ", CIRCUIT_BRK: "BREAK", BIFURCATION: "БИФУРК", ATTRACTORS: "АТТРАКТ", STABLE: "СТАБИЛ", RESONANCE: "РЕЗОНАНС" },
        stochastic_resonance: {
            title: "Стохастический Резонанс",
            signal_label: "СИГНАЛ",
            noise_label: "ШУМ",
            snr_label: "SNR",
            conclusion: "Подтверждение детерминизма (Ст. 1.1). Система отличает сигнал от случайного шума."
        }
    },
    security_monitor: { title: "МОНИТОР БЕЗОПАСНОСТИ", requests_label: "ЗАПРОСЫ", domains_label: "ДОМЕНЫ", violations_label: "НАРУШЕНИЯ", integrity_desc: "Проверка целостности пройдена." },
    constitution: { title: "Конституция Genesis OS", subtitle: "Верховный Документ", articles: { a1: "Ст. 1: Природа Системы", a1_desc: "Genesis OS — детерминированный алгоритм.", a2: "Ст. 2: Абсолютный Запрет на AI", a2_desc: "Запрещено использование генеративных нейросетей в ядре.", a3: "Ст. 3: Клиническая Достоверность", a3_desc: "Алгоритмы основаны на научных моделях.", a4: "Ст. 4: Принцип Единого Организма", a4_desc: "Система целостна.", a13: "Ст. 13: Приватность", a13_desc: "Данные локальны.", a28: "Ст. 28: Незыблемость", a28_desc: "Конституция имеет высшую силу." } },
    tech_standard: { title: "Технический Стандарт", subtitle: "Спецификация Архитектуры", integrity_proof: "Доказательство Целостности", deterministic_proof: "Детерминизм", butterfly_risk: "Риск 'Эффекта Бабочки'" },
    changelog: { title: "Хроника Эволюции", subtitle: "Системный Журнал", types: { MAJOR: "MAJOR", MINOR: "MINOR", PATCH: "PATCH" }, legal_compliance: "Соответствие Конституции", genetic_memory: "Генетическая Память" },
    scientific_foundations: { 
        title: "Научные Основания", 
        subtitle: "Методология V11.0", 
        clinical_logic_label: "КЛИНИЧЕСКИЙ СМЫСЛ",
        citations: { 
            stroup: "Stroop, J. R. (1935). Studies of interference in serial verbal reactions.", 
            porges: "Porges, S. W. (2011). The Polyvagal Theory: Neurophysiological Foundations.", 
            sigmoid: "A. Maslow & K. Lewin: Field Theory and Homeostasis models." 
        },
        latency: {
            title: "Когнитивная Латентность",
            desc: "Модель основана на эффекте Струпа. Каждое внутреннее сопротивление увеличивает время выбора на 250-800мс.",
            logic: "Если клиент 'зависает' — это не медлительность, а работа защиты. Система видит, где психика тратит энергию на подавление импульса."
        },
        dynamics: {
            title: "Биодинамика Порога",
            desc: "Психика — нелинейная система. Мы используем Сигмоиду для моделирования момента, когда защиты 'прорываются'.",
            logic: "Архетип не меняется от одной ошибки. Нужно накопление критической массы сигналов, чтобы система зафиксировала сдвиг стратегии."
        },
        determinism: {
            title: "Детерминизм (Art. 1.1)",
            desc: "В системе нет вероятностей. Идентичный вход = Идентичный выход.",
            logic: "Это гарантирует объективность. Психолог может быть уверен: результат не 'галлюцинация' AI, а математическое отражение реакций клиента."
        }
    },
    privacy: { title: "Приватность", description: "Ваши данные хранятся только на этом устройстве и никуда не отправляются.", erase_warning: "Вы уверены? Это действие необратимо.", erase_button_text: "Удалить все данные" },
    legal: { tos_title: "Правила использования", tos_body: "Текст правил...", privacy_title: "Политика приватности", privacy_body: "Текст политики...", close_btn: "Закрыть" },
    guide: { 
        title: "Руководство Пользователя", 
        subtitle: "Протокол Самоисследования", 
        sections: [
            { 
                title: "Сущность метода", 
                content: [
                    "Genesis OS измеряет то, что вы не можете контролировать сознательно: скорость вашего выбора и телесный отклик.",
                    "Это не экзамен. Здесь нет правильных или неправильных ответов. Есть только сигналы вашего бессознательного."
                ] 
            },
            { 
                title: "Важность спонтанности", 
                content: [
                    "Старайтесь отвечать максимально быстро. Долгая пауза — это работа ваших защитных механизмов.",
                    "Система фиксирует эти задержки (латентность) как маркеры внутреннего конфликта."
                ] 
            },
            { 
                title: "Работа с телом", 
                content: [
                    "Периодически система будет запрашивать ваше физическое состояние. Обращайте внимание на зажимы, холод или тепло в теле.",
                    "Тело никогда не лжет, даже если ум пытается казаться лучше."
                ] 
            },
            { 
                title: "Ваш Blueprint", 
                content: [
                    "В конце вы получите уникальную карту вашей личности. Используйте её как повод для глубокой работы со специалистом.",
                    "Blueprint — это не приговор, а снимок вашего текущего состояния и зон роста."
                ] 
            }
        ], 
        closing: "Будьте честны с собой. Система увидит остальное." 
    },
    brief_explainer: { title: "Краткий Экскурс", subtitle: "Брифинг", intro_title: "Введение", intro_text: "Genesis OS - это детерминированный инструмент для анализа паттернов сопротивления.", blocks_title: "Блоки", archetype_label: "Архетип", archetype_desc: "Ваш доминирующий поведенческий паттерн.", metrics_title: "Метрики", metric_labels: { foundation: "Фундамент", agency: "Воля", resource: "Ресурс", entropy: "Энтропия" }, foundation_desc: "Ваша опора, безопасность и связь с родом.", agency_desc: "Ваша способность действовать и влиять на мир.", resource_desc: "Ваша внутренняя емкость и запас жизненных сил.", entropy_desc: "Уровень внутреннего хаоса и неопределенности.", neurosync_label: "Нейросинк", neurosync_desc: "Связь между вашим умом и телесным откликом.", latency_label: "Латентность", latency_desc: "Задержка перед ответом, маркер внутреннего сопротивления.", combinations_title: "Комбинации", combinations_text: "Сочетания метрик рождают уникальные паттерны и вердикты.", action_title: "Действие", action_text: "Используйте полученную карту для работы со специалистом.", limits_title: "Ограничения", limits_text: "Это не диагноз и не замена терапии.", closing: "Вперед к самопознанию." },
    methodology_faq: { q1: "Как это работает? Система измеряет задержки и телесный отклик для выявления бессознательных паттернов." }, 
    soft_mode: { archetype_prefix: "Ваш тип:", verdict_softened: { V1: "Рекомендуется обратить внимание на баланс." } },
    oracle: { title: "Оракул", subtitle: "Симуляция", exit: "Выход", btn_running: "Симуляция...", btn_idle: "Запустить симуляцию", section_anomalies: "Аномалии", no_anomalies: "Аномалий не найдено. Система стабильна.", section_calibrator: "Калибратор", footer: "Оракул v1.0" },
    export_image: { header: "GENESIS OS", blueprint_title: "BLUEPRINT ЛИЧНОСТИ", footer: "КЛИНИЧЕСКИЙ АНАЛИЗ", metrics: { integrity: "ЦЕЛОСТНОСТЬ", entropy: "ЭНТРОПИЯ" } },
    evolution_insights: { loading: "Загрузка...", growth_detected: "Обнаружен рост", chaos_reduction: "Снижение хаоса", stable_dynamics: "Стабильная динамика", status_ok: "OK", status_tracking: "Отслеживание" },
    context_check: {},
    admin: { panel_title: "Панель Администратора", oversight_layer: "Надзорный уровень", diagnostic_protocols: "Протоколы", issue_license: "Выдать лицензию", client_name: "Имя клиента" },
};