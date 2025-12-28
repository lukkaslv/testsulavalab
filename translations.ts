
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
        agree_terms_btn: "Принять условия"
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
        complete: "Завершено",
        calibrating: "Калибровка",
        calib_desc: "Настройка на пользователя"
    },
    sync: {
        title: "Синхронизация",
        desc: "Отметьте телесный отклик",
        guidance_tip: "Слушайте тело",
        break_title: "Пауза",
        break_desc: "Сделайте вдох",
        break_btn: "Продолжить",
        processing: "Обработка...",
        s0: "Нейтрально",
        s1: "Блок",
        s2: "Тепло",
        s3: "Холод",
        s4: "Дрожь"
    },
    sensation_feedback: {
        s0: "Принято",
        s1: "Зафиксировано напряжение",
        s2: "Зафиксировано тепло",
        s3: "Зафиксирован холод",
        s4: "Зафиксирована реакция"
    },
    domains: {
        foundation: "ФУНДАМЕНТ",
        agency: "АГЕНТНОСТЬ",
        money: "РЕСУРС",
        social: "СОЦИУМ",
        legacy: "НАСЛЕДИЕ"
    },
    dashboard: {
        desc: "Панель управления",
        insight_coherence: "Когерентность",
        insight_noise: "Шум",
        insight_somatic_dissonance: "Диссонанс",
        manual_btn: "Ручной ввод",
        select_domain: "Выберите домен"
    },
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
    ekg: {
        title: "Пульс сессии"
    },
    pro_terminal: {
        diagnostic_protocol: "Протокол",
        paste_placeholder: "Вставьте код",
        initiate_decrypt: "Расшифровать",
        no_latency_anomalies: "Нет аномалий",
        latency_hint: "Задержки реакции",
        resistance_label: "Сопротивление",
        decrypting_msg: "Расшифровка...",
        dossier_btn: "Досье",
        monolith_output: "Вывод монолита",
        monolith_precision: "Точность",
        copy_success: "Скопировано",
        export_crm: "Экспорт",
        sabotage_intellectual: "Интеллектуальный саботаж",
        sabotage_shadow: "Теневой саботаж",
        sabotage_critic: "Критический саботаж",
        sabotage_wall: "Стена",
        sabotage_standard: "Стандарт"
    },
    pro_headers: {
        differential: "Дифференциал",
        badge_prob_map: "Карта вероятностей",
        heatmap: "Тепловая карта",
        badge_latency: "Латентность",
        sabotage: "Саботаж",
        badge_contact: "Контакт",
        beliefs: "Убеждения",
        badge_schemas: "Схемы"
    },
    phases: {
        SANITATION: "Санация",
        STABILIZATION: "Стабилизация",
        EXPANSION: "Расширение"
    },
    tasks: {
        sanitation_1: "Очистка 1", sanitation_2: "Очистка 2", sanitation_3: "Очистка 3", sanitation_4: "Очистка 4", sanitation_5: "Очистка 5", sanitation_6: "Очистка 6", sanitation_7: "Очистка 7",
        stabilization_1: "Стабилизация 1", stabilization_2: "Стабилизация 2", stabilization_3: "Стабилизация 3", stabilization_4: "Стабилизация 4", stabilization_5: "Стабилизация 5", stabilization_6: "Стабилизация 6", stabilization_7: "Стабилизация 7",
        expansion_1: "Расширение 1", expansion_2: "Расширение 2", expansion_3: "Расширение 3", expansion_4: "Расширение 4", expansion_5: "Расширение 5", expansion_6: "Расширение 6", expansion_7: "Расширение 7"
    },
    scenes: {},
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
    explanations: {},
    pattern_library: {
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
    metric_definitions: {},
    conflicts: {},
    system_commentary: [],
    auth_hint: "Введите ключ",
    legal_disclaimer: "Не является офертой",
    safety: {
        time_remaining: "Осталось",
        minutes: "мин",
        alert: "Внимание",
        trigger_warning_title: "Триггер",
        trigger_warning_desc: "Может вызвать эмоции",
        emergency_contacts_title: "Экстренная помощь",
        emergency_contacts_desc: "Контакты служб",
        return_btn: "Вернуться",
        uncomfortable_btn: "Мне некомфортно"
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
    synthesis_categories: {},
    synthesis: {},
    interventions: {}, // Populated to satisfy interface
    directives: {},    // Populated to satisfy interface
    interferences: {}, // Populated to satisfy interface
    correlation_types: {},
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
    methodology_faq: [
        { q: "Как это работает?", a: "Анализ реакций." }
    ],
    soft_mode: {
        archetype_prefix: "Мягкий ",
        verdict_softened: {
            CRITICAL_DEFICIT: "Требует внимания"
        }
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
    legal: {
        tos_title: "Условия использования",
        tos_body: "Используя сервис, вы соглашаетесь...",
        privacy_title: "Конфиденциальность",
        privacy_body: "Мы не храним личные данные...",
        close_btn: "Закрыть"
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
        agree_terms_btn: "პირობებზე თანხმობა"
    },
    admin: {
        ...ru.admin,
        panel_title: "ადმინისტრატორის პანელი",
        oversight_layer: "ზედამხედველობის შრე",
        exit: "გასვლა",
        session_nodes: "სესიის კვანძები",
        avg_latency: "საშუალო დაყოვნება",
        system_unstable: "სისტემა არასტაბილურია",
        immediate_attention: "საჭიროებს ყურადღებას"
    },
    guide: {
        ...ru.guide,
        title: "სახელმძღვანელო",
        subtitle: "მომხმარებლის გზამკვლევი",
        sections: [
            { title: "შესავალი", content: ["Genesis OS გეხმარებათ პატერნების გაგებაში."] }
        ],
        metaphor: "პიროვნების რუკა"
    },
    clinical_decoder: {
        ...ru.clinical_decoder,
        somatic_dissonance_title: "სომატური დისონანსი",
        somatic_dissonance_desc: "კონფლიქტი გონებასა და სხეულს შორის.",
        disclaimer: "მხოლოდ პროფესიული გამოყენებისთვის."
    },
    clinical_narratives: {
        ...ru.clinical_narratives,
        labels: {
            armored: "დაჯავშნული",
            critical: "კრიტიკული",
            stable: "სტაბილური",
            focus_somatic: "ფოკუსი სხეულზე"
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
        back: "უკან"
    },
    integrity_audit: {
        ...ru.integrity_audit,
        title: "მთლიანობის აუდიტი",
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
        initializing: "ინიციალიზაცია...",
        verdict_healthy: "სისტემა სტაბილურია",
        verdict_unstable: "აღმოჩენილია არასტაბილურობა"
    }
};

export const translations = { ru, ka };
