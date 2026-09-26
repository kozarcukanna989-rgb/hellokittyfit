let currentLang = localStorage.getItem('siteLang') || 'uk';
let currentUserEmail = localStorage.getItem('currentUserEmail') || '';
let isRegisterMode = false;
let usersDB = JSON.parse(localStorage.getItem('helloKittyUsersDB')) || {};
const todayDateStr = new Date().toISOString().slice(0, 10);

let userProfile = {
    name: '',
    targetWeight: 0,
    savedWeight: '-',
    savedWaist: '-',
    calculatedNorm: '-',
    lastActiveDate: todayDateStr,
    totalCalories: 0,
    totalSteps: 0,
    waterCount: 0,
    foodListHTML: '',
    calendarMarks: {},
    dailyHistory: {}
};

let currentCalendarYear = new Date().getFullYear();
let currentCalendarMonth = new Date().getMonth();

// МЕГА-БАЗА 100+ ПРОДУКТІВ
const foodDatabase = [
    { name: "Банан (1 шт / ~120г)", cals: 105, desc: "1 шт" },
    { name: "Інжир свіжий (1 шт / ~50г)", cals: 37, desc: "1 шт" },
    { name: "Яблуко (1 шт / ~150г)", cals: 78, desc: "1 шт" },
    { name: "Апельсин (1 шт / ~140г)", cals: 65, desc: "1 шт" },
    { name: "Мандарин (1 шт / ~80г)", cals: 40, desc: "1 шт" },
    { name: "Груша (1 шт / ~150г)", cals: 85, desc: "1 шт" },
    { name: "Ківі (1 шт / ~75г)", cals: 46, desc: "1 шт" },
    { name: "Персик (1 шт / ~100г)", cals: 45, desc: "1 шт" },
    { name: "Полуниця (100 г)", cals: 32, desc: "100 г" },
    { name: "Малина (100 г)", cals: 52, desc: "100 г" },
    { name: "Чорниця (100 г)", cals: 57, desc: "100 г" },
    { name: "Виноград (100 г)", cals: 69, desc: "100 г" },
    { name: "Кавун (100 г)", cals: 30, desc: "100 г" },
    { name: "Диня (100 г)", cals: 34, desc: "100 г" },
    { name: "Ананас (100 г)", cals: 50, desc: "100 г" },
    { name: "Манго (100 г)", cals: 60, desc: "100 г" },
    { name: "Гранат (100 г)", cals: 83, desc: "100 г" },
    { name: "Лимон (1 шт / ~60г)", cals: 17, desc: "1 шт" },
    { name: "Авокадо (1 шт / ~150г)", cals: 240, desc: "1 шт" },
    { name: "Сухофрукти (курага/чорнослив) (100 г)", cals: 250, desc: "100 г" },

    { name: "Капучино (велика чашка / 300 мл)", cals: 135, desc: "300 мл" },
    { name: "Капучино (стандарт / 200 мл)", cals: 90, desc: "200 мл" },
    { name: "Кава з молоко (без цукру / 200 мл)", cals: 35, desc: "200 мл" },
    { name: "Чорна кава (без цукру / 200 мл)", cals: 2, desc: "200 мл" },
    { name: "Чай зелений / чорний (200 мл)", cals: 2, desc: "200 мл" },
    { name: "Латте (350 мл)", cals: 180, desc: "350 мл" },
    { name: "Раф-кава (300 мл)", cals: 260, desc: "300 мл" },
    { name: "Гарячий шоколад (200 мл)", cals: 220, desc: "200 мл" },
    { name: "Сік апельсиновий (200 мл)", cals: 90, desc: "200 мл" },
    { name: "Кока-кола (250 мл)", cals: 105, desc: "250 мл" },
    { name: "Енергетик (250 мл)", cals: 115, desc: "250 мл" },
    { name: "Протеїновий коктейль на молоці (300 мл)", cals: 210, desc: "300 мл" },
    { name: "Молочний мілкшейк (300 мл)", cals: 280, desc: "300 мл" },
    { name: "Кефір 1% (250 мл)", cals: 100, desc: "250 мл" },
    { name: "Йогурт питний білий (250 мл)", cals: 150, desc: "250 мл" },

    { name: "Шоколад чорний (плитка 100г)", cals: 546, desc: "100 г" },
    { name: "Шоколад молочний (плитка 100г)", cals: 535, desc: "100 г" },
    { name: "Шоколадний батончик (Snickers / Mars ~50г)", cals: 240, desc: "1 шт" },
    { name: "Печиво Ювілейне (1 шт)", cals: 48, desc: "1 шт" },
    { name: "Круасан з шоколадом (1 шт / 70г)", cals: 310, desc: "1 шт" },
    { name: "Морозиво пломбір (100 г)", cals: 230, desc: "100 г" },
    { name: "Морозиво в стаканчику (1 шт)", cals: 180, desc: "1 шт" },
    { name: "Зефір (1 шт / ~35г)", cals: 110, desc: "1 шт" },
    { name: "Мармелад (1 шт / ~20г)", cals: 60, desc: "1 шт" },
    { name: "Сирок в шоколаді (1 шт / 45г)", cals: 180, desc: "1 шт" },
    { name: "Вафлі з начинкою (100 г)", cals: 500, desc: "100 г" },
    { name: "Мед (1 столова ложка / 20г)", cals: 64, desc: "1 ст.л." },
    { name: "Цукор (1 чайна ложка / 5г)", cals: 20, desc: "1 ч.л." },
    { name: "Чіпси Lays (велика пачка 150г)", cals: 760, desc: "150 г" },
    { name: "Чіпси Lays (мала пачка 70г)", cals: 350, desc: "70 г" },
    { name: "Сухарики до пива (пачка 80г)", cals: 320, desc: "80 г" },
    { name: "Попкорн з маслом (100 г)", cals: 500, desc: "100 г" },
    { name: "Горіхи волоські (50 г)", cals: 330, desc: "50 г" },
    { name: "Арахіс смажений (50 г)", cals: 290, desc: "50 г" },
    { name: "Мигдаль (50 г)", cals: 290, desc: "50 г" },

    { name: "Мівіна з соусом (пачка 85г)", cals: 385, desc: "1 пачка" },
    { name: "Вівсянка на молоці (порція 200г)", cals: 200, desc: "200 г" },
    { name: "Вівсянка на воді (порція 200г)", cals: 110, desc: "200 г" },
    { name: "Гречка відварена (порція 200г)", cals: 210, desc: "200 г" },
    { name: "Рис відварений (порція 200г)", cals: 260, desc: "200 г" },
    { name: "Макарони відварені (порція 200г)", cals: 280, desc: "200 г" },
    { name: "Картопля пюре (порція 200г)", cals: 210, desc: "200 г" },
    { name: "Картопля фрі (порція 150г)", cals: 470, desc: "150 г" },
    { name: "Куряче філе варене (150 г)", cals: 250, desc: "150 г" },
    { name: "Куряча котлета (1 шт / 90г)", cals: 210, desc: "1 шт" },
    { name: "Свинина запечена (150 г)", cals: 380, desc: "150 г" },
    { name: "Яловичина тушкована (150 г)", cals: 290, desc: "150 г" },
    { name: "Сосиска варена (1 шт / 60г)", cals: 160, desc: "1 шт" },
    { name: "Ковбаса докторська (100 г)", cals: 250, desc: "100 г" },
    { name: "Пельмені відварені (порція 250г)", cals: 650, desc: "250 г" },
    { name: "Вареники з картоплею (порція 250г)", cals: 420, desc: "250 г" },
    { name: "Млинці з м'ясом (2 шт / 150г)", cals: 340, desc: "2 шт" },
    { name: "Млинці з сиром (2 шт / 150г)", cals: 310, desc: "2 шт" },
    { name: "Піца Пепероні (1 шматочок / 120г)", cals: 320, desc: "1 шм." },
    { name: "Піца Сирна (1 шматочок / 120г)", cals: 290, desc: "1 шм." },
    { name: "Бургер стандартний (1 шт / 200г)", cals: 490, desc: "1 шт" },
    { name: "Шаурма з куркою (велика / 400г)", cals: 720, desc: "1 шт" },
    { name: "Хот-дог (1 шт / 150г)", cals: 380, desc: "1 шт" },
    { name: "Суп курячий з локшиною (порція 300г)", cals: 180, desc: "300 г" },
    { name: "Борщ український (порція 300г)", cals: 210, desc: "300 г" },
    { name: "Солянка м'ясна (порція 300г)", cals: 310, desc: "300 г" },

    { name: "Сир кисломолочний 5% (150 г)", cals: 180, desc: "150 г" },
    { name: "Сир твердий (Голандський/Чедер) (50 г)", cals: 180, desc: "50 г" },
    { name: "Сметана 15% (2 столові ложки / 50г)", cals: 80, desc: "50 г" },
    { name: "Масло вершкове 82% (1 шматочок / 15г)", cals: 110, desc: "15 г" },
    { name: "Яйце куряче варене / омлет (1 шт)", cals: 75, desc: "1 шт" },
    { name: "Яєчня з 2-х яєць", cals: 180, desc: "2 шт" },
    { name: "Молоко 2.5% (200 мл)", cals: 105, desc: "200 мл" },
    { name: "Хліб білий (1 шматочок / 30г)", cals: 80, desc: "1 шт" },
    { name: "Хліб чорний / житній (1 шматочок / 30г)", cals: 65, desc: "1 шт" },
    { name: "Тост з авокадо та яйцем (1 шт)", cals: 260, desc: "1 шт" },
    { name: "Лаваш армянський (1 лист / 80г)", cals: 220, desc: "1 шт" },
    { name: "Сир плавлєний (1 трикутничок / 20г)", cals: 60, desc: "1 шт" },

    { name: "Салат Цезар з куркою (порція 250г)", cals: 420, desc: "250 г" },
    { name: "Салат Грецький (порція 250г)", cals: 280, desc: "250 г" },
    { name: "Салат Овочевий з олією (порція 200г)", cals: 120, desc: "200 г" },
    { name: "Оладки кабачкові (2 шт / 100г)", cals: 150, desc: "2 шт" },
    { name: "Сирники (2 шт / 120г)", cals: 260, desc: "2 шт" },
    { name: "Яєчний омлет з сиром (порція)", cals: 240, desc: "порція" }
];

// Мультивмовний словник
const translations = {
    uk: {
        title: "HelloKittyFit — Твій персональний фітнес-щоденник",
        welcome: (name) => `Привіт, ${name}! Твій шлях до гармонії та енергії.`,
        welcomeDefault: "Привіт! Твій шлях до гармонії та енергії.",
        archiveBtn: "📂 Архів",
        logoutBtn: "Вийти 🚪",
        goalTitle: "🎯 Твоя мета та прогрес",
        goalDesc: "Рухайся до своєї мрії крок за кроком. Ти зможеш усе!",
        targetLabel: "Бажана ціль",
        leftLabel: "Залишилось скинути / набрати",
        editProfileBtn: "Змінити профіль / ціль ⚙️",
        quoteTitle: "✨ Натхнення дня",
        newQuoteBtn: "Оновити цитату 🦋",
        calendarTitle: "📅 Календар щоденних перемог",
        calendarDesc: "Кликай на дні місяця, щоб відзначити свої успіхи та догляд за собою!",
        calTitle: "🥗 Розумний калькулятор калорій",
        calDesc: "Вибери з бази 100+ продуктів, вкажи кількість — сайт усе порахує сам!",
        chooseProduct: "-- Вибери продукт із бази (100+ позицій) --",
        foodNamePh: "Назва продукту",
        foodCalsPh: "Ккал за 100г/мл/порцію",
        foodAmountPh: "Кількість (напр: 3 шт / 200г)",
        foodMultPh: "Множник (напр: 3)",
        addFoodBtn: "Додати страву",
        consumedToday: "Спожито за сьогодні",
        clearFoodBtn: "Очистити список",
        stepsTitle: "👟 Трекер кроків та активності",
        stepsDesc: "Стеж за щоденною активністю. Ціль — 10 000 кроків на день!",
        stepsInputPh: "Кількість кроків",
        addStepsBtn: "Додати кроки",
        resetStepsBtn: "Скинути день",
        totalStepsLabel: "Всього кроків за день",
        waterTitle: "💧 Трекер води",
        waterDesc: "Пий достатньо води для краси та енергії (ціль — 8 склянок).",
        waterDrunk: "Випито склянок",
        addWaterBtn: "+ Випити склянку 🥤",
        resetWaterBtn: "Скинути",
        paramsTitle: "📈 Параметри тіла та розрахунок калоражу",
        paramsDesc: "Введи свої дані для розрахунку норми калорій.",
        weightPh: "Вага (кг)",
        heightPh: "Зріст (см)",
        agePh: "Вік",
        waistPh: "Талія (см)",
        calcParamsBtn: "Розрахувати та зберегти",
        lastData: "Останні дані",
        normLabel: "Твоя рекомендована норма калорій",
        videoTitle: "🎥 Улюблені тренування: Shake Twins, Torepina & Emma Fitness",
        videoDesc: "Танцювальне кардіо, вправи для ніжок та інтенсивні комплекси!",
        footerText: "Створено з любов'ю та натхненням",
        authTitle: "🐾 Вхід у HelloKittyFit 🐾",
        authDesc: "Увійди або зареєструйся, щоб зберегти свій профіль.",
        authEmailPh: "Електронна пошта",
        authPassPh: "Пароль",
        authNamePh: "Як тебе звати?",
        authGoalPh: "Цільова вага (кг)",
        authSubmit: "Увійти 💕",
        authTogglePrompt: "Ще немає акаунту?",
        authToggleLink: "Зареєструватися",
        regTitle: "🐾 Реєстрація в HelloKittyFit 🐾",
        regDesc: "Створи акаунт, щоб зберігати своє ім'я та прогрес.",
        regSubmit: "Зареєструватися 💕",
        regTogglePrompt: "Вже є акаунт?",
        regToggleLink: "Увійти",
        archiveTitleText: "📂 Архів та історія за кожен день",
        archiveDescText: "Тут зберігаються дані твого профілю та детальна історія активності по днях.",
        closeArchiveBtn: "Закрити 💖"
    },
    en: {
        title: "HelloKittyFit — Your Personal Fitness Diary",
        welcome: (name) => `Hello, ${name}! Your journey to harmony and energy.`,
        welcomeDefault: "Hello! Your journey to harmony and energy.",
        archiveBtn: "📂 Archive",
        logoutBtn: "Log out 🚪",
        goalTitle: "🎯 Your Goal & Progress",
        goalDesc: "Move towards your dream step by step. You can do it!",
        targetLabel: "Target weight",
        leftLabel: "Remaining to lose / gain",
        editProfileBtn: "Edit Profile / Goal ⚙️",
        quoteTitle: "✨ Inspiration of the Day",
        newQuoteBtn: "New Quote 🦋",
        calendarTitle: "📅 Daily Wins Calendar",
        calendarDesc: "Click on calendar days to track your success and self-care!",
        calTitle: "🥗 Smart Calorie Calculator",
        calDesc: "Choose from 100+ foods, enter amount — the site calculates everything!",
        chooseProduct: "-- Choose food from base (100+ items) --",
        foodNamePh: "Food name",
        foodCalsPh: "Cals per 100g/ml/portion",
        foodAmountPh: "Amount (e.g., 3 pcs / 200g)",
        foodMultPh: "Multiplier (e.g., 3)",
        addFoodBtn: "Add dish",
        consumedToday: "Consumed today",
        clearFoodBtn: "Clear list",
        stepsTitle: "👟 Steps & Activity Tracker",
        stepsDesc: "Track your daily activity. Goal — 10,000 steps per day!",
        stepsInputPh: "Number of steps",
        addStepsBtn: "Add steps",
        resetStepsBtn: "Reset day",
        totalStepsLabel: "Total steps today",
        waterTitle: "💧 Water Tracker",
        waterDesc: "Drink enough water for beauty and energy (goal — 8 glasses).",
        waterDrunk: "Glasses drunk",
        addWaterBtn: "+ Drink a glass 🥤",
        resetWaterBtn: "Reset",
        paramsTitle: "📈 Body Parameters & Calorie Norm",
        paramsDesc: "Enter your data to calculate your calorie norm.",
        weightPh: "Weight (kg)",
        heightPh: "Height (cm)",
        agePh: "Age",
        waistPh: "Waist (cm)",
        calcParamsBtn: "Calculate & Save",
        lastData: "Last data",
        normLabel: "Your recommended calorie norm",
        videoTitle: "🎥 Favorite Workouts: Shake Twins, Torepina & Emma Fitness",
        videoDesc: "Dance cardio, leg exercises, and intense routines!",
        footerText: "Created with love and inspiration",
        authTitle: "🐾 HelloKittyFit Login 🐾",
        authDesc: "Sign in or register to save your profile.",
        authEmailPh: "Email",
        authPassPh: "Password",
        authNamePh: "What is your name?",
        authGoalPh: "Target weight (kg)",
        authSubmit: "Log in 💕",
        authTogglePrompt: "No account yet?",
        authToggleLink: "Register",
        regTitle: "🐾 HelloKittyFit Registration 🐾",
        regDesc: "Create an account to save your name and progress.",
        regSubmit: "Register 💕",
        regTogglePrompt: "Already have an account?",
        regToggleLink: "Log in",
        archiveTitleText: "📂 Archive & Daily History",
        archiveDescText: "Your profile data and detailed daily activity history are stored here.",
        closeArchiveBtn: "Close 💖"
    },
    es: {
        title: "HelloKittyFit — Tu diario fitness personal",
        welcome: (name) => `¡Hola, ${name}! Tu camino hacia la armonía y la energía.`,
        welcomeDefault: "¡Hola! Tu camino hacia la armonía y la energía.",
        archiveBtn: "📂 Archivo",
        logoutBtn: "Salir 🚪",
        goalTitle: "🎯 Tu Meta y Progreso",
        goalDesc: "Avanza hacia tu sueño paso a paso. ¡Tú puedes!",
        targetLabel: "Peso objetivo",
        leftLabel: "Falta por perder / ganar",
        editProfileBtn: "Editar perfil / meta ⚙️",
        quoteTitle: "✨ Inspiración del día",
        newQuoteBtn: "Nueva cita 🦋",
        calendarTitle: "📅 Calendario de victorias diarias",
        calendarDesc: "¡Haz clic en los días para registrar tus éxitos y cuidado personal!",
        calTitle: "🥗 Calculadora inteligente de calorías",
        calDesc: "¡Elige entre 100+ alimentos, indica la cantidad y la web lo calcula!",
        chooseProduct: "-- Elige un alimento de la base --",
        foodNamePh: "Nombre del alimento",
        foodCalsPh: "Kcal por 100g/ml/porción",
        foodAmountPh: "Cantidad (ej: 3 ud / 200g)",
        foodMultPh: "Multiplicador",
        addFoodBtn: "Añadir plato",
        consumedToday: "Consumido hoy",
        clearFoodBtn: "Limpiar lista",
        stepsTitle: "👟 Rastreador de pasos y actividad",
        stepsDesc: "Sigue tu actividad diaria. ¡Meta: 10 000 pasos al día!",
        stepsInputPh: "Número de pasos",
        addStepsBtn: "Añadir pasos",
        resetStepsBtn: "Reiniciar día",
        totalStepsLabel: "Pasos totales hoy",
        waterTitle: "💧 Rastreador de agua",
        waterDesc: "Bebe suficiente agua (meta: 8 vasos).",
        waterDrunk: "Vasos bebidos",
        addWaterBtn: "+ Beber un vaso 🥤",
        resetWaterBtn: "Reiniciar",
        paramsTitle: "📈 Parámetros corporales y calorías",
        paramsDesc: "Introduce tus datos para calcular tu norma de calorías.",
        weightPh: "Peso (kg)",
        heightPh: "Altura (cm)",
        agePh: "Edad",
        waistPh: "Cintura (cm)",
        calcParamsBtn: "Calcular y guardar",
        lastData: "Últimos datos",
        normLabel: "Tu norma de calorías recomendada",
        videoTitle: "🎥 Entrenamientos favoritos: Shake Twins, Torepina & Emma Fitness",
        videoDesc: "¡Cardio de baile, ejercicios de piernas y rutinas intensas!",
        footerText: "Creado con amor e inspiración",
        authTitle: "🐾 Acceso a HelloKittyFit 🐾",
        authDesc: "Inicia sesión o regístrate para guardar tu perfil.",
        authEmailPh: "Correo electrónico",
        authPassPh: "Contraseña",
        authNamePh: "¿Cómo te llamas?",
        authGoalPh: "Peso objetivo (kg)",
        authSubmit: "Entrar 💕",
        authTogglePrompt: "¿No tienes cuenta?",
        authToggleLink: "Regístrate",
        regTitle: "🐾 Registro en HelloKittyFit 🐾",
        regDesc: "Crea una cuenta para guardar tu perfil.",
        regSubmit: "Registrarse 💕",
        regTogglePrompt: "¿Ya tienes cuenta?",
        regToggleLink: "Entrar",
        archiveTitleText: "📂 Archivo e historial diario",
        archiveDescText: "Aquí se guardan tus datos de perfil e historial diario.",
        closeArchiveBtn: "Cerrar 💖"
    },
    tr: {
        title: "HelloKittyFit — Kişisel Fitness Günlüğün",
        welcome: (name) => `Merhaba ${name}! Uyum ve enerji yolculuğun.`,
        welcomeDefault: "Merhaba! Uyum ve enerji yolculuğun.",
        archiveBtn: "📂 Arşiv",
        logoutBtn: "Çıkış 🚪",
        goalTitle: "🎯 Hedefin ve İlerlemen",
        goalDesc: "Hayaline adım adım ilerle. Başarabilirsin!",
        targetLabel: "Hedef kilo",
        leftLabel: "Kalan kilo (verilecek/alınacak)",
        editProfileBtn: "Profili / Hedefi Düzenle ⚙️",
        quoteTitle: "✨ Günün İlhamı",
        newQuoteBtn: "Yeni Söz 🦋",
        calendarTitle: "📅 Günlük Başarılar Takvimi",
        calendarDesc: "Başarılarını ve öz bakımını işaretlemek için takvim günlerine tıkla!",
        calTitle: "🥗 Akıllı Kalori Hesaplayıcı",
        calDesc: "100+ besin arasından seç, miktarı gir — site her şeyi hesaplasın!",
        chooseProduct: "-- Ürün seç (100+ seçenek) --",
        foodNamePh: "Yiyecek adı",
        foodCalsPh: "100g/ml başına kalori",
        foodAmountPh: "Miktar (örn: 3 adet / 200g)",
        foodMultPh: "Çarpan",
        addFoodBtn: "Yemek ekle",
        consumedToday: "Bugün tüketilen",
        clearFoodBtn: "Listeyi temizle",
        stepsTitle: "👟 Adım ve Aktivite Takibi",
        stepsDesc: "Günlük aktiviteni takip et. Hedef — günde 10.000 adım!",
        stepsInputPh: "Adım sayısı",
        addStepsBtn: "Adım ekle",
        resetStepsBtn: "Günü sıfırla",
        totalStepsLabel: "Bugünkü toplam adım",
        waterTitle: "💧 Su Takibi",
        waterDesc: "Güzellik ve enerji için yeterli su iç (hedef — 8 bardak).",
        waterDrunk: "İçilen bardak",
        addWaterBtn: "+ Bardak iç 🥤",
        resetWaterBtn: "Sıfırla",
        paramsTitle: "📈 Vücut Ölçüleri ve Kalori İhtiyacı",
        paramsDesc: "Kalori normunu hesaplamak için verilerini gir.",
        weightPh: "Kilo (kg)",
        heightPh: "Boy (cm)",
        agePh: "Yaş",
        waistPh: "Bel (cm)",
        calcParamsBtn: "Hesapla ve Kaydet",
        lastData: "Son veriler",
        normLabel: "Önerilen günlük kalori normun",
        videoTitle: "🎥 Favori Antrenmanlar: Shake Twins, Torepina & Emma Fitness",
        videoDesc: "Dans kardiyosu, bacak egzersizleri ve yoğun setler!",
        footerText: "Sevgi ve ilhamla oluşturuldu",
        authTitle: "🐾 HelloKittyFit Giriş 🐾",
        authDesc: "Profilini kaydetmek için giriş yap veya kayıt ol.",
        authEmailPh: "E-posta",
        authPassPh: "Şifre",
        authNamePh: "Adın ne?",
        authGoalPh: "Hedef kilo (kg)",
        authSubmit: "Giriş Yap 💕",
        authTogglePrompt: "Hesabın yok mu?",
        authToggleLink: "Kayıt ol",
        regTitle: "🐾 HelloKittyFit Kayıt 🐾",
        regDesc: "Adını ve ilerlemeni kaydetmek için hesap oluştur.",
        regSubmit: "Kayıt Ol 💕",
        regTogglePrompt: "Zaten hesabın var mı?",
        regToggleLink: "Giriş yap",
        archiveTitleText: "📂 Arşiv ve Günlük Geçmiş",
        archiveDescText: "Profil verilerin ve detaylı günlük aktivite geçmişin burada saklanır.",
        closeArchiveBtn: "Kapat 💖"
    },
    pl: {
        title: "HelloKittyFit — Twój osobisty dziennik fitness",
        welcome: (name) => `Cześć, ${name}! Twoja droga do harmonii i energii.`,
        welcomeDefault: "Cześć! Twoja droga do harmonii i energii.",
        archiveBtn: "📂 Archiwum",
        logoutBtn: "Wyloguj 🚪",
        goalTitle: "🎯 Twój cel i postęp",
        goalDesc: "Idź do swojego marzenia krok po kroku. Uda Ci się!",
        targetLabel: "Docelowa waga",
        leftLabel: "Pozostało do zrzucenia / przytycia",
        editProfileBtn: "Edytuj profil / cel ⚙️",
        quoteTitle: "✨ Inspiracja dnia",
        newQuoteBtn: "Nowy cytat 🦋",
        calendarTitle: "📅 Kalendarz codziennych sukcesów",
        calendarDesc: "Kliknij dni miesiąca, aby zaznaczyć swoje sukcesy i dbanie o siebie!",
        calTitle: "🥗 Inteligentny kalkulator kalorii",
        calDesc: "Wybierz spośród 100+ produktów, wpisz ilość — strona wszystko policzy!",
        chooseProduct: "-- Wybierz produkt z bazy --",
        foodNamePh: "Nazwa produktu",
        foodCalsPh: "Kcal na 100g/ml/porcję",
        foodAmountPh: "Ilość (np. 3 szt. / 200g)",
        foodMultPh: "Mnożnik",
        addFoodBtn: "Dodaj potrawę",
        consumedToday: "Spożyto dzisiaj",
        clearFoodBtn: "Wyczyść listę",
        stepsTitle: "👟 Licznik kroków i aktywności",
        stepsDesc: "Śledź swoją codzienną aktywność. Cel — 10 000 kroków dziennie!",
        stepsInputPh: "Liczba kroków",
        addStepsBtn: "Dodaj kroki",
        resetStepsBtn: "Zresetuj dzień",
        totalStepsLabel: "Łącznie kroków dzisiaj",
        waterTitle: "💧 Monitor wody",
        waterDesc: "Pij wystarczającą ilość wody dla urody i energii (cel — 8 szklanek).",
        waterDrunk: "Wypite szklanki",
        addWaterBtn: "+ Wypij szklankę 🥤",
        resetWaterBtn: "Zresetuj",
        paramsTitle: "📈 Parametry ciała i zapotrzebowanie kaloryczne",
        paramsDesc: "Wpisz swoje dane, aby obliczyć normę kalorii.",
        weightPh: "Waga (kg)",
        heightPh: "Wzrost (cm)",
        agePh: "Wiek",
        waistPh: "Talia (cm)",
        calcParamsBtn: "Oblicz i zapisz",
        lastData: "Ostatnie dane",
        normLabel: "Twoja zalecana norma kalorii",
        videoTitle: "🎥 Ulubione treningi: Shake Twins, Torepina & Emma Fitness",
        videoDesc: "Taneczne cardio, ćwiczenia na nogi i intensywne zestawy!",
        footerText: "Stworzone z miłością i inspiracją",
        authTitle: "🐾 Logowanie do HelloKittyFit 🐾",
        authDesc: "Zaloguj się lub zarejestruj, aby zapisać swój profil.",
        authEmailPh: "E-mail",
        authPassPh: "Hasło",
        authNamePh: "Jak masz na imię?",
        authGoalPh: "Docelowa waga (kg)",
        authSubmit: "Zaloguj się 💕",
        authTogglePrompt: "Nie masz konta?",
        authToggleLink: "Zarejestruj się",
        regTitle: "🐾 Rejestracja w HelloKittyFit 🐾",
        regDesc: "Utwórz konto, aby zapisać swoje imię i postępy.",
        regSubmit: "Zarejestruj się 💕",
        regTogglePrompt: "Masz już konto?",
        regToggleLink: "Zaloguj się",
        archiveTitleText: "📂 Archiwum i historia dzienna",
        archiveDescText: "Tutaj przechowywane są dane Twojego profilu i historia aktywności.",
        closeArchiveBtn: "Zamknij 💖"
    },
    de: {
        title: "HelloKittyFit — Dein persönliches Fitness-Tagebuch",
        welcome: (name) => `Hallo, ${name}! Dein Weg zu Harmonie und Energie.`,
        welcomeDefault: "Hallo! Dein Weg zu Harmonie und Energie.",
        archiveBtn: "📂 Archiv",
        logoutBtn: "Abmelden 🚪",
        goalTitle: "🎯 Dein Ziel & Fortschritt",
        goalDesc: "Gehe deinen Traum Schritt für Schritt an. Du schaffst das!",
        targetLabel: "Zielgewicht",
        leftLabel: "Verbleibend abzunehmen / zuzunehmen",
        editProfileBtn: "Profil / Ziel bearbeiten ⚙️",
        quoteTitle: "✨ Inspiration des Tages",
        newQuoteBtn: "Neues Zitat 🦋",
        calendarTitle: "📅 Kalender der täglichen Erfolge",
        calendarDesc: "Klicke auf Tage, um deine Erfolge und Selbstfürsorge zu markieren!",
        calTitle: "🥗 Intelligenter Kalorienrechner",
        calDesc: "Wähle aus 100+ Lebensmitteln, gib die Menge ein — die Seite rechnet alles aus!",
        chooseProduct: "-- Wähle ein Produkt aus der Basis --",
        foodNamePh: "Lebensmittelname",
        foodCalsPh: "Kcal pro 100g/ml/Portion",
        foodAmountPh: "Menge (z.B. 3 Stk / 200g)",
        foodMultPh: "Multiplikator",
        addFoodBtn: "Gericht hinzufügen",
        consumedToday: "Heute verbraucht",
        clearFoodBtn: "Liste leeren",
        stepsTitle: "👟 Schritt- & Aktivitäts-Tracker",
        stepsDesc: "Verfolge deine tägliche Aktivität. Ziel — 10.000 Schritte am Tag!",
        stepsInputPh: "Anzahl der Schritte",
        addStepsBtn: "Schritte hinzufügen",
        resetStepsBtn: "Tag zurücksetzen",
        totalStepsLabel: "Schritte heute gesamt",
        waterTitle: "💧 Wassertracker",
        waterDesc: "Trinke genug Wasser für Schönheit und Energie (Ziel — 8 Gläser).",
        waterDrunk: "Getrunkene Gläser",
        addWaterBtn: "+ Glas trinken 🥤",
        resetWaterBtn: "Zurücksetzen",
        paramsTitle: "📈 Körperparameter & Kalorienbedarf",
        paramsDesc: "Gib deine Daten ein, um deinen Kalorienbedarf zu berechnen.",
        weightPh: "Gewicht (kg)",
        heightPh: "Größe (cm)",
        agePh: "Alter",
        waistPh: "Taile (cm)",
        calcParamsBtn: "Berechnen & Speichern",
        lastData: "Letzte Daten",
        normLabel: "Deine empfohlene Kaloriennorm",
        videoTitle: "🎥 Lieblingsworkouts: Shake Twins, Torepina & Emma Fitness",
        videoDesc: "Tanz-Cardio, Beinübungen und intensive Workouts!",
        footerText: "Mit Liebe und Inspiration erstellt",
        authTitle: "🐾 HelloKittyFit Anmeldung 🐾",
        authDesc: "Melde dich an oder registriere dich, um dein Profil zu speichern.",
        authEmailPh: "E-Mail",
        authPassPh: "Passwort",
        authNamePh: "Wie heißt du?",
        authGoalPh: "Zielgewicht (kg)",
        authSubmit: "Einloggen 💕",
        authTogglePrompt: "Noch kein Konto?",
        authToggleLink: "Registrieren",
        regTitle: "🐾 HelloKittyFit Registrierung 🐾",
        regDesc: "Erstelle ein Konto, um deinen Namen und Fortschritt zu speichern.",
        regSubmit: "Registrieren 💕",
        regTogglePrompt: "Bereits ein Konto?",
        regToggleLink: "Einloggen",
        archiveTitleText: "📂 Archiv & Tagesverlauf",
        archiveDescText: "Hier werden deine Profildaten und tägliche Aktivität gespeichert.",
        closeArchiveBtn: "Schließen 💖"
    },
    fr: {
        title: "HelloKittyFit — Votre journal de fitness personnel",
        welcome: (name) => `Bonjour, ${name} ! Votre chemin vers l'harmonie et l'énergie.`,
        welcomeDefault: "Bonjour ! Votre chemin vers l'harmonie et l'énergie.",
        archiveBtn: "📂 Archives",
        logoutBtn: "Se déconnecter 🚪",
        goalTitle: "🎯 Votre Objectif & Progrès",
        goalDesc: "Avancez vers votre rêve étape par étape. Vous y arriverez !",
        targetLabel: "Poids cible",
        leftLabel: "Restant à perdre / gagner",
        editProfileBtn: "Modifier le profil / l'objectif ⚙️",
        quoteTitle: "✨ Inspiration du jour",
        newQuoteBtn: "Nouvelle citation 🦋",
        calendarTitle: "📅 Calendrier des victoires quotidiennes",
        calendarDesc: "Cliquez sur les jours pour marquer vos réussites !",
        calTitle: "🥗 Calculateur de calories intelligent",
        calDesc: "Choisissez parmi 100+ aliments, indiquez la quantité — le site calcule tout !",
        chooseProduct: "-- Choisissez un aliment --",
        foodNamePh: "Nom de l'aliment",
        foodCalsPh: "Kcal pour 100g/ml/portion",
        foodAmountPh: "Quantité (ex: 3 pcs / 200g)",
        foodMultPh: "Multiplicateur",
        addFoodBtn: "Ajouter le plat",
        consumedToday: "Consommé aujourd'hui",
        clearFoodBtn: "Effacer la liste",
        stepsTitle: "👟 Suivi des pas et de l'activité",
        stepsDesc: "Suivez votre activité quotidienne. Objectif — 10 000 pas par jour !",
        stepsInputPh: "Nombre de pas",
        addStepsBtn: "Ajouter des pas",
        resetStepsBtn: "Réinitialiser",
        totalStepsLabel: "Total des pas aujourd'hui",
        waterTitle: "💧 Suivi de l'eau",
        waterDesc: "Buvez assez d'eau (objectif — 8 verres).",
        waterDrunk: "Verres bu",
        addWaterBtn: "+ Boire un verre 🥤",
        resetWaterBtn: "Réinitialiser",
        paramsTitle: "📈 Paramètres corporels et calories",
        paramsDesc: "Entrez vos données pour calculer votre norme calorique.",
        weightPh: "Poids (kg)",
        heightPh: "Taille (cm)",
        agePh: "Âge",
        waistPh: "Taille / Tour de taille (cm)",
        calcParamsBtn: "Calculer et enregistrer",
        lastData: "Dernières données",
        normLabel: "Votre norme calorique recommandée",
        videoTitle: "🎥 Entraînements favoris : Shake Twins, Torepina & Emma Fitness",
        videoDesc: "Cardio danse, exercices pour les jambes et programmes intenses !",
        footerText: "Créé avec amour et inspiration",
        authTitle: "🐾 Connexion HelloKittyFit 🐾",
        authDesc: "Connectez-vous ou inscrivez-vous pour enregistrer votre profil.",
        authEmailPh: "E-mail",
        authPassPh: "Mot de passe",
        authNamePh: "Comment vous appelez-vous ?",
        authGoalPh: "Poids cible (kg)",
        authSubmit: "Se connecter 💕",
        authTogglePrompt: "Pas encore de compte ?",
        authToggleLink: "S'inscrire",
        regTitle: "🐾 Inscription HelloKittyFit 🐾",
        regDesc: "Créez un compte pour enregistrer votre nom et vos progrès.",
        regSubmit: "S'inscrire 💕",
        regTogglePrompt: "Déjà un compte ?",
        regToggleLink: "Se connecter",
        archiveTitleText: "📂 Archives et historique quotidien",
        archiveDescText: "Vos données de profil et l'historique d'activité sont stockés ici.",
        closeArchiveBtn: "Fermer 💖"
    },
    it: {
        title: "HelloKittyFit — Il tuo diario fitness personale",
        welcome: (name) => `Ciao, ${name}! Il tuo percorso verso armonia ed energia.`,
        welcomeDefault: "Ciao! Il tuo percorso verso armonia ed energia.",
        archiveBtn: "📂 Archivio",
        logoutBtn: "Esci 🚪",
        goalTitle: "🎯 Il tuo obiettivo e progresso",
        goalDesc: "Vai verso il tuo sogno passo dopo passo. Ce la farai!",
        targetLabel: "Peso obiettivo",
        leftLabel: "Rimasto da perdere / guadagnare",
        editProfileBtn: "Modifica profilo / obiettivo ⚙️",
        quoteTitle: "✨ Ispirazione del giorno",
        newQuoteBtn: "Nuova citazione 🦋",
        calendarTitle: "📅 Calendario delle vittorie giornaliere",
        calendarDesc: "Clicca sui giorni del mese per segnare i tuoi successi e la cura di te!",
        calTitle: "🥗 Calcolatore di calorie intelligente",
        calDesc: "Scegli tra 100+ alimenti, inserisci la quantità — il sito calcolerà tutto!",
        chooseProduct: "-- Scegli un alimento dalla base (100+ elementi) --",
        foodNamePh: "Nome alimento",
        foodCalsPh: "Kcal per 100g/ml/porzione",
        foodAmountPh: "Quantità (es: 3 pz / 200g)",
        foodMultPh: "Moltiplicatore (es: 3)",
        addFoodBtn: "Aggiungi piatto",
        consumedToday: "Consumato oggi",
        clearFoodBtn: "Svuota lista",
        stepsTitle: "👟 Contapassi e attività",
        stepsDesc: "Monitora la tua attività quotidiana. Obiettivo — 10.000 passi al giorno!",
        stepsInputPh: "Numero di passi",
        addStepsBtn: "Aggiungi passi",
        resetStepsBtn: "Resetta giorno",
        totalStepsLabel: "Passi totali oggi",
        waterTitle: "💧 Monitor dell'acqua",
        waterDesc: "Bevi abbastanza acqua per bellezza ed energia (obiettivo — 8 bicchieri).",
        waterDrunk: "Bicchieri bevuti",
        addWaterBtn: "+ Bevi un bicchiere 🥤",
        resetWaterBtn: "Resetta",
        paramsTitle: "📈 Parametri corporei e fabbisogno calorico",
        paramsDesc: "Inserisci i tuoi dati per calcolare la tua norma calorica.",
        weightPh: "Peso (kg)",
        heightPh: "Altezza (cm)",
        agePh: "Età",
        waistPh: "Girovita (cm)",
        calcParamsBtn: "Calcola e salva",
        lastData: "Ultimi dati",
        normLabel: "La tua norma calorica consigliata",
        videoTitle: "🎥 Allenamenti preferiti: Shake Twins, Torepina & Emma Fitness",
        videoDesc: "Cardio dance, esercizi per le gambe e programmi intensi!",
        footerText: "Creato con amore e ispirazione",
        authTitle: "🐾 Accesso a HelloKittyFit 🐾",
        authDesc: "Accedi o registrati per salvare il tuo profilo.",
        authEmailPh: "E-mail",
        authPassPh: "Password",
        authNamePh: "Come ti chiami?",
        authGoalPh: "Peso obiettivo (kg)",
        authSubmit: "Accedi 💕",
        authTogglePrompt: "Non hai ancora un account?",
        authToggleLink: "Registrati",
        regTitle: "🐾 Registrazione a HelloKittyFit 🐾",
        regDesc: "Crea un account per salvare il tuo nome e i tuoi progressi.",
        regSubmit: "Registrati 💕",
        regTogglePrompt: "Hai già un account?",
        regToggleLink: "Accedi",
        archiveTitleText: "📂 Archivio e storico giornaliero",
        archiveDescText: "I dati del tuo profilo e lo storico dettagliato delle attività sono salvati qui.",
        closeArchiveBtn: "Chiudi 💖"
    },
    ja: {
        title: "HelloKittyFit — パーソナルフィットネスダイアリー",
        welcome: (name) => `こんにちは、${name}さん！調和とエネルギーへの道。`,
        welcomeDefault: "こんにちは！調和とエネルギーへの道。",
        archiveBtn: "📂 アーカイブ",
        logoutBtn: "ログアウト 🚪",
        goalTitle: "🎯 目標と進捗",
        goalDesc: "一歩ずつ夢に向かって進もう！",
        targetLabel: "目標体重",
        leftLabel: "残り増減",
        editProfileBtn: "プロフィール変更 ⚙️",
        quoteTitle: "✨ 今日のお言葉",
        newQuoteBtn: "名言を更新 🦋",
        calendarTitle: "📅 毎日の達成カレンダー",
        calendarDesc: "カレンダーの日付をクリックして記録しよう！",
        calTitle: "🥗 スマートカロリー計算",
        calDesc: "100以上の食品から選択して計算しよう！",
        chooseProduct: "-- 食品を選択 --",
        foodNamePh: "食品名",
        foodCalsPh: "100gあたりのカロリー",
        foodAmountPh: "数量",
        foodMultPh: "倍率",
        addFoodBtn: "料理を追加",
        consumedToday: "今日の摂取カロリー",
        clearFoodBtn: "リストをクリア",
        stepsTitle: "👟 歩数・活動トラッカー",
        stepsDesc: "目標は1日10,000歩！",
        stepsInputPh: "歩数",
        addStepsBtn: "歩数を追加",
        resetStepsBtn: "リセット",
        totalStepsLabel: "今日の合計歩数",
        waterTitle: "💧 水分補給トラッカー",
        waterDesc: "目標は1日8杯のグラス。",
        waterDrunk: "飲んだ杯数",
        addWaterBtn: "+ グラスを飲む 🥤",
        resetWaterBtn: "リセット",
        paramsTitle: "📈 身体測定とカロリー計算",
        paramsDesc: "データを入力してカロリーノルードを計算。",
        weightPh: "体重 (kg)",
        heightPh: "身長 (cm)",
        agePh: "年齢",
        waistPh: "ウエスト (cm)",
        calcParamsBtn: "計算して保存",
        lastData: "直近のデータ",
        normLabel: "推奨カロリーノルマ",
        videoTitle: "🎥 お気に入りワークアウト",
        videoDesc: "ダンス cardio とシェイプアップ！",
        footerText: "愛とインスピレーションを込めて",
        authTitle: "🐾 ログイン 🐾",
        authDesc: "プロフィールを保存するためにログインしてください。",
        authEmailPh: "メール",
        authPassPh: "パスワード",
        authNamePh: "お名前は？",
        authGoalPh: "目標体重 (kg)",
        authSubmit: "ログイン 💕",
        authTogglePrompt: "アカウントがありませんか？",
        authToggleLink: "登録する",
        regTitle: "🐾 登録 🐾",
        regDesc: "アカウントを作成して進捗を保存しましょう。",
        regSubmit: "登録 💕",
        regTogglePrompt: "すでにアカウントをお持ちですか？",
        regToggleLink: "ログイン",
        archiveTitleText: "📂 アーカイブと履歴",
        archiveDescText: "プロフィールデータと履歴がここに保存されます。",
        closeArchiveBtn: "閉じる 💖"
    },
    ko: {
        title: "HelloKittyFit — 개인 피트니스 일기",
        welcome: (name) => `안녕하세요, ${name}님! 조화와 에너지를 향한 여정.`,
        welcomeDefault: "안녕하세요! 조화와 에너지를 향한 여정.",
        archiveBtn: "📂 보관함",
        logoutBtn: "로그아웃 🚪",
        goalTitle: "🎯 목표 및 진행 상황",
        goalDesc: "한 걸음씩 꿈을 향해 나아가세요!",
        targetLabel: "목표 체중",
        leftLabel: "남은 감량/증량",
        editProfileBtn: "프로필 수정 ⚙️",
        quoteTitle: "✨ 오늘의 영감",
        newQuoteBtn: "새 명언 🦋",
        calendarTitle: "📅 일일 승리 캘린더",
        calendarDesc: "날짜를 클릭하여 성공을 기록하세요!",
        calTitle: "🥗 스마트 칼로리 계산기",
        calDesc: "100가지 이상의 식품에서 선택하세요!",
        chooseProduct: "-- 식품 선택 --",
        foodNamePh: "음식 이름",
        foodCalsPh: "100g당 칼로리",
        foodAmountPh: "수량",
        foodMultPh: "배수",
        addFoodBtn: "음식 추가",
        consumedToday: "오늘 섭취한 칼로리",
        clearFoodBtn: "목록 지우기",
        stepsTitle: "👟 걸음 수 및 활동",
        stepsDesc: "목표 — 하루 10,000보!",
        stepsInputPh: "걸음 수",
        addStepsBtn: "걸음 추가",
        resetStepsBtn: "초기화",
        totalStepsLabel: "오늘 총 걸음 수",
        waterTitle: "💧 수분 섭취 추적",
        waterDesc: "목표 — 하루 8잔.",
        waterDrunk: "마신 컵 수",
        addWaterBtn: "+ 물 마시기 🥤",
        resetWaterBtn: "초기화",
        paramsTitle: "📈 신체 치수 및 칼로리",
        paramsDesc: "데이터를 입력하여 칼로리 권장량을 계산하세요.",
        weightPh: "체중 (kg)",
        heightPh: "키 (cm)",
        agePh: "나이",
        waistPh: "허리 (cm)",
        calcParamsBtn: "계산 및 저장",
        lastData: "최근 데이터",
        normLabel: "권장 칼로리",
        videoTitle: "🎥 추천 운동",
        videoDesc: "댄스 카디오 및 홈트!",
        footerText: "사랑과 영감으로 제작됨",
        authTitle: "🐾 로그인 🐾",
        authDesc: "프로필을 저장하려면 로그인하세요.",
        authEmailPh: "이메일",
        authPassPh: "비밀번호",
        authNamePh: "이름이 무엇인가요?",
        authGoalPh: "목표 체중 (kg)",
        authSubmit: "로그인 💕",
        authTogglePrompt: "계정이 없으신가요?",
        authToggleLink: "회원가입",
        regTitle: "🐾 회원가입 🐾",
        regDesc: "계정을 만들어 진행 상황을 저장하세요.",
        regSubmit: "가입하기 💕",
        regTogglePrompt: "이미 계정이 있으신가요?",
        regToggleLink: "로그인",
        archiveTitleText: "📂 보관함 및 기록",
        archiveDescText: "프로필 데이터와 일일 활동 기록이 저장됩니다.",
        closeArchiveBtn: "닫기 💖"
    },
    sv: {
        title: "HelloKittyFit — Din personliga fitnessdagbok",
        welcome: (name) => `Hej, ${name}! Din resa mot harmoni och energi.`,
        welcomeDefault: "Hej! Din resa mot harmoni och energi.",
        archiveBtn: "📂 Arkiv",
        logoutBtn: "Logga ut 🚪",
        goalTitle: "🎯 Ditt mål och framsteg",
        goalDesc: "Gå mot din dröm steg för steg!",
        targetLabel: "Målvikt",
        leftLabel: "Kvar att gå ner / upp",
        editProfileBtn: "Ändra profil / mål ⚙️",
        quoteTitle: "✨ Dagens inspiration",
        newQuoteBtn: "Nytt citat 🦋",
        calendarTitle: "📅 Dagens vinster kalender",
        calendarDesc: "Klicka på dagarna för att registrera dina framsteg!",
        calTitle: "🥗 Smart kaloriräknare",
        calDesc: "Välj bland 100+ livsmedel!",
        chooseProduct: "-- Välj livsmedel --",
        foodNamePh: "Livsmedelsnamn",
        foodCalsPh: "Kcal per 100g",
        foodAmountPh: "Mängd",
        foodMultPh: "Multiplikator",
        addFoodBtn: "Lägg till",
        consumedToday: "Konsumerat idag",
        clearFoodBtn: "Rensa lista",
        stepsTitle: "👟 Stegräknare och aktivitet",
        stepsDesc: "Mål — 10 000 steg om dagen!",
        stepsInputPh: "Antal steg",
        addStepsBtn: "Lägg till steg",
        resetStepsBtn: "Återställ dag",
        totalStepsLabel: "Totalt antal steg idag",
        waterTitle: "💧 Vattenträff",
        waterDesc: "Drick tillräckligt med vatten (mål — 8 glas).",
        waterDrunk: "Drickna glas",
        addWaterBtn: "+ Drick ett glas 🥤",
        resetWaterBtn: "Återställ",
        paramsTitle: "📈 Kroppsparametrar och kalorier",
        paramsDesc: "Ange dina uppgifter för att beräkna kaloribehov.",
        weightPh: "Vikt (kg)",
        heightPh: "Längd (cm)",
        agePh: "Ålder",
        waistPh: "Midja (cm)",
        calcParamsBtn: "Beräkna och spara",
        lastData: "Senaste data",
        normLabel: "Din rekommenderade kalorinorm",
        videoTitle: "🎥 Favoritträning",
        videoDesc: "Dans, kondition och styrka!",
        footerText: "Skapat med kärlek och inspiration",
        authTitle: "🐾 Inloggning 🐾",
        authDesc: "Logga in eller registrera dig för att spara din profil.",
        authEmailPh: "E-post",
        authPassPh: "Lösenord",
        authNamePh: "Vad heter du?",
        authGoalPh: "Målvikt (kg)",
        authSubmit: "Logga in 💕",
        authTogglePrompt: "Inget konto?",
        authToggleLink: "Registrera",
        regTitle: "🐾 Registrering 🐾",
        regDesc: "Skapa ett konto för att spara ditt namn och dina framsteg.",
        regSubmit: "Registrera 💕",
        regTogglePrompt: "Har du redan ett konto?",
        regToggleLink: "Logga in",
        archiveTitleText: "📂 Arkiv och historik",
        archiveDescText: "Dina profildata och din dagliga historik sparas här.",
        closeArchiveBtn: "Stäng 💖"
    },
    nl: {
        title: "HelloKittyFit — Jouw persoonlijke fitnessdagboek",
        welcome: (name) => `Hallo, ${name}! Jouw reis naar harmonie en energie.`,
        welcomeDefault: "Hallo! Jouw reis naar harmonie en energie.",
        archiveBtn: "📂 Archief",
        logoutBtn: "Uitloggen 🚪",
        goalTitle: "🎯 Jouw doel & voortgang",
        goalDesc: "Ga stap voor stap naar je droom!",
        targetLabel: "Doelgewicht",
        leftLabel: "Resterend te verliezen / winnen",
        editProfileBtn: "Profiel / doel bewerken ⚙️",
        quoteTitle: "✨ Inspiratie van de dag",
        newQuoteBtn: "Nieuwe quote 🦋",
        calendarTitle: "📅 Dagelijkse overwinningskalender",
        calendarDesc: "Klik op dagen om je successen bij te houden!",
        calTitle: "🥗 Slimme caloriecalculator",
        calDesc: "Kies uit 100+ voedingsmiddelen!",
        chooseProduct: "-- Kies een product --",
        foodNamePh: "Naam product",
        foodCalsPh: "Kcal per 100g",
        foodAmountPh: "Hoeveelheid",
        foodMultPh: "Multiplier",
        addFoodBtn: "Gerecht toevoegen",
        consumedToday: "Vandaag geconsumeerd",
        clearFoodBtn: "Lijst wissen",
        stepsTitle: "👟 Stappen- & activiteitentracker",
        stepsDesc: "Doel — 10.000 stappen per dag!",
        stepsInputPh: "Aantal stappen",
        addStepsBtn: "Stappen toevoegen",
        resetStepsBtn: "Dag resetten",
        totalStepsLabel: "Totaal stappen vandaag",
        waterTitle: "💧 Watertracker",
        waterDesc: "Drink genoeg water (doel — 8 glazen).",
        waterDrunk: "Glazen gedronken",
        addWaterBtn: "+ Drink een glas 🥤",
        resetWaterBtn: "Resetten",
        paramsTitle: "📈 Lichaamsparameters & calorieën",
        paramsDesc: "Voer je gegevens in om je calorienorm te berekenen.",
        weightPh: "Gewicht (kg)",
        heightPh: "Lengte (cm)",
        agePh: "Leeftijd",
        waistPh: "Taille (cm)",
        calcParamsBtn: "Berekenen & opslaan",
        lastData: "Laatste gegevens",
        normLabel: "Jouw aanbevolen calorienorm",
        videoTitle: "🎥 Favoriete workouts",
        videoDesc: "Danscardio en intensieve trainingen!",
        footerText: "Gemaakt met liefde en inspiratie",
        authTitle: "🐾 Inloggen 🐾",
        authDesc: "Log in of registreer om je profiel op te slaan.",
        authEmailPh: "E-mail",
        authPassPh: "Wachtwoord",
        authNamePh: "Hoe heet je?",
        authGoalPh: "Doelgewicht (kg)",
        authSubmit: "Inloggen 💕",
        authTogglePrompt: "Nog geen account?",
        authToggleLink: "Registreren",
        regTitle: "🐾 Registreren 🐾",
        regDesc: "Maak een account aan om je voortgang op te slaan.",
        regSubmit: "Registreren 💕",
        regTogglePrompt: "Al een account?",
        regToggleLink: "Inloggen",
        archiveTitleText: "📂 Archief & geschiedenis",
        archiveDescText: "Je profielgegevens en dagelijkse geschiedenis staan hier.",
        closeArchiveBtn: "Sluiten 💖"
    }
};

// Запуск при завантаженні сторінки
window.addEventListener('DOMContentLoaded', () => {
    initApp();
    populateFoodPresetSelect();
    renderCalendar();
    
    // Завантаження циклу
    const savedDate = localStorage.getItem('kitty_last_period');
    const savedLength = localStorage.getItem('kitty_cycle_length');
    if (savedDate) document.getElementById('last-period-date').value = savedDate;
    if (savedLength) document.getElementById('cycle-length-input').value = savedLength;
    if (savedDate) updateCycleCalculations();
});

function initApp() {
    applyLanguage(currentLang);
    document.getElementById('lang-selector').value = currentLang;

    if (!currentUserEmail) {
        openAuthModal();
    } else {
        loadUserData(currentUserEmail);
    }
}

// Перемикання мови через селектор
function changeLanguageDropdown(lang) {
    currentLang = lang;
    localStorage.setItem('siteLang', lang);
    applyLanguage(lang);
    renderCalendar();
    updateCycleCalculations();
}

function applyLanguage(lang) {
    const t = translations[lang] || translations['uk'];
    
    document.getElementById('html-root').setAttribute('lang', lang);
    document.title = t.title;
    
    // Header
    document.getElementById('archive-btn-text').innerText = t.archiveBtn;
    document.getElementById('logout-btn-text').innerText = t.logoutBtn;
    
    const welcomeEl = document.getElementById('welcome-user-text');
    if (userProfile.name) {
        welcomeEl.innerText = t.welcome(userProfile.name);
    } else {
        welcomeEl.innerText = t.welcomeDefault;
    }

    // Goal Card
    document.getElementById('goal-card-title').innerText = t.goalTitle;
    document.getElementById('goal-card-desc').innerText = t.goalDesc;
    document.getElementById('txt-target-label').innerText = t.targetLabel;
    document.getElementById('txt-left-label').innerText = t.leftLabel;
    document.getElementById('btn-edit-profile').innerText = t.editProfileBtn;

    // Motivation Card
    document.getElementById('quote-card-title').innerText = t.quoteTitle;
    document.getElementById('btn-new-quote').innerText = t.newQuoteBtn;

    // Calendar Card
    document.getElementById('calendar-card-title').innerText = t.calendarTitle;
    document.getElementById('calendar-card-desc').innerText = t.calendarDesc;

    // Cycle Tracker Card
    if (document.getElementById('cycle-card-title')) {
        document.getElementById('cycle-card-title').innerText = lang === 'uk' ? "🌸 Трекер циклу та догляду" : (lang === 'en' ? "🌸 Cycle & Self-Care Tracker" : "🌸 Ciclo y Cuidado Personal");
        document.getElementById('cycle-card-desc').innerText = lang === 'uk' ? "Стеж за своїм жіночим здоров'ям, фазами циклу та отримуй персоналізовані поради для тренувань." : "Track your feminine health, cycle phases, and get personalized workout tips.";
        document.getElementById('lbl-last-period').innerText = lang === 'uk' ? "Дата початку останньої менструації:" : "Last period start date:";
        document.getElementById('lbl-cycle-length').innerText = lang === 'uk' ? "Середня тривалість циклу (днів):" : "Average cycle length (days):";
        document.getElementById('txt-current-phase').innerText = lang === 'uk' ? "Поточна фаза" : "Current phase";
        document.getElementById('txt-cycle-day').innerText = lang === 'uk' ? "День циклу" : "Cycle day";
        document.getElementById('txt-next-period').innerText = lang === 'uk' ? "Прогноз наступних місячних" : "Next period forecast";
        document.getElementById('txt-ovulation-day').innerText = lang === 'uk' ? "Вікно овуляції" : "Ovulation window";
        document.getElementById('rec-title').innerText = lang === 'uk' ? "💡 Рекомендації для цього періоду:" : "💡 Recommendations for this period:";
    }

    // Calorie Card
    document.getElementById('cal-card-title').innerText = t.calTitle;
    document.getElementById('cal-card-desc').innerText = t.calDesc;
    document.getElementById('opt-choose-product').innerText = t.chooseProduct;
    document.getElementById('food-name').placeholder = t.foodNamePh;
    document.getElementById('food-cals-100').placeholder = t.foodCalsPh;
    document.getElementById('food-amount-desc').placeholder = t.foodAmountPh;
    document.getElementById('food-multiplier').placeholder = t.foodMultPh;
    document.getElementById('btn-add-food').innerText = t.addFoodBtn;
    document.getElementById('txt-consumed-today').innerText = t.consumedToday;
    document.getElementById('btn-clear-food').innerText = t.clearFoodBtn;

    // Steps Card
    document.getElementById('steps-card-title').innerText = t.stepsTitle;
    document.getElementById('steps-card-desc').innerText = t.stepsDesc;
    document.getElementById('steps-input').placeholder = t.stepsInputPh;
    document.getElementById('btn-add-steps').innerText = t.addStepsBtn;
    document.getElementById('btn-reset-steps').innerText = t.resetStepsBtn;
    document.getElementById('txt-total-steps').innerText = t.totalStepsLabel;

    // Water Card
    document.getElementById('water-card-title').innerText = t.waterTitle;
    document.getElementById('water-card-desc').innerText = t.waterDesc;
    document.getElementById('txt-water-drunk').innerText = t.waterDrunk;
    document.getElementById('btn-add-water').innerText = t.addWaterBtn;
    document.getElementById('btn-reset-water').innerText = t.resetWaterBtn;

    // Params Card
    document.getElementById('params-card-title').innerText = t.paramsTitle;
    document.getElementById('params-card-desc').innerText = t.paramsDesc;
    document.getElementById('weight-input').placeholder = t.weightPh;
    document.getElementById('height-input').placeholder = t.heightPh;
    document.getElementById('age-input').placeholder = t.agePh;
    document.getElementById('waist-input').placeholder = t.waistPh;
    document.getElementById('btn-calc-params').innerText = t.calcParamsBtn;
    document.getElementById('txt-last-data').innerText = t.lastData;
    document.getElementById('txt-norm-label').innerText = t.normLabel;

    // Video Card
    document.getElementById('video-card-title').innerText = t.videoTitle;
    document.getElementById('video-card-desc').innerText = t.videoDesc;

    // Footer
    document.getElementById('footer-text').innerText = t.footerText;

    // Auth Modal
    document.getElementById('auth-title').innerText = isRegisterMode ? t.regTitle : t.authTitle;
    document.getElementById('auth-desc').innerText = isRegisterMode ? t.regDesc : t.authDesc;
    document.getElementById('auth-email').placeholder = t.authEmailPh;
    document.getElementById('auth-password').placeholder = t.authPassPh;
    document.getElementById('auth-name').placeholder = t.authNamePh;
    document.getElementById('auth-goal-weight').placeholder = t.authGoalPh;
    document.getElementById('auth-submit-btn').innerText = isRegisterMode ? t.regSubmit : t.authSubmit;
    document.getElementById('auth-toggle-prompt').innerText = isRegisterMode ? t.regTogglePrompt : t.authTogglePrompt;
    document.getElementById('auth-toggle-link').innerText = isRegisterMode ? t.regToggleLink : t.authToggleLink;

    // Archive Modal
    document.getElementById('archive-title').innerText = t.archiveTitleText;
    document.getElementById('archive-desc').innerText = t.archiveDescText;
    document.getElementById('btn-close-archive').innerText = t.closeArchiveBtn;
}

// Заповнення випадаючого списку продуктів
function populateFoodPresetSelect() {
    const select = document.getElementById('food-preset-select');
    foodDatabase.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.innerText = `${item.name} — ${item.cals} ккал (${item.desc})`;
        select.appendChild(option);
    });
}

function fillPresetFood() {
    const select = document.getElementById('food-preset-select');
    const index = select.value;
    if (index === "") return;
    
    const food = foodDatabase[index];
    document.getElementById('food-name').value = food.name;
    document.getElementById('food-cals-100').value = food.cals;
    document.getElementById('food-amount-desc').value = food.desc;
    document.getElementById('food-multiplier').value = 1;
}

// Автентифікація та збереження даних користувача
function openAuthModal() {
    document.getElementById('auth-modal').style.display = 'flex';
}

function closeAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
}

function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    const t = translations[currentLang] || translations['uk'];
    
    document.getElementById('auth-title').innerText = isRegisterMode ? t.regTitle : t.authTitle;
    document.getElementById('auth-desc').innerText = isRegisterMode ? t.regDesc : t.authDesc;
    document.getElementById('auth-submit-btn').innerText = isRegisterMode ? t.regSubmit : t.authSubmit;
    document.getElementById('auth-toggle-prompt').innerText = isRegisterMode ? t.regTogglePrompt : t.authTogglePrompt;
    document.getElementById('auth-toggle-link').innerText = isRegisterMode ? t.regToggleLink : t.authToggleLink;

    document.getElementById('auth-name').style.display = isRegisterMode ? 'block' : 'none';
    document.getElementById('auth-goal-weight').style.display = isRegisterMode ? 'block' : 'none';
}

function handleAuthSubmit() {
    const email = document.getElementById('auth-email').value.trim();
    const pass = document.getElementById('auth-password').value.trim();
    
    if (!email || !pass) {
        alert("Будь ласка, заповни пошту та пароль 💕");
        return;
    }

    if (isRegisterMode) {
        const name = document.getElementById('auth-name').value.trim() || "Подруга";
        const goalWeight = parseFloat(document.getElementById('auth-goal-weight').value) || 55;
        
        usersDB[email] = {
            email: email,
            password: pass,
            profile: {
                ...userProfile,
                name: name,
                targetWeight: goalWeight
            }
        };
        localStorage.setItem('helloKittyUsersDB', JSON.stringify(usersDB));
        currentUserEmail = email;
        localStorage.setItem('currentUserEmail', email);
        
        userProfile = usersDB[email].profile;
        closeAuthModal();
        initApp();
        updateUI();
    } else {
        if (usersDB[email] && usersDB[email].password === pass) {
            currentUserEmail = email;
            localStorage.setItem('currentUserEmail', email);
            userProfile = usersDB[email].profile;
            checkNewDayReset();
            closeAuthModal();
            initApp();
            updateUI();
        } else {
            // Якщо користувача немає в базі, але введено пошту — створимо автоматично для зручності
            usersDB[email] = {
                email: email,
                password: pass,
                profile: { ...userProfile, name: email.split('@')[0], targetWeight: 55 }
            };
            localStorage.setItem('helloKittyUsersDB', JSON.stringify(usersDB));
            currentUserEmail = email;
            localStorage.setItem('currentUserEmail', email);
            userProfile = usersDB[email].profile;
            closeAuthModal();
            initApp();
            updateUI();
        }
    }
}

function logoutUser() {
    saveUserData();
    localStorage.removeItem('currentUserEmail');
    currentUserEmail = '';
    openAuthModal();
}

function saveUserData() {
    if (!currentUserEmail) return;
    if (!usersDB[currentUserEmail]) {
        usersDB[currentUserEmail] = { email: currentUserEmail, password: '123', profile: userProfile };
    } else {
        usersDB[currentUserEmail].profile = userProfile;
    }
    localStorage.setItem('helloKittyUsersDB', JSON.stringify(usersDB));
}

function loadUserData(email) {
    if (usersDB[email]) {
        userProfile = usersDB[email].profile || userProfile;
    }
    checkNewDayReset();
    updateUI();
}

function checkNewDayReset() {
    if (userProfile.lastActiveDate !== todayDateStr) {
        // Архівуємо вчорашній день
        if (!userProfile.dailyHistory) userProfile.dailyHistory = {};
        userProfile.dailyHistory[userProfile.lastActiveDate] = {
            calories: userProfile.totalCalories,
            steps: userProfile.totalSteps,
            water: userProfile.waterCount
        };
        
        // Зберігаємо старий день у календар як виконаний, якщо була активність
        if (userProfile.totalCalories > 0 || userProfile.totalSteps > 0 || userProfile.waterCount > 0) {
            if (!userProfile.calendarMarks) userProfile.calendarMarks = {};
            userProfile.calendarMarks[userProfile.lastActiveDate] = 'pink';
        }

        // Скидаємо поточні показники на новий день
        userProfile.lastActiveDate = todayDateStr;
        userProfile.totalCalories = 0;
        userProfile.totalSteps = 0;
        userProfile.waterCount = 0;
        userProfile.foodListHTML = '';
        saveUserData();
    }
}

// Оновлення інтерфейсу за збереженими даними
function updateUI() {
    document.getElementById('target-weight-display').innerText = userProfile.targetWeight || '-';
    calculateWeightLeft();

    document.getElementById('total-calories').innerText = userProfile.totalCalories || 0;
    document.getElementById('food-list').innerHTML = userProfile.foodListHTML || '';

    document.getElementById('total-steps').innerText = userProfile.totalSteps || 0;
    updateStepsProgress();

    document.getElementById('water-count').innerText = userProfile.waterCount || 0;
    updateWaterMessage();

    document.getElementById('saved-weight').innerText = userProfile.savedWeight || '-';
    document.getElementById('saved-waist').innerText = userProfile.savedWaist || '-';
    document.getElementById('calculated-norm').innerText = userProfile.calculatedNorm || '-';

    const welcomeEl = document.getElementById('welcome-user-text');
    const t = translations[currentLang] || translations['uk'];
    if (userProfile.name) {
        welcomeEl.innerText = t.welcome(userProfile.name);
    } else {
        welcomeEl.innerText = t.welcomeDefault;
    }
}

// Калькулятор калорій
function addCalculatedCalories() {
    const name = document.getElementById('food-name').value.trim();
    const cals100 = parseFloat(document.getElementById('food-cals-100').value);
    const amountDesc = document.getElementById('food-amount-desc').value.trim() || 'порція';
    const multiplier = parseFloat(document.getElementById('food-multiplier').value) || 1;

    if (!name || isNaN(cals100)) {
        alert("Будь ласка, введи назву страви та калорії 💕");
        return;
    }

    const totalDishCals = Math.round(cals100 * multiplier);
    userProfile.totalCalories = (userProfile.totalCalories || 0) + totalDishCals;

    const li = document.createElement('li');
    li.innerHTML = `<span>${name} (${amountDesc} × ${multiplier})</span> <strong>${totalDishCals} ккал</strong>`;
    document.getElementById('food-list').appendChild(li);

    userProfile.foodListHTML = document.getElementById('food-list').innerHTML;
    document.getElementById('total-calories').innerText = userProfile.totalCalories;

    // Очищення полів
    document.getElementById('food-name').value = '';
    document.getElementById('food-cals-100').value = '';
    document.getElementById('food-amount-desc').value = '';
    document.getElementById('food-multiplier').value = 1;
    document.getElementById('food-preset-select').value = '';

    markTodayDone();
    saveUserData();
}

function resetCalories() {
    userProfile.totalCalories = 0;
    userProfile.foodListHTML = '';
    document.getElementById('total-calories').innerText = 0;
    document.getElementById('food-list').innerHTML = '';
    saveUserData();
}

// Трекер кроків
function addSteps() {
    const stepsInput = parseInt(document.getElementById('steps-input').value);
    if (isNaN(stepsInput) || stepsInput <= 0) {
        alert("Введи коректну кількість кроків 👟");
        return;
    }

    userProfile.totalSteps = (userProfile.totalSteps || 0) + stepsInput;
    document.getElementById('total-steps').innerText = userProfile.totalSteps;
    document.getElementById('steps-input').value = '';
    
    updateStepsProgress();
    markTodayDone();
    saveUserData();
}

function resetStepsToday() {
    userProfile.totalSteps = 0;
    document.getElementById('total-steps').innerText = 0;
    updateStepsProgress();
    saveUserData();
}

function updateStepsProgress() {
    const goal = 10000;
    const percent = Math.min(100, Math.round(((userProfile.totalSteps || 0) / goal) * 100));
    document.getElementById('steps-progress').style.width = percent + '%';
}

// Трекер води
function addWater() {
    if ((userProfile.waterCount || 0) < 8) {
        userProfile.waterCount = (userProfile.waterCount || 0) + 1;
        document.getElementById('water-count').innerText = userProfile.waterCount;
        updateWaterMessage();
        markTodayDone();
        saveUserData();
    }
}

function resetWater() {
    userProfile.waterCount = 0;
    document.getElementById('water-count').innerText = 0;
    updateWaterMessage();
    saveUserData();
}

function updateWaterMessage() {
    const count = userProfile.waterCount || 0;
    const msgEl = document.getElementById('water-message');
    if (count === 0) {
        msgEl.innerText = "Подбай про свою красу — випий першу склянку водички! 💧";
    } else if (count < 4) {
        msgEl.innerText = "Чудове початок! Шкіра сяє, енергія додається ✨";
    } else if (count < 8) {
        msgEl.innerText = "Ти на екваторі! Ще трішки і норма виконана 🌸";
    } else {
        msgEl.innerText = "Ура! Ціль з води досягнута! Ти неймовірна 💖";
    }
}

// Параметри тіла та норма калорій
function calculateNormAndSave() {
    const weight = parseFloat(document.getElementById('weight-input').value);
    const height = parseFloat(document.getElementById('height-input').value);
    const age = parseInt(document.getElementById('age-input').value);
    const waist = parseFloat(document.getElementById('waist-input').value);

    if (isNaN(weight) || isNaN(height) || isNaN(age)) {
        alert("Будь ласка, заповни вагу, зріст та вік для розрахунку 💕");
        return;
    }

    // Формула Міффліна-Сан Жеора для жінок
    const bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    const norm = Math.round(bmr * 1.2); // Коефіцієнт сидячого способу життя

    userProfile.savedWeight = weight;
    if (!isNaN(waist)) userProfile.savedWaist = waist;
    userProfile.calculatedNorm = norm;

    document.getElementById('saved-weight').innerText = userProfile.savedWeight;
    document.getElementById('saved-waist').innerText = userProfile.savedWaist;
    document.getElementById('calculated-norm').innerText = userProfile.calculatedNorm;

    alert(`Розрахунок успішно виконано! Твоя норма: ${norm} ккал/день 🌸`);
    markTodayDone();
    saveUserData();
}

function calculateWeightLeft() {
    if (!userProfile.targetWeight || userProfile.savedWeight === '-') {
        document.getElementById('weight-left-display').innerText = '-';
        return;
    }
    const currentW = parseFloat(userProfile.savedWeight);
    const diff = (currentW - userProfile.targetWeight).toFixed(1);
    const disp = document.getElementById('weight-left-display');
    if (diff > 0) {
        disp.innerText = `Залишилось скинути ${diff}`;
    } else if (diff < 0) {
        disp.innerText = `Залишилось набрати ${Math.abs(diff)}`;
    } else {
        disp.innerText = "Ціль досягнута! Ти зірка ⭐";
    }
}

// Натхнення дня (цитати)
const quotes = [
    "Твоє тіло здатне на все, головне — повірити в це! 💖",
    "Люби себе в кожному кілограмі, твоя енергія прекрасна ✨",
    "Маленькі кроки щодня ведуть до великих перемог 🌸",
    "Твій стиль життя — це турбота про себе, а не покарання 🦋",
    "Сьогодні ти робиш інвестицію у своє здорове завтра 🌷"
];

function setRandomQuote() {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('daily-quote').innerText = `"${random}"`;
}

// Календар щоденних перемог
function changeMonth(direction) {
    currentCalendarMonth += direction;
    if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    } else if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    }
    renderCalendar();
}

function renderCalendar() {
    const container = document.getElementById('calendar-days-container');
    container.innerHTML = '';
    
    const monthNames = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
    document.getElementById('calendar-month-year').innerText = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;

    const firstDayIndex = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Понеділок як перший день
    const totalDays = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();

    // Порожні клітинки для попереднього місяця
    for (let i = 0; i < adjustedFirstDay; i++) {
        const emptyDiv = document.createElement('div');
        container.appendChild(emptyDiv);
    }

    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.innerText = day;

        const monthStr = String(currentCalendarMonth + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateKey = `${currentCalendarYear}-${monthStr}-${dayStr}`;

        if (dateKey === todayDateStr) {
            dayDiv.classList.add('today');
        }

        if (userProfile.calendarMarks && userProfile.calendarMarks[dateKey]) {
            dayDiv.classList.add('completed');
        }

        dayDiv.onclick = () => {
            if (!userProfile.calendarMarks) userProfile.calendarMarks = {};
            if (userProfile.calendarMarks[dateKey]) {
                delete userProfile.calendarMarks[dateKey];
                dayDiv.classList.remove('completed');
            } else {
                userProfile.calendarMarks[dateKey] = 'pink';
                dayDiv.classList.add('completed');
            }
            saveUserData();
        };

        container.appendChild(dayDiv);
    }
}

function markTodayDone() {
    if (!userProfile.calendarMarks) userProfile.calendarMarks = {};
    userProfile.calendarMarks[todayDateStr] = 'pink';
    renderCalendar();
}

// Модальне вікно архіву
function openArchiveModal() {
    const box = document.getElementById('archive-content');
    let html = `<p><strong>Ім'я:</strong> ${userProfile.name || 'Не вказано'}</p>`;
    html += `<p><strong>Цільова вага:</strong> ${userProfile.targetWeight || '-'} кг</p>`;
    html += `<p><strong>Остання вага:</strong> ${userProfile.savedWeight} кг | <strong>Талія:</strong> ${userProfile.savedWaist} см</p>`;
    html += `<hr style="border: 0; border-top: 1px dashed #ffb6c1; margin: 10px 0;">`;
    html += `<h4>Історія попередніх днів:</h4>`;

    if (userProfile.dailyHistory && Object.keys(userProfile.dailyHistory).length > 0) {
        for (const [date, data] of Object.entries(userProfile.dailyHistory)) {
            html += `<p>📅 <strong>${date}</strong>: 🥗 ${data.calories} ккал | 👟 ${data.steps} кроків | 💧 ${data.water} скл.</p>`;
        }
    } else {
        html += `<p>Архівних днів поки немає. Продовжуй вести щоденник! 💕</p>`;
    }

    box.innerHTML = html;
    document.getElementById('archive-modal').style.display = 'flex';
}

function closeArchiveModal() {
    document.getElementById('archive-modal').style.display = 'none';
}

function openResetModal() {
    const newName = prompt("Введи своє ім'я:", userProfile.name);
    if (newName !== null) userProfile.name = newName.trim();

    const newTarget = prompt("Введи бажану цільову вагу (кг):", userProfile.targetWeight);
    if (newTarget !== null && !isNaN(parseFloat(newTarget))) userProfile.targetWeight = parseFloat(newTarget);

    saveUserData();
    updateUI();
    applyLanguage(currentLang);
}

// --- ФУНКЦІЇ ТРЕКЕРА ЦИКЛУ ТА РЕКОМЕНДАЦІЙ (як у Flo) ---
function saveCycleSettings() {
    const lastDate = document.getElementById('last-period-date').value;
    const cycleLength = parseInt(document.getElementById('cycle-length-input').value) || 28;
    
    localStorage.setItem('kitty_last_period', lastDate);
    localStorage.setItem('kitty_cycle_length', cycleLength);
    
    updateCycleCalculations();
}

function updateCycleCalculations() {
    const lastDateStr = localStorage.getItem('kitty_last_period');
    const cycleLength = parseInt(localStorage.getItem('kitty_cycle_length')) || 28;
    
    if (!lastDateStr) return;
    
    const lastDate = new Date(lastDateStr);
    const today = new Date();
    
    const diffTime = today - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        document.getElementById('cycle-phase-name').innerText = currentLang === 'uk' ? "Дата з майбутнього 🌸" : "Future date 🌸";
        return;
    }
    
    const currentCycleDay = (diffDays % cycleLength) + 1;
    document.getElementById('cycle-day-count').innerText = `${currentCycleDay} ${currentLang === 'uk' ? 'день' : 'day'}`;
    
    const nextPeriod = new Date(lastDate);
    const cyclesPassed = Math.floor(diffDays / cycleLength) + 1;
    nextPeriod.setDate(lastDate.getDate() + (cyclesPassed * cycleLength));
    document.getElementById('next-period-date').innerText = nextPeriod.toLocaleDateString();
    
    const ovulationDay = cycleLength - 14;
    const ovulationStart = new Date(lastDate);
    ovulationStart.setDate(lastDate.getDate() + ovulationDay - 2 + ((cyclesPassed - 1) * cycleLength));
    const ovulationEnd = new Date(ovulationStart);
    ovulationEnd.setDate(ovulationStart.getDate() + 4);
    
    document.getElementById('ovulation-window').innerText = `${ovulationStart.toLocaleDateString()} — ${ovulationEnd.toLocaleDateString()}`;
    
    let phaseName = "";
    let recommendation = "";
    
    if (currentCycleDay >= 1 && currentCycleDay <= 5) {
        phaseName = currentLang === 'uk' ? "Менструальна фаза 🩸" : (currentLang === 'it' ? "Fase mestruale 🩸" : "Menstrual Phase 🩸");
        recommendation = currentLang === 'uk' 
            ? "🧘‍♀️ Рівень енергії знижений. Надавай перевагу легкій розминці, пілатесу, прогулянкам на свіжому повітрі та розтяжці. Пий більше теплої води."
            : (currentLang === 'it' ? "🧘‍♀️ Livelli di energia ridotti. Privilegia stretching leggero, pilates, passeggiate e acqua tiepida." : "🧘‍♀️ Energy levels are lower. Prioritize gentle stretching, pilates, walks, and plenty of warm water.");
    } else if (currentCycleDay > 5 && currentCycleDay < ovulationDay - 2) {
        phaseName = currentLang === 'uk' ? "Фолікулярна фаза 🌱" : (currentLang === 'it' ? "Fase follicolare 🌱" : "Follicular Phase 🌱");
        recommendation = currentLang === 'uk'
            ? "💪 Енергія росте! Це ідеальний час для інтенсивних кардіо-тренувань (Shake Twins), силових вправ та вивчення нового."
            : (currentLang === 'it' ? "💪 L'energia cresce! Momento ideale per cardio intenso (Shake Twins) e allenamenti di forza." : "💪 Energy is rising! Perfect time for intense cardio workouts, strength training, and new challenges.");
    } else if (currentCycleDay >= ovulationDay - 2 && currentCycleDay <= ovulationDay + 2) {
        phaseName = currentLang === 'uk' ? "Овуляція ✨" : (currentLang === 'it' ? "Ovulazione ✨" : "Ovulation ✨");
        recommendation = currentLang === 'uk'
            ? "🔥 Пік енергії та сил! Чудово підійдуть динамічні танцювальні тренування, біг та активні кардіо-комплекси."
            : (currentLang === 'it' ? "🔥 Picco di energia! Ottimo per allenamenti di danza dinamici, corsa e cardio intenso." : "🔥 Peak energy! Great for dynamic dance workouts, running, and high-energy cardio complexes.");
    } else {
        phaseName = currentLang === 'uk' ? "Лютеїнова фаза 🌙" : (currentLang === 'it' ? "Fase luteale 🌙" : "Luteal Phase 🌙");
        recommendation = currentLang === 'uk'
            ? "🌿 Енергія поступово знижується. Зменшуй інтенсивність тренувань, роби акцент на йогу, дихальні практики та догляд за тілом."
            : (currentLang === 'it' ? "🌿 L'energia cala gradualmente. Riduci l'intensità e concentrati su yoga, respirazione e cura personale." : "🌿 Energy is winding down. Reduce workout intensity, focus on yoga, breathing practices, and self-care.");
    }
    
    document.getElementById('cycle-phase-name').innerText = phaseName;
    document.getElementById('cycle-workout-rec').innerText = recommendation;
}