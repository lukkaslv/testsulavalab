
export const uiTranslations = {
    subtitle: "Genesis OS // Цифровое Зеркало Души",
    global: { back: "Назад", complete: "Завершен", calibrating: "Калибровка", calib_desc: "Настройка ядра..." },
    sync: { 
        title: "СКАНИРОВАНИЕ ТЕЛА", desc: "Где отозвался предыдущий вопрос?", connection_label: "СКАНИРОВАНИЕ",
        scan_complete: "СИГНАЛ ПРИНЯТ",
        intro_title: "ВАШЕ ТЕЛО — ЭТО КОМПАС",
        intro_desc: "Эмоции и сопротивление проявляются как физические ощущения. Заметьте, где в теле 'отозвался' предыдущий вопрос. Это ключ к вашему бессознательному.",
        start_scan_btn: "Начать сканирование",
        s0: "Голова / Тишина", s1: "Горло / Ком", s2: "Грудь / Чувство", s3: "Сплетение / Тревога", s4: "Живот / Страх",
        zones: { head: "Мысли (Нейтрально)", throat: "Горло (Слова)", chest: "Грудь (Эмоции)", plexus: "Сплетение (Воля)", belly: "Живот (Безопасность)" },
        break_title: "Пауза", break_desc: "Дышите глубоко.", break_btn: "Далее", guidance_tip: "Если нет явных ощущений — выбирайте Голову. Это нормально." 
    },
    sensation_feedback: { s0: "Сигнал принят.", s1: "Напряжение.", s2: "Ресурс.", s3: "Энергия.", s4: "Блок." },
    dashboard: { 
        insight_coherence: "Стабильно.", insight_noise: "Шум.", insight_somatic_dissonance: "Диссонанс.", desc: "Ядро активно.", 
        manual_btn: "Инструкция", select_domain: "Модули", signal_stability: "Стабильность сигнала", protocol_active: "ПРОТОКОЛ АКТИВЕН",
        phase_label: "ТЕКУЩАЯ ФАЗА", next_task: "СЛЕДУЮЩИЙ ШАГ", days_complete: "ДНЕЙ", open_roadmap: "ОТКРЫТЬ КАРТУ", context_label: "КОНТЕКСТ СЕССИИ",
        contexts: { NORMAL: "НОРМА", HIGH_LOAD: "НАГРУЗКА", CRISIS: "КРИЗИС", TRANSITION: "ПЕРЕХОД" },
        domain_navigator: { title: "КАРТА ДОМЕНОВ" }
    },
    onboarding: { 
        protocol_btn: "Старт", pricing_btn: "Доступ", promo_title: "Клинический Доступ", promo_desc: "Протоколы для специалистов", 
        recommended_tag: "Специалистам", price_per_month: "/мес", features_clinical: "Клиническое Досье;Нейронный След;Прогноз Альянса;Экспорт Карты", 
        client_card_desc: "Инструмент самопознания", free_trial_desc: "Демо-режим", start_free_btn: "Демо", activate_access_btn: "Получить доступ", 
        pro_features_expl: "Требуется подтверждение квалификации", for_clients: "Для самопознания", social_justice: "Принцип справедливости: Бесплатно для НКО и госсектора",
        slides: [
            { title: "Слова лгут", desc: "Ум может обмануть, но ваша реакция — никогда. Мы измеряем миллисекунды вашего выбора." },
            { title: "Паузы важны", desc: "Задержка перед ответом — это маркер внутреннего сопротивления. Будьте спонтанны." },
            { title: "Тело помнит", desc: "После сложных вопросов мы попросим вас оценить физическое ощущение. Это ключ к подсознанию." },
            { title: "Ваш Слепок", desc: "В конце вы получите карту своей личности. Это не диагноз, а инструмент для роста." }
        ]
    },
    informed_consent: { title: "ИНФОРМИРОВАННОЕ СОГЛАСИЕ", measures_title: "Что мы измеряем:", measures: ["Задержки (латентность)", "Телесный отклик (соматика)", "Ресурсную емкость"], usage_title: "Назначение:", usage: ["Карта поведенческих паттернов", "Не является диагнозом", "Инструмент самопознания"], data_title: "Приватность:", data: ["Данные только на устройстве", "Не отправляются на сервер", "Вы можете удалить их в любой момент"], checkbox: "Я понял(а) и согласен/согласна начать", start_btn: "НАЧАТЬ" },
    ui: { 
        system_build: "СБОРКА", reset_session_btn: "Сброс", reset_confirm: "Стереть данные?", auth_title: "Вход", code_input_placeholder: "КЛЮЧ", 
        enter_code_btn: "Войти", status_report_title: "Статус", logout_btn: "Выход", resume_session_title: "Активно", resume_session_btn: "Продолжить", 
        progress_label: "Прогресс", system_audit_title: "Системный аудит", secured_label: "ЗАЩИЩЕНО", mode_client: "Клиент", mode_pro: "Специалист", 
        evolution_title: "Эволюция", sessions_secured: "сессий", first_investigation_hint: "Начните тест", integrity_drift: "Дрейф", 
        noise_tracking: "Мониторинг шума", evolution_insight_desc: "Динамика", start_new_cycle_btn: "Новый цикл", agree_terms_btn: "Я принимаю условия", 
        module_label: "МОДУЛЬ", verdict_label: "Вердикт", priority_label: "Приоритет", access_restricted: "Доступ ограничен", enter_code_desc: "Введите ключ", 
        mode_transition: "Переход", somatic_anchor_tip: "Дышите в такт пульса", constitution_btn: "Конституция", security_btn: "Аудит сети", 
        tech_standard_btn: "Стандарт", changelog_btn: "Хроника", science_btn: "Наука" 
    },
    boot_sequence: { kernel_init: "Ядро Инициализировано {version}", load_constitution: "Загрузка Конституции {constitution_version}", mount_volumes: "Монтирование томов", load_psychometrics: "Загрузка психометрии", calibrate_neuro_sync: "Калибровка Нейросинка", secure_link: "Защита соединения", system_ready: "Система готова", copyright: "© 2025" },
    auth_ui: { cancel: "Отмена", enter_key_placeholder: "КЛЮЧ ДОСТУПА", enter_code_btn: "ВОЙТИ", admin_access_hint: "Доступ к ядру", verifying: "ПРОВЕРКА...", authenticate: "АВТОРИЗАЦИЯ", invalid_format: "НЕВЕРНЫЙ ФОРМАТ", license_expired: "ЛИЦЕНЗИЯ ИСТЕКЛА", revoked: "ОТОЗВАНА", terms_link: "Правила", privacy_link: "Приватность", footer_tagline: "Суверенная Локальная Архитектура", checking_crypto: "КРИПТОГРАФИЧЕСКАЯ ПРОВЕРКА..." },
    test_metrics: { insight_resolution: "Точность", confidence: "Достоверность", adaptive_active: "Адаптивный режим", dissonance_points: "Диссонанс", signal_clean: "Сигнал чистый", structural_contradictions: "Противоречия", persona_conflict_hint: "Конфликт маски", adaptive_pacing: "ВОССТАНОВЛЕНИЕ СИГНАЛА", pacing_breath: "Дышите..." },
};
