
import { Translations } from './types';

const ru: Translations = {
    subtitle: "Genesis OS // Клинический мост",
    onboarding: {
        protocol_btn: "Запустить протокол",
        pricing_btn: "Тарифы и планы",
        promo_title: "Genesis Pro",
        promo_desc: "Инструмент для профессионалов",
        recommended_tag: "Рекомендуем",
        price_per_month: "/ мес",
        features_clinical: "Анализ латентности;Карта сопротивления;Супервизия;Экспорт"
    },
    pro_hub: {
        title: "PRO HUB",
        risk_level_critical: "КРИТИЧЕСКИЙ",
        risk_level_high: "ВЫСОКИЙ",
        risk_level_nominal: "НОМИНАЛЬНЫЙ",
        system_status: "СТАТУС СИСТЕМЫ",
        license_expires: "ЛИЦЕНЗИЯ ИСТЕКАЕТ",
        days_left: "ДНЕЙ",
        remaining_sessions: "ОСТАЛОСЬ СЕССИЙ",
        access_terminal: "ТЕРМИНАЛ",
        terminal_desc: "Доступ к клиническим данным",
        recent_activity: "НЕДАВНЯЯ АКТИВНОСТЬ",
        session_id: "SESSION",
        no_sessions_found: "Нет активных сессий",
        tools_panel: "ИНСТРУМЕНТЫ",
        calibrate_instrument: "Калибровка",
        pro_guide: "Руководство",
        data_vault: "Архив"
    },
    invalid_results: {
        title: "РЕЗУЛЬТАТ НЕВАЛИДЕН",
        message: "Система обнаружила аномалии в паттернах ответов.",
        reason_monotonic: "Монотонные ответы",
        reason_skip: "Высокий уровень пропусков",
        reason_flatline: "Отсутствие динамики",
        reason_robotic: "Роботизированный тайминг",
        reason_somatic: "Соматическая монотония",
        reason_early_termination: "Раннее завершение",
        reset_button: "ПЕРЕЗАПУСТИТЬ",
        recommendation: "Пожалуйста, отвечайте искренне."
    },
    data_corruption: {
        title: "ОШИБКА ДАННЫХ",
        message: "Целостность данных сессии нарушена.",
        recommendation: "Необходим сброс.",
        reset_button: "СБРОС"
    },
    boot_sequence: ["Инициализация...", "Загрузка ядра...", "Проверка...", "Готово"],
    ui: {
        system_build: "SYSTEM BUILD",
        reset_session_btn: "Сброс сессии",
        auth_title: "Авторизация",
        code_input_placeholder: "ВВЕДИТЕ КОД",
        enter_code_btn: "Ввести код",
        status_report_title: "Статус",
        logout_btn: "Выход",
        resume_session_title: "Сессия активна",
        resume_session_btn: "Продолжить",
        progress_label: "Прогресс",
        system_audit_title: "Системный аудит",
        secured_label: "SECURED",
        mode_client: "Клиент",
        mode_pro: "Профессионал",
        evolution_title: "Эволюция",
        sessions_secured: "сессий",
        first_investigation_hint: "Первое исследование",
        integrity_drift: "Дрейф целостности",
        noise_tracking: "Шум",
        evolution_insight_desc: "Динамика отслеживается.",
        start_new_cycle_btn: "Начать новый цикл",
        agree_terms_btn: "Принять условия",
        module_label: "МОДУЛЬ",
        verdict_label: "ВЕРДИКТ",
        priority_label: "ПРИОРИТЕТ",
        access_restricted: "Доступ ограничен",
        enter_code_desc: "Введите ID клиента или код доступа для расшифровки профиля."
    },
    auth_ui: {
        checking_crypto: "Проверка криптографии...",
        invalid_format: "Неверный формат",
        license_expired: "Лицензия истекла",
        offline_mode: "Офлайн режим",
        revoked: "Лицензия отозвана",
        maintenance: "Техническое обслуживание",
        verifying: "Проверка...",
        authenticate: "Войти",
        cancel: "Отмена"
    },
    context_check: {
        title: "Контекст",
        desc: "Выберите текущее состояние",
        options: {
            NORMAL: { label: "Норма", sub: "Обычный режим" },
            HIGH_LOAD: { label: "Нагрузка", sub: "Высокий стресс" },
            CRISIS: { label: "Кризис", sub: "Острая фаза" },
            TRANSITION: { label: "Переход", sub: "Изменения" }
        }
    },
    admin: {
        panel_title: "Панель администратора",
        oversight_layer: "СЛОЙ НАДЗОРА",
        exit: "Выход",
        session_nodes: "Узлы сессии",
        avg_latency: "Средняя задержка",
        diagnostic_protocols: "Диагностические протоколы",
        launch_oracle_protocol: "Запустить Оракул",
        launch_integrity_audit: "Запустить аудит целостности",
        access_clinical: "Клинический доступ",
        master_overrides: "Мастер-управление",
        force_unlock: "Принудительная разблокировка",
        glitch_sim: "Симуляция глитча",
        global_control: "Глобальный контроль",
        broadcast_msg: "Сообщение трансляции",
        block_all: "Блокировка всех",
        issue_license: "Выдать лицензию",
        client_name: "Имя клиента",
        license_duration: "Длительность",
        days: "Дней",
        generate_btn: "Генерировать",
        ready_dist: "Готово к выдаче",
        license_ledger: "Реестр лицензий",
        prepare_github: "Подготовить для GitHub",
        auth_access: "Авторизованный доступ",
        system_unstable: "СИСТЕМА НЕСТАБИЛЬНА",
        immediate_attention: "Требуется внимание",
        data_vault: "Хранилище данных",
        import_state: "Импорт",
        export_backup: "Экспорт",
        mark_revoked: "Отозвать лицензию?",
        kernel: "Ядро",
        registry: "Реестр",
        telemetry: "Телеметрия",
        anomaly: "Аномалии",
        integrity: "Целостность",
        oracle: "Оракул"
    },
    oracle: {
        title: "ПРОТОКОЛ: ОРАКУЛ",
        subtitle: "DYNAMIC SIMULATOR v1.0",
        exit: "ВЫХОД",
        btn_idle: "ЗАПУСТИТЬ СИМУЛЯЦИЮ",
        btn_running: "СИМУЛЯЦИЯ...",
        section_anomalies: "ОБНАРУЖЕННЫЕ АНОМАЛИИ",
        section_calibrator: "ПСИХОМЕТРИЧЕСКИЙ КАЛИБРАТОР",
        no_anomalies: "Аномалий не обнаружено.",
        footer: "Genesis_Oracle_Protocol // Pre-Flight Check"
    },
    guide: {
        title: "Руководство",
        subtitle: "Руководство пользователя",
        sections: [
            { title: "Введение", content: ["Genesis OS помогает понять ваши скрытые паттерны."] }
        ],
        metaphor: "Карта вашей личности"
    },
    pro_guide: {
        title: "PRO Руководство",
        subtitle: "Для специалистов",
        sections: [
            { title: "Интерпретация", content: ["Используйте данные для подготовки к сессии."] }
        ],
        closing: "Точность - вежливость королей"
    },
    brief_explainer: {
        title: "Справка",
        subtitle: "Краткий обзор",
        intro_title: "Что это?",
        intro_text: "Система анализа личности.",
        blocks_title: "Блоки",
        archetype_label: "Архетип",
        archetype_desc: "Основная модель поведения.",
        metrics_title: "Метрики",
        foundation_desc: "Внутренняя опора.",
        agency_desc: "Способность действовать.",
        resource_desc: "Запас энергии.",
        entropy_desc: "Уровень хаоса.",
        neurosync_label: "Нейросинхронизация",
        neurosync_desc: "Связь ума и тела.",
        latency_label: "Латентность",
        latency_desc: "Скорость реакции.",
        combinations_title: "Комбинации",
        combinations_text: "Метрики взаимодействуют друг с другом.",
        action_title: "Действие",
        action_text: "Используйте рекомендации.",
        limits_title: "Ограничения",
        limits_text: "Не является диагнозом.",
        closing: "Изучайте себя."
    },
    clinical_decoder: {
        somatic_dissonance_title: "Соматический диссонанс",
        somatic_dissonance_desc: "Конфликт между сознанием и телом.",
        disclaimer: "Только для профессионального использования.",
        provocations: {
            seducer: "Интеллектуальное соблазнение",
            shadow: "Неуловимая тень",
            critic: "Грандиозный критик",
            wall: "Соматическая стена"
        },
        common_hypotheses: {
            anesthesia: { h: "Анестезия чувств", q: "Что вы не чувствуете?" },
            survival_priority: { h: "Приоритет выживания", q: "Где опасность?" }
        },
        configs: {
            balanced: { title: "Сбалансированный", desc: "Норма" },
            compensatory_overdrive: { title: "Компенсаторный", desc: "Гиперактивность" },
            critical_deficit: { title: "Дефицит", desc: "Нехватка ресурсов" },
            economy_mode: { title: "Эконом", desc: "Сохранение энергии" },
            mobilization: { title: "Мобилизация", desc: "Готовность к действию" },
            chaotic_creative: { title: "Творческий хаос", desc: "Высокая энтропия" },
            chaotic: { title: "Хаос", desc: "Нестабильность" },
            rigid: { title: "Ригидный", desc: "Жесткость" }
        },
        headers: {
            mechanism: "Механизм"
        },
        sync_patterns: {
            dissociation: "Диссоциация",
            coherent: "Когерентность"
        },
        archetype_strategies: {
            THE_ARCHITECT: { strategy: "Планирование", func: "Структура", limit: "Контроль" },
            THE_DRIFTER: { strategy: "Адаптация", func: "Гибкость", limit: "Цель" },
            THE_BURNED_HERO: { strategy: "Служение", func: "Отдача", limit: "Истощение" },
            THE_GOLDEN_PRISONER: { strategy: "Сохранение", func: "Безопасность", limit: "Свобода" },
            THE_CHAOS_SURFER: { strategy: "Импровизация", func: "Новизна", limit: "Порядок" },
            THE_GUARDIAN: { strategy: "Защита", func: "Опека", limit: "Развитие" }
        },
        risks: {
            decompensation: "Декомпенсация"
        },
        session_entries: {
            intellectual: "Интеллектуальный вход",
            shadow: "Теневой вход",
            critic: "Критический вход",
            wall: "Блокированный вход"
        }
    },
    clinical_narratives: {
        labels: {
            armored: "Бронированный",
            critical: "Критический",
            stable: "Стабильный",
            focus_somatic: "Фокус на тело"
        },
        supervisor_patterns: {
             stable: { obs: "Стабильность", risk: "Застой", trap: "Скука", provocation: "Вызов", transfer: "Ровный", tactics: "Поддержка" },
             burnout_protocol: { obs: "Выгорание", risk: "Срыв", trap: "Спасательство", provocation: "Отдых", transfer: "Зависимый", tactics: "Забота" },
             critical_foundation: { obs: "Слабая опора", risk: "Обрушение", trap: "Опека", provocation: "Поддержка", transfer: "Идеализация", tactics: "Укрепление" },
             manic_defense: { obs: "Маниакальная защита", risk: "Истощение", trap: "Восхищение", provocation: "Замедление", transfer: "Конкуренция", tactics: "Заземление" },
             narcissistic_expansion: { obs: "Нарциссическое расширение", risk: "Стыд", trap: "Ничтожность", provocation: "Реальность", transfer: "Зеркальный", tactics: "Отражение" },
             frozen_state: { obs: "Заморозка", risk: "Апатия", trap: "Активность", provocation: "Тепло", transfer: "Отстраненный", tactics: "Разогрев" },
             dissociation: { obs: "Диссоциация", risk: "Потеря связи", trap: "Интеллектуализация", provocation: "Тело", transfer: "Пустой", tactics: "Связывание" },
             systemic_loyalty: { obs: "Лояльность", risk: "Жертва", trap: "Соучастие", provocation: "Автономия", transfer: "Семейный", tactics: "Разделение" }
        },
        profiles: {
            compensatory: { contract: "Я буду сильным", goal: "Признание слабости", process: "Снятие брони", p_profile: "Компенсаторный", deep_expl: "Страх уязвимости", behavior: "Активный", hypo: "Гипотеза силы", transference: "Идеализация", counter_transference: "Восхищение", trap: "Поддержка фасада", fragility: "Провал", strategies: ["Конфронтация"] },
            borderline: { contract: "Спаси меня", goal: "Целостность", process: "Контейнирование", p_profile: "Пограничный", deep_expl: "Страх покинутости", behavior: "Нестабильный", hypo: "Гипотеза дефицита", transference: "Слияние", counter_transference: "Тревога", trap: "Спасательство", fragility: "Отвержение", strategies: ["Границы"] },
            neurotic: { contract: "Исправь меня", goal: "Свобода", process: "Осознание", p_profile: "Невротический", deep_expl: "Внутренний конфликт", behavior: "Сдержанный", hypo: "Гипотеза запрета", transference: "Рабочий", counter_transference: "Интерес", trap: "Интеллектуализация", fragility: "Вина", strategies: ["Анализ"] },
            chaotic: { contract: "Упорядочи меня", goal: "Структура", process: "Организация", p_profile: "Хаотический", deep_expl: "Отсутствие опор", behavior: "Импульсивный", hypo: "Гипотеза хаоса", transference: "Хаотичный", counter_transference: "Растерянность", trap: "Контроль", fragility: "Давление", strategies: ["Структурирование"] }
        },
        systemic: {
            loyalty_desc: "Системная лояльность",
            supervisor_note: "Обратить внимание на семейную историю",
            systemic_order_1: "Восстановление порядка"
        },
        interventions: {
            confrontation_1: "Конфронтация с защитой",
            support_1: "Поддержка Эго"
        },
        diagnoses: {
            affective: "Аффективный спектр",
            narcissistic: "Нарциссический спектр",
            manic: "Маниакальный спектр",
            systemic: "Системная динамика"
        },
        diff_expl: "Дифференциальный анализ",
        validity_expl: "Оценка валидности",
        steps: {
            confrontation_func: "Конфронтация",
            confrontation_func_action: "Предъявление противоречия",
            search_crack: "Поиск бреши",
            search_crack_action: "Исследование уязвимости"
        }
    },
    global: {
        back: "Назад",
        complete: "Готово",
        calibrating: "КАЛИБРОВКА",
        calib_desc: "Настройка чувствительности системы..."
    },
    sync: {
        title: "СИНХРОНИЗАЦИЯ",
        desc: "Что ощущается в теле?",
        guidance_tip: "Не анализируйте, чувствуйте.",
        break_title: "ПАУЗА ДЛЯ ИНТЕГРАЦИИ",
        break_desc: "Система обрабатывает большой массив данных. Сделайте вдох.",
        break_btn: "ПРОДОЛЖИТЬ",
        s0: "НЕЙТРАЛЬНО",
        s1: "БЛОК / ЗАЖИМ",
        s2: "ТЕПЛО / ПОТОК",
        s3: "ХОЛОД / ПУСТОТА",
        s4: "ДРОЖЬ / ВИБРАЦИЯ"
    },
    sensation_feedback: {
        s0: "ДАННЫЕ ПРИНЯТЫ",
        s1: "ЗАФИКСИРОВАНО НАПРЯЖЕНИЕ",
        s2: "РЕСУРСНЫЙ ОТКЛИК",
        s3: "СНИЖЕНИЕ ЭНЕРГИИ",
        s4: "ВЫСОКАЯ ИНТЕНСИВНОСТЬ"
    },
    dashboard: {
        desc: "Панель управления состоянием.",
        insight_coherence: "Система работает слаженно.",
        insight_noise: "Обнаружен высокий уровень шума.",
        insight_somatic_dissonance: "Тело и разум рассинхронизированы.",
        select_domain: "ВЫБЕРИТЕ МОДУЛЬ",
        manual_btn: "СПРАВОЧНИК"
    },
    safety: {
        trigger_warning_title: "ВЫСОКАЯ ИНТЕНСИВНОСТЬ",
        trigger_warning_desc: "Вопросы могут вызвать сильный отклик.",
        emergency_contacts_title: "ЭКСТРЕННАЯ ПОМОЩЬ",
        emergency_contacts_desc: "Если вы чувствуете, что не справляетесь, остановитесь.",
        return_btn: "В БЕЗОПАСНОСТЬ",
        uncomfortable_btn: "МНЕ ТЯЖЕЛО",
        alert: "ТРЕВОГА",
        time_remaining: "ОСТАЛОСЬ",
        minutes: "МИН"
    },
    interventions: {},
    directives: {},
    interferences: {},
    results: {
        integrity: "Целостность",
        neuro_sync: "Нейросинк",
        blueprint: "Блупринт",
        confidence: "Доверие",
        session_prep: "Подготовка",
        session_prep_desc: "Вопросы для сессии",
        protection_label: "Защита",
        cost_label: "Цена",
        disclaimer_title: "Отказ от ответственности",
        disclaimer_body: "Не является диагнозом",
        active_patterns_title: "Активные паттерны",
        methodology_title: "Методология",
        methodology_desc: "Как это работает",
        share_button: "Поделиться",
        back: "Назад",
        brief_instruction: "Инструкция",
        encrypted_overlay: "Зашифровано"
    },
    integrity_audit: {
        title: "АУДИТ ЦЕЛОСТНОСТИ",
        version_label: "v1.0",
        exit_btn: "ВЫХОД",
        metrics: {
            emergence: "Эмерджентность",
            synergy: "Синергия",
            phase_risk: "Риск фазового перехода"
        },
        dynamics_label: "ДИНАМИКА",
        system_narrative: "СИСТЕМНЫЙ НАРРАТИВ",
        no_anomalies: "АНОМАЛИЙ НЕ ОБНАРУЖЕНО",
        organs: {
            NERVOUS_SYSTEM: "НЕРВНАЯ СИСТЕМА",
            METABOLISM: "МЕТАБОЛИЗМ",
            VOICE: "ГОЛОС",
            IMMUNITY: "ИММУНИТЕТ",
            STRUCTURE: "СТРУКТУРА"
        },
        efficiency: "ЭФФЕКТИВНОСТЬ",
        optimal: "ОПТИМАЛЬНО",
        anomalies: {
            DEAD_CODE: "МЕРТВЫЙ КОД",
            SPOF: "ЕДИНАЯ ТОЧКА ОТКАЗА",
            BUTTERFLY: "ЭФФЕКТ БАБОЧКИ",
            DOMINO: "ЭФФЕКТ ДОМИНО",
            HYSTERESIS: "ГИСТЕРЕЗИС",
            TECH_DEBT: "ТЕХНИЧЕСКИЙ ДОЛГ",
            COUPLING: "СВЯЗАННОСТЬ",
            CONWAY: "ЗАКОН КОНВЕЯ",
            DETERMINISM: "РИСК ДЕТЕРМИНИЗМА",
            CIRCUIT_BRK: "ПРЕДОХРАНИТЕЛЬ",
            BIFURCATION: "БИФУРКАЦИЯ",
            ATTRACTORS: "СТРАННЫЕ АТТРАКТОРЫ",
            STABLE: "СТАБИЛЬНЫЕ АТТРАКТОРЫ",
            RESONANCE: "РЕЗОНАНС"
        },
        initializing: "ИНИЦИАЛИЗАЦИЯ...",
        verdict_healthy: "СИСТЕМА СТАБИЛЬНА",
        verdict_unstable: "ОБНАРУЖЕНА НЕСТАБИЛЬНОСТЬ"
    },
    conflicts: {
        critical_deficit: { title: "Ресурсная Яма", desc: "Система тратит больше, чем получает. Фундамент не выдерживает амбиций." },
        brilliant_sabotage: { title: "Блестящее Сопротивление", desc: "Высокий интеллект используется для защиты от реальных изменений." },
        invisibile_ceiling: { title: "Стеклянный Потолок", desc: "Опоры мощные, но страх масштаба блокирует рост." },
        leaky_bucket: { title: "Утечка Энергии", desc: "Высокий ресурс сливается через хаос и отсутствие фокуса." },
        paralyzed_giant: { title: "Паралич Воли", desc: "Потенциал огромен, но способность действовать заблокирована." },
        frozen_potential: { title: "Анабиоз", desc: "Все системы работают на минимуме для сохранения безопасности." },
        healthy_scale: { title: "Баланс", desc: "Конфликты минимальны, система готова к нагрузке." },
        family_loyalty: { title: "Родовой Долг", desc: "Бессознательный запрет жить лучше, чем предки." }
    },
    beliefs: {
        family_loyalty: "Семейная лояльность",
        scarcity_mindset: "Дефицитарное мышление",
        fear_of_punishment: "Страх наказания",
        imposter_syndrome: "Синдром самозванца",
        poverty_is_virtue: "Бедность как добродетель",
        hard_work_only: "Только тяжелый труд",
        self_permission: "Саморазрешение",
        fear_of_conflict: "Страх конфликта",
        betrayal_trauma: "Травма предательства",
        unconscious_fear: "Бессознательный страх",
        money_is_danger: "Деньги - опасность",
        impulse_spend: "Импульсивные траты",
        resource_toxicity: "Токсичность ресурса",
        short_term_bias: "Краткосрочное мышление",
        capacity_expansion: "Расширение емкости",
        boundary_collapse: "Коллапс границ",
        shame_of_success: "Стыд успеха",
        hero_martyr: "Герой-мученик",
        latency_resistance: "Латентное сопротивление",
        body_mind_conflict: "Конфликт ум-тело",
        ambivalence_loop: "Петля амбивалентности",
        autopilot_mode: "Автопилот",
        golden_cage: "Золотая клетка",
        money_is_tool: "Деньги - инструмент",
        default: "Стандарт"
    },
    pattern_library: {
        scarcity_mindset: { protection: "Контроль", cost: "Тревога", antidote: "Доверие" },
        family_loyalty: { protection: "Принадлежность", cost: "Самореализация", antidote: "Сепарация" },
        fear_of_punishment: { protection: "Безопасность", cost: "Свобода", antidote: "Взросление" },
        imposter_syndrome: { protection: "თავმდაბლობა", cost: "აღიარება", antidote: "ფაქტები" },
        hard_work_only: { protection: "Оправдание", cost: "Здоровье", antidote: "Ценность" },
        fear_of_conflict: { protection: "Мир", cost: "Границы", antidote: "Ассертивность" },
        betrayal_trauma: { protection: "Неуязвимость", cost: "Близость", antidote: "Риск" },
        money_is_danger: { protection: "Спокойствие", cost: "Возможности", antidote: "Управление" },
        hero_martyr: { protection: "Нужность", cost: "Истощение", antidote: "Делегирование" },
        golden_cage: { protection: "Комфорт", cost: "Смысл", antidote: "Прыжок" },
        default: { protection: "Защита", cost: "Цена", antidote: "Решение" }
    },
    archetypes: {
        THE_ARCHITECT: { title: "АРХИТЕКТОР", desc: "Строитель систем", superpower: "Структура", shadow: "Ригидность", quote: "Порядок из хаоса" },
        THE_DRIFTER: { title: "СТРАННИК", desc: "Искатель", superpower: "Гибкость", shadow: "Бесцельность", quote: "Путь важнее цели" },
        THE_BURNED_HERO: { title: "ОБОЖЖЕННЫЙ ГЕРОЙ", desc: "Выживший", superpower: "Стойкость", shadow: "Цинизм", quote: "Я выстоял" },
        THE_GOLDEN_PRISONER: { title: "ЗОЛОТОЙ УЗНИК", desc: "Заложник успеха", superpower: "Статус", shadow: "Несвобода", quote: "Все есть, но..." },
        THE_CHAOS_SURFER: { title: "СЕРФЕР ХАОСА", desc: "Адаптивный", superpower: "Реакция", shadow: "Нестабильность", quote: "Лови волну" },
        THE_GUARDIAN: { title: "ХРАНИТЕЛЬ", desc: "Оберегающий", superpower: "Забота", shadow: "Гиперопека", quote: "Безопасность прежде всего" }
    },
    verdicts: {
        HEALTHY_SCALE: { label: "ЗДОРОВЫЙ МАСШТАБ", impact: "Оптимально" },
        BRILLIANT_SABOTAGE: { label: "БРИЛЛИАНТОВЫЙ САБОТАЖ", impact: "Скрытый конфликт" },
        INVISIBILE_CEILING: { label: "НЕВИДИМЫЙ ПОТОЛОК", impact: "Ограничение роста" },
        LEAKY_BUCKET: { label: "ДЫРЯВОЕ ВЕДРО", impact: "Потеря ресурса" },
        PARALYZED_GIANT: { label: "ПАРАЛИЗОВАННЫЙ ГИГАНТ", impact: "Блокировка силы" },
        FROZEN_POTENTIAL: { label: "ЗАМОРОЖЕННЫЙ ПОТЕНЦИАЛ", impact: "Стагнация" },
        CRITICAL_DEFICIT: { label: "КРИТИЧЕСКИЙ ДЕФИЦИТ", impact: "Истощение" }
    },
    session_prep_templates: {
        low_foundation_pattern: "Как {{pattern}} влияет на вашу опору?",
        low_foundation_generic: "Что дает вам ощущение безопасности?",
        somatic_dissonance: "Что вы чувствуете в теле, когда думаете о {{pattern}}?",
        default_archetype: "Как {{archetype_shadow}} проявляется в вашей жизни?",
        pattern_interaction: "Как связаны {{pattern1}} и {{pattern2}}?",
        default_latency: "Замечаете ли вы паузы в ответах?",
        default_verdict: "Как {{verdict_impact}} влияет на ваши решения?"
    },
    legal: {
        tos_title: "Условия использования",
        tos_body: "Используя сервис, вы соглашаетесь с тем, что результаты носят информационный характер и не заменяют профессиональную медицинскую помощь.",
        privacy_title: "Конфиденциальность",
        privacy_body: "Мы не храним личные данные. Весь анализ происходит локально на вашем устройстве. Облачная синхронизация отсутствует.",
        close_btn: "Закрыть"
    },
    test_metrics: {
        insight_resolution: "Разрешение инсайта",
        confidence: "Уверенность",
        adaptive_active: "Адаптивный режим",
        signal_clean: "Сигнал чист",
        dissonance_points: "точек диссонанса",
        structural_contradictions: "Структурные противоречия",
        persona_conflict_hint: "Конфликт персоны"
    },
    soft_mode: {
        archetype_prefix: "Мягкий ",
        verdict_softened: {
            CRITICAL_DEFICIT: "Требует внимания"
        }
    },
    methodology_faq: [
        { q: "Как это работает?", a: "Система анализирует не только ваши ответы, но и скорость реакции (латентность) и телесный отклик (нейросинк). Это позволяет выявить то, что сознание пытается скрыть." },
        { q: "Что делать с результатом?", a: "Результат — это карта для работы с психологом. Используйте вопросы из блока 'Подготовка' для начала терапии." },
        { q: "Это диагноз?", a: "Нет. Genesis OS — это инструмент скрининга паттернов, а не медицинская диагностика." }
    ],
    scenes: {
        // ... (scenes omitted for brevity, assuming they are correct) ...
        foundation_0: { title: "КАЛИБРОВКА СИСТЕМЫ", desc: "Как вы обычно реагируете на необходимость принять быстрое решение в условиях неопределенности?", c1: "Действую на автомате", c2: "Замираю и жду", c3: "Анализирую ресурсы" },
        // ... (rest of scenes)
    },
    domains: { 
        foundation: "Фундамент", 
        agency: "Субъектность", 
        money: "Ресурс", 
        social: "Социум", 
        legacy: "Наследие" 
    },
    ekg: { title: "ПУЛЬС СЕССИИ" },
    pro_terminal: {
        diagnostic_protocol: "ДИАГНОСТИЧЕСКИЙ ПРОТОКОЛ",
        paste_placeholder: "ВСТАВЬТЕ КОД КЛИЕНТА",
        initiate_decrypt: "РАСШИФРОВАТЬ ПРОФИЛЬ",
        no_latency_anomalies: "Аномалий задержки не выявлено",
        latency_hint: "Красные зоны указывают на когнитивное сопротивление",
        sabotage_standard: "Стандартное сопротивление изменениям",
        sabotage_intellectual: "Интеллектуализация как защита от чувств",
        resistance_label: "Сопротивление",
        decrypting_msg: "РАСШИФРОВКА...",
        dossier_btn: "СГЕНЕРИРОВАТЬ ДОСЬЕ",
        monolith_output: "ВЫВОД MONOLITH",
        monolith_precision: "ТОЧНОСТЬ: ВЫСОКАЯ",
        copy_success: "СКОПИРОВАНО",
        export_crm: "ЭКСПОРТ В БУФЕР"
    },
    pro_headers: {
        differential: "ДИФФЕРЕНЦИАЛЬНЫЙ АНАЛИЗ",
        badge_prob_map: "ВЕРОЯТНОСТЬ",
        heatmap: "НЕЙРО-ТЕПЛОВАЯ КАРТА",
        badge_latency: "ЛАТЕНТНОСТЬ",
        sabotage: "САБОТАЖ АЛЬЯНСА",
        badge_contact: "КОНТАКТ",
        beliefs: "СИСТЕМА УБЕЖДЕНИЙ",
        badge_schemas: "СХЕМЫ"
    },
    phases: {
        SANITATION: "Санитарная фаза",
        STABILIZATION: "Стабилизация",
        EXPANSION: "Расширение"
    },
    tasks: {
        // ...
    },
    explanations: {},
    metric_definitions: {},
    system_commentary: [],
    auth_hint: "",
    legal_disclaimer: "",
    synthesis_categories: {},
    synthesis: {},
    correlation_types: {},
    export_image: {
        header: "GENESIS OS // CLINICAL BRIDGE",
        blueprint_title: "IDENTITY BLUEPRINT",
        footer: "CLINICAL SCREENING",
        metrics: {
            integrity: "INTEGRITY",
            entropy: "ENTROPY"
        }
    }
};

const ka: Translations = {
    ...ru,
    subtitle: "Genesis OS // კლინიკური ხიდი",
    onboarding: {
        ...ru.onboarding,
        protocol_btn: "პროტოკოლის დაწყება",
        pricing_btn: "ტარიფები",
        promo_title: "Genesis Pro",
        promo_desc: "ფსიქოლოგებისთვის",
        recommended_tag: "რეკომენდირებული",
        price_per_month: "/ თვე",
        features_clinical: "სიღრმისეული ანალიზი;სუპერვიზია;ექსპორტი"
    },
    global: {
        back: "უკან",
        complete: "დასრულებულია",
        calibrating: "კალიბრაცია",
        calib_desc: "სისტემის მგრძნობელობის გასწორება..."
    },
    sync: {
        title: "სინქრონიზაცია",
        desc: "რას გრძნობთ სხეულში?",
        guidance_tip: "არ გააანალიზოთ, იგრძენით.",
        break_title: "ინტეგრაციის პაუზა",
        break_desc: "სისტემა ამუშავებს მონაცემებს. ისუნთქეთ.",
        break_btn: "გაგრძელება",
        s0: "ნეიტრალური",
        s1: "ბლოკი / დაძაბულობა",
        s2: "სითბო / დინება",
        s3: "სიცივე / სიცარიელე",
        s4: "კანკალი / ვიბრაცია"
    },
    sensation_feedback: {
        s0: "მონაცემები მიღებულია",
        s1: "დაფიქსირდა დაძაბულობა",
        s2: "რესურსული გამოძახილი",
        s3: "ენერგიის ვარდნა",
        s4: "მაღალი ინტენსივობა"
    },
    dashboard: {
        desc: "მართვის პანელი.",
        insight_coherence: "სისტემა გამართულია.",
        insight_noise: "მაღალი ხმაურის დონე.",
        insight_somatic_dissonance: "სხეული და გონება აცდენილია.",
        select_domain: "აირჩიეთ დომენი",
        manual_btn: "ცნობარი"
    },
    safety: {
        trigger_warning_title: "მაღალი ინტენსივობა",
        trigger_warning_desc: "კითხვებმა შეიძლება გამოიწვიოს ძლიერი რეაქცია.",
        emergency_contacts_title: "დახმარება",
        emergency_contacts_desc: "თუ გრძნობთ რომ ვერ უმკლავდებით, შეჩერდით.",
        return_btn: "უსაფრთხოებაში",
        uncomfortable_btn: "მიჭირს",
        alert: "ყურადღება",
        time_remaining: "დარჩა",
        minutes: "წთ"
    },
    invalid_results: {
        ...ru.invalid_results,
        title: "შედეგი არავალიდურია",
        message: "სისტემამ დააფიქსირა ანომალიები.",
        reset_button: "გადატვირთვა",
        recommendation: "გთხოვთ უპასუხოთ გულწრფელად."
    },
    data_corruption: {
        title: "მონაცემთა შეცდომა",
        message: "მონაცემთა მთლიანობა დარღვეულია.",
        recommendation: "საჭიროა გადატვირთვა.",
        reset_button: "გადატვირთვა"
    },
    boot_sequence: ["ჩატვირთვა...", "ბირთვი...", "შემოწმება...", "მზადაა"],
    domains: { 
        foundation: "საყრდენი", 
        agency: "ნებელობა", 
        money: "ფული", 
        social: "სოციუმი", 
        legacy: "მემკვიდრეობა" 
    },
    ui: {
        ...ru.ui,
        reset_session_btn: "სესიის განულება",
        auth_title: "ავტორიზაცია",
        code_input_placeholder: "შეიყვანეთ კოდი",
        enter_code_btn: "კოდის შეყვანა",
        logout_btn: "გასვლა",
        resume_session_btn: "გაგრძელება",
        progress_label: "პროგრესი",
        system_audit_title: "სისტემური აუდიტი",
        evolution_title: "ევოლუცია",
        sessions_secured: "სესია",
        first_investigation_hint: "პირველი კვლევა",
        integrity_drift: "მთლიანობის დრეიფი",
        noise_tracking: "ხმაური",
        evolution_insight_desc: "დინამიკა კონტროლდება.",
        start_new_cycle_btn: "ახალი ციკლი",
        agree_terms_btn: "პირობებზე თანხმობა",
        module_label: "მოდული",
        verdict_label: "ვერდიქტი",
        priority_label: "პრიორიტეტი",
        access_restricted: "წვდომა შეზღუდულია",
        enter_code_desc: "შეიყვანეთ კლიენტის ID ან კოდი პროფილის გასახსნელად."
    },
    admin: {
        panel_title: "ადმინისტრატორის პანელი",
        oversight_layer: "ზედამხედველობის შრე",
        exit: "გასვლა",
        session_nodes: "სესიის კვანძები",
        avg_latency: "საშუალო დაყოვნება",
        diagnostic_protocols: "დიაგნოსტიკური პროტოკოლები",
        launch_oracle_protocol: "ორაკულის გაშვება",
        launch_integrity_audit: "მთლიანობის აუდიტის გაშვება",
        access_clinical: "კლინიკური წვდომა",
        master_overrides: "მასტერ-მართვა",
        force_unlock: "იძულებითი განბლოკვა",
        glitch_sim: "გლიჩის სიმულაცია",
        global_control: "გლობალური კონტროლი",
        broadcast_msg: "მაუწყებლობის შეტყობინება",
        block_all: "ყველას დაბლოკვა",
        issue_license: "ლიცენზიის გაცემა",
        client_name: "კლიენტის სახელი",
        license_duration: "ხანგრძლივობა",
        days: "დღე",
        generate_btn: "გენერირება",
        ready_dist: "მზადაა გასაცემად",
        license_ledger: "ლიცენზიების რეესტრი",
        prepare_github: "GitHub-ისთვის მომზადება",
        auth_access: "ავტორიზებული წვდომა",
        system_unstable: "სისტემა არასტაბილურია",
        immediate_attention: "საჭიროებს ყურადღებას",
        data_vault: "მონაცემთა საცავი",
        import_state: "იმპორტი",
        export_backup: "ექსპორტი",
        mark_revoked: "ლიცენზიის გაუქმება?",
        kernel: "ბირთვი",
        registry: "რეესტრი",
        telemetry: "ტელემეტრია",
        anomaly: "ანომალიები",
        integrity: "მთლიანობა",
        oracle: "ორაკული"
    },
    oracle: {
        title: "პროტოკოლი: ორაკული",
        subtitle: "დინამიური სიმულატორი v1.0",
        exit: "გასვლა",
        btn_idle: "სიმულაციის გაშვება",
        btn_running: "სიმულაცია...",
        section_anomalies: "აღმოჩენილი ანომალიები",
        section_calibrator: "ფსიქომეტრიული კალიბრატორი",
        no_anomalies: "ანომალიები არ არის.",
        footer: "Genesis_Oracle_Protocol // წინასწარი შემოწმება"
    },
    guide: {
        title: "სახელმძღვანელო",
        subtitle: "მომხმარებლის გზამკვლევი",
        sections: [
            { title: "შესავალი", content: ["Genesis OS გეხმარებათ ფარული პატერნების გაგებაში."] }
        ],
        metaphor: "პიროვნების რუკა"
    },
    clinical_decoder: {
        ...ru.clinical_decoder,
        somatic_dissonance_title: "სომატური დისონანსი",
        somatic_dissonance_desc: "კონფლიქტი გონებასა და სხეულს შორის.",
        disclaimer: "მხოლოდ პროფესიული გამოყენებისთვის.",
        configs: {
            balanced: { title: "დაბალანსებული", desc: "ნორმა" },
            compensatory_overdrive: { title: "კომპენსატორული", desc: "ჰიპერაქტივობა" },
            critical_deficit: { title: "დეფიციტი", desc: "რესურსების ნაკლებობა" },
            economy_mode: { title: "ეკონომია", desc: "ენერგიის დაზოგვა" },
            mobilization: { title: "მობილიზაცია", desc: "მოქმედებისთვის მზადყოფნა" },
            chaotic_creative: { title: "შემოქმედებითი ქაოსი", desc: "მაღალი ენტროპია" },
            chaotic: { title: "ქაოსი", desc: "არასტაბილურობა" },
            rigid: { title: "რიგიდული", desc: "სიმკაცრე" }
        }
    },
    clinical_narratives: {
        ...ru.clinical_narratives,
        labels: {
            armored: "დაჯავშნული",
            critical: "კრიტიკული",
            stable: "სტაბილური",
            focus_somatic: "ფოკუსი სხეულზე"
        },
        profiles: {
            compensatory: { contract: "მე ვიქნები ძლიერი", goal: "სისუსტის აღიარება", process: "ჯავშნის მოხსნა", p_profile: "კომპენსატორული", deep_expl: "მოწყვლადობის შიში", behavior: "აქტიური", hypo: "ძალის ჰიპოთეზა", transference: "იდეალიზაცია", counter_transference: "აღტაცება", trap: "ფასადის მხარდაჭერა", fragility: "ჩავარდნა", strategies: ["კონფრონტაცია"] },
            borderline: { contract: "გადამარჩინე", goal: "მთლიანობა", process: "კონტეინირება", p_profile: "მოსაზღვრე", deep_expl: "მიტოვების შიში", behavior: "არასტაბილური", hypo: "დეფიციტის ჰიპოთეზა", transference: "შერწყმა", counter_transference: "შფოთვა", trap: "მშველელი", fragility: "უარყოფა", strategies: ["საზღვრები"] },
            neurotic: { contract: "შემაკეთე", goal: "თავისუფლება", process: "გაცნობიერება", p_profile: "ნევროტული", deep_expl: "შინაგანი კონფლიქტი", behavior: "თავშეკავებული", hypo: "აკრძალვის ჰიპოთეზა", transference: "სამუშაო", counter_transference: "ინტერესი", trap: "ინტელექტუალიზაცია", fragility: "დანაშაულის განცდა", strategies: ["ანალიზი"] },
            chaotic: { contract: "დამალაგე", goal: "სტრუქტურა", process: "ორგანიზება", p_profile: "ქაოტური", deep_expl: "საყრდენების არარსებობა", behavior: "იმპულსური", hypo: "ქაოსის ჰიპოთეზა", transference: "ქაოტური", counter_transference: "დაბნეულობა", trap: "კონტროლი", fragility: "ზეწოლა", strategies: ["სტრუქტურირება"] }
        },
        systemic: {
            loyalty_desc: "სისტემური ლოიალობა",
            supervisor_note: "ყურადღება მიაქციეთ ოჯახის ისტორიას",
            systemic_order_1: "წესრიგის აღდგენა"
        },
        interventions: {
            confrontation_1: "კონფრონტაცია დაცვასთან",
            support_1: "ეგოს მხარდაჭერა"
        },
        diagnoses: {
            affective: "აფექტური სპექტრი",
            narcissistic: "ნარცისული სპექტრი",
            manic: "მანიაკალური სპექტრი",
            systemic: "სისტემური დინამიკა"
        },
        diff_expl: "დიფერენციალური ანალიზი",
        validity_expl: "ვალიდურობის შეფასება",
        steps: {
            confrontation_func: "კონფრონტაცია",
            confrontation_func_action: "წინააღმდეგობის ჩვენება",
            search_crack: "ბზარის ძიება",
            search_crack_action: "მოწყვლადობის კვლევა"
        }
    },
    results: {
        ...ru.results,
        integrity: "მთლიანობა",
        neuro_sync: "ნეიროსინქრონიზაცია",
        blueprint: "გეგმა",
        confidence: "ნდობა",
        session_prep: "მომზადება",
        session_prep_desc: "კითხვები სესიისთვის",
        active_patterns_title: "აქტიური პატერნები",
        share_button: "გაზიარება",
        back: "უკან",
        brief_instruction: "ინსტრუქცია",
        encrypted_overlay: "დაშიფრულია",
        disclaimer_title: "პასუხისმგებლობის უარყოფა",
        disclaimer_body: "არ წარმოადგენს დიაგნოზს",
        methodology_title: "მეთოდოლოგია",
        methodology_desc: "როგორ მუშაობს"
    },
    integrity_audit: {
        title: "მთლიანობის აუდიტი",
        version_label: "v1.0",
        exit_btn: "გასვლა",
        metrics: {
            emergence: "ემერჯენტობა",
            synergy: "სინერგია",
            phase_risk: "ფაზური რისკი"
        },
        dynamics_label: "დინამიკა",
        system_narrative: "სისტემური ნარატივი",
        no_anomalies: "ანომალიები არ არის",
        organs: {
            NERVOUS_SYSTEM: "ნერვული სისტემა",
            METABOLISM: "მეტაბოლიზმი",
            VOICE: "ხმა",
            IMMUNITY: "იმუნიტეტი",
            STRUCTURE: "სტრუქტურა"
        },
        efficiency: "ეფექტურობა",
        optimal: "ოპტიმალური",
        anomalies: {
            DEAD_CODE: "მკვდარი კოდი",
            SPOF: "ჩავარდნის ერთი წერტილი",
            BUTTERFLY: "პეპლის ეფექტი",
            DOMINO: "დომინოს ეფექტი",
            HYSTERESIS: "ჰისტერეზისი",
            TECH_DEBT: "ტექნიკური ვალი",
            COUPLING: "ბმა",
            CONWAY: "კონვეის კანონი",
            DETERMINISM: "დეტერმინიზმის რისკი",
            CIRCUIT_BRK: "დამცველი",
            BIFURCATION: "ბიფურკაცია",
            ATTRACTORS: "უცნაური ატრაქტორები",
            STABLE: "სტაბილური ატრაქტორები",
            RESONANCE: "რეზონანსი"
        },
        initializing: "ინიციალიზაცია...",
        verdict_healthy: "სისტემა სტაბილურია",
        verdict_unstable: "აღმოჩენილია არასტაბილურობა"
    },
    conflicts: {
        critical_deficit: { title: "რესურსული ორმო", desc: "სისტემა ხარჯავს მეტს, ვიდრე იღებს. საყრდენი ვერ უძლებს ამბიციებს." },
        brilliant_sabotage: { title: "ბრწყინვალე საბოტაჟი", desc: "მაღალი ინტელექტი გამოიყენება რეალური ცვლილებებისგან თავის დასაცავად." },
        invisibile_ceiling: { title: "უხილავი ჭერი", desc: "საყრდენები მყარია, მაგრამ მასშტაბის შიში ბლოკავს ზრდას." },
        leaky_bucket: { title: "ენერგიის გაჟონვა", desc: "მაღალი რესურსი იკარგება ქაოსსა და ფოკუსის არარსებობაში." },
        paralyzed_giant: { title: "ნებისყოფის დამბლა", desc: "პოტენციალი დიდია, მაგრამ მოქმედების უნარი დაბლოკილია." },
        frozen_potential: { title: "ანაბიოზი", desc: "ყველა სისტემა მუშაობს მინიმუმზე უსაფრთხოების შესანარჩუნებლად." },
        healthy_scale: { title: "ბალანსი", desc: "კონფლიქტები მინიმალურია, სისტემა მზადაა დატვირთვისთვის." },
        family_loyalty: { title: "გვაროვნული ვალი", desc: "არაცნობიერი აკრძალვა იცხოვრო წინაპრებზე უკეთ." }
    },
    beliefs: {
        family_loyalty: "ოჯახური ლოიალობა",
        scarcity_mindset: "დეფიციტური აზროვნება",
        fear_of_punishment: "დასჯის შიში",
        imposter_syndrome: "თვითმარქვიას სინდრომი",
        poverty_is_virtue: "სიღარიბე როგორც სათნოება",
        hard_work_only: "მხოლოდ მძიმე შრომა",
        self_permission: "თვითნებართვა",
        fear_of_conflict: "კონფლიქტის შიში",
        betrayal_trauma: "ღალატის ტრავმა",
        unconscious_fear: "არაცნობიერი შიში",
        money_is_danger: "ფული საფრთხეა",
        impulse_spend: "იმპულსური ხარჯვა",
        resource_toxicity: "რესურსის ტოქსიკურობა",
        short_term_bias: "მოკლევადიანი აზროვნება",
        capacity_expansion: "ტევადობის გაფართოება",
        boundary_collapse: "საზღვრების რღვევა",
        shame_of_success: "წარმატების სირცხვილი",
        hero_martyr: "გმირი-მოწამე",
        latency_resistance: "ლატენტური წინააღმდეგობა",
        body_mind_conflict: "გონება-სხეულის კონფლიქტი",
        ambivalence_loop: "ამბივალენტობის მარყუჟი",
        autopilot_mode: "ავტოპილოტი",
        golden_cage: "ოქროს გალია",
        money_is_tool: "ფული — ინსტრუმენტია",
        default: "სტანდარტი"
    },
    pattern_library: {
        scarcity_mindset: { protection: "კონტროლი", cost: "შფოთვა", antidote: "ნდობა" },
        family_loyalty: { protection: "მიკუთვნებულობა", cost: "თვითანალიზი", antidote: "სეპარაცია" },
        fear_of_punishment: { protection: "უსაფრთხოება", cost: "თავისუფლება", antidote: "გაზრდა" },
        imposter_syndrome: { protection: "თავმდაბლობა", cost: "აღიარება", antidote: "ფაქტები" },
        hard_work_only: { protection: "გამართლება", cost: "ჯანმრთელობა", antidote: "ღირებულება" },
        fear_of_conflict: { protection: "მშვიდობა", cost: "საზღვრები", antidote: "ასერტიულობა" },
        betrayal_trauma: { protection: "მოუწყვლადობა", cost: "სიახლოვე", antidote: "რისკი" },
        money_is_danger: { protection: "სიმშვიდე", cost: "შესაძლებლობები", antidote: "მართვა" },
        hero_martyr: { protection: "Нужность", cost: "Истощение", antidote: "Делегирование" },
        golden_cage: { protection: "კომფორტი", cost: "აზრი", antidote: "ნახტომი" },
        default: { protection: "დაცვა", cost: "ფასი", antidote: "გადაწყვეტა" }
    },
    archetypes: {
        THE_ARCHITECT: { title: "არქიტექტორი", desc: "სისტემების მშენებელი", superpower: "სტრუქტურა", shadow: "რიგიდულობა", quote: "წესრიგი ქაოსიდან" },
        THE_DRIFTER: { title: "მოხეტიალე", desc: "მაძიებელი", superpower: "მოქნილობა", shadow: "უმიზნობა", quote: "გზა უფრო მნიშვნელოვანია" },
        THE_BURNED_HERO: { title: "დამწვარი გმირი", desc: "გადარჩენილი", superpower: "გამძლეობა", shadow: "ცინიზმი", quote: "მე გადავრჩი" },
        THE_GOLDEN_PRISONER: { title: "ოქროს ტყვე", desc: "წარმატების მძევალი", superpower: "სტატუსი", shadow: "თავისუფლების ნაკლებობა", quote: "ყველაფერი მაქვს, მაგრამ..." },
        THE_CHAOS_SURFER: { title: "ქაოსის სერფერი", desc: "ადაპტიური", superpower: "რეაქცია", shadow: "არასტაბილურობა", quote: "დაიჭირე ტალღა" },
        THE_GUARDIAN: { title: "მცველი", desc: "მზრუნველი", superpower: "ზრუნვა", shadow: "ჰიპერმზრუნველობა", quote: "უსაფრთხოება უპირველეს ყოვლისა" }
    },
    verdicts: {
        HEALTHY_SCALE: { label: "ჯანსაღი მასშტაბი", impact: "ოპტიმალური" },
        BRILLIANT_SABOTAGE: { label: "ბრწყინვალე საბოტაჟი", impact: "ფარული კონფლიქტი" },
        INVISIBILE_CEILING: { label: "უხილავი ჭერი", impact: "ზრდის შეზღუდვა" },
        LEAKY_BUCKET: { label: "გახვრეტილი ვედრო", impact: "რესურსის დაკარგვა" },
        PARALYZED_GIANT: { label: "პარალიზებული გიგანტი", impact: "ძალის ბლოკირება" },
        FROZEN_POTENTIAL: { label: "გაყინული პოტენციალი", impact: "სტაგნაცია" },
        CRITICAL_DEFICIT: { label: "კრიტიკული დეფიციტი", impact: "გამოფიტვა" }
    },
    session_prep_templates: {
        low_foundation_pattern: "როგორ მოქმედებს {{pattern}} თქვენს საყრდენზე?",
        low_foundation_generic: "რა გაძლევთ უსაფრთხოების განცდას?",
        somatic_dissonance: "რას გრძნობთ სხეულში, როცა ფიქრობთ თემაზე: {{pattern}}?",
        default_archetype: "როგორ ვლინდება {{archetype_shadow}} თქვენს ცხოვრებაში?",
        pattern_interaction: "როგორ უკავშირდება ერთმანეთს {{pattern1}} და {{pattern2}}?",
        default_latency: "ამჩნევთ თუ არა პაუზებს პასუხებში?",
        default_verdict: "როგორ მოქმედებს {{verdict_impact}} თქვენს გადაწყვეტილებებზე?"
    },
    legal: {
        tos_title: "გამოყენების პირობები",
        tos_body: "სერვისის გამოყენებით თქვენ ეთანხმებით, რომ შედეგები ატარებს საინფორმაციო ხასიათს და არ ანაცვლებს პროფესიულ სამედიცინო დახმარებას.",
        privacy_title: "კონფიდენციალობა",
        privacy_body: "ჩვენ არ ვინახავთ პირად მონაცემებს. მთელი ანალიზი ხდება ლოკალურად თქვენს მოწყობილობაზე. ღრუბლოვანი სინქრონიზაცია არ ხდება.",
        close_btn: "დახურვა"
    },
    export_image: {
        header: "GENESIS OS // კლინიკური ხიდი",
        blueprint_title: "პიროვნების ანაბეჭდი",
        footer: "კლინიკური სკრინინგი",
        metrics: {
            integrity: "მთლიანობა",
            entropy: "ენტროპია"
        }
    }
};

export const translations = { ru, ka };
