"use client";

import {
  Apple,
  ArrowRight,
  CalendarDays,
  ChefHat,
  Check,
  CircleCheckBig,
  ChevronRight,
  Clock3,
  Flame,
  Leaf,
  ListChecks,
  MoonStar,
  PackageCheck,
  RotateCcw,
  ShoppingBasket,
  Sparkles,
  Sunrise,
  Timer,
  Utensils,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type MealKind = "breakfast" | "lunch" | "snack" | "dinner";

type Meal = {
  id: string;
  kind: MealKind;
  label: string;
  title: string;
  kcal: number;
  protein: number;
  time: number;
  image?: string;
  ingredients: string[];
  steps: string[];
  storage: string;
};

type DayPlan = {
  short: string;
  name: string;
  date: string;
  macros: { protein: number; fat: number; carbs: number; fiber: number };
  meals: Meal[];
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetPath = (path: string) => `${basePath}${path}`;

const recipes: Record<string, Meal> = {
  oatmeal: {
    id: "oatmeal",
    kind: "breakfast",
    label: "Завтрак",
    title: "Овсянка с ягодами",
    kcal: 365,
    protein: 17,
    time: 10,
    image: assetPath("/images/oatmeal-berries.webp"),
    ingredients: [
      "Овсяные хлопья — 50 г",
      "Молоко 1,5% — 150 мл",
      "Греческий йогурт — 80 г",
      "Ягоды — 100 г",
      "Миндальные лепестки — 8 г",
    ],
    steps: [
      "Сварить хлопья на молоке 5–7 минут.",
      "Переложить в миску и добавить йогурт.",
      "Сверху выложить ягоды и миндаль.",
    ],
    storage: "Основу можно приготовить вечером и хранить до 2 суток.",
  },
  chicken: {
    id: "chicken",
    kind: "lunch",
    label: "Обед",
    title: "Курица с гречкой",
    kcal: 560,
    protein: 48,
    time: 25,
    image: assetPath("/images/chicken-buckwheat.webp"),
    ingredients: [
      "Куриная грудка — 170 г",
      "Гречка сухая — 70 г",
      "Брокколи — 120 г",
      "Морковь — 80 г",
      "Оливковое масло — 7 г",
    ],
    steps: [
      "Отварить гречку до готовности.",
      "Курицу приправить и обжарить на сухой сковороде.",
      "Овощи запечь или приготовить на пару, собрать порцию.",
    ],
    storage: "Готовая порция хранится в контейнере до 3 суток.",
  },
  cottageCream: {
    id: "cottageCream",
    kind: "snack",
    label: "Перекус",
    title: "Творожный крем",
    kcal: 220,
    protein: 24,
    time: 5,
    image: assetPath("/images/cottage-cream.webp"),
    ingredients: [
      "Творог 2–5% — 150 г",
      "Натуральный йогурт — 50 г",
      "Ягоды — 70 г",
      "Мёд — 5 г",
    ],
    steps: [
      "Пробить творог с йогуртом до кремовой текстуры.",
      "Добавить ягоды и немного мёда.",
    ],
    storage: "Можно собрать заранее и хранить до следующего дня.",
  },
  lentilSoup: {
    id: "lentilSoup",
    kind: "dinner",
    label: "Ужин",
    title: "Чечевичный суп",
    kcal: 335,
    protein: 19,
    time: 30,
    ingredients: [
      "Красная чечевица — 65 г",
      "Томаты в собственном соку — 150 г",
      "Морковь — 70 г",
      "Лук — 50 г",
      "Цельнозерновой хлеб — 35 г",
    ],
    steps: [
      "Пассеровать лук и морковь с ложкой воды.",
      "Добавить чечевицу, томаты и 400 мл воды.",
      "Варить 20 минут, подать с хлебом.",
    ],
    storage: "Суп хорошо хранится 3 дня и подходит для заморозки.",
  },
  omelet: {
    id: "omelet",
    kind: "breakfast",
    label: "Завтрак",
    title: "Омлет со шпинатом",
    kcal: 370,
    protein: 27,
    time: 12,
    ingredients: [
      "Яйца — 2 шт.",
      "Яичные белки — 100 г",
      "Шпинат — 60 г",
      "Цельнозерновой хлеб — 50 г",
      "Томаты — 100 г",
    ],
    steps: [
      "Смешать яйца с белками и щепоткой соли.",
      "Добавить шпинат и готовить под крышкой 6–7 минут.",
      "Подать с хлебом и томатами.",
    ],
    storage: "Лучше готовить перед едой; активного времени около 5 минут.",
  },
  turkey: {
    id: "turkey",
    kind: "lunch",
    label: "Обед",
    title: "Тефтели из индейки",
    kcal: 520,
    protein: 44,
    time: 35,
    ingredients: [
      "Фарш индейки — 170 г",
      "Кускус сухой — 65 г",
      "Кабачок — 150 г",
      "Протёртые томаты — 120 г",
      "Оливковое масло — 5 г",
    ],
    steps: [
      "Сформировать тефтели и выложить в форму.",
      "Залить томатами и запекать 25 минут при 190 °C.",
      "Залить кускус кипятком и подать с кабачком.",
    ],
    storage: "Тефтели можно приготовить на 3 порции и хранить 3 дня.",
  },
  appleSnack: {
    id: "appleSnack",
    kind: "snack",
    label: "Перекус",
    title: "Яблоко с орехами",
    kcal: 190,
    protein: 5,
    time: 2,
    ingredients: ["Яблоко — 180 г", "Миндаль — 20 г"],
    steps: ["Нарезать яблоко и подать с порцией орехов."],
    storage: "Орехи удобно заранее разложить по небольшим контейнерам.",
  },
  tunaSalad: {
    id: "tunaSalad",
    kind: "dinner",
    label: "Ужин",
    title: "Салат с тунцом",
    kcal: 400,
    protein: 39,
    time: 12,
    ingredients: [
      "Тунец в собственном соку — 120 г",
      "Картофель отварной — 150 г",
      "Огурец — 120 г",
      "Томаты — 120 г",
      "Йогуртовая заправка — 50 г",
    ],
    steps: [
      "Нарезать картофель и овощи.",
      "Добавить тунец и заправить йогуртовым соусом.",
    ],
    storage: "Компоненты хранятся 2 дня; смешивать лучше перед едой.",
  },
  casserole: {
    id: "casserole",
    kind: "breakfast",
    label: "Завтрак",
    title: "Творожная запеканка",
    kcal: 380,
    protein: 32,
    time: 40,
    ingredients: [
      "Творог 5% — 180 г",
      "Яйцо — 1 шт.",
      "Рисовая мука — 20 г",
      "Йогурт — 50 г",
      "Ягоды — 80 г",
    ],
    steps: [
      "Смешать творог, яйцо и муку.",
      "Выложить в небольшую форму и запекать 30 минут при 180 °C.",
      "Подать с йогуртом и ягодами.",
    ],
    storage: "Запеканка хранится 3 дня; удобно сразу сделать 3 порции.",
  },
  yogurtSnack: {
    id: "yogurtSnack",
    kind: "snack",
    label: "Перекус",
    title: "Йогурт с семенами",
    kcal: 215,
    protein: 18,
    time: 3,
    ingredients: [
      "Греческий йогурт — 180 г",
      "Семена чиа — 10 г",
      "Груша — 100 г",
    ],
    steps: ["Смешать йогурт с чиа и добавить нарезанную грушу."],
    storage: "Можно приготовить с вечера и хранить до 24 часов.",
  },
  salmon: {
    id: "salmon",
    kind: "dinner",
    label: "Ужин",
    title: "Лосось с картофелем",
    kcal: 550,
    protein: 38,
    time: 30,
    ingredients: [
      "Филе лосося — 150 г",
      "Картофель — 220 г",
      "Стручковая фасоль — 150 г",
      "Лимон — 20 г",
      "Оливковое масло — 5 г",
    ],
    steps: [
      "Нарезать картофель и запекать 15 минут при 200 °C.",
      "Добавить лосось и фасоль, запекать ещё 12–15 минут.",
      "Сбрызнуть лимоном.",
    ],
    storage: "Готовое блюдо хранится до 2 суток.",
  },
  pumpkinSoup: {
    id: "pumpkinSoup",
    kind: "dinner",
    label: "Ужин",
    title: "Тыквенный суп с нутом",
    kcal: 335,
    protein: 16,
    time: 30,
    ingredients: [
      "Тыква — 300 г",
      "Нут готовый — 100 г",
      "Морковь — 70 г",
      "Кокосовое молоко light — 50 мл",
      "Тыквенные семечки — 8 г",
    ],
    steps: [
      "Тыкву и морковь отварить до мягкости.",
      "Добавить половину нута и пробить блендером.",
      "Вмешать молоко, подать с оставшимся нутом и семечками.",
    ],
    storage: "Готовится большой кастрюлей и хранится до 3 суток.",
  },
};

const days: DayPlan[] = [
  {
    short: "Пн",
    name: "Понедельник",
    date: "27 июля",
    macros: { protein: 108, fat: 45, carbs: 158, fiber: 27 },
    meals: [recipes.oatmeal, recipes.chicken, recipes.cottageCream, recipes.lentilSoup],
  },
  {
    short: "Вт",
    name: "Вторник",
    date: "28 июля",
    macros: { protein: 115, fat: 47, carbs: 151, fiber: 25 },
    meals: [recipes.omelet, recipes.turkey, recipes.appleSnack, recipes.tunaSalad],
  },
  {
    short: "Ср",
    name: "Среда",
    date: "29 июля",
    macros: { protein: 107, fat: 49, carbs: 154, fiber: 24 },
    meals: [recipes.casserole, recipes.lentilSoup, recipes.yogurtSnack, recipes.salmon],
  },
  {
    short: "Чт",
    name: "Четверг",
    date: "30 июля",
    macros: { protein: 105, fat: 46, carbs: 160, fiber: 28 },
    meals: [recipes.oatmeal, recipes.chicken, recipes.cottageCream, recipes.pumpkinSoup],
  },
  {
    short: "Пт",
    name: "Пятница",
    date: "31 июля",
    macros: { protein: 115, fat: 47, carbs: 151, fiber: 25 },
    meals: [recipes.omelet, recipes.turkey, recipes.appleSnack, recipes.tunaSalad],
  },
  {
    short: "Сб",
    name: "Суббота",
    date: "1 августа",
    macros: { protein: 107, fat: 49, carbs: 154, fiber: 24 },
    meals: [recipes.casserole, recipes.salmon, recipes.yogurtSnack, recipes.lentilSoup],
  },
  {
    short: "Вс",
    name: "Воскресенье",
    date: "2 августа",
    macros: { protein: 108, fat: 45, carbs: 158, fiber: 27 },
    meals: [recipes.oatmeal, recipes.chicken, recipes.cottageCream, recipes.pumpkinSoup],
  },
];

const alternatives: Record<string, Meal> = {
  oatmeal: {
    ...recipes.casserole,
    id: "alt-oatmeal",
    title: "Запеканка с ягодами",
    kcal: 365,
  },
  chicken: {
    ...recipes.turkey,
    id: "alt-chicken",
    title: "Тефтели с кускусом",
    kcal: 560,
  },
  cottageCream: {
    ...recipes.yogurtSnack,
    id: "alt-cottage",
    title: "Йогурт с грушей и чиа",
    kcal: 220,
  },
  lentilSoup: {
    ...recipes.pumpkinSoup,
    id: "alt-lentil",
    kcal: 335,
  },
  omelet: {
    ...recipes.casserole,
    id: "alt-omelet",
    title: "Ленивая творожная запеканка",
    kcal: 370,
  },
  turkey: {
    ...recipes.chicken,
    id: "alt-turkey",
    title: "Курица с гречкой и брокколи",
    kcal: 520,
  },
  appleSnack: {
    ...recipes.cottageCream,
    id: "alt-apple",
    title: "Творожный крем с ягодами",
    kcal: 190,
  },
  tunaSalad: {
    ...recipes.pumpkinSoup,
    id: "alt-tuna",
    title: "Тыквенный суп с нутом",
    kcal: 400,
  },
  casserole: {
    ...recipes.oatmeal,
    id: "alt-casserole",
    title: "Ночная овсянка с ягодами",
    kcal: 380,
  },
  yogurtSnack: {
    ...recipes.cottageCream,
    id: "alt-yogurt",
    title: "Творожный крем",
    kcal: 215,
  },
  salmon: {
    ...recipes.chicken,
    id: "alt-salmon",
    kind: "dinner",
    label: "Ужин",
    title: "Курица с овощами",
    kcal: 550,
  },
  pumpkinSoup: {
    ...recipes.lentilSoup,
    id: "alt-pumpkin",
    kcal: 335,
  },
};

const shoppingGroups = [
  {
    title: "Белок и молочные продукты",
    icon: PackageCheck,
    items: [
      ["chicken", "Куриная грудка", "700 г"],
      ["turkey", "Фарш индейки", "400 г"],
      ["fish", "Лосось", "300 г"],
      ["tuna", "Тунец в собственном соку", "2 банки"],
      ["eggs", "Яйца", "8 шт."],
      ["cottage", "Творог 2–5%", "1,2 кг"],
      ["yogurt", "Натуральный йогурт", "1,4 кг"],
      ["milk", "Молоко 1,5%", "1 л"],
    ],
  },
  {
    title: "Овощи, фрукты и зелень",
    icon: Leaf,
    items: [
      ["tomatoes", "Томаты", "1,2 кг"],
      ["cucumber", "Огурцы", "500 г"],
      ["carrot", "Морковь", "1 кг"],
      ["broccoli", "Брокколи", "500 г"],
      ["potato", "Картофель", "1,2 кг"],
      ["pumpkin", "Тыква", "600 г"],
      ["spinach", "Шпинат", "200 г"],
      ["fruit", "Яблоки и груши", "7 шт."],
      ["berries", "Ягоды свежие или замороженные", "700 г"],
    ],
  },
  {
    title: "Крупы и всё остальное",
    icon: ShoppingBasket,
    items: [
      ["oats", "Овсяные хлопья", "350 г"],
      ["buckwheat", "Гречка", "250 г"],
      ["couscous", "Кускус", "150 г"],
      ["lentils", "Красная чечевица", "250 г"],
      ["chickpeas", "Нут готовый", "2 банки"],
      ["bread", "Цельнозерновой хлеб", "1 упаковка"],
      ["nuts", "Миндаль", "120 г"],
      ["chia", "Семена чиа", "50 г"],
      ["oil", "Оливковое масло", "1 бутылка"],
    ],
  },
];

const kindIcons = {
  breakfast: Sunrise,
  lunch: Utensils,
  snack: Apple,
  dinner: MoonStar,
};

export default function Home() {
  const [dayIndex, setDayIndex] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [swaps, setSwaps] = useState<Record<string, boolean>>({});
  const [recipeFilter, setRecipeFilter] = useState<"all" | "quick" | "batch" | "breakfast">("all");
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const activeDay = days[dayIndex];
  const activeMeals = useMemo(
    () =>
      activeDay.meals.map((meal, index) =>
        swaps[`${dayIndex}-${index}`] ? alternatives[meal.id] : meal,
      ),
    [activeDay, dayIndex, swaps],
  );
  const totalKcal = useMemo(
    () => activeMeals.reduce((total, meal) => total + meal.kcal, 0),
    [activeMeals],
  );
  const recipeCards = useMemo(() => {
    const all = Object.values(recipes);
    if (recipeFilter === "quick") return all.filter((recipe) => recipe.time <= 12);
    if (recipeFilter === "batch") return all.filter((recipe) => recipe.storage.includes("3"));
    if (recipeFilter === "breakfast") return all.filter((recipe) => recipe.kind === "breakfast");
    return all;
  }, [recipeFilter]);
  const totalShoppingItems = shoppingGroups.reduce((sum, group) => sum + group.items.length, 0);
  const shoppingProgress = Math.round((checkedItems.length / totalShoppingItems) * 100);

  useEffect(() => {
    if (!selectedMeal) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedMeal(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedMeal]);

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const openMeal = (meal: Meal, context: string | null = null) => {
    setSelectedMeal(meal);
    setSelectedContext(context);
  };

  const replaceSelectedMeal = () => {
    if (!selectedContext) return;
    setSwaps((current) => ({ ...current, [selectedContext]: !current[selectedContext] }));
    setSelectedMeal(null);
    setSelectedContext(null);
  };

  const toggleShoppingItem = (id: string) => {
    setCheckedItems((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ПростоПП — на главную">
          ПростоПП <Leaf aria-hidden="true" />
        </a>
        <nav aria-label="Основная навигация">
          <a className="active" href="#menu">Меню недели</a>
          <a href="#recipes">Рецепты</a>
          <a href="#shopping">Продукты</a>
        </nav>
        <button className="header-action" type="button" onClick={scrollToMenu}>
          <CalendarDays size={19} />
          Моя неделя
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-shape hero-shape-one" />
        <div className="hero-shape hero-shape-two" />
        <div className="hero-copy">
          <span className="eyebrow"><Check size={16} /> Меню уже рассчитано</span>
          <h1>Вкусная неделя без лишней готовки</h1>
          <p className="hero-subtitle">
            1450–1500 ккал <span>·</span> 2 готовки в неделю <span>·</span> 1 порция
          </p>
          <p className="hero-description">
            Простые продукты, понятные рецепты и готовый план — чтобы питаться
            сбалансированно и не стоять у плиты каждый день.
          </p>
          <div className="hero-actions">
            <button className="button primary" type="button" onClick={scrollToMenu}>
              Собрать меню <ArrowRight size={20} />
            </button>
            <button className="button secondary" type="button" onClick={scrollToMenu}>
              Посмотреть эту неделю
            </button>
          </div>
          <div className="trust-row">
            <span><Clock3 size={17} /> до 35 минут</span>
            <span><ShoppingBasket size={17} /> один список покупок</span>
            <span><RotateCcw size={17} /> блюда можно менять</span>
          </div>
        </div>

        <section className="planner-card" id="menu" aria-labelledby="planner-title">
          <div className="day-tabs" role="tablist" aria-label="Дни недели">
            {days.map((day, index) => (
              <button
                aria-selected={index === dayIndex}
                className={index === dayIndex ? "selected" : ""}
                key={day.short}
                onClick={() => setDayIndex(index)}
                role="tab"
                type="button"
              >
                {day.short}
                {index === dayIndex && <span />}
              </button>
            ))}
          </div>

          <div className="planner-heading">
            <div>
              <span>{activeDay.date}</span>
              <h2 id="planner-title">{activeDay.name}</h2>
            </div>
            <div className="calorie-total">
              <Flame size={24} />
              <strong>{totalKcal}</strong> ккал
            </div>
          </div>

          <div className="meal-list">
            {activeMeals.map((meal, mealIndex) => {
              const KindIcon = kindIcons[meal.kind];
              const context = `${dayIndex}-${mealIndex}`;
              return (
                <button
                  className="meal-row"
                  key={meal.id}
                  onClick={() => openMeal(meal, context)}
                  type="button"
                >
                  {meal.image ? (
                    <img src={meal.image} alt="" />
                  ) : (
                    <span className={`meal-placeholder ${meal.kind}`}>
                      <KindIcon size={22} />
                    </span>
                  )}
                  <span className={`meal-kind ${meal.kind}`}><KindIcon size={19} /></span>
                  <span className="meal-copy">
                    <small>
                      {meal.label} · {meal.time} мин
                      {swaps[context] && <> <em>заменено</em></>}
                    </small>
                    <strong>{meal.title}</strong>
                  </span>
                  <span className="meal-kcal">{meal.kcal} ккал</span>
                  <ChevronRight className="meal-chevron" size={22} />
                </button>
              );
            })}
          </div>

          <div className="macro-strip" aria-label="Пищевая ценность меню">
            <Macro label="Белки" value={`${activeDay.macros.protein} г`} tone="green" />
            <Macro label="Жиры" value={`${activeDay.macros.fat} г`} tone="orange" />
            <Macro label="Углеводы" value={`${activeDay.macros.carbs} г`} tone="yellow" />
            <Macro label="Клетчатка" value={`${activeDay.macros.fiber} г`} tone="mint" />
          </div>
        </section>
      </section>

      <section className="quick-benefits" aria-label="Преимущества плана">
        <article>
          <span>01</span>
          <div><strong>Готовим в воскресенье</strong><p>Основы для первых трёх дней</p></div>
        </article>
        <article>
          <span>02</span>
          <div><strong>Обновляем в среду</strong><p>Свежая партия до выходных</p></div>
        </article>
        <article>
          <span>03</span>
          <div><strong>Собираем за 5 минут</strong><p>В будни только разогреть и дополнить</p></div>
        </article>
      </section>

      <section className="content-section prep-section" id="prep">
        <div className="section-heading">
          <div>
            <span className="section-kicker"><Timer size={16} /> Две готовки</span>
            <h2>Вся неделя — за два подхода</h2>
          </div>
          <p>
            В будни остаётся только собрать порцию, разогреть основу или добавить
            свежие овощи. Контейнеры подписываем по дням.
          </p>
        </div>

        <div className="prep-grid">
          <article className="prep-card prep-card-main">
            <div className="prep-card-heading">
              <span className="prep-day">Воскресенье</span>
              <span className="prep-time"><Clock3 size={16} /> 1 ч 20 мин</span>
            </div>
            <h3>Основа на понедельник–среду</h3>
            <div className="prep-steps">
              <PrepStep number="1" title="Поставить крупы" text="Гречка и кускус готовятся параллельно." />
              <PrepStep number="2" title="Запечь одним противнем" text="Курица, морковь, брокколи и кабачок." />
              <PrepStep number="3" title="Сварить большую кастрюлю" text="Чечевичный суп — сразу на три ужина." />
              <PrepStep number="4" title="Собрать завтраки" text="Запеканка и две банки ночной овсянки." />
            </div>
          </article>

          <article className="prep-card">
            <div className="prep-card-heading">
              <span className="prep-day mint">Среда</span>
              <span className="prep-time"><Clock3 size={16} /> 55 мин</span>
            </div>
            <h3>Свежая партия до воскресенья</h3>
            <ul className="check-list">
              <li><CircleCheckBig size={19} /> Запечь тефтели из индейки</li>
              <li><CircleCheckBig size={19} /> Сварить тыквенный суп</li>
              <li><CircleCheckBig size={19} /> Подготовить картофель и фасоль</li>
              <li><CircleCheckBig size={19} /> Разложить перекусы по порциям</li>
            </ul>
            <div className="fresh-note">
              <Sparkles size={20} />
              <span><strong>Свежим готовим только рыбу.</strong> Лосось отправляется в духовку на 15 минут в день ужина.</span>
            </div>
          </article>
        </div>
      </section>

      <section className="content-section recipes-section" id="recipes">
        <div className="section-heading compact">
          <div>
            <span className="section-kicker"><ChefHat size={16} /> База рецептов</span>
            <h2>Просто приготовить, легко повторить</h2>
          </div>
          <div className="filter-row" aria-label="Фильтр рецептов">
            {[
              ["all", "Все"],
              ["quick", "До 15 минут"],
              ["batch", "На несколько дней"],
              ["breakfast", "Завтраки"],
            ].map(([value, label]) => (
              <button
                aria-pressed={recipeFilter === value}
                className={recipeFilter === value ? "active" : ""}
                key={value}
                onClick={() => setRecipeFilter(value as typeof recipeFilter)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="recipe-grid">
          {recipeCards.map((meal) => {
            const KindIcon = kindIcons[meal.kind];
            return (
              <button className="recipe-card" key={meal.id} onClick={() => openMeal(meal)} type="button">
                <span className="recipe-visual">
                  {meal.image ? (
                    <img src={meal.image} alt="" />
                  ) : (
                    <span className={`recipe-placeholder ${meal.kind}`}><KindIcon size={30} /></span>
                  )}
                  <span className="recipe-time"><Clock3 size={14} /> {meal.time} мин</span>
                </span>
                <span className="recipe-card-body">
                  <small>{meal.label}</small>
                  <strong>{meal.title}</strong>
                  <span><b>{meal.kcal} ккал</b><i /> {meal.protein} г белка</span>
                </span>
                <ChevronRight size={19} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="shopping-section" id="shopping">
        <div className="shopping-inner">
          <div className="section-heading light">
            <div>
              <span className="section-kicker"><ListChecks size={16} /> Покупки на 7 дней</span>
              <h2>Один список — ничего лишнего</h2>
            </div>
            <div className="shopping-progress">
              <div>
                <strong>{checkedItems.length} из {totalShoppingItems}</strong>
                <span>уже в корзине</span>
              </div>
              <b>{shoppingProgress}%</b>
              <span className="progress-track"><i style={{ width: `${shoppingProgress}%` }} /></span>
            </div>
          </div>

          <div className="shopping-grid">
            {shoppingGroups.map((group) => {
              const GroupIcon = group.icon;
              return (
                <article className="shopping-card" key={group.title}>
                  <h3><span><GroupIcon size={19} /></span>{group.title}</h3>
                  <div className="shopping-list">
                    {group.items.map(([id, name, amount]) => {
                      const checked = checkedItems.includes(id);
                      return (
                        <label className={checked ? "checked" : ""} key={id}>
                          <input
                            checked={checked}
                            onChange={() => toggleShoppingItem(id)}
                            type="checkbox"
                          />
                          <span className="custom-check"><Check size={14} /></span>
                          <span>{name}</span>
                          <b>{amount}</b>
                        </label>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
          <p className="shopping-note">
            <ShoppingBasket size={18} />
            Количество рассчитано на одну взрослую порцию. Базовые специи, соль и вода в список не включены.
          </p>
        </div>
      </section>

      <section className="closing-section">
        <div>
          <span className="section-kicker"><Leaf size={16} /> Спокойный режим</span>
          <h2>План есть. Остаётся только начать.</h2>
          <p>Откройте понедельник, приготовьте первую партию и отмечайте продукты прямо во время покупки.</p>
        </div>
        <button className="button primary" type="button" onClick={scrollToMenu}>
          Вернуться к меню <ArrowRight size={20} />
        </button>
      </section>

      <footer>
        <a className="brand" href="#top">ПростоПП <Leaf aria-hidden="true" /></a>
        <p>Калорийность рассчитана ориентировочно и зависит от конкретных продуктов.</p>
        <span>Меню на 1450–1500 ккал · 1 порция</span>
      </footer>

      {selectedMeal && (
        <div className="modal-backdrop" onMouseDown={() => setSelectedMeal(null)}>
          <article
            aria-labelledby="recipe-title"
            aria-modal="true"
            className="recipe-modal"
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Закрыть рецепт"
              className="modal-close"
              onClick={() => setSelectedMeal(null)}
              type="button"
            >
              <X size={22} />
            </button>
            {selectedMeal.image && <img className="modal-image" src={selectedMeal.image} alt="" />}
            <div className="modal-content">
              <span className="recipe-label">{selectedMeal.label}</span>
              <h2 id="recipe-title">{selectedMeal.title}</h2>
              <div className="recipe-stats">
                <span><Flame size={17} /> {selectedMeal.kcal} ккал</span>
                <span><Clock3 size={17} /> {selectedMeal.time} минут</span>
                <span><Leaf size={17} /> {selectedMeal.protein} г белка</span>
              </div>
              <div className="recipe-columns">
                <div>
                  <h3>На одну порцию</h3>
                  <ul>
                    {selectedMeal.ingredients.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3>Как приготовить</h3>
                  <ol>
                    {selectedMeal.steps.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                </div>
              </div>
              <p className="storage-note"><Clock3 size={18} /> {selectedMeal.storage}</p>
              {selectedContext && (
                <button className="replace-button" onClick={replaceSelectedMeal} type="button">
                  <RotateCcw size={18} />
                  {swaps[selectedContext] ? "Вернуть исходное блюдо" : "Заменить на равноценное"}
                </button>
              )}
            </div>
          </article>
        </div>
      )}
    </main>
  );
}

function PrepStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="prep-step">
      <span>{number}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function Macro({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "green" | "orange" | "yellow" | "mint";
}) {
  return (
    <div className="macro">
      <small>{label}</small>
      <strong><i className={tone} />{value}</strong>
    </div>
  );
}
