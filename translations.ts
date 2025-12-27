
import { Translations } from './types';

const BELIEF_SCENARIOS: Record<string, { q: string, a: string[] }[]> = {
    'family_loyalty': [
        { q: "Вы добились успеха, которого не было у ваших родителей. Чувство?", a: ["Вина / Неловкость", "Желание спрятать успех", "Гордость и благодарность"] },
        { q: "Родственники просят денег в долг, но вы не хотите давать. Ваши действия?", a: ["Дам, чтобы не обиделись", "Совру, что нет денег", "Откажу прямо"] },
        { q: "В вашей семье принято 'не высовываться'. Вам предлагают публичность.", a: ["Откажусь, страшно", "Соглашусь, но буду ждать беды", "С радостью использую шанс"] }
    ],
    'fear_of_punishment': [
        { q: "Вы допустили ошибку в важном проекте. Первая мысль?", a: ["Сейчас меня уничтожат", "Надо срочно скрыть", "Как это исправить?"] },
        { q: "Авторитетная фигура (босс/ментор) вызывает на разговор.", a: ["Паника / 'Что я натворил?'", "Напряжение / Защита", "Интерес / Диалог"] },
        { q: "Когда все идет слишком хорошо, вы...", a: ["Jду подвоха", "Саботирую процесс", "Наслаждаюсь"] }
    ],
    'betrayal_trauma': [
        { q: "Близкий человек забыл о важном для вас событии.", a: ["Разрыв отношений / Игнор", "Молчаливая обида", "Спрошу, что случилось"] },
        { q: "Вам предлагают помощь без условий.", a: ["Ищу скрытый мотив", "Отказываюсь ('я сам')", "Принимаю с благодарностью"] },
        { q: "Идеализация нового партнера сменяется...", a: ["Резким обесцениванием", "Страхом потери", "Реалистичным взглядом"] }
    ],
    'body_mind_conflict': [
        { q: "Голова говорит 'Надо делать', а тело...", a: ["Ложится и болеет", "Впадает в ступор", "Мобилизуется"] },
        { q: "Вы чувствуете сильную усталость, но задача не закончена.", a: ["Работаю на износ", "Злюсь на себя", "Беру паузу"] },
        { q: "Ваш привычный ритм жизни напоминает...", a: ["Гонку на выживание", "Механический конвейер", "Танец с паузами"] }
    ],
    'foundation_generic': [
        { q: "Критическая ситуация. Реакция тела?", a: ["Замирание (Freeze)", "Суета (Flight)", "Мобилизация (Fight)"] },
        { q: "Ощущение опоры под ногами прямо сейчас.", a: ["Ее нет / Ватные ноги", "Напряжение в ногах", "Устойчивость"] },
        { q: "Мир для вас — это...", a: ["Опасное место", "Поле битвы", "Пространство возможностей"] }
    ],
    'scarcity_mindset': [
        { q: "На счет поступила крупная сумма. Первая реакция?", a: ["Тревога / 'Надо сохранить'", "Желание срочно потратить", "Спокойное удовлетворение"] },
        { q: "Вы видите вещь, которая вам нравится, но она дорогая.", a: ["'Это не для меня'", "Куплю и буду винить себя", "Куплю, если это ценно"] },
        { q: "Отдавать деньги за услугу для вас...", a: ["Физически больно", "Неприятно, но надо", "Нормальный обмен"] }
    ],
    'poverty_is_virtue': [
        { q: "Богатые люди в вашем представлении...", a: ["Воры и циники", "Одинокие и несчастные", "Успешные и разные"] },
        { q: "Быть скромным и незаметным — это...", a: ["Безопасно и правильно", "Скучно, но привычно", "Ограничивающее убеждение"] },
        { q: "Заявлять о высокой цене на свои услуги.", a: ["Стыдно / Наглость", "Страшно, что откажут", "Естественно"] }
    ],
    'money_is_danger': [
        { q: "Если у меня будет много денег, то...", a: ["Меня ограбят / Убьют", "Все будут мне завидовать", "Я смогу многое создать"] },
        { q: "Большие деньги — это...", a: ["Большая ответственность", "Грязь и проблемы", "Большая энергия"] }
    ],
    'impulse_spend': [
        { q: "Деньги жгут карман. Если не потрачу...", a: ["Они исчезнут", "Почувствую тревогу", "Ничего не случится"] },
        { q: "Покупка совершена. Через час вы чувствуете...", a: ["Стыд и пустоту", "Разочарование", "Радость от пользы"] }
    ],
    'money_generic': [
        { q: "Проверка банковского счета вызывает...", a: ["Тревогу", "Скуку", "Интерес"] },
        { q: "Обсуждение зарплаты с начальством.", a: ["Избегаю до последнего", "Агрессивно требую", "Спокойно обсуждаю ценность"] }
    ],
    'imposter_syndrome': [
        { q: "Вас публично похвалили за result. Первая реакция?", a: ["'Им показалось / Повезло'", "Страх разоблачения", "Принимаю ('Я молодец')"] },
        { q: "Нужно взяться за новую сложную задачу. Ваша мысль?", a: ["Я не справлюсь", "Нужно еще поучиться", "Интересный вызов"] },
        { q: "Сравнение себя с конкурентами вызывает...", a: ["Паралич действий", "Злость и зависть", "Азарт"] }
    ],
    'golden_cage': [
        { q: "Текущая работа не радует, но платит стабильно.", a: ["Терплю ради безопасности", "Мечтаю уйти, но не иду", "Готовлю план выхода"] },
        { q: "Комфорт для вас сейчас — это...", a: ["Ловушка", "Необходимость", "Ресурс для рывка"] },
        { q: "Рискнуть стабильностью ради мечты.", a: ["Невозможно", "Страшно, но хочется", "Необходимый шаг"] }
    ],
    'ambivalence_loop': [
        { q: "Нужно принять решение. Вы...", a: ["Откладываю бесконечно", "Спрашиваю всех вокруг", "Решаю и действую"] },
        { q: "Сделан выбор. Ваши мысли?", a: ["'А вдруг тот был лучше?'", "Тревога об упущенном", "Фокус на выбранном"] },
        { q: "Движение к цели напоминает...", a: ["Шаг вперед, два назад", "Бег по кругу", "Восхождение"] }
    ],
    'agency_generic': [
        { q: "Нужно принять решение за 5 секунд.", a: ["Ступор", "Панический выбор", "Четкое решение"] },
        { q: "Препятствие на пути к цели.", a: ["Отказ от цели", "Поиск виноватых", "Поиск обходного пути"] },
        { q: "Вам нужно начать новое дело.", a: ["Жду идеального момента", "Начинаю и бросаю", "Делаю первый шаг"] }
    ],
    'fear_of_conflict': [
        { q: "Вам нахамили в очереди. Реакция?", a: ["Промолчу и уйду", "Вспылю, потом пожалею", "Спокойно обозначу границы"] },
        { q: "Вы не согласны с мнением группы.", a: ["Промолчу", "Соглашусь внешне", "Выскажу свое мнение"] },
        { q: "Сказать 'Нет' близкому человеку.", a: ["Невозможно", "Только через ложь", "Возможно и безопасно"] }
    ],
    'shame_of_success': [
        { q: "Рассказать друзьям о своем триумфе.", a: ["Смолчу, чтоб не сглазили", "Прибеднюсь ('да ерунда')", "Поделюсь радостью"] },
        { q: "Быть ярче, чем ваше окружение.", a: ["Опасно (отвергнут)", "Стыдно (неловко)", "Нормально"] },
        { q: "Вас публично награждают.", a: ["Хочется сбежать", "Чувствую вину перед другими", "Принимаю с достоинством"] }
    ],
    'social_isolation': [ 
        { q: "Быть одному в толпе людей.", a: ["Страшно / Одиноко", "Безопасно / Спокойно", "Интересно"] },
        { q: "Просить о помощи, когда вы больны.", a: ["Никогда ('Я сам')", "Только в крайнем случае", "Легко и естественно"] },
        { q: "Чувство принадлежности к группе.", a: ["Я всегда чужой", "Я притворяюсь своим", "Я чувствую связь"] }
    ],
    'role_mask': [ 
        { q: "На работе вы и дома вы — это...", a: ["Два разных человека", "Маска и пустота", "Одна личность"] },
        { q: "Показать свои слезы другому.", a: ["Слабость / Позор", "Манипуляция", "Доверие / Живость"] },
        { q: "Социальные сети для вас — это...", a: ["Ярмарка тщеславия", "Способ спрятаться", "Инструмент связи"] }
    ],
    'social_generic': [
        { q: "Одиночество для вас — это...", a: ["Изоляция и холод", "Скука", "Время для себя"] },
        { q: "Критика в ваш адрес.", a: ["Разрушает меня", "Вызывает агрессию", "Информация к размышлению"] }
    ],
    'legacy_void': [
        { q: "Смысл вашей деятельности сейчас.", a: ["Выживание / Ипотека", "Доказать кому-то", "Моя личная миссия"] },
        { q: "След, который я хочу оставить.", a: ["Не думал об этом", "Дети и внуки", "Идеи и проекты"] }
    ],
    'time_scarcity': [ 
        { q: "Ощущение времени в вашей жизни.", a: ["Оно утекает сквозь пальцы", "Его вечно не хватает", "Его достаточно"] },
        { q: "Если бы вы знали, что осталось 5 лет...", a: ["Паника и ужас", "Радикально изменил бы все", "Продолжил бы так же"] }
    ],
    'death_anxiety': [ 
        { q: "Мысль о конечности жизни вызывает...", a: ["Паралич / Вытеснение", "Суетливую деятельность", "Ценность момента"] },
        { q: "Старость в вашем представлении.", a: ["Немощь и бедность", "Одиночество", "Мудрость и покой"] }
    ]
};

const createPlaceholderScenes = (lang: 'ru' | 'ka') => {
    const scenes: Record<string, any> = {};
    const domains = ['foundation', 'agency', 'money', 'social', 'legacy'];
    const counts = [15, 10, 10, 10, 5];
    
    const nodeBeliefMap: Record<string, string> = {
        "foundation_0": "foundation_generic", "foundation_1": "foundation_generic", "foundation_2": "body_mind_conflict",
        "foundation_3": "fear_of_punishment", "foundation_4": "betrayal_trauma", "foundation_5": "family_loyalty",
        "foundation_6": "body_mind_conflict", "foundation_7": "fear_of_punishment", "foundation_8": "betrayal_trauma",
        "foundation_9": "family_loyalty", "foundation_10": "body_mind_conflict", "foundation_11": "foundation_generic",
        "foundation_12": "fear_of_punishment", "foundation_13": "betrayal_trauma", "foundation_14": "family_loyalty",
        
        "agency_0": "imposter_syndrome", "agency_1": "ambivalence_loop", "agency_2": "golden_cage", 
        "agency_3": "agency_generic", "agency_4": "imposter_syndrome", "agency_5": "ambivalence_loop",
        "agency_6": "golden_cage", "agency_7": "agency_generic", "agency_8": "imposter_syndrome", "agency_9": "agency_generic",

        "money_0": "scarcity_mindset", "money_1": "poverty_is_virtue", "money_2": "money_is_danger", 
        "money_3": "impulse_spend", "money_4": "money_generic", "money_5": "scarcity_mindset",
        "money_6": "poverty_is_virtue", "money_7": "money_is_danger", "money_8": "impulse_spend", "money_9": "money_generic",

        "social_0": "fear_of_conflict", "social_1": "shame_of_success", "social_2": "social_isolation",
        "social_3": "role_mask", "social_4": "fear_of_conflict", "social_5": "shame_of_success",
        "social_6": "social_isolation", "social_7": "role_mask", "social_8": "fear_of_conflict", "social_9": "shame_of_success",

        "legacy_0": "legacy_void", "legacy_1": "time_scarcity", "legacy_2": "death_anxiety", 
        "legacy_3": "legacy_void", "legacy_4": "time_scarcity"
    };

    domains.forEach((d, dIdx) => {
        for (let i = 0; i < counts[dIdx]; i++) {
            const key = `${d}_${i}`;
            const beliefKey = nodeBeliefMap[key] || `${d}_generic`;
            
            let scenarioPool = BELIEF_SCENARIOS[beliefKey];
            if (!scenarioPool) scenarioPool = BELIEF_SCENARIOS[`${d}_generic`] || BELIEF_SCENARIOS['foundation_generic'];
            
            const scenario = scenarioPool[i % scenarioPool.length];
            const isKa = lang === 'ka';
            
            scenes[key] = {
                title: isKa ? `მოდული: ${d.toUpperCase()}` : `Модуль: ${d.toUpperCase()}`,
                desc: isKa ? `(KA) ${scenario.q}` : scenario.q,
                c1: isKa ? `ვარიანტი A` : scenario.a[0],
                c2: isKa ? `ვარიანტი B` : scenario.a[1],
                c3: isKa ? `ვარიანტი C` : scenario.a[2]
            };
        }
    });
    return scenes;
};

const ru: Translations = {
  subtitle: "Clinical Bridge // Professional Screening",
  onboarding: {
    title: "Genesis OS",
    promo_title: "PRO: ИНСТРУМЕНТ ЭКСПЕРТА",
    promo_desc: "Лицензии для Специалистов",
    promo_value_1: "Удерживайте клиентов с первой сессии (Retention).",
    promo_value_2: "Обоснуйте более высокий чек за диагностику.",
    promo_value_3: "Минуйте сопротивление и начните глубокую работу.",
    protocol_btn: "НАЧАТЬ СКРИНИНГ",
    start_btn: "Запуск системы",
    pricing_btn: "Профессиональный доступ",
    solo_plan: "Solo Practice",
    clinical_plan: "Clinical Pro",
    lab_plan: "Research Lab",
    price_solo: "19$",
    price_clinical: "49$",
    price_lab: "99$",
    price_per_month: "/ мес"
  },
  invalid_results: {
    title: "Нарушение Протокола",
    message: "Система зафиксировала нетипичные паттерны ввода, указывающие на возможную фальсификацию или техническую аномалию.",
    reason_monotonic: "Повторяющийся выбор позиций (Механический паттерн).",
    reason_robotic: "Сверхвысокая точность тайминга (Искусственный ритм).",
    reason_rhythm: "Нестабильный когнитивный ритм (Попытка обхода латентности).",
    reason_skip: "Высокий уровень игнорирования значимых стимулов.",
    reason_early_termination: "Недостаточный объем данных для клинического вывода.",
    recommendation: "Для корректной диагностики требуется спонтанность и контакт с телом. Пожалуйста, сбросьте сессию и пройдите исследование без попыток 'угадать' результат.",
    reset_button: "Восстановить целостность"
  },
  boot_sequence: ["Инициализация ядра...", "Загрузка модулей...", "Проверка целостности...", "Система готова"],
  ui: {
    system_build: "Сборка системы",
    reset_session_btn: "В меню",
    status_report_title: "Отчет о состоянии",
    module_label: "Модуль",
    progress_label: "Прогресс",
    secured_label: "Защищено",
    agree_terms_btn: "Принять условия",
    mode_client: "Клиент",
    mode_pro: "Специалист",
    access_restricted: "Доступ ограничен",
    decrypt_btn: "Расшифровать",
    paste_code: "Вставьте код",
    evolution_title: "Эволюция",
    sessions_secured: "Сессий проведено",
    first_investigation_hint: "Первое исследование даст базовую линию",
    integrity_drift: "Дрейф целостности",
    noise_tracking: "Трекинг шума",
    evolution_insight_optimizing: "Система оптимизируется",
    evolution_insight_stabilizing: "Система стабилизируется",
    evolution_insight_desc: "Данные показывают динамику изменений",
    copy_brief: "Копировать",
    brief_copied: "Скопировано",
    system_audit_title: "Аудит системы",
    status_active: "Активен",
    status_expired: "Истек",
    upgrade_btn: "Обновить",
    skip_button: "Пропустить",
    enter_code_btn: "ВХОД В СИСТЕМУ",
    code_input_placeholder: "Лицензия или Пароль",
    auth_title: "Авторизация",
    resume_session_title: "Сессия активна", 
    resume_session_btn: "Продолжить",
    start_new_cycle_btn: "Начать новый цикл", 
    new_cycle_desc: "Архивировать текущий результат and начать с чистого листа",
    session_ekg_title: "Кардиограмма сессии (EKG)",
    session_ekg_desc: "Динамика напряжения and сопротивления в реальном времени."
  },
  auth_ui: {
      verifying: "Проверка...",
      authenticate: "Войти",
      cancel: "Отмена",
      checking_crypto: "Криптографическая проверка...",
      invalid_format: "Неверный формат ключа",
      license_expired: "Срок лицензии истек",
      revoked: "ЛИЦЕНЗИЯ ОТОЗВАНА",
      offline_mode: "ОФФЛАЙН РЕЖИМ: Валидация из кэша...",
      maintenance: "ТЕХНИЧЕСКИЕ РАБОТЫ"
  },
  context_check: {
      title: "Настройка Линзы",
      desc: "Для точной диагностики системе важно понимать контекст вашей жизни прямо сейчас.",
      options: {
          NORMAL: { label: "Штатный режим", sub: "Обычная жизнь, без острых потрясений." },
          HIGH_LOAD: { label: "Высокая нагрузка", sub: "Стресс на работе, экзамены, дедлайны." },
          CRISIS: { label: "Острый кризис", sub: "Потеря, развод, болезнь, война." },
          TRANSITION: { label: "Переходный период", sub: "Переезд, новая работа, смена ролей." }
      }
  },
  admin: {
    kernel: "Ядро",
    registry: "Реестр",
    telemetry: "Телеметрия",
    integrity: "Целостность",
    billing: "Биллинг",
    learning: "Обучение",
    logs: "Логи",
    integrity_audit: "Аудит",
    license_key: "Лицензионный ключ",
    tier_label: "Тип лицензии",
    status_active: "Активна",
    status_expired: "Истекла",
    upgrade_btn: "Обновить",
    panel_title: "ПАНЕЛЬ УПРАВЛЕНИЯ",
    oversight_layer: "СЛОЙ НАДЗОРА",
    exit: "ВЫХОД",
    master_overrides: "МАСТЕР-ОПЦИИ",
    force_unlock: "ПРИНУДИТЕЛЬНОЕ ВСКРЫТИЕ (UNLOCK)",
    glitch_sim: "СИМУЛЯЦИЯ СБОЯ",
    global_control: "ГЛОБАЛЬНЫЙ КОНТРОЛЬ",
    broadcast_msg: "СИСТЕМНОЕ СООБЩЕНИЕ",
    maintenance_mode: "РЕЖИМ ОБСЛУЖИВАНИЯ (KILL SWITCH)",
    issue_license: "ВЫПУСК ЛИЦЕНЗИИ",
    client_name: "Имя Клиента / ID",
    generate_btn: "СГЕНЕРИРОВАТЬ И ВНЕСТИ",
    license_ledger: "РЕЕСТР ЛИЦЕНЗИЙ",
    prepare_github: "ПОДГОТОВИТЬ LEDGER (GITHUB)",
    data_vault: "ХРАНИЛИЩЕ ДАННЫХ",
    import_state: "ИМПОРТ СОСТОЯНИЯ",
    export_backup: "ЭКСПОРТ БЭКАПА",
    launch_audit: "ЗАПУСК АУДИТА ЦЕЛОСТНОСТИ",
    session_nodes: "УЗЛЫ СЕССИИ",
    avg_latency: "СР. ЛАТЕНТНОСТЬ",
    access_clinical: "ДОСТУП К КЛИНИЧЕСКОМУ ТЕРМИНАЛУ"
  },
  guide: {
    title: "Руководство",
    subtitle: "Для клиентов",
    sections: [
      { title: "Как это работает", content: ["Отвечайте быстро", "Будьте честны", "Слушайте тело"] }
    ],
    metaphor: "Ваше подсознание знает кратчайший путь."
  },
  pro_guide: {
    title: "Про-Гайд",
    subtitle: "Для специалистов",
    sections: [
      { title: "Интерпретация", content: ["Смотрите на Entropy", "Foundation - это база вашей работы", "NeuroSync показывает готовность к изменениям"] },
      { title: "Чтение ЭКГ Сессии (EKG)", content: ["График показывает динамику напряжения по ходу сессии.", "Высокие пики (красный) = Точки срыва адаптации и сильного сопротивления.", "Провалы (зеленый) = Flow state или диссоциация (проверяйте NeuroSync).", "Нажмите на столбец, чтобы увидеть точную метрику напряжения."] }
    ],
    closing: "Genesis OS — это профессиональный инструмент, а не развлечение."
  },
  brief_explainer: {
    title: "Краткий экскурс",
    subtitle: "Основы системы",
    intro_title: "Что это?",
    intro_text: "Это система профессионального психологического скрининга.",
    blocks_title: "Блоки",
    archetype_label: "Архетип",
    archetype_desc: "Ваш доминирующий паттерн поведения.",
    metrics_title: "Метрики",
    foundation_desc: "Базовая безопасность and опоры.",
    agency_desc: "Воля and способность к действию.",
    resource_desc: "Ваш потенциал and емкость.",
    entropy_desc: "Уровень шума and тревоги в системе.",
    neurosync_label: "НейроСинхрон",
    neurosync_desc: "Связь тела and разума.",
    latency_label: "Латентность",
    latency_desc: "Время реакции на стимулы.",
    combinations_title: "Комбинации",
    combinations_text: "Метрики работают в связке.",
    action_title: "Действие",
    action_text: "Используйте результаты для терапии.",
    limits_title: "Ограничения",
    limits_text: "Не является медицинским диагнозом.",
    closing: "Ваш путь к осознанности начинается здесь."
  },
  clinical_decoder: {
    somatic_dissonance_title: "Соматический диссонанс",
    somatic_dissonance_desc: "Разрыв между сознательным выбором and реакцией тела.",
    disclaimer: "Только для профессионального использования квалифицированным специалистом.",
    analysis_patterns: {
        god_mode_dissociation: "Компенсаторная сверхпродуктивность как защита от травмы.",
        somatic_rebellion: "Тело бунтует против волевого давления.",
        naked_wire: "Высокая чувствительность при полном отсутствии опор.",
        frozen_will: "Паралич воли при критическом уровне внутреннего шума.",
        intellectual_bypass: "Интеллектуальный обход чувств and ощущений.",
        resource_anxiety: "Тревога, вызванная обладанием ресурсом.",
        foundation_void: "Вакуум в базовой безопасности.",
        manic_defense: "Маниакальная защита через гиперактивность."
    },
    common_hypotheses: {
        anesthesia: { h: "Функциональная анестезия", q: "Что вы перестаете чувствовать, когда вы успешны?" },
        functional_value: { h: "Функциональная самооценка", q: "Кто вы без ваших достижений and функции?" },
        visibility_fear: { h: "Страх видимости", q: "Что самое страшное случится, если вас заметят?" },
        adaptation_to_min: { h: "Адаптация к минимуму", q: "Как вы научились выживать на малом?" }
    },
    configs: {
        compensatory_overdrive: { title: "Сверхкомпенсация", desc: "Система работает на износ для удержания контроля." },
        critical_deficit: { title: "Критический дефицит", desc: "Система истощена, опоры разрушены." },
        economy_mode: { title: "Режим экономии", desc: "Минимальный расход энергии для выживания." },
        mobilization: { title: "Мобилизация", desc: "Активный поиск новых опор and ресурсов." },
        chaotic: { title: "Хаос", desc: "Высокий уровень неопределенности." },
        chaotic_creative: { title: "Креативный хаос", desc: "Активная пересборка внутренних смыслов." },
        rigid: { title: "Ригидность", desc: "Чрезмерная жесткость структур." }
    },
    headers: { mechanism: "Глубинные Механизмы" },
    sync_patterns: {
        coherent: "Когерентность",
        dissociation: "Диссоциация",
        honest_weakness: "Честная слабость"
    },
    archetype_strategies: {
        THE_ARCHITECT: { strategy: "Структурирование", func: "Порядок", limit: "Контроль" },
        THE_DRIFTER: { strategy: "Адаптация", func: "Гибкость", limit: "Размытость" },
        THE_BURNED_HERO: { strategy: "Жертвенность", func: "Подвиг", limit: "Выгорание" },
        THE_GOLDEN_PRISONER: { strategy: "Накопление", func: "Стабильность", limit: "Застой" },
        THE_CHAOS_SURFER: { strategy: "Импровизация", func: "Драйв", limit: "Дезорганизация" },
        THE_GUARDIAN: { strategy: "Сохранение", func: "Безопасность", limit: "Страх перемен" }
    },
    risks: {
        burnout_blindness: "Слепота к признакам выгорания",
        normalization: "Нормализация дефицитарного состояния",
        intellectualization: "Уход в бесплодные рассуждения",
        premature_action: "Преждевременное или импульсивное действие",
        role_play: "Игра в 'хорошего клиента' для терапевта"
    },
    session_entries: {
        reality_check: "Проверка реальности and заземление.",
        decelerate: "Замедление and фокус на дыхании.",
        security_first: "Приоритет: создание безопасности.",
        body_focus: "Возвращение контакта с телом.",
        validate_deficit: "Признание and валидация дефицита."
    }
  },
  global: {
    back: "Назад",
    complete: "Завершено",
    calibrating: "Калибровка",
    calib_desc: "Настройка сенсоров системы and базовой линии.",
    skip_button: "Пропустить"
  },
  sync: {
    title: "Body Sync",
    desc: "Синхронизация с телесными ощущениями.",
    s0: "Нейтрально",
    s1: "Напряжение / Сжатие",
    s2: "Тепло / Энергия",
    s3: "Холод / Онемение",
    s4: "Дрожь / Тремор",
    guidance_tip: "Прислушайтесь к своему телу прямо сейчас.",
    processing: "Обработка сигнала..."
  },
  sensation_feedback: {
    s0: "Сигнал принят",
    s1: "Зафиксирован блок",
    s2: "Ресурс активирован",
    s3: "Обнаружена заморозка",
    s4: "Волнение системы"
  },
  domains: {
    foundation: "Опоры",
    agency: "Воля",
    money: "Ресурсы",
    social: "Социум",
    legacy: "Наследие"
  },
  dashboard: {
    desc: "Система готова к глубокому анализу.",
    insight_coherence: "Высокая когерентность системы.",
    insight_noise: "Обнаружен избыточный шум в каналах.",
    insight_somatic_dissonance: "Зафиксирован соматический диссонанс.",
    needs_retuning: "Требуется калибровка.",
    retest_ready: "Готовность к повторному тесту",
    retest_desc: "Прошло достаточно времени для новой оценки.",
    select_domain: "Выберите домен",
    open_terminal: "Терминал",
    manual_btn: "Инструкция"
  },
  results: {
    integrity: "Целостность",
    neuro_sync: "НейроСинхрон",
    capacity: "Емкость",
    entropy: "Энтропия",
    share_url: "https://genesis-os.app",
    share_button: "Поделиться",
    back: "В дашборд",
    disclaimer_title: "Важное уведомление",
    disclaimer_body: "Результаты скрининга требуют интерпретации квалифицированным специалистом. Это не медицинский диагноз.",
    brief_instruction: "Передайте этот код вашему специалисту.",
    copy_brief: "Копировать код",
    brief_copied: "Код скопирован",
    active_patterns_title: "Активные паттерны",
    tap_to_decode: "Нажмите для расшифровки",
    decoder_title: "Сигнальный декодер",
    signal_resistance: "Сопротивление",
    signal_resonance: "Резонанс",
    protection_label: "Защита",
    cost_label: "Цена",
    antidote_label: "Антидот",
    origin_measured: "Системный замер",
    origin_reported: "Отчет клиента",
    session_prep: "Подготовка к сессии",
    session_prep_desc: "Ключевые вопросы для терапии",
    status: "Статус системы",
    next_steps_title: "Что делать дальше?",
    next_steps_body: "Данные зашифрованы клиническим протоколом. Расшифровка доступна только в PRO-терминале специалиста.",
    step_1: "Скопируйте Clinical ID (Код Доступа).",
    step_2: "Отправьте код вашему психологу.",
    step_3: "Специалист расшифрует скрытые паттерны.",
    human_readable_summary: "Ваше состояние одной фразой:",
    resume_session_title: "Сессия активна", 
    resume_session_btn: "Продолжить",
    start_new_cycle_btn: "Начать новый цикл", 
    new_cycle_desc: "Архивировать текущий результат and начать с чистого листа",
    session_ekg_title: "Кардиограмма сессии (EKG)",
    session_ekg_desc: "Динамика напряжения and сопротивления в реальном времени.",
    blueprint: "БЛУПРИНТ",
    confidence: "ДОСТОВЕРНОСТЬ",
    consistency: "СТАБИЛЬНОСТЬ",
    psychometric_signature: "ПСИХОМЕТРИЧЕСКАЯ ПОДПИСЬ",
    encrypted_overlay: "НЕЙРО-ДИНАМИКА ЗАШИФРОВАНА",
    encrypted_desc: "Скрыты точки срыва адаптации. Доступно специалисту.",
    safety_override: "ПРОТОКОЛ БЕЗОПАСНОЕНИЯ",
    preview_insight: "ПРЕДПРОСМОТР ИНСАЙТА"
  },
  ekg: {
      title: "ЭКГ СЕССИИ",
      tension: "НАПРЯЖЕНИЕ",
      block: "БЛОК",
      flow: "ПОТОК",
      start: "СТАРТ",
      end: "ФИНИШ",
      breakdown: "СРЫВ НА"
  },
  pro_terminal: {
      title: "КЛИНИЧЕСКИЙ ТЕРМИНАЛ",
      access_restricted: "Доступ Ограничен",
      enter_code: "Введите Client ID для дешифровки профиля.",
      paste_placeholder: "ВСТАВЬТЕ КОД (VEHFX...)",
      decrypt_btn: "ДЕШИФРОВАТЬ",
      active_session: "АКТИВНАЯ СЕССИЯ",
      decode_current: "ДЕКОДИРОВАТЬ ТЕКУЩИЙ",
      security_breach: "УГРОЗА БЕЗОПАСНОСТИ",
      tamper_detected: "Обнаружена модификация данных.",
      terminate_session: "ЗАВЕРШИТЬ СЕССИЮ",
      risk_high: "ВЫСОКИЙ РИСК",
      dissociated: "ДИССОЦИАЦИЯ",
      creative_chaos: "КРЕАТИВНЫЙ ХАОС",
      run_protocol: "ЗАПУСК ПРОТОКОЛА СУПЕРВИЗОРА",
      calculating: "ВЫЧИСЛЕНИЕ...",
      supervisor_note: "ЗАМЕТКА СУПЕРВИЗОРА",
      close_session: "ЗАКРЫТЬ СЕССИЮ",
      clinical_hypotheses: "КЛИНИЧЕСКИЕ ГИПОТЕЗЫ",
      verdict_protocol: "ВЕРДИКТ И ПРОТОКОЛ"
  },
  pro_headers: {
      deep_analysis: "01. ГЛУБИННЫЙ АНАЛИЗ",
      behavior_markers: "ПОВЕДЕНЧЕСКИЕ МАРКЕРЫ",
      systemic_vectors: "СИСТЕМНЫЕ ВЕКТОРЫ",
      differential_diagnosis: "ДИФФЕРЕНЦИАЛЬНАЯ ДИАГНОСТИКА",
      evolution_vector: "ВЕКТОР ЭВОЛЮЦИИ",
      target_state: "ЦЕЛЕВОЕ СОСТОЯНИЕ",
      supervision_layer: "СЛОЙ СУПЕРВИЗИИ",
      shadow_contract: "ТЕНЕВОЙ КОНТРАКТ",
      clinical_interventions: "КЛИНИЧЕСКИЕ ИНТЕРВЕНЦИИ",
      signal_check: "ПРОВЕРКА КАЧЕСТВА СИГНАЛА",
      systemic_forces: "СИСТЕМНЫЕ СИЛЫ"
  },
  integrity_audit: {
      title: "АУДИТ ЯДРА GENESIS",
      mode: "РЕЖИМ: ЛИНГВИСТИЧЕСКИЙ НАДЗОР",
      exit: "ВЫХОД ИЗ АУДИТА",
      vital_health: "ВИТАЛЬНОЕ ЗДОРОВЬЕ",
      core_integrity: "ЦЕЛОСТНОСТЬ ЯДРА",
      l10n_parity: "СИНХРОНИЗАЦИЯ ЯЗЫКОВ",
      config_dossier: "ДОСЬЕ КОНФИГУРАЦИИ",
      semantic_audit: "СЕМАНТИЧЕСКИЙ АУДИТ",
      terminology_control: "КОНТРОЛЬ ТЕРМИНОЛОГИИ"
  },
  phases: {
    SANITATION: "Восстановление",
    STABILIZATION: "Стабилизация",
    EXPANSION: "Экспансия"
  },
  tasks: {
      sanitation_1: "Аудит лояльностей",
      sanitation_2: "Соматическая разгрузка",
      stabilization_1: "Границы and опоры",
      expansion_1: "Масштабирование воли"
  },
  scenes: createPlaceholderScenes('ru'),
  beliefs: {
    family_loyalty: "Семейная лояльность",
    scarcity_mindset: "Дефицитарное мышление",
    fear_of_punishment: "Страх наказания",
    imposter_syndrome: "Синдром самозванца",
    poverty_is_virtue: "Бедность как добродетель",
    hard_work_only: "Только тяжелый труд",
    self_permission: "Разрешение себе",
    fear_of_conflict: "Страх конфликта",
    betrayal_trauma: "Травма предательства",
    unconscious_fear: "Бессознательный страх",
    money_is_danger: "Деньги — это опасность",
    impulse_spend: "Импульсивные траты",
    resource_toxicity: "Токсичность ресурса",
    short_term_bias: "Краткосрочное видение",
    capacity_expansion: "Расширение емкости",
    boundary_collapse: "Коллапс границ",
    shame_of_success: "стыд успеха",
    hero_martyr: "Герой-мученик",
    latency_resistance: "Латентное сопротивление",
    body_mind_conflict: "Конфликт души and тела",
    ambivalence_loop: "Петля амбивалентности",
    autopilot_mode: "Автопилот",
    golden_cage: "Золотая клетка",
    money_is_tool: "Деньги как инструмент",
    social_isolation: "Социальная изоляция",
    role_mask: "Ролевая маска",
    time_scarcity: "Дефицит времени",
    death_anxiety: "Тревога смерти",
    legacy_void: "Вакуум наследия",
    default: "Пропуск"
  },
  explanations: {
      latency: "Время, необходимое психике для обработки стимула.",
      resonance: "Совпадение когнитивного ответа and телесного импульса."
  },
  pattern_library: {
    default: { protection: "Стабильность", cost: "Застой", antidote: "Движение" },
    family_loyalty: { protection: "Принадлежность к роду через повторение судьбы", cost: "Запрет на личное счастье and успех", antidote: "Я выбираю свою жизнь с уважением к вашей." },
  },
  archetypes: {
    THE_ARCHITECT: { title: "Архитектор", desc: "Строит системы and структуры.", quote: "Порядок в системе — порядок в жизни.", superpower: "Структурирование", shadow: "Ригидность" },
    THE_DRIFTER: { title: "Скиталец", desc: "Ищет путь, избегая привязанностей.", quote: "Путь открывается идущему.", superpower: "Поиск", shadow: "Нестабильность" },
    THE_BURNED_HERO: { title: "Выгоревший герой", desc: "Спас всех ценой собственного ресурса.", quote: "Я все сделаю сам, любой ценой.", superpower: "Самоотверженность", shadow: "Истощение" },
    THE_GOLDEN_PRISONER: { title: "Золотой узник", desc: "Заперт в комфорте, боится потерять стабильность.", quote: "Мне здесь хорошо, но очень тесно.", superpower: "Стабильность", shadow: "Застой" },
    THE_CHAOS_SURFER: { title: "Серфер хаоса", desc: "Управляет неопределенностью на интуиции.", quote: "Лови волну, пока она есть.", superpower: "Гибкость", shadow: "Дезорганизация" },
    THE_GUARDIAN: { title: "Хранитель", desc: "Оберегает существующие границы and ценности.", quote: "Ни шагу назад от того, что имеем.", superpower: "Защита", shadow: "Изоляция" }
  },
  verdicts: {
    HEALTHY_SCALE: { label: "Здоровый баланс", impact: "Система в ресурсном состоянии." },
    CRITICAL_DEFICIT: { label: "Систემный Сброс", impact: "Необходима полная перезагрузка опор." },
    BRILLIANT_SABOTAGE: { label: "Блестящий саботаж", impact: "Скрытое сопротивление росту." },
    INVISIBILE_CEILING: { label: "Невидимый потолок", impact: "Ограничение масштаба." },
    LEAKY_BUCKET: { label: "Дырявое ведро", impact: "Потеря ресурса через тревогу." },
    PARALYZED_GIANT: { label: "Парализованный гигант", impact: "Огромный потенциал без воли." },
    FROZEN_POTENTIAL: { label: "Замерзший потенциал", impact: "Стагнация на всех уровнях." }
  },
  metric_definitions: {
    foundation: "Ваша внутренняя безопасность and опоры.",
    integrity: "Общая целостность and устойчивость системы."
  },
  conflicts: {
      foundation_agency: "Конфликт Безопасности and Действия",
      agency_resource: "Конфликт Воли and Емкости"
  },
  system_commentary: ["Сигнал стабилен", "Анализ латентности продолжается", "Обнаружен паттерн сопротивления"],
  auth_hint: "Используйте ваш ключ доступа для дешифровки данных.",
  legal_disclaimer: "Genesis OS v3.0 // Только для профессионального использования.",
  safety: {
      alert: "Внимание: Обнаружен критический дефицит опор."
  },
  session_prep_templates: {
      low_foundation_pattern: "Как паттерн '{{pattern}}' влияет на ваше чувство безопасности?",
      low_foundation_generic: "Что сейчас является вашей главной опорой?",
      conflict: "Как вы ощущаете конфликт между сфер {{metric1}} and {{metric2}}?",
      somatic_dissonance: "Ваше тело реагирует на '{{pattern}}' напряжением. О чем этот сигнал?",
      pattern_interaction: "Как '{{pattern1}}' подкрепляет '{{pattern2}}' в вашей жизни?",
      default_latency: "Мы заметили задержку при ответе на вопросы о тени вашего архетипа ({{archetype_shadow}}). Что там скрыто?",
      default_archetype: "Ваш архетип проявляет теневую сторону: {{archetype_shadow}}. Как это мешает прогрессу?",
      default_verdict: "Ваш вердикт '{{verdict_impact}}'. С чего бы вы хотели начать обсуждение?"
  },
  synthesis_categories: {},
  synthesis: {},
  interventions: {},
  directives: {},
  interferences: {},
  correlation_types: {},
};

const ka: Translations = {
  subtitle: "კლინიკური ხიდი // პროფესიული სკრინინგი",
  onboarding: {
    title: "Genesis OS",
    promo_title: "PRO: ექსპერტის ინსტრუმენტი",
    promo_desc: "ლიცენზიები სპეციალისტებისთვის",
    promo_value_1: "შეინარჩუნეთ კლიენტები პირველივე სესიიდან (Retention).",
    promo_value_2: "დაასაბუთეთ დიაგნოსტიკის მაღალი საფასური.",
    promo_value_3: "აუარეთ გვერდი წინააღმდეგობას და დაიწყეთ მუშაობა.",
    protocol_btn: "სკრინინგის დაწყება",
    start_btn: "სისტემის გაშვება",
    pricing_btn: "პროფესიული წვდომა",
    solo_plan: "Solo",
    clinical_plan: "Clinical",
    lab_plan: "Lab",
    price_solo: "19$",
    price_clinical: "49$",
    price_lab: "99$",
    price_per_month: "/ თვეში"
  },
  invalid_results: {
    title: "პროტოკოლის დარღვევა",
    message: "სკრინინგის დროს სისტემამ დააფიქსირა არატიპიური პატერნები, რაც მიუთითებს მონაცემების შესაძლო მანიპულაციაზე.",
    reason_monotonic: "განმეორებადი არჩევანი (მექანიკური პატერნი).",
    reason_robotic: "ზეზუსტი ტაიმინგი (ხელოვნური რიტმი).",
    reason_rhythm: "არასტაბილური კოგნიტური რიტმი.",
    reason_skip: "მნიშვნელოვანი სტიმულების იგნორირების მაღალი დონე.",
    reason_early_termination: "არასაკმარისი მონაცემები კლინიკური დასკვნისთვის.",
    recommendation: "კორექტული დიაგნოსტიკისთვის საჭიროა სპონტანურობა. გთხოვთ, თავიდან გაიაროთ კვლევა 'სწორი' პასუხების გამოცნობის გარეშე.",
    reset_button: "მთლიანობის აღდგენა"
  },
  boot_sequence: ["ბირთვის ინიციალიზაცია...", "მოდულების ჩატვირთვა...", "მთლიანობის შემოწმება...", "სისტემა მზად არის"],
  ui: {
    system_build: "სისტემის ვერსია",
    reset_session_btn: "მთავარი",
    status_report_title: "მდგომარეობის ანგარიში",
    module_label: "მოდული",
    progress_label: "პროგრესი",
    secured_label: "დაცულია",
    agree_terms_btn: "პირობებზე დათანხმება",
    mode_client: "კლიენტი",
    mode_pro: "სპეციალისტი",
    access_restricted: "წვდომა შეზღუდულია",
    decrypt_btn: "დეშიფრაცია",
    paste_code: "ჩასვით კოდი",
    evolution_title: "ევოლუცია",
    sessions_secured: "სესიები დასრულებულია",
    first_investigation_hint: "პირველი კვლევა მოგცემთ საბაზისო ხაზს",
    integrity_drift: "მთლიანობის დრეიფი",
    noise_tracking: "ხმაურის თრექინგი",
    evolution_insight_optimizing: "სისტემა ოპტიმიზირდება",
    evolution_insight_stabilizing: "სისტემა სტაბილიზირდება",
    evolution_insight_desc: "მონაცემები აჩვენებს ცვლილებების დინამიკას",
    copy_brief: "კოპირება",
    brief_copied: "დაკოპირდა",
    system_audit_title: "სისტემის აუდიტი",
    status_active: "აქტიური",
    status_expired: "ვადაგასული",
    upgrade_btn: "განახლება",
    skip_button: "გამოტოვება",
    enter_code_btn: "სისტემაში შესვლა",
    code_input_placeholder: "ლიცენზია ან პაროლი",
    auth_title: "ავტორიზაცია",
    resume_session_title: "სესია აქტიურია", 
    resume_session_btn: "გაგრძელება",
    start_new_cycle_btn: "ახალი ციკლის დაწყება", 
    new_cycle_desc: "მიმდინარე შედეგის დაარქივება და თავიდან დაწყება",
    session_ekg_title: "სესიის კარდიოგრამა (EKG)",
    session_ekg_desc: "დაძაბულობის დინამიკა რეალურ დროში."
  },
  auth_ui: {
      verifying: "მოწმდება...",
      authenticate: "შესვლა",
      cancel: "გაუქმება",
      checking_crypto: "კრიპტოგრაფიული შემოწმება...",
      invalid_format: "არასწორი ფორმატი",
      license_expired: "ლიცენზია ვადაგასულია",
      revoked: "ლიცენზია გაუქმებულია",
      offline_mode: "ოფლაინ რეჟიმი",
      maintenance: "მიმდინარეობს განახლება"
  },
  context_check: {
      title: "ლინზის გასწორება",
      desc: "დიაგნოსტიკისთვის სისტემას სჭირდება თქვენი ცხოვრების კონტექსტი.",
      options: {
          NORMAL: { label: "შტატური რეჟიმი", sub: "ჩვეულებრივი ცხოვრება." },
          HIGH_LOAD: { label: "მაღალი დატვირთვა", sub: "სამუშაო სტრესი, გამოცდები." },
          CRISIS: { label: "მწვავე კრიზისი", sub: "დანაკარგი, ავადმყოფობა, ომი." },
          TRANSITION: { label: "გარდამავალი ეტაპი", sub: "ახალი სამსახური, გადასვლა." }
      }
  },
  admin: {
    kernel: "ბირთვი",
    registry: "რეესტრი",
    telemetry: "ტელემეტრია",
    integrity: "მთლიანობა",
    billing: "ბილინგი",
    learning: "სწავლება",
    logs: "ლოგები",
    integrity_audit: "აუდიტი",
    license_key: "ლიცენზიის გასაღები",
    tier_label: "ლიცენზიის ტიპი",
    status_active: "აქტიური",
    status_expired: "ვადაგული",
    upgrade_btn: "განახლება",
    panel_title: "მართვის პანელი",
    oversight_layer: "ზედამხედველობა",
    exit: "გასვლა",
    master_overrides: "მასტერ-პარამეტრები",
    force_unlock: "იძულებითი გახსნა (UNLOCK)",
    glitch_sim: "ხარვეზის სიმულაცია",
    global_control: "გლობალური კონტროლი",
    broadcast_msg: "სისტემური შეტყობინება",
    maintenance_mode: "სერვისის რეჟიმი (KILL SWITCH)",
    issue_license: "ლიცენზიის გაცემა",
    client_name: "კლიენტის სახელი / ID",
    generate_btn: "გენერაცია და რეგისტრაცია",
    license_ledger: "ლიცენზიების რეესტრი",
    prepare_github: "LEDGER მომზადება (GITHUB)",
    data_vault: "მონაცემთა საცავი",
    import_state: "მდგომარეობის იმპორტი",
    export_backup: "სრული არქივის ექსპორტი",
    launch_audit: "მთლიანობის აუდიტი",
    session_nodes: "სესიის კვანძები",
    avg_latency: "საშ. ლატენტურობა",
    access_clinical: "კლინიკურ ტერმინალზე გადასვლა"
  },
  guide: {
    title: "სახელმძღვანელო",
    subtitle: "კლიენტებისთვის",
    sections: [
      { title: "როგორ მუშაობს", content: ["უპასუხეთ სწრაფად", "იყავით გულწრფელი", "მოუსმინეთ სხეულს"] }
    ],
    metaphor: "თქვენმა ქვეცნობიერმა იცის უმოკლესი გზა."
  },
  pro_guide: {
    title: "პრო-გაიდი",
    subtitle: "სპეციალისტებისთვის",
    sections: [
      { title: "ინტერპრეტაცია", content: ["აკონტროლეთ Entropy", "Foundation არის თქვენი მუშაობის საფუძველი", "NeuroSync აჩვენებს ცვლილებებისთვის მზაობას"] },
      { title: "EKG კითხვა", content: ["გრაფიკი აჩვენებს დაძაბულობის დინამიკას.", "წითელი ზონა = წინააღმდეგობა.", "მწვანე ზონა = Flow.", "დააჭირეთ სვეტს დეტალებისთვის."] }
    ],
    closing: "Genesis OS პროფესიული ინსტრუმენტია."
  },
  brief_explainer: {
    title: "მოკლე ექსკურსი",
    subtitle: "სისტემის საფუძვლები",
    intro_title: "რა არის ეს?",
    intro_text: "ეს არის პროფესიული ფსიქოლოგიური სკრინინგის სისტემა.",
    blocks_title: "ბლოკები",
    archetype_label: "არქეტიპი",
    archetype_desc: "თქვენი დომინანტური ქცევის პატერნი.",
    metrics_title: "მეტრიკები",
    foundation_desc: "ბაზისური უსაფრთხოება და საყრდენები.",
    agency_desc: "ნება და ქმედითობის უნარი.",
    resource_desc: "თქვენი პოტენციალი და ტევადობა.",
    entropy_desc: "ხმაურისა და შფოთვის დონე სისტემაში.",
    neurosync_label: "ნეირო-სინქრონი",
    neurosync_desc: "კავშირი სხეულსა და გონებას შორის.",
    latency_label: "ლატენტურობა",
    latency_desc: "რეაქციის დრო სტიმულებზე.",
    combinations_title: "კომბინაციები",
    combinations_text: "მეტრიკები მუშაობენ ერთობლიობაში.",
    action_title: "ქმედება",
    action_text: "გამოიყენეთ შედეგები თერაპიისთვის.",
    limits_title: "შეზღუდვები",
    limits_text: "არ წარმოადგენს სამედიცინო დიაგნოზს.",
    closing: "თქვენი გზა გაცნობიერებულობისკენ აქ იწყება."
  },
  clinical_decoder: {
    somatic_dissonance_title: "სომატური დისონანსი",
    somatic_dissonance_desc: "გაწყვეტა ცნობიერ არჩევანსა და სხეულის რეაქციას შორის.",
    disclaimer: "მხოლოდ პროფესიული გამოყენებისთვის კვალიფიციური სპეციალისტის მიერ.",
    analysis_patterns: {
        god_mode_dissociation: "Компенсаторная сверхпродуктивность как защита от травмы.",
        somatic_rebellion: "Тело буნტობდეს ნების წინააღმდეგ.",
        naked_wire: "მაღალი მგრძნობელობა საყრდენების არარსებობისას.",
        frozen_will: "ნების პარალიზი შინაგანი ხმაურის ფონზე.",
        intellectual_bypass: "ინტელექტუალური გვერდის ავლა შეგრძნებებისთვის.",
        resource_anxiety: "რესურსის ფლობით გამოწვეული შფოთვა.",
        foundation_void: "ვაკუუმი ბაზისურ უსაფრთხოებაში.",
        manic_defense: "მანიაკალური დაცვა ჰიპერაქტიურობით."
    },
    common_hypotheses: {
        anesthesia: { h: "ფუნქციური ანესთეზია", q: "რისი გრძნობა გიწყდებათ, როცა წარმატებული ხართ?" },
        functional_value: { h: "ფუნქციური თვითშეფასება", q: "ვინ ხართ თქვენი მიღწევების გარეშე?" },
        visibility_fear: { h: "ხილვადობის შიში", q: "რა მოხდება, თუ სხვები შეგამჩნევენ?" },
        adaptation_to_min: { h: "მინიმუმთან ადაპტაცია", q: "როგორ ისწავლეთ მცირედით გადარჩენა?" }
    },
    configs: {
        compensatory_overdrive: { title: "ზე-კომპენსაცია", desc: "სისტემა მუშაობს გადაწვაზე კონტროლის შესანარჩუნებლად." },
        critical_deficit: { title: "კრიტიკული დეფიციტი", desc: "სისტემა გამოფიტულია, საყრდენები დანგრეულია." },
        economy_mode: { title: "ეკონმიის რეჟიმი", desc: "ენერგიის მინიმალური ხარჯვა გადარჩენისთვის." },
        mobilization: { title: "მობილიზაცია", desc: "ახალი საყრდენებისა და რესურსების აქტიური ძიება." },
        chaotic: { title: "ქაოსი", desc: "გაურკვევლობის მაღალი დონე." },
        chaotic_creative: { title: "კრეატიული ქაოსი", desc: "შინაგანი მნიშვნელობების აქტიური გადაწყობა." },
        rigid: { title: "რიგიდულობა", desc: "სტრუქტურების ზედმეტი სიხისტე." }
    },
    headers: { mechanism: "ღრმა მექანიზმები" },
    sync_patterns: {
        coherent: "კოჰერენტულობა",
        dissociation: "დისოციაცია",
        honest_weakness: "გულწრფელი სისუსტე"
    },
    archetype_strategies: {
        THE_ARCHITECT: { strategy: "სტრუქტურირება", func: "წესრიგი", limit: "კონტროლი" },
        THE_DRIFTER: { strategy: "ადაპტაცია", func: "მოქნილობა", limit: "ბუნდოვანება" },
        THE_BURNED_HERO: { strategy: "თავგანწირვა", func: "გმირობა", limit: "გადაწვა" },
        THE_GOLDEN_PRISONER: { strategy: "დაგროვება", func: "სტაბილურობა", limit: "სტაგნაცია" },
        THE_CHAOS_SURFER: { strategy: "იმპროვიზაცია", func: "დრაივი", limit: "დეზორგანიზაცია" },
        THE_GUARDIAN: { strategy: "შენარჩუნება", func: "უსაფრთხოება", limit: "ცვლილებების შიში" }
    },
    risks: {
        burnout_blindness: "გადაწვის ნიშნების იგნორირება",
        normalization: "დეფიციტური მდგომარეობის ნორმალიზაცია",
        intellectualization: "უნაყოფო მსჯელობებში წასვლა",
        premature_action: "ნაადრევი ან იმპულსური ქმედება",
        role_play: "Игра в 'хорошего клиента' для тераეფტა"
    },
    session_entries: {
        reality_check: "რეალობის შემოწმება და დამიწება.",
        decelerate: "შენელება და სუნთქვაზე ფოკუსი.",
        security_first: "პრიორიტეტი: უსაფრთხოების შექმნა.",
        body_focus: "სხეულთან კონტაქტის აღდგენა.",
        validate_deficit: "დეფიციტის აღიარება და ვალიდაცია."
    }
  },
  global: {
    back: "უკან",
    complete: "დასრულებულია",
    calibrating: "კალიბრაცია",
    calib_desc: "სისტემის სენსორების გასწორება.",
    skip_button: "გამოტოვება"
  },
  sync: {
    title: "Body Sync",
    desc: "სხეულებრივ შეგრძნებებთან სინქრონიზაცია.",
    s0: "ნეიტრალური",
    s1: "დაჭიმულობა / შეკუმშვა",
    s2: "სითბო / ენერგია",
    s3: "სიცივე / დაბუჟება",
    s4: "კანკალი / თრთოლვა",
    guidance_tip: "მოუსმინეთ თქვენს სხეულს ამ მომენტში.",
    processing: "სიგნალის დამუშავება..."
  },
  sensation_feedback: {
    s0: "სიგნალი მიღებულია",
    s1: "ბლოკი დაფიქსირდა",
    s2: "რესურსი გააქტიურდა",
    s3: "გაყინვა აღმოჩენილია",
    s4: "სისტემის აღგზნება"
  },
  domains: {
    foundation: "საყრდენები",
    agency: "ნება",
    money: "რესურსები",
    social: "სოციუმი",
    legacy: "მემკვიდრეობა"
  },
  dashboard: {
    desc: "სისტემა მზად არის ღრმა ანალიზისთვის.",
    insight_coherence: "სისტემის მაღალი კოჰერენტულობა.",
    insight_noise: "აღმოჩენილია ჭარბი ხმაური.",
    insight_somatic_dissonance: "დაფიქსირდა სომატური დისონანსი.",
    retest_ready: "მზადყოფნა განმეორებითი ტესტისთვის",
    retest_desc: "ახალი შეფასებისთვის საკმარისი დრო გავიდა.",
    select_domain: "აირჩიეთ დომენი",
    open_terminal: "ტერმინალი",
    manual_btn: "ინსტრუქცია"
  },
  results: {
    integrity: "მთლიანობა",
    neuro_sync: "ნეირო-სინქრონი",
    capacity: "ტევადობა",
    entropy: "ენტროპია",
    share_url: "https://genesis-os.app",
    share_button: "გაზიარება",
    back: "დაშბორდზე",
    disclaimer_title: "მნიშვნელოვანი შეტყობინება",
    disclaimer_body: "შედეგები საჭიროებს სპეციალისტის ინტერპრეტაციას. ეს არ არის დიაგნოზი.",
    brief_instruction: "გადაეცით ეს კოდი თქვენს სპეციალისტს.",
    copy_brief: "კოდის კოპირება",
    brief_copied: "კოდი დაკოპირდა",
    active_patterns_title: "აქტიური პატერნები",
    tap_to_decode: "დააჭირეთ დეშიფრაციისთვის",
    decoder_title: "სიგნალის დეკოდერი",
    signal_resistance: "წინააღმდეგობა",
    signal_resonance: "რეზონანსი",
    protection_label: "დაცვა",
    cost_label: "ფასი",
    antidote_label: "ანტიდოტი",
    origin_measured: "სისტემური გაზომვა",
    origin_reported: "კლიენტის რეპორტი",
    session_prep: "სესიისთვის მომზადება",
    session_prep_desc: "საკვანძო კითხვები თერაპიისთვის",
    status: "სისტემის სტატუსი",
    next_steps_title: "რა გავაკეთო?",
    next_steps_body: "მონაცემები დაშიფრულია კლინიკური პროტოკოლით. გაშიფვრა ხელმისაწვდომია მხოლოდ PRO-ტერმინალში.",
    step_1: "დააკოპირეთ Clinical ID (წვდომის კოდი).",
    step_2: "გაუგზავნეთ კოდი თქვენს ფსიქოლოგს.",
    step_3: "სპეციალისტი გაშიფრავს დაფარულ პატერნებს.",
    human_readable_summary: "თქვენი მდგომარეობა ერთი ფრაზით:",
    resume_session_title: "სესია აქტიურია", 
    resume_session_btn: "გაგრძელება",
    start_new_cycle_btn: "ახალი ციკლის დაწყება", 
    new_cycle_desc: "მიმდინარე შედეგის დაარქივება და თავიდან დაწყება",
    session_ekg_title: "სესიის კარდიოგრამა (EKG)",
    session_ekg_desc: "დაძაბულობის დინამიკა რეალურ დროში.",
    blueprint: "პიროვნების რუკა",
    confidence: "სანდოობა",
    consistency: "სტაბილურობა",
    psychometric_signature: "ფსიქომეტრიული ხელმოწერა",
    encrypted_overlay: "ნეირო-დინამიკა დაშიფრულია",
    encrypted_desc: "დაფარული ზონები სპეციალისტისთვის.",
    safety_override: "უსაფრთხოების პროტოკოლი",
    preview_insight: "ინსაიტის პრევიუ"
  },
  ekg: {
      title: "სესიის EKG",
      tension: "დაძაბულობა",
      block: "ბლოკი",
      flow: "ნაკადი",
      start: "დასაწყისი",
      end: "დასასრული",
      breakdown: "გარღვევა"
  },
  pro_terminal: {
      title: "კლინიკური ტერმინალი",
      access_restricted: "წვდომა შეზღუდულია",
      enter_code: "შეიყვანეთ Client ID დეშიფრაციისთვის.",
      paste_placeholder: "ჩასვით კოდი (VEHFX...)",
      decrypt_btn: "დეშიფრაცია",
      active_session: "აქტიური სესია",
      decode_current: "მიმდინარეს გაშიფრვა",
      security_breach: "უსაფრთხოების დარღვევა",
      tamper_detected: "მონაცემების ცვლილება დაფიქსირდა.",
      terminate_session: "სესიის დასრულება",
      risk_high: "მაღალი რისკი",
      dissociated: "დისოციაცია",
      creative_chaos: "კრეატიული ქაოსი",
      run_protocol: "სუპერვაიზერის პროტოკოლი",
      calculating: "გამოთვლა...",
      supervisor_note: "სუპერვაიზერის შენიშვნა",
      close_session: "სესიის დახურვა",
      clinical_hypotheses: "კლინიკური ჰიპოთეზები",
      verdict_protocol: "ვერდიქტი და პროტოკოლი"
  },
  pro_headers: {
      deep_analysis: "01. სიღრმისეული ანალიზი",
      behavior_markers: "ქცევითი მარკერები",
      systemic_vectors: "სისტემური ვექტორები",
      differential_diagnosis: "დიფერენციალური დიაგნოსტიკა",
      evolution_vector: "ევოლუციის ვექტორი",
      target_state: "სამიზნე მდგომარეობა",
      supervision_layer: "ზედამხედველობის შრე",
      shadow_contract: "ჩრდილოვანი კონტრაქტი",
      clinical_interventions: "კლინიკური ინტერვენციები",
      signal_check: "სიგნალის ხარისხი",
      systemic_forces: "სისტემური ძალები"
  },
  integrity_audit: {
      title: "ბირთვის აუდიტი (GENESIS)",
      mode: "რეჟიმი: ლინგვისტური ზედამხედველობა",
      exit: "აუდიტიდან გასვლა",
      vital_health: "ვიტალური ჯანმრთელობა",
      core_integrity: "ბირთვის მთლიანობა",
      l10n_parity: "ენების სინქრონიზაცია",
      config_dossier: "კონფიგურაციის დოსიე",
      semantic_audit: "სემანტიკური აუდიტი",
      terminology_control: "ტერმინოლოგიის კონტროლი"
  },
  phases: {
    SANITATION: "აღდგენა",
    STABILIZATION: "სტაბილიზაცია",
    EXPANSION: "ექსპანსია"
  },
  tasks: {
      sanitation_1: "ლოიალობების აუდიტი",
      sanitation_2: "სომატური განტვირთვა",
      stabilization_1: "საზღვრები და საყრდენები",
      expansion_1: "ნების მასშტაბირება"
  },
  scenes: createPlaceholderScenes('ka'),
  beliefs: {
    family_loyalty: "ოჯახური ლოიალობა",
    scarcity_mindset: "დეფიციტური აზროვნება",
    fear_of_punishment: "დასჯის შიში",
    imposter_syndrome: "თვითმარქვიას სინდრომი",
    poverty_is_virtue: "სიღარიბე როგორც სათნოება",
    hard_work_only: "მხოლოდ მძიმე შრომა",
    self_permission: "საკუთარი თავისთვის ნების დართვა",
    fear_of_conflict: "კონფლიქტის შიში",
    betrayal_trauma: "ღალატის ტრავმა",
    unconscious_fear: "ქვეცნობიერი შიში",
    money_is_danger: "ფული საფრთხეა",
    impulse_spend: "იმპულსური ხარჯვა",
    resource_toxicity: "რესურსის ტოქსიკურობა",
    short_term_bias: "მოკლევადიანი ხედვა",
    capacity_expansion: "ტევადობის გაფართოება",
    boundary_collapse: "საზღვრების კოლაფსი",
    shame_of_success: "წარმატების სირცხვილი",
    hero_martyr: "გმირი-წამებული",
    latency_resistance: "ლატენტური წინააღმდეგობა",
    body_mind_conflict: "კონფლიქტი სულისა და სხეულის კონფლიქტი",
    ambivalence_loop: "ამბივალენტობის მარყუჟი",
    autopilot_mode: "ავტოპილოტი",
    golden_cage: "ოქროს გალია",
    money_is_tool: "ფული როგორც ინსტრუმენტი",
    social_isolation: "სოციალური იზოლაცია",
    role_mask: "როლური ნიღაბი",
    time_scarcity: "დროის დეფიციტი",
    death_anxiety: "სიკვდილის შფოთვა",
    legacy_void: "მემკვიდრეობის ვაკუუმი",
    default: "გამოტოვება"
  },
  explanations: {
      latency: "დრო, რომელიც ფსიქიკას სჭირდება სტიმულის დასამუშავებლად.",
      resonance: "კოგნიტური პასუხისა და სხეულებრივი იმპულსის თანხვედრა."
  },
  pattern_library: {
    default: { protection: "სტაბილურობა", cost: "სტაგნაცია", antidote: "მოძრაობა" },
    family_loyalty: { protection: "გვარისადმი კუთვნილება ბედის გამეორებით", cost: "პირად ბედნიერებაზე აკრძალვა", antidote: "მე ვირჩევ ჩემს ცხოვრებას თქვენი პატივისცემით." },
  },
  archetypes: {
    THE_ARCHITECT: { title: "არქიტექტორი", desc: "აშენებს სისტემებსა და სტრუქტურებს.", quote: "წესრიგი სისტემაში — წესრიგი ცხოვრებაში.", superpower: "სტრუქტურირება", shadow: "რიგიდულობა" },
    THE_DRIFTER: { title: "მოხეტიალე", desc: "ეძებს გზას მიჯაჭვულობის გარეშე.", quote: "გზა მიმავალს ემორჩილება.", superpower: "ძიება", shadow: "არასტაბილურობა" },
    THE_BURNED_HERO: { title: "გადამწვარი გმირი", desc: "გადაარჩინა ყველა საკუთარი რესურსის ფასად.", quote: "ყველაფერს თავად გავაკეთებ, ნებისმიერ ფასად.", superpower: "თავდადება", shadow: "გამოფიტვა" },
    THE_GOLDEN_PRISONER: { title: "ოქროს ტყვე", desc: "ჩაკეტილია კომფორტში, ეშინია სტაბილურობის დაკარგვის.", quote: "აქ კარგია, მაგრამ ძალიან ვიწრო.", superpower: "სტაბილურობა", shadow: "სტაგნაცია" },
    THE_CHAOS_SURFER: { title: "ქაოსის სერფერი", desc: "მართავს გაურკვევლობას ინტუიციით.", quote: "დაიჭირე ტალღა, სანამ ის არის.", superpower: "მოქნილობა", shadow: "დეზორგანიზაცია" },
    THE_GUARDIAN: { title: "მცველი", desc: "იცავს არსებულ საზღვრებსა და ღირებულებებს.", quote: "არცერთი ნაბიჯი უკან იმისგან, რაც გვაქვს.", superpower: "დაცვა", shadow: "იზოლაცია" }
  },
  verdicts: {
    HEALTHY_SCALE: { label: "ჯანსაღი ბალანსი", impact: "სისტემა რესურსულ მდგომარეობაშია." },
    CRITICAL_DEFICIT: { label: "სისტემური გადატვირთვა", impact: "საჭიროა საყრდენების სრული აღდგენა." },
    BRILLIANT_SABOTAGE: { label: "ბრწყინვალე საბოტაჟი", impact: "ფარული წინააღმდეგობა ზრდისადმი." },
    INVISIBILE_CEILING: { label: "უხილავი ჭერი", impact: "მასშტაბის შეზღუდვა." },
    LEAKY_BUCKET: { label: "გახვრეტილი ვედრო", impact: "რესურსის კარგვა შფოთვის გამო." },
    PARALYZED_GIANT: { label: "პარალიზებული გიგანტი", impact: "დიდი პოტენციალი ნების გარეშე." },
    FROZEN_POTENTIAL: { label: "გაყინული პოტენციალი", impact: "სტაგნაცია ყველა დონეზე." }
  },
  metric_definitions: {
    foundation: "თქვენი შინაგანი უსაფრთხოება და საყრდენები.",
    integrity: "სისტემის საერთო მთლიანობა და მდგრადობა."
  },
  conflicts: {
      foundation_agency: "უსაფრთხოებისა და ქმედების კონფლიქტი",
      agency_resource: "ნებისა და ტევადობის კონფლიქტი"
  },
  system_commentary: ["სიგნალი სტაბილურია", "ლატენტურობის ანალიზი გრძელდება", "აღმოჩენილია წინააღმდეგობის პატერნი"],
  auth_hint: "გამოიყენეთ თქვენი წვდომის გასაღები მონაცემთა დეშიფრაციისთვის.",
  legal_disclaimer: "Genesis OS v3.0 // მხოლოდ პროფესიული გამოყენებისთვის.",
  safety: {
      alert: "ყურადღება: საყრდენების კრიტიკული დეფიციტი."
  },
  session_prep_templates: {
      low_foundation_pattern: "როგორ მოქმედებს პატერნი '{{pattern}}' თქვენს უსაფრთხოების განცდაზე?",
      low_foundation_generic: "რა არის თქვენი მთავარი საყრდენი ამჟამად?",
      conflict: "როგორ გრძნობთ კონფლიქტს {{metric1}}-სა და {{metric2}}-ს შორის?",
      somatic_dissonance: "თქვენი სხეული რეაგირებს '{{pattern}}'-ზე დაჭიმულობით. რაზეა ეს სიგნალი?",
      pattern_interaction: "როგორ აძლიერებს '{{pattern1}}' '{{pattern2}}'-ს თქვენს ცხოვრებაში?",
      default_latency: "ჩვენ შევამჩნიეთ დაყოვნება თქვენი არქეტიპის ჩრდილოვან მხარეზე ({{archetype_shadow}}). რა იმალება იქ?",
      default_archetype: "თქვენი არქეტიპი ავლენს ჩრდილოვან მხარეს: {{archetype_shadow}}. როგორ უშლის ეს ხელს პროგრესს?",
      default_verdict: "თქვენი ვერდიქტია '{{verdict_impact}}'. რით გსურთ საუბრის დაწყება?"
  },
  synthesis_categories: {},
  synthesis: {},
  interventions: {},
  directives: {},
  interferences: {},
  correlation_types: {},
};

export const translations: Record<string, Translations> = { ru, ka };
