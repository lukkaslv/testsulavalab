
import { Translations, BeliefKey } from './types';

const pattern_library_ru = {
    family_loyalty: { protection: "Сохраняет принадлежность к роду. Страх: 'Если я стану успешнее, я предам их лишения'.", cost: "Финансовый потолок. Бессознательное обесценивание достижений.", antidote: "Фраза: 'Я имею право жить иначе, сохраняя уважение к корням'." },
    scarcity_mindset: { protection: "Защита от разочарования. 'Если я ничего не жду, мне не будет больно'.", cost: "Слепота к возможностям. Видение рисков вместо ресурсов.", antidote: "Вопрос: 'Если бы безопасность была гарантирована, какой шаг я бы сделал?'" },
    fear_of_punishment: { protection: "Детская защита от гнева авторитетов. 'Не проявляйся — не накажут'.", cost: "Паралич инициативы. Постоянное ожидание разрешения.", antidote: "Ошибка — это данные для анализа, а не повод для наказания." },
    imposter_syndrome: { protection: "Защита от стыда. Перфекционизм как щит от критики.", cost: "Бесконечное обучение без практики. Жизнь 'на черновик'.", antidote: "Действие: Сделать на 70% и выпустить в мир." },
    poverty_is_virtue: { protection: "Моральное превосходство. 'Я бедный, зато честный'.", cost: "Запрет на достойную оплату. Обесценивание своего времени.", antidote: "Ресурс нейтрален. Он лишь усиливает то, что уже есть в человеке." },
    hard_work_only: { protection: "Снятие вины за доход. 'Я имею право на деньги только через страдание'.", cost: "Выгорание. Невозможность принимать подарки.", antidote: "Ценность создается пользой, а не степенью усталости." },
    self_permission: { protection: "Ожидание внешней валидации.", cost: "Зависимость от мнения экспертов и авторитетов.", antidote: "Я сам являюсь источником разрешения на действие." },
    fear_of_conflict: { protection: "Сохранение хрупкой стабильности. 'Мир важнее истины'.", cost: "Потеря границ. Использование вашего ресурса другими.", antidote: "Конфликт — это инструмент прояснения реальности, а не война." },
    betrayal_trauma: { protection: "Тотальный контроль. 'Никому нельзя доверять'.", cost: "Одиночество на вершине. Невозможность делегирования.", antidote: "Доверие — это риск, который окупается скоростью роста." },
    unconscious_fear: { protection: "Иррациональная остановка перед неизвестным.", cost: "Ступор без видимой логической причины.", antidote: "Идти в страх. Там, где страшно — там скрытая энергия." },
    money_is_danger: { protection: "Физическое выживание. Генетическая память о раскулачивании.", cost: "Психосоматика при росте дохода. Саботаж крупных сделок.", antidote: "Те времена прошли. Сейчас ресурс — это безопасность и свобода." },
    impulse_spend: { protection: "Сброс эмоционального напряжения через покупки.", cost: "Невозможность формирования капитала. Жизнь 'в ноль'.", antidote: "Пауза 24 часа перед любым финансовым решением." },
    resource_toxicity: { protection: "Сохранение гомеостаза. Успех воспринимается как угроза.", cost: "Саботаж на финишной прямой.", antidote: "Моя емкость для принятия благ растет с каждым шагом." },
    short_term_bias: { protection: "Быстрое удовольствие здесь и сейчас.", cost: "Отсутствие стратегического видения и будущего.", antidote: "Выбор в пользу своего будущего 'Я'." },
    capacity_expansion: { protection: "Тестирование новых границ системы.", cost: "Временный дискомфорт адаптации.", antidote: "Продолжать движение, опираясь на факты." },
    boundary_collapse: { protection: "Слияние. 'Я хороший, если я удобный для других'.", cost: "Потеря собственной цели. Проживание чужой жизни.", antidote: "Говорить 'Нет' без чувства вины и оправданий." },
    shame_of_success: { protection: "Социальная мимикрия. 'Не буду выделяться, чтобы не завидовали'.", cost: "Искусственное уменьшение своего масштаба.", antidote: "Мой успех — это ориентир и вдохновение для других." },
    hero_martyr: { protection: "Чувство значимости через самопожертвование.", cost: "Глубокое истощение и скрытая обида на мир.", antidote: "Сначала маску на себя, затем на окружающих." },
    latency_resistance: { protection: "Торг с системой. Поиск самого 'безопасного' ответа.", cost: "Упущенные возможности. Потеря подлинности.", antidote: "Первый импульс — самый честный сигнал системы." },
    body_mind_conflict: { protection: "Блокировка опасного действия через тело.", cost: "Хроническое напряжение и психосоматика.", antidote: "Слушать тело как независимый детектор истины." },
    ambivalence_loop: { protection: "Избегание выбора для сохранения всех вариантов.", cost: "Трата психической энергии вхолостую.", antidote: "Любой выбор лучше, чем паралич решения." },
    autopilot_mode: { protection: "Экономия когнитивного ресурса.", cost: "Жизнь по инерции и чужим сценариям.", antidote: "Осознанное присутствие в каждом выборе." },
    golden_cage: { protection: "Максимальный комфорт при отсутствии развития.", cost: "Экзистенциальный кризис. Скука как симптом.", antidote: "Контролируемый риск — цена подлинной свободы." },
    money_is_tool: { protection: "Здоровое отношение к ресурсу.", cost: "Ошибок не выявлено.", antidote: "Усиливать текущий паттерн осознанности." },
    default: { protection: "Адаптация к среде.", cost: "Ограничение потенциала.", antidote: "Наблюдение за собой." }
};

const pattern_library_ka = {
    family_loyalty: { protection: "ინარჩუნებს გვარისადმი კუთვნილებას. შიში: 'თუ გავმდიდრდები, ვუღალატებ მათ'.", cost: "ფინანსური ჭერი. წარმატების გაუფასურება.", antidote: "ფრაზა: 'მე მაქვს უფლება ვიცხოვრო სხვანაირად'." },
    scarcity_mindset: { protection: "დაცვა იმედგაცრუებისგან.", cost: "შესაძლებლობების მიმართ სიბრმავე.", antidote: "კითხვა: 'უსაფრთხოება გარანტირებული რომ იყოს, რას ვიზამდი?'" },
    fear_of_punishment: { protection: "ბავშვური დაცვა რისხვისგან.", cost: "ინიციატივის პარალიზება.", antidote: "შეცდომა არის მონაცემი სწავლისთვის." },
    imposter_syndrome: { protection: "დაცვა სირცხვილისგან.", cost: "უსასრულო სწავლა პრაქტიკის გარეშე.", antidote: "ქმედება: გააკეთე 70%-ით და გამოაქვეყნე." },
    poverty_is_virtue: { protection: "მორალური უპირატესობა.", cost: "საკუთარი შრომის გაუფასურება.", antidote: "ფული ნეიტრალურია." },
    hard_work_only: { protection: "დანაშაულის მოხსნა ტანჯვით.", cost: "გადაწვა.", antidote: "ფული მოდის ღირებულებაზე." },
    self_permission: { protection: "გარე ვალიდაციის ლოდინი.", cost: "ავტორიტეტებისგან დამოკიდებულება.", antidote: "მე თვითონ ვაძლევ საკუთარ თავს უფლებას." },
    fear_of_conflict: { protection: "ხილული მშვიდობის შენარჩუნება.", cost: "საზღვრების დაკარგვა.", antidote: "კონფლიქტი სიმართლის გარკვევის საშუალებაა." },
    betrayal_trauma: { protection: "ტოტალური კონტროლი.", cost: "მარტოობა მწვერვალზე.", antidote: "ნდობა არის რისკი." },
    unconscious_fear: { protection: "ირაციონალური გაჩერება.", cost: "სტუპორი უხილავი მიზეზით.", antidote: "წადი შიშისკენ." },
    money_is_danger: { protection: "ფიზიკური საფრთხე.", cost: "ფსიქოსომატიკა.", antidote: "ახლა ფული უსაფრთხოა." },
    impulse_spend: { protection: "დაძაბულობის მოხსნა.", cost: "კაპიტალის დაგროვების შეუძლებლობა.", antidote: "24 საათიანი პაუზა ყიდვის წინ." },
    resource_toxicity: { protection: "ჰომეოსტაზის შენარჩუნება.", cost: "საბოტაჟი ფინიშის ხაზთან.", antidote: "ჩემი ტევადობა იზრდება." },
    short_term_bias: { protection: "სწრაფი სიამოვნება.", cost: "სტრატეგიული ხედვის არარსებობა.", antidote: "არჩევანი მომავალი 'მეს' სასარგებლოდ." },
    capacity_expansion: { protection: "ახალი საზღვრების ტესტირება.", cost: "ზრდის დროებითი დისკომფორტი.", antidote: "გააგრძელე მოძრაობა." },
    boundary_collapse: { protection: "შერწყმა.", cost: "საკუთარი თავის დაკარგვა.", antidote: "თქვი 'არა' თავის მართლების გარეშე." },
    shame_of_success: { protection: "სოციალური მიმიკრია.", cost: "საკუთარი მასშტაბის შემცირება.", antidote: "ჩემი წარმატება სხვებს შთააგონებს." },
    hero_martyr: { protection: "მნიშვნელოვნების განცდა მსხვერპლშეწირვით.", cost: "წყენა სამყაროზე.", antidote: "ჯერ ნიღაბი საკუთარ თავს." },
    latency_resistance: { protection: "ვაჭრობა. უსაფრთხო პასუხის ძიება.", cost: "გაშვებული მომენტები.", antidote: "პირველი იმპულსი ყველაზე მართალია." },
    body_mind_conflict: { protection: "საშიში ქმედების ბლოკირება სხეულით.", cost: "ფსიქოსომატიკა.", antidote: "უსმინე სხეულს." },
    ambivalence_loop: { protection: "არჩევანის არიდება.", cost: "ენერგიის ფუჭი ხარჯვა.", antidote: "ნებისმიერი არჩევანი სჯობს უმოქმედობას." },
    autopilot_mode: { protection: "კოგნიტური რესურსის ეკონომია.", cost: "ცხოვრება სხვისი სცენარით.", antidote: "გააზრებულობა ყოველ ქმედებაში." },
    golden_cage: { protection: "კომფორტი და უსაფრთხოება.", cost: "განვითარების სიკვდილი.", antidote: "რისკი თავისუფლების ფასია." },
    money_is_tool: { protection: "ჯანსაღი დამოკიდებულება.", cost: "შეცდომები არ გამოვლენილა.", antidote: "გააძლიერე არსებული სტრატეგია." },
    default: { protection: "ადაპტაცია.", cost: "შეზღუდვა.", antidote: "დაკვირვება." }
};

// Defined session preparation templates for clinical context
const session_prep_ru = {
    low_foundation_pattern: "Как паттерн «{{pattern}}» помогает вам чувствовать себя в безопасности сейчас?",
    low_foundation_generic: "Какие основные опоры вы чувствуете в своей жизни в данный момент?",
    conflict: "Как конфликт «{{conflict_name}}» между {{metric1}} и {{metric2}} проявляется в ваших ежедневных решениях?",
    somatic_dissonance: "Что ваше тело пытается сказать вам через паттерн «{{pattern}}»?",
    pattern_interaction: "Как взаимодействуют «{{pattern1}}» и «{{pattern2}}» в вашей текущей ситуации?",
    default_latency: "Почему возникла задержка при обсуждении вашей тени «{{archetype_shadow}}»?",
    default_archetype: "Как ваша теневая сторона «{{archetype_shadow}}» мешает вам достигать целей?",
    default_verdict: "Какое влияние оказывает вердикт «{{verdict_impact}}» на ваше самовосприятие?"
};

const session_prep_ka = {
    low_foundation_pattern: "როგორ გეხმარებათ პატერნი „{{pattern}}“ თავის დაცულად გრძნობაში ახლა?",
    low_foundation_generic: "რა არის თქვენი ძირითადი საყრდენები ცხოვრებაში ამ მომენტში?",
    conflict: "როგორ ვლინდება კონფლიქტი „{{conflict_name}}“ {{metric1}}-სა და {{metric2}}-ს შორის თქვენს ყოველდღიურ გადაწყვეტილებებში?",
    somatic_dissonance: "რისი თქმა სურს თქვენს სხეულს პატერნ „{{pattern}}“-ის მეშვეობით?",
    pattern_interaction: "როგორ ურთიერთქმედებენ „{{pattern1}}“ და „{{pattern2}}“ თქვენს ამჟამინდელ სიტუაციაში?",
    default_latency: "რატომ გაჩნდა დაყოვნება თქვენს ჩრდილოვან მხარეზე „{{archetype_shadow}}“ საუბრისას?",
    default_archetype: "როგორ უშლის ხელს თქვენი ჩრდილოვანი მხარე „{{archetype_shadow}}“ მიზნების მიღწევას?",
    default_verdict: "რა გავლენას ახდენს ვერდიქტი „{{verdict_impact}}“ თქვენს თვითაღქმაზე?"
};

const ru: Translations = {
  subtitle: "LUKA SULAVA // НЕЙРО-ОРИЕНТИРОВАНИЕ",
  onboarding: {
    title: "Genesis OS: Навигатор",
    step1_t: "СКОРОСТЬ РЕАКЦИИ",
    step1_d: "Мы фиксируем время вашего выбора. Это объективный замер когнитивной нагрузки и скрытого сопротивления.",
    step2_t: "САМООТЧЕТ ТЕЛА",
    step2_d: "Ваше ощущение резонанса. Физика тела знает верный путь раньше, чем это осознает ум.",
    step3_t: "ИНТЕРПРЕТАЦИЯ",
    step3_d: "Результаты — это карта для диалога со специалистом, помогающая выявить структурные конфликты личности.",
    protocol_btn: "ПРИНЯТЬ ПРОТОКОЛ",
    protocol_init: "ИНИЦИАЛИЗАЦИЯ...",
    protocol_ready: "ПРОТОКОЛ ПРИНЯТ",
    start_btn: "НАЧАТЬ ИССЛЕДОВАНИЕ"
  },
  invalid_results: {
      title: "Данные не валидны",
      subtitle: "Целостность сигнала нарушена",
      message: "Система обнаружила паттерн ответов, который не позволяет построить достоверную клиническую картину.",
      reason_monotonic: "Причина: Обнаружен монотонный паттерн (выбор одной позиции).",
      reason_skip: "Причина: Слишком высокий процент пропущенных вопросов.",
      reason_flatline: "Причина: Обнаружен 'плоский' эмоциональный профиль.",
      reason_robotic: "Причина: Роботизированный тайминг (отсутствие живой вариативности).",
      reason_somatic: "Причина: Монотонный паттерн телесных откликов.",
      reason_early_termination: "Причина: Исследование завершено слишком рано.",
      recommendation: "Пожалуйста, пройдите исследование заново, доверяя своему первому импульсу.",
      reset_button: "СБРОСИТЬ И НАЧАТЬ ЗАНОВО"
  },
  boot_sequence: [
      "Инициализация ядра v6.4...",
      "Загрузка нейронных модулей...",
      "Проверка целостности: 100%",
      "Калибровка соматических сенсоров...",
      "Установка защищенного соединения...",
      "Система готова к работе."
  ],
  ui: {
    scanning: "Синхронизация",
    module_label: "МОДУЛЬ",
    skip_button: "Не уверен / Пропустить",
    system_build: "Сборка системы",
    reset_session_btn: "Сбросить_Сессию",
    verified_badge: "Проверено",
    day_label: "День",
    status_report_title: "ОТЧЕТ О СОСТОЯНИИ",
    live_uplink: "Канал активен",
    secured_label: "СЕКТОРОВ ЗАЩИЩЕНО",
    system_audit_title: "Аудит системы",
    progress_label: "ПРОГРЕСС",
    decrypt_btn: "РАСШИФРОВАТЬ",
    close_session_btn: "[ ЗАКРЫТЬ СЕССИЮ ]",
    agree_terms_btn: "СОГЛАСЕН С УСЛОВИЯМИ",
    mode_client: "Для Клиента",
    mode_pro: "Для Специалиста",
    access_restricted: "Доступ Ограничен",
    paste_code: "Вставьте ID клиента...",
    architecture_session: "Архитектура Сессии",
    status_protocol: "Статус Протокола",
    behavioral_markers: "Маркеры Поведения",
    systemic_root: "Системный Корень",
    verdict_protocol: "Вердикт и Протокол",
    supervision_layer: "Слой Супервизии"
  },
  admin: {
    access: "Вход",
    cancel: "Отмена",
    enter_key: "Введите_Ключ",
    privacy: "КОНФИДЕНЦИАЛЬНОСТЬ: ЛОКАЛЬНОЕ ХРАНЕНИЕ",
    confirm_destructive: "Подтвердите действие",
    irreversible_note: "Это действие необратимо. Введите код подтверждения.",
    execute: "Выполнить",
    kernel_commands: "Команды Ядра",
    live_metrics: "Живые Метрики",
    integrity_audit: "Аудит Системы",
    translation_deep: "Аудит Перевода",
    db_inspector: "Инспектор БД"
  },
  guide: {
    title: "ПРОТОКОЛ ПОЛЬЗОВАТЕЛЯ",
    subtitle: "Инструкция клиента",
    sections: [
        { title: "1. ЦЕЛЬ ИССЛЕДОВАНИЯ", content: ["Genesis OS — это инструмент объективизации внутренних конфликтов.", "Мы анализируем не только 'что' вы отвечаете, но и 'как' — с какой задержкой и телесным откликом."] },
        { title: "2. ПРАВИЛА ОТВЕТОВ", content: ["Используйте первый импульс. Здесь нет правильных ответов.", "Если тело дает реакцию (сжатие, тепло) — фиксируйте это в блоке резонанса."] }
    ],
    metaphor: "Genesis OS — это компас, показывающий, где ваша энергия заблокирована страхом."
  },
  pro_guide: {
    title: "КЛИНИЧЕСКИЙ ПРОТОКОЛ",
    subtitle: "Руководство для специалиста",
    sections: [
        { title: "1. ИНТЕРПРЕТАЦИЯ МЕТРИК", content: ["Foundation (Опора) — уровень безопасности. Ниже 35% требует стабилизации.", "Agency (Воля) — способность к экспансии.", "Entropy (Шум) — уровень внутреннего трения."] }
    ],
    closing: "Используйте эти данные как гипотезу для диагностической сессии."
  },
  brief_explainer: {
    title: "КАК ЧИТАТЬ БРИФ",
    subtitle: "Пояснение результатов",
    intro_title: "1. СУТЬ РЕЗУЛЬТАТА",
    intro_text: "Этот бриф — технический срез вашего текущего состояния, а не приговор личности.",
    blocks_title: "2. РАСШИФРОВКА БЛОКОВ",
    archetype_label: "АРХЕТИП",
    archetype_desc: "Доминирующая стратегия адаптации в текущих условиях.",
    metrics_title: "МЕТРИКИ (FARE)",
    foundation_desc: "Опора (Foundation): Ваше глубинное чувство безопасности.",
    agency_desc: "Воля (Agency): Способность действовать вопреки страху.",
    resource_desc: "Емкость (Resource): Готовность принимать масштаб ресурсов.",
    entropy_desc: "Шум (Entropy): Энергия, уходящая на сомнения.",
    neurosync_label: "NEUROSYNC",
    neurosync_desc: "Уровень контакта с телом.",
    latency_label: "LATENCY (Латентность)",
    latency_desc: "Паузы перед ответом указывают на зоны сопротивления.",
    combinations_title: "3. СОЧЕТАНИЯ",
    combinations_text: "Важны разрывы. Высокая Воля при низкой Опоре — путь к выгоранию.",
    action_title: "4. ВАШИ ДЕЙСТВИЯ",
    action_text: "Выполняйте протокол 7 дней и обсудите бриф с психологом.",
    limits_title: "5. ВАЖНОЕ ПРЕДУПРЕЖДЕНИЕ",
    limits_text: "Это не медицинский диагноз и не замена терапии.",
    closing: "Этот бриф — ваша карта. Маршрут выбираете вы."
  },
  clinical_decoder: {
    title: "АНАЛИТИЧЕСКИЙ ТЕРМИНАЛ",
    subtitle: "Clinical Decision Support",
    headers: { config: "1. КОНФИГУРАЦИЯ", mechanism: "2. МЕХАНИЗМ", interactions: "3. ДИНАМИКА", archetype: "4. АРХЕТИП", hypotheses: "5. ГИПОТЕЗЫ", risks: "6. РИСКИ", session: "7. СЕССИЯ" },
    configs: {
        balanced: { title: "Сбалансированная", desc: "Система в режиме штатного функционирования." },
        optimal: { title: "Оптимальная", desc: "Высокая целостность и ресурсность." },
        compensatory_overdrive: { title: "Компенсаторный Форсаж", desc: "Эффективность за счет подавления аффекта." },
        critical_deficit: { title: "Критический Дефицит", desc: "Острая нехватка опор и безопасности." }
    },
    analysis_patterns: {
        god_mode_dissociation: "ФОРСАЖ: Высокая эффективность маскирует уязвимость.",
        somatic_rebellion: "БУНТ: Тело блокирует сознательные цели.",
        naked_wire: "ОГОЛЕННЫЙ НЕРВ: Чувствительность без защиты.",
        frozen_will: "ЗАМОРОЖЕННАЯ ВОЛЯ: Действие заблокировано неопределенностью.",
        intellectual_bypass: "ОБХОД: Логика вместо чувств.",
        resource_anxiety: "ТРЕВОГА ОБЛАДАНИЯ: Ресурс создает страх потери.",
        foundation_void: "ВАКУУМ: Отсутствие внутренней поддержки.",
        manic_defense: "ЗАЩИТА: Бегство от тревоги в активность."
    },
    sync_patterns: {
        coherent: "Когерентность: разум и тело синхронны.",
        dissociation: "Диссоциация: разрыв контакта с чувствами.",
        honest_weakness: "Слабость: тело признает уязвимость."
    },
    archetype_strategies: {
        THE_ARCHITECT: { strategy: "Структурный рост", func: "Масштабирование", limit: "Интеллектуализация" },
        THE_DRIFTER: { strategy: "Гибкая адаптация", func: "Поиск возможностей", limit: "Нет заземления" },
        THE_BURNED_HERO: { strategy: "Восстановление", func: "Эмпатия через боль", limit: "Самопожертвование" },
        THE_GOLDEN_PRISONER: { strategy: "Границы", func: "Безопасность", limit: "Страх перемен" },
        THE_CHAOS_SURFER: { strategy: "Сдвиг", func: "Интуиция", limit: "Нестаბильность" },
        THE_GUARDIAN: { strategy: "Стабилизация", func: "Защита", limit: "Ригидность" }
    },
    risks: {
        burnout_blindness: "Риск выгорания из-за игнорирования усталости.",
        normalization: "Нормализация токсичных паттернов.",
        intellectualization: "Прогресс заблокирован анализом.",
        premature_action: "Импульсивность до стабилизации.",
        role_play: "Имитация прогресса."
    },
    session_entries: {
        reality_check: "Начните с заземления и фактов.",
        decelerate: "Приоритет: замедление темпа.",
        security_first: "Приоритет: восстановление границ.",
        body_focus: "Вход через физические маркеры.",
        validate_deficit: "Валидация нехватки энергии."
    },
    common_hypotheses: {
        anesthesia: { h: "Эмоциональная анестезия", q: "Что вы не чувствуете сейчас?" },
        functional_value: { h: "Самоценность", q: "Кто вы, когда не продуктивны?" },
        visibility_fear: { h: "Страх проявленности", q: "Для кого опасно быть замеченным?" },
        adaptation_to_min: { h: "Выживание", q: "Почему 10% емкости безопаснее?" }
    },
    disclaimer: "Это гипотеза. Требуется интерпретация специалиста.",
    somatic_dissonance_title: "СОМАТИЧЕСКИЙ ДИССОНАНС",
    somatic_dissonance_desc: "Тело блокирует импульс сознания."
  },
  global: { stats: "Ядро", export: "Экспорт", import: "Импорт", close: "Закрыть", back: "Назад", calibrating: "КАЛИБРОВКА...", calib_desc: "Поиск спутников системы...", complete: "ГОТОВО", progress: "ПРОГРЕСС" },
  sync: { title: "РЕЗОНАНС", desc: "Что в теле сейчас?", guidance_tip: "Сканируйте отклик на выбранный ответ.", s0: "Нейтрально", s1: "Сжатие", s2: "Расширение", s3: "Жар", s4: "Холод", proceed: "Далее", processing: "Синхронизация..." },
  sensation_feedback: { s0: "СИГНАЛ_ОК", s1: "БЛОК_ОБНАРУЖЕН", s2: "РЕСУРС_ПОДТВЕРЖДЕН", s3: "АКТИВАЦИЯ", s4: "ЗАЖИМ_ВЫЯВЛЕН" },
  domains: { foundation: "ОПОРА", agency: "ВОЛЯ", money: "РЕСУРС", social: "СВЯЗИ", legacy: "СМЫСЛ" },
  dashboard: { title: "Genesis", desc: "Навигатор", insight_noise: "Высокий шум", insight_coherence: "Ясность подтверждена", insight_somatic_dissonance: "Выявлен диссонанс", retest_ready: "ОБНОВИТЬ", retest_desc: "Рекомендуется повторный замер.", select_domain: "Секторы исследования:", open_terminal: "ТЕРМИНАЛ", manual_btn: "ИНСТРУКЦИЯ" },
  results: {
    integrity: "Целостность", entropy: "Сложность", capacity: "Емкость", roadmap: "Протокол (7 дней)",
    logTitle: "Точки маршрута", back: "К навигации", stability: "Устойчивость", neuro_sync: "Телесный отклик",
    conflict_warn: "КОНФЛИКТ СИГНАЛОВ", click_info: "Нажми на точку для расшифровки",
    share_button: "ПОДЕЛИТЬСЯ",
    share_url: "https://t.me/thndrrr",
    contact_psychologist: "ОБСУДИТЬ СО СПЕЦИАЛИСТОМ",
    blueprint_title: "BLUEPRINT",
    shadow_zone: "⚠️ КОНФЛИКТНЫЙ УЗЕЛ",
    light_zone: "⚡ ЧИСТЫЙ СИГНАЛ",
    verdict_title: "ГИПОТЕЗА ПАТТЕРНА",
    root_command: "УСТАНОВКА",
    deep_analysis_title: "СИНТЕЗ",
    intervention_title: "ВЕКТОР",
    conflict_title: "СОПРОТИВЛЕНИЕ",
    shadow_directive_title: "ТЕНЬ",
    intervention_strategy_title: "СТРАТЕГИЯ",
    interference_title: "ИСКАЖЕНИЯ",
    decoder_title: "ДЕШИФРАТОР",
    decoder_desc: "Маркеры задержки реакций:",
    session_prep: "ТЕМЫ ДЛЯ ТЕРАПИИ",
    session_prep_desc: "Рекомендуется обсудить со специалистом:",
    disclaimer_title: "ЭТИЧЕСКИЙ БРИФИНГ",
    disclaimer_body: "Genesis OS не является медицинским инструментом. Все выводы — гипотезы для специалиста.",
    advanced_data: "ДАННЫЕ",
    advanced_data_desc: "Методология выводов",
    evolution_title: "ДИНАМИКА",
    evolution_desc: "Сравнение с предыдущим замером",
    retest_title: "РЕТЕСТ",
    retest_desc: "Пройдите повторно через 7 дней.",
    value_prop: "Этот отчет экономит до 3-х часов сессий.",
    copy_brief: "СКОПИРОВАТЬ КОД",
    brief_copied: "КОПИРОВАНО",
    brief_instruction: "Отправьте текст вашему терапевту.",
    brief_look: "ПОСМОТРЕТЬ КОД",
    brief_hide: "СКРЫТЬ КОД",
    brief_legend_title: "ЛЕГЕНДА (FARE)",
    brief_legend_f: "F: Опора (Foundation)",
    brief_legend_a: "A: Воля (Agency)",
    brief_legend_r: "R: Ресурс (Resource)",
    brief_legend_e: "E: Энтропия (Шум)",
    brief_legend_sync: "SYNC: Контакт с телом",
    origin_measured: "[ЗАМЕР]",
    origin_reported: "[САМООТЧЕТ]",
    clinical_note: "ЗНАЧЕНИЕ",
    clinical_note_desc: "Обнаружены значимые маркеры.",
    safety_warning: "ЭНЕРГОСБЕРЕЖЕНИЕ",
    safety_warning_desc: "Опора ниже 25%.",
    how_to_read: "ИНСТРУКЦИЯ К БРИФУ",
    signal_resistance: "СОПРОТИВЛЕНИЕ",
    signal_resonance: "РЕЗОНАНС",
    active_patterns_title: "АКТИВНЫЕ ПАТТЕРНЫ",
    tap_to_decode: "Нажми для дешифровки",
    protection_label: "🛡️ ЗАЩИТА",
    cost_label: "💸 ЦЕНА",
    antidote_label: "💊 АНТИДОТ",
    close_btn: "ЗАКРЫТЬ"
  },
  explanations: {
    foundation: "Уровень вашей базовой безопасности. То, насколько вы чувствуете право находиться в этом мире и опираться на себя.",
    agency: "Ваша воля и способность действовать. Насколько вы автор своих решений, а не заложник обстоятельств.",
    resource: "Ваша пропускная способность для благ и возможностей. Готовность принимать и удерживать масштаб.",
    entropy: "Уровень внутренних помех. Энергия, которая тратится на сомнения, страхи и борьбу."
  },
  archetypes: {
    THE_ARCHITECT: { title: "Архитектор", desc: "Строит системы через логику.", superpower: "Системность", shadow: "Контроль", quote: "Порядок освобождает энергию.", root_command: "СТРОИТЬ" },
    THE_DRIFTER: { title: "Скиталец", desc: "Адаптируется к потоку.", superpower: "Гибкость", shadow: "Нет корней", quote: "Направление важнее плана.", root_command: "ИСКАТЬ" },
    THE_BURNED_HERO: { title: "Герой", desc: "Достигает через сверхсилия.", superpower: "Стойкость", shadow: "Износ", quote: "Я справлюсь любой ценой.", root_command: "ВОССТАНОВИТЬ" },
    THE_GOLDEN_PRISONER: { title: "Узник", desc: "Заперт в безопасности.", superpower: "Стабильность", shadow: "Страх масштаба", quote: "Безопасность — иллюзия.", root_command: "РАСШИРИТЬ" },
    THE_CHAOS_SURFER: { title: "Серфер", desc: "Действует интуитивно.", superpower: "Интуиция", shadow: "Нестабильность", quote: "В хаосе скрыта сила.", root_command: "УМЕНЬШИТЬ ШУМ" },
    THE_GUARDIAN: { title: "Хранитель", desc: "Оберегает достигнутое.", superpower: "Верность", shadow: "Ригидность", quote: "Сохранить важнее, чем приобрести.", root_command: "УКРЕПИТЬ" }
  },
  verdicts: {
    HEALTHY_SCALE: { label: "Здоровая Интеграция", description: "Система сбалансирована.", impact: "Эффективность без выгорания.", supportive_context: "Масштабируйтесь." },
    BRILLIANT_SABOTAGE: { label: "Блестящий Саботаж", description: "Активность при слабой опоре.", impact: "Риск обрушения.", supportive_context: "Укрепите границы." },
    INVISIBILE_CEILING: { label: "Невидимый Потолок", description: "Сильная опора, нет воли.", impact: "Стагнация.", supportive_context: "Легализуйте амбиции." },
    LEAKY_BUCKET: { label: "Дырявое Ведро", description: "Ресурс сливается.", impact: "Хроническая усталость.", supportive_context: "Аудит трат." },
    PARALYZED_GIANT: { label: "Парализованный Гигант", description: "Потенциал заблокиров шумом.", impact: "Бессилие.", supportive_context: "Снизьте стресс." },
    FROZEN_POTENTIAL: { label: "Замороженный Потенциал", description: "Режим ожидания.", impact: "Жизнь на черновик.", supportive_context: "Найдите импульс." },
    CRITICAL_DEFICIT: { label: "Критический Дефицит", description: "Система истощена.", impact: "Риск сбоев.", supportive_context: "Восстановите опоры." }
  },
  metric_definitions: {
      foundation: "Уровень базовой безопасности и опоры.",
      agency: "Способность принимать решения.",
      resource: "Внутренняя емкость для успеха.",
      entropy: "Психическая энергия на сомнения.",
      integrity: "Общая согласованность личности."
  },
  phases: { sanitation: "Очистка", stabilization: "Укрепление", expansion: "Рост" },
  tasks: pattern_library_ru,
  scenes: pattern_library_ru,
  beliefs: {
    family_loyalty: "Лояльность роду", scarcity_mindset: "Дефицит", self_permission: "Право быть", fear_of_punishment: "Страх наказания",
    imposter_syndrome: "Самозванец", hard_work_only: "Тяжелый труд", boundary_collapse: "Слияние", money_is_danger: "Опасность ресурса",
    shame_of_success: "Стыд успеха", betrayal_trauma: "Предательство", capacity_expansion: "Рост емкости", money_is_tool: "Инструмент",
    unconscious_fear: "Слепой страх", fear_of_conflict: "Страх конфликта", impulse_spend: "Слив ресурса", short_term_bias: "Короткий фокус",
    poverty_is_virtue: "Святая бедность", latency_resistance: "Торг", resource_toxicity: "Токсичность", body_mind_conflict: "Диссонанс",
    ambivalence_loop: "Петля сомнений", hero_martyr: "Мученик", autopilot_mode: "Автопилот", golden_cage: "Золотая клетка", default: 'По умолчанию'
  },
  conflicts: {
      icarus: "Икар (воля без опоры)",
      leaky_bucket: "Утечка ресурса",
      invisible_cage: "Блокировка воли"
  },
  system_commentary: [
      "SYSTEM CHECK: Когерентность оптимальна.",
      "KERNEL LOG: Паттерны проанализированы.",
      "UPLINK NOTE: Отклик интегрирован.",
      "ANALYSIS: Проверка завершена."
  ],
  auth_hint: "Доступ только для специалистов.",
  legal_disclaimer: "Genesis OS — инструмент осознанности.",
  safety: {
    mode_title: "Режим Безопасности",
    mode_desc: "Зафиксирован критический стресс.",
    external_help: "Обратитесь к специалисту.",
    somatic_detection_warning: "Отклик может be искажен.",
    slow_processing_detected: "Высокая когнитивная нагрузка.",
    important_context_title: "Важный Контекст",
    important_context_body: "Тело сигнализирует о сопротивлении."
  },
  pattern_library: pattern_library_ru,
  session_prep_templates: session_prep_ru,
};

const ka: Translations = {
  ...ru,
  subtitle: "LUKA SULAVA // ნეირო-ორიენტირება",
  onboarding: {
    title: "Genesis OS: ნავიგატორი",
    step1_t: "რეაქციის სისწრაფე",
    step1_d: "ჩვენ ვაფიქსირებთ თქვენი არჩევანის დროს. ეს არის შემეცნებითი დატვირთვის ობიექტური საზომი.",
    step2_t: "სხეულის თვითრეპორტი",
    step2_d: "თქვენი სუბიექტური რეზონანსის განცდა. სხეულის ფიზიკამ იცის გზა უფრო ადრე, ვიდრე გონებამ.",
    step3_t: "ინტერპრეტაცია",
    step3_d: "შედეგები არის რუკა სპეციალისტთან დიალოგისთვის და არა საბოლოო დიაგნოზი.",
    protocol_btn: "პროტოკოლის მიღება",
    protocol_init: "ინიციალიზაცია...",
    protocol_ready: "პროტოკოლი მიღებულია",
    start_btn: "კვლევის დაწყება"
  },
  invalid_results: {
    ...ru.invalid_results,
    title: "მონაცემები არ არის ვალიდური",
    subtitle: "სიგნალის მთლიანობა დარღვეულია",
    message: "სისტემამ აღმოაჩინა პასუხების ნიმუში, რომელიც არ იძლევა სანდო კლინიკური სურათის აგების საშუალებას.",
    recommendation: "გთხოვთ, ხელახლა გაიაროთ კვლევა, ენდეთ თქვენს პირველ იმპულსს.",
    reset_button: "თავიდან დაწყება"
  },
  ui: {
    ...ru.ui,
    scanning: "სინქრონიზაცია",
    module_label: "მოდული",
    skip_button: "არ ვარ დარწმუნებული",
    system_build: "სისტემის ვერსია",
    reset_session_btn: "სესიის_გადატვირთვა",
    day_label: "დღე",
    decrypt_btn: "დეშიფრაცია",
    close_session_btn: "[ სესიის დახურვა ]",
    agree_terms_btn: "ვეთანხმები პირობებს",
    mode_client: "კლიენტისთვის",
    mode_pro: "სპეციალისტისთვის",
    access_restricted: "წვდომა შეზღუდულია",
    paste_code: "ჩაწერეთ კლიენტის ID...",
    architecture_session: "სესიის არქიტექტურა",
    status_protocol: "პროტოკოლის სტატუსი",
    behavioral_markers: "ქცევის მარკერები",
    systemic_root: "სისტემური ფესვი",
    verdict_protocol: "ვერდიქტი და პროტოკოლი",
    supervision_layer: "სუპერვიზიის შრე"
  },
  guide: {
    title: "მომხმარებლის პროტოკოლი",
    subtitle: "ინსტრუქცია კლიენტისთვის",
    sections: [
        { title: "1. კვლევის მიზანი", content: ["Genesis OS არის შინაგანი კონფლიქტების ობიექტივიზაციის ინსტრუმენტი.", "ჩვენ ვაანალიზებთ არა მხოლოდ 'რას' პასუხობთ, არამედ 'როგორ' - რა დაყოვნებით და სხეულის პასუხით."] },
        { title: "2. პასუხის წესები", content: ["გამოიყენეთ პირველი იმპულსი. აქ არ არის სწორი პასუხები.", "თუ სხეული რეაქციას გაძლევთ (შეკუმშვა, სითბო) - დააფიქსირეთ ეს რეზონანსის ბლოკში."] }
    ],
    metaphor: "Genesis OS არის კომპასი, რომელიც აჩვენებს სად არის თქვენი ენერგია ბლოკირებული."
  },
  pro_guide: {
    title: "კლინიკური პროტოკოლი",
    subtitle: "სახელმძღვანელო სპეციალისტისთვის",
    sections: [
        { title: "1. მეტრიკების ინტერპრეტაცია", content: ["Foundation (საყრდენი) — უსაფრთხოების დონე. 35%-ზე დაბალი მოითხოვს სტაბილიზაციას.", "Agency (ნება) — ექსპანსიის უნარი.", "Entropy (ხმაური) — შინაგანი ხახუნის დონე."] }
    ],
    closing: "გამოიყენეთ ეს მონაცემები როგორც ჰიპოთეზა სესიისთვის."
  },
  global: { ...ru.global, stats: "ბირთვი", back: "უკან", complete: "მზად არის" },
  sync: { title: "რეზონანსი", desc: "რას გრძნობს სხეული?", guidance_tip: "დააკვირდით სხეულის რეაქციას პასუხზე.", s0: "ნეიტრალური", s1: "შეკუმშვა", s2: "გაფართოება", s3: "სიცხე", s4: "სიცივე", proceed: "შემდეგი" },
  domains: { foundation: "საყრდენი", agency: "ნება", money: "რესურსი", social: "კავშირები", legacy: "აზრი" },
  dashboard: { title: "Genesis", desc: "ნავიგატორი", retest_ready: "განახლება", select_domain: "სექტორები:", open_terminal: "ტერმინალი", manual_btn: "ინსტრუქცია" },
  results: {
    ...ru.results,
    integrity: "მთლიანობა", entropy: "სირთულე", capacity: "ტევადობა", roadmap: "პროტოკოლი (7 დღე)",
    stability: "მდგრადობა", neuro_sync: "სხეულის პასუხი",
    share_button: "გაზიარება",
    contact_psychologist: "სპეციალისტთან კონსულტაცია",
    verdict_title: "პატერნის ჰიპოთეზა",
    decoder_title: "დეშიფრატორი",
    session_prep: "თემები თერაპიისთვის",
    copy_brief: "კოდის კოპირება",
    how_to_read: "ბრიფის ინსტრუქცია",
    active_patterns_title: "აქტიური პატერნები",
    tap_to_decode: "დააჭირეთ დეშიფრაციისთვის",
    protection_label: "🛡️ დაცვა",
    cost_label: "💸 ფასი",
    antidote_label: "💊 ანტიდოტი"
  },
  beliefs: {
    family_loyalty: "გვაროვნული ლოიალობა", scarcity_mindset: "დეფიციტი", self_permission: "ყოფნის უფლება", fear_of_punishment: "დასჯის შიში",
    imposter_syndrome: "თვითმარქვია", hard_work_only: "მძიმე შრომა", boundary_collapse: "შერწყმა", money_is_danger: "რესურსის საფრთხე",
    shame_of_success: "წარმატების სირცხვილი", betrayal_trauma: "ღალატის ტრავმა", capacity_expansion: "ტევადობის ზრდა", money_is_tool: "ინსტრუმენტი",
    unconscious_fear: "ბრმა შიში", fear_of_conflict: "კონფლიქტის შიში", impulse_spend: "რესურსის გაფანტვა", short_term_bias: "მოკლე ფოკუსი",
    poverty_is_virtue: "წმინდა სიღარიბე", latency_resistance: "ვაჭრობა", resource_toxicity: "ტოქსიკურობა", body_mind_conflict: "დისონანსი",
    ambivalence_loop: "ეჭვის მარყუჟი", hero_martyr: "წამებული", autopilot_mode: "ავტოპილოტი", golden_cage: "ოქროს გალია", default: 'ნაგულისხმევი'
  },
  pattern_library: pattern_library_ka,
  session_prep_templates: session_prep_ka,
};

export const translations: Record<'ru' | 'ka', Translations> = { ru, ka };
