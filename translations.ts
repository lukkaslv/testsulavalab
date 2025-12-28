
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
    scenes: {
        // --- FOUNDATION (15 NODES) - FULLY DETAILED ---
        foundation_0: { title: "КАЛИБРОВКА СИСТЕМЫ", desc: "Как вы обычно реагируете на необходимость принять быстрое решение в условиях неопределенности?", c1: "Действую на автомате", c2: "Замираю и жду", c3: "Анализирую ресурсы" },
        foundation_1: { title: "КОРНИ И КРЫЛЬЯ", desc: "Ваше отношение к истории вашей семьи и наследию предков. Что вы чувствуете, оглядываясь назад?", c1: "Долг и тяжесть", c2: "Свободу выбора", c3: "Слияние границ" },
        foundation_2: { title: "СИГНАЛ ТРЕВОГИ", desc: "Когда вы совершаете ошибку, какая первая мысль возникает в вашей голове до того, как вы успеваете ее осознать?", c1: "Меня накажут", c2: "Я самозванец", c3: "Лучше не высовываться" },
        foundation_3: { title: "РЕСУРСНЫЙ ГОЛОД", desc: "Вы получили крупную сумму денег. Ваша первая, инстинктивная реакция тела?", c1: "Нужно спрятать/сберечь", c2: "Тревога и опасность", c3: "Желание быстро потратить" },
        foundation_4: { title: "ТЕНЬ УСПЕХА", desc: "Представьте, что вы достигли всего, о чем мечтали. Кто из вашего окружения исчезнет?", c1: "Мне станет стыдно", c2: "Придется спасать всех", c3: "Меня предадут" },
        foundation_5: { title: "ПРАВО НА ОТДЫХ", desc: "Вы ничего не делаете целый день. Какое чувство доминирует к вечеру?", c1: "Только труд оправдывает жизнь", c2: "Фоновая тревога", c3: "Спокойное восстановление" },
        foundation_6: { title: "ПЕТЛЯ ВРЕМЕНИ", desc: "Как часто вы откладываете важные, но сложные решения на потом?", c1: "Постоянно сомневаюсь", c2: "Тяну до последнего", c3: "Решаю здесь и сейчас" },
        foundation_7: { title: "АВТОРИТЕТ", desc: "Критика со стороны значимой фигуры (начальник, родитель). Ваша реакция?", c1: "Страх отвержения", c2: "Взрослая дискуссия", c3: "Агрессивная защита" },
        foundation_8: { title: "ГРАНИЦЫ Я", desc: "Вас просят о помощи, когда у вас нет на это ресурса. Что вы сделаете?", c1: "Помогу через силу", c2: "Испугаюсь конфликта", c3: "Спокойно откажу" },
        foundation_9: { title: "ТЕЛЕСНЫЙ КОНТАКТ", desc: "В моменты сильного стресса, что происходит с вашим телом?", c1: "Я перестаю его чувствовать", c2: "Включается автопилот", c3: "Теряю границы тела" },
        foundation_10: { title: "ЕМКОСТЬ", desc: "Вы получаете подарок, который слишком дорог для вас. Ваши мысли?", c1: "Я должен отдать долг", c2: "Это опасно/токсично", c3: "Принимаю с радостью" },
        foundation_11: { title: "ВИДИМОСТЬ", desc: "Вам нужно выступить перед большой аудиторией. Ваше основное чувство?", c1: "Ужас разоблачения", c2: "Героическое преодоление", c3: "Стыд быть видимым" },
        foundation_12: { title: "ЛОЯЛЬНОСТЬ", desc: "Стать успешнее своих родителей — это для вас...", c1: "Предательство рода", c2: "Опасный конфликт", c3: "Естественный ход вещей" },
        foundation_13: { title: "ЗОЛОТАЯ КЛЕТКА", desc: "Стабильная, но нелюбимая работа или риск ради мечты?", c1: "Соглашусь на меньшее", c2: "Выберу комфорт", c3: "Пожертвую собой" },
        foundation_14: { title: "ФИНАЛ ФУНДАМЕНТА", desc: "Оглядываясь на этот блок вопросов, какое чувство было фоновым?", c1: "Тяжесть обязательств", c2: "Желание сбежать", c3: "Интерес к себе" },

        // --- AGENCY (10 NODES) - STRUCTURAL ---
        agency_0: { title: "ИМПУЛЬС", desc: "Возникает идея. Как быстро вы переходите к действию?", c1: "Сомневаюсь в себе", c2: "Действую сразу", c3: "Боюсь последствий" },
        agency_1: { title: "ВОЛЯ", desc: "Препятствие на пути. Ваша стратегия?", c1: "Упорный труд", c2: "Обход на автопилоте", c3: "Застревание" },
        agency_2: { title: "КОМПЕТЕНЦИЯ", desc: "Вам предлагают сложный проект.", c1: "Я не справлюсь", c2: "Это вызов для роста", c3: "Лучше не рисковать" },
        agency_3: { title: "КОНФРОНТАЦИЯ", desc: "Нужно защитить свои интересы.", c1: "Избегу конфликта", c2: "Пожертвую собой", c3: "Заявлю о правах" },
        agency_4: { title: "ОТВЕТСТВЕННОСТЬ", desc: "Ошибка команды. Кто виноват?", c1: "Я должен был проверить", c2: "Решаем проблему", c3: "Это не моя вина" },
        agency_5: { title: "ЖЕРТВЕННОСТЬ", desc: "Успех требует жертв?", c1: "Всегда", c2: "Иногда приходится терпеть", c3: "Нет, нужен баланс" },
        agency_6: { title: "ДОВЕРИЕ", desc: "Делегирование задачи.", c1: "Сделаю сам лучше", c2: "Доверяю и проверяю", c3: "Боюсь потерять контроль" },
        agency_7: { title: "ПЛАНИРОВАНИЕ", desc: "Горизонт вашего планирования.", c1: "Только сегодня", c2: "На годы вперед", c3: "Деньги - инструмент" },
        agency_8: { title: "ТОКСИЧНОСТЬ", desc: "Работа высасывает силы.", c1: "Терплю ради денег", c2: "Героически страдаю", c3: "Меняю условия" },
        agency_9: { title: "ТРИУМФ", desc: "Вы победили. Реакция?", c1: "Стыдно радоваться", c2: "Праздную", c3: "Это случайность" },

        // --- MONEY (10 NODES) - STRUCTURAL ---
        money_0: { title: "ДЕНЬГИ И РОД", desc: "Финансовые установки семьи.", c1: "Мы бедные, но честные", c2: "Деньги - это возможности", c3: "Деньги портят людей" },
        money_1: { title: "ДЕФИЦИТ", desc: "Ощущение нехватки.", c1: "Всегда мало", c2: "Нужно больше работать", c3: "Не знаю, чего хочу" },
        money_2: { title: "ОПАСНОСТЬ", desc: "Большие деньги - это...", c1: "Угроза жизни", c2: "Скромность украшает", c3: "Инструмент влияния" },
        money_3: { title: "ИЗОБИЛИЕ", desc: "Можно ли иметь всё?", c1: "За всё надо платить", c2: "Конечно", c3: "Не в этой жизни" },
        money_4: { title: "ДОЛГ", desc: "Отношение к кредитам.", c1: "Кабала", c2: "Рычаг", c3: "Стыд" },
        money_5: { title: "ТРАТЫ", desc: "Покупка для себя.", c1: "Жалко денег", c2: "Срыв и транжирство", c3: "Легко и приятно" },
        money_6: { title: "ПРЕДАТЕЛЬСТВО", desc: "Богатый друг.", c1: "Он изменился", c2: "Рад за него", c3: "Зависть" },
        money_7: { title: "ИМПУЛЬС", desc: "Скидки и акции.", c1: "Скупаю всё", c2: "Беру нужное", c3: "Игнорирую" },
        money_8: { title: "ЕМКОСТЬ", desc: "Ваш потолок.", c1: "Выше головы не прыгнешь", c2: "Сливаю излишки", c3: "Постоянно расту" },
        money_9: { title: "СТЫД", desc: "Озвучить цену за услуги.", c1: "Неудобно", c2: "Я много прошу?", c3: "Это моя цена" },

        // --- SOCIAL (10 NODES) - STRUCTURAL ---
        social_0: { title: "КОНФЛИКТ", desc: "Ссора с другом.", c1: "Уступлю", c2: "Замкнусь", c3: "Потеряю границы" },
        social_1: { title: "ОЦЕНКА", desc: "Что подумают люди?", c1: "Важно мнение", c2: "Подстраиваюсь", c3: "Я в клетке ожиданий" },
        social_2: { title: "ДОВЕРИЕ", desc: "Новое знакомство.", c1: "Жду подвоха", c2: "Открыт, но осторожен", c3: "Закрыт наглухо" },
        social_3: { title: "МАСКИ", desc: "В обществе я...", c1: "Играю роль", c2: "Сливаюсь с толпой", c3: "Напряжен" },
        social_4: { title: "УСПЕХ ДРУГИХ", desc: "Коллега получил повышение.", c1: "Мне стыдно", c2: "Я хуже него", c3: "Равнодушие" },
        social_5: { title: "ОДИНОЧЕСТВО", desc: "Вечер наедине с собой.", c1: "Тревога", c2: "Работа", c3: "Слияние с кем-то" },
        social_6: { title: "ГРАНИЦЫ", desc: "Вас критикуют.", c1: "Оправдываюсь", c2: "Принимаю к сведению", c3: "Обижаюсь" },
        social_7: { title: "БЛИЗОСТЬ", desc: "Глубокий контакт.", c1: "Страшно", c2: "Хочу и боюсь", c3: "Избегаю" },
        social_8: { title: "ПРЕДАТЕЛЬСТВО", desc: "Вас подставили.", c1: "Мир жесток", c2: "Я сам виноват", c3: "Нужно больше работать" },
        social_9: { title: "ДЕНЬГИ И ДРУЖБА", desc: "Дал в долг и не вернули.", c1: "Больше не дам", c2: "Мне стыдно спросить", c3: "Прощу ради мира" },

        // --- LEGACY (5 NODES) - STRUCTURAL ---
        legacy_0: { title: "СМЫСЛ", desc: "Ради чего всё это?", c1: "Выживание", c2: "Создание", c3: "Жертва ради других" },
        legacy_1: { title: "СЛЕД", desc: "Что останется после?", c1: "Ничего", c2: "Память рода", c3: "Страх забвения" },
        legacy_2: { title: "СТРАХ СМЕРТИ", desc: "Мысль о конечности.", c1: "Парализует", c2: "Мотивирует", c3: "Истощает" },
        legacy_3: { title: "МИССИЯ", desc: "Ваш вклад.", c1: "Я должен спасти всех", c2: "Прожить достойно", c3: "Плыву по течению" },
        legacy_4: { title: "ИТОГ", desc: "Финал протокола.", c1: "Я верен роду", c2: "Я в золотой клетке", c3: "Я выбираю себя" }
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
    interventions: {}, 
    directives: {},    
    interferences: {}, 
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
        { q: "Как это работает?", a: "Система анализирует не только ваши ответы, но и скорость реакции (латентность) и телесный отклик (нейросинк). Это позволяет выявить то, что сознание пытается скрыть." },
        { q: "Что делать с результатом?", a: "Результат — это карта для работы с психологом. Используйте вопросы из блока 'Подготовка' для начала терапии." },
        { q: "Это диагноз?", a: "Нет. Genesis OS — это инструмент скрининга паттернов, а не медицинская диагностика." }
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
        tos_body: "Используя сервис, вы соглашаетесь с тем, что результаты носят информационный характер и не заменяют профессиональную медицинскую помощь.",
        privacy_title: "Конфиденциальность",
        privacy_body: "Мы не храним личные данные. Весь анализ происходит локально на вашем устройстве. Облачная синхронизация отсутствует.",
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
    scenes: {
        foundation_0: { title: "სისტემის კალიბრაცია", desc: "როგორ რეაგირებთ გადაწყვეტილების სწრაფად მიღების აუცილებლობაზე გაურკვევლობის პირობებში?", c1: "ვმოქმედებ ავტომატურად", c2: "ვშეშდები და ვიცდი", c3: "ვაანალიზებ რესურსებს" },
        foundation_1: { title: "ფესვები და ფრთები", desc: "თქვენი დამოკიდებულება ოჯახის ისტორიასთან. რას გრძნობთ, როცა უკან იხედებით?", c1: "ვალი და სიმძიმე", c2: "არჩევანის თავისუფლება", c3: "საზღვრების შერწყმა" },
        foundation_2: { title: "განგაშის სიგნალი", desc: "შეცდომის დაშვებისას, რა არის პირველი აზრი, რომელიც ჩნდება თავში გააზრებამდე?", c1: "დამსჯიან", c2: "თაღლითი ვარ", c3: "ჯობია არ გავჩნდე" },
        foundation_3: { title: "რესურსული შიმშილი", desc: "მიიღეთ დიდი თანხა. სხეულის პირველი, ინსტინქტური რეაქცია?", c1: "უნდა დავმალო/შევინახო", c2: "შფოთვა და საფრთხე", c3: "სწრაფად დახარჯვის სურვილი" },
        foundation_4: { title: "წარმატების ჩრდილი", desc: "წარმოიდგინეთ, რომ მიაღწიეთ ყველაფერს. ვინ გაქრება თქვენი გარემოცვიდან?", c1: "შემრცხვება", c2: "მომიწევს ყველას გადარჩენა", c3: "მიღალატებენ" },
        foundation_5: { title: "დასვენების უფლება", desc: "მთელი დღე არაფერს აკეთებთ. რომელი გრძნობა დომინირებს საღამოს?", c1: "მხოლოდ შრომა ამართლებს სიცოცხლეს", c2: "ფონური შფოთვა", c3: "მშვიდი აღდგენა" },
        foundation_6: { title: "დროის მარყუჟი", desc: "რამდენად ხშირად დებთ რთულ გადაწყვეტილებებს?", c1: "მუდმივად ვყოყმანობ", c2: "ბოლომდე ვიწელები", c3: "ვწყვეტ აქ და ახლა" },
        foundation_7: { title: "ავტორიტეტი", desc: "კრიტიკა მნიშვნელოვანი ფიგურისგან (უფროსი, მშობელი). რეაქცია?", c1: "უარყოფის შიში", c2: "ზრდასრული დისკუსია", c3: "აგრესიული დაცვა" },
        foundation_8: { title: "მე-ს საზღვრები", desc: "გთხოვენ დახმარებას, როცა რესურსი არ გაქვთ. რას იზამთ?", c1: "დავეხმარები ძალის დატანებით", c2: "შემეშინდება კონფლიქტის", c3: "მშვიდად ვიტყვი უარს" },
        foundation_9: { title: "სხეულთან კონტაქტი", desc: "ძლიერი სტრესის დროს, რა ემართება თქვენს სხეულს?", c1: "ვეღარ ვგრძნობ მას", c2: "ირთვება ავტოპილოტი", c3: "ვკარგავ სხეულის საზღვრებს" },
        foundation_10: { title: "ტევადობა", desc: "იღებთ საჩუქარს, რომელიც თქვენთვის ზედმეტად ძვირია. ფიქრები?", c1: "ვალი უნდა დავაბრუნო", c2: "ეს საშიშია/ტოქსიკურია", c3: "ვიღებ სიხარულით" },
        foundation_11: { title: "ხილვადობა", desc: "უნდა გამოხვიდეთ აუდიტორიის წინაშე. ძირითადი გრძნობა?", c1: "მხილების შიში", c2: "გმირული გადალახვა", c3: "ხილვადობის სირცხვილი" },
        foundation_12: { title: "ლოიალობა", desc: "გახდე მშობლებზე წარმატებული — ეს თქვენთვის არის...", c1: "გვარის ღალატი", c2: "საშიში კონფლიქტი", c3: "ბუნებრივი პროცესი" },
        foundation_13: { title: "ოქროს გალია", desc: "სტაბილური, მაგრამ არასასურველი სამსახური თუ რისკი ოცნებისთვის?", c1: "დავთანხმდები ნაკლებზე", c2: "ავირჩევ კომფორტს", c3: "გავიღებ მსხვერპლს" },
        foundation_14: { title: "ფუნდამენტის ფინალი", desc: "ამ ბლოკის შეჯამებისას, რომელი გრძნობა იყო ფონური?", c1: "ვალდებულებების სიმძიმე", c2: "გაქცევის სურვილი", c3: "ინტერესი საკუთარი თავის მიმართ" },

        agency_0: { title: "იმპულსი", desc: "გაჩნდა იდეა. რამდენად სწრაფად გადადიხართ მოქმედებაზე?", c1: "ვეჭვობ საკუთარ თავში", c2: "ვმოქმედებ მყისიერად", c3: "მეშინია შედეგების" },
        agency_1: { title: "ნებისყოფა", desc: "დაბრკოლება გზაზე. თქვენი სტრატეგია?", c1: "ჯიუტი შრომა", c2: "ავტოპილოტით გვერდის ავლა", c3: "გაჭედვა" },
        agency_2: { title: "კომპეტენცია", desc: "გთავაზობენ რთულ პროექტს.", c1: "ვერ გავუმკლავდები", c2: "ეს გამოწვევაა ზრდისთვის", c3: "ჯობია არ გავრისკო" },
        agency_3: { title: "კონფრონტაცია", desc: "უნდა დაიცვათ თქვენი ინტერესები.", c1: "გავექცევი კონფლიქტს", c2: "გავიღებ მსხვერპლს", c3: "განვაცხადებ უფლებებზე" },
        agency_4: { title: "პასუხისმგებლობა", desc: "გუნდის შეცდომა. ვინ არის დამნაშავე?", c1: "მე უნდა შემემოწმებინა", c2: "ვაგვარებთ პრობლემას", c3: "ეს ჩემი ბრალი არ არის" },
        agency_5: { title: "მსხვერპლშეწირვა", desc: "წარმატება მოითხოვს მსხვერპლს?", c1: "ყოველთვის", c2: "ზოგჯერ მოთმენაა საჭირო", c3: "არა, ბალანსია საჭირო" },
        agency_6: { title: "ნდობა", desc: "საქმის დელეგირება.", c1: "თვითონ უკეთ გავაკეთებ", c2: "ვენდობი და ვამოწმებ", c3: "კონტროლის დაკარგვის შიში" },
        agency_7: { title: "დაგეგმვა", desc: "დაგეგმვის ჰორიზონტი.", c1: "მხოლოდ დღეს", c2: "წლებით წინ", c3: "ფული — ინსტრუმენტია" },
        agency_8: { title: "ტოქსიკურობა", desc: "სამსახური გართმევთ ძალებს.", c1: "ვითმენ ფულის გამო", c2: "გმირულად ვიტანჯები", c3: "ვცვლი პირობებს" },
        agency_9: { title: "ტრიუმფი", desc: "გაიმარჯვეთ. რეაქცია?", c1: "სიხარული სირცხვილია", c2: "ვზეიმობ", c3: "ეს შემთხვევითობაა" },

        money_0: { title: "ფული და გვარი", desc: "ოჯახური ფინანსური განწყობები.", c1: "ღარიბები ვართ, მაგრამ პატიოსნები", c2: "ფული — შესაძლებლობაა", c3: "ფული აფუჭებს ადამიანს" },
        money_1: { title: "დეფიციტი", desc: "დანაკლისის შეგრძნება.", c1: "სულ ცოტაა", c2: "მეტი უნდა ვიმუშავო", c3: "არ ვიცი რა მინდა" },
        money_2: { title: "საფრთხე", desc: "დიდი ფული — ეს...", c1: "საფრთხეა სიცოცხლისთვის", c2: "მოკრძალება ამკობს", c3: "გავლენის იარაღია" },
        money_3: { title: "სიუხვე", desc: "შეიძლება გქონდეს ყველაფერი?", c1: "ყველაფერს საფასური აქვს", c2: "რა თქმა უნდა", c3: "ამ ცხოვრებაში არა" },
        money_4: { title: "ვალი", desc: "დამოკიდებულება კრედიტებთან.", c1: "მონობა", c2: "ბერკეტი", c3: "სირცხვილი" },
        money_5: { title: "ხარჯვა", desc: "ყიდვა საკუთარი თავისთვის.", c1: "მენანება ფული", c2: "გაფლანგვა", c3: "მარტივი და სასიამოვნო" },
        money_6: { title: "ღალატი", desc: "მდიდარი მეგობარი.", c1: "ის შეიცვალა", c2: "მიხარია მის გამო", c3: "შური" },
        money_7: { title: "იმპულსი", desc: "ფასდაკლებები.", c1: "ყველაფერს ვყიდულობ", c2: "ვიღებ საჭიროს", c3: "ვაიგნორებ" },
        money_8: { title: "ტევადობა", desc: "თქვენი ჭერი.", c1: "თავს ზემოთ ძალა არაა", c2: "ზედმეტს გავცემ", c3: "მუდმივად ვიზრდები" },
        money_9: { title: "სირცხვილი", desc: "მომსახურების ფასის თქმა.", c1: "უხერხულია", c2: "ბევრს ხომ არ ვითხოვ?", c3: "ეს ჩემი ფასია" },

        social_0: { title: "კონფლიქტი", desc: "ჩხუბი მეგობართან.", c1: "დავუთმობ", c2: "ჩავიკეტები", c3: "საზღვრებს დავკარგავ" },
        social_1: { title: "შეფასება", desc: "რას იფიქრებს ხალხი?", c1: "მნიშვნელოვანია აზრი", c2: "ვერგები", c3: "მოლოდინების გალიაში ვარ" },
        social_2: { title: "ნდობა", desc: "ახალი ნაცნობობა.", c1: "ველოდები ღალატს", c2: "ღია ვარ, მაგრამ ფრთხილი", c3: "ჩაკეტილი ვარ" },
        social_3: { title: "ნიღბები", desc: "საზოგადოებაში მე...", c1: "როლს ვთამაშობ", c2: "მასას ვერწყმი", c3: "დაძაბული ვარ" },
        social_4: { title: "სხვისი წარმატება", desc: "კოლეგა დააწინაურეს.", c1: "მრცხვენია", c2: "მასზე უარესი ვარ", c3: "გულგრილობა" },
        social_5: { title: "მარტოობა", desc: "საღამო მარტო.", c1: "შფოთვა", c2: "მუშაობა", c3: "ვიღაცასთან შერწყმა" },
        social_6: { title: "საზღვრები", desc: "გაკრიტიკებენ.", c1: "თავს ვიმართლებ", c2: "ვითვალისწინებ", c3: "მწყინს" },
        social_7: { title: "სიახლოვე", desc: "ღრმა კონტაქტი.", c1: "საშიშია", c2: "მინდა და მეშინია", c3: "გავურბივარ" },
        social_8: { title: "ღალატი", desc: "გიღალატეს.", c1: "სამყარო სასტიკია", c2: "მე ვარ დამნაშავე", c3: "მეტი უნდა ვიმუშავო" },
        social_9: { title: "ფული და მეგობრობა", desc: "ასესხეთ და არ დაგიბრუნეს.", c1: "აღარ გავასესხებ", c2: "მრცხვენია მოთხოვნა", c3: "ვაპატიებ მშვიდობისთვის" },

        legacy_0: { title: "აზრი", desc: "რისთვის ეს ყველაფერი?", c1: "გადარჩენა", c2: "შექმნა", c3: "მსხვერპლი სხვებისთვის" },
        legacy_1: { title: "კვალი", desc: "რა დარჩება?", c1: "არაფერი", c2: "გვარის ხსოვნა", c3: "დავიწყების შიში" },
        legacy_2: { title: "სიკვდილის შიში", desc: "ფიქრი დასასრულზე.", c1: "მბოჭავს", c2: "მოტივაციას მაძლევს", c3: "მფიტავს" },
        legacy_3: { title: "მისია", desc: "თქვენი წვლილი.", c1: "ყველა უნდა გადავარჩინო", c2: "ვიცხოვრო ღირსეულად", c3: "დინებას მივყვები" },
        legacy_4: { title: "შედეგი", desc: "პროტოკოლის ფინალი.", c1: "ერთგული ვარ გვარის", c2: "ოქროს გალიაში ვარ", c3: "ვირჩევ საკუთარ თავს" }
    }
};

export const translations = { ru, ka };
