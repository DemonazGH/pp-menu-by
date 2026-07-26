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
  fat: number;
  carbs: number;
  fiber: number;
  time: number;
  image?: string;
  brand?: string;
  ingredients: string[];
  steps: string[];
  storage: string;
};

type DayPlan = {
  short: string;
  name: string;
  date: string;
  meals: Meal[];
};

const recipes: Record<string, Meal> = {
  chiaBowl: {
    id: "chiaBowl",
    kind: "breakfast",
    label: "Завтрак",
    title: "Чиа-йогурт с малиной и голубикой",
    kcal: 253,
    protein: 13.1,
    fat: 9.7,
    carbs: 26.2,
    fiber: 10.5,
    time: 5,
    brand: "TEOS + семена чиа",
    image: "/images/oatmeal-berries.webp",
    ingredients: [
      "Семена чиа — 20 г",
      "Йогурт TEOS натуральный 2% — 150 г",
      "Малина — 50 г",
      "Голубика — 50 г",
    ],
    steps: [
      "Смешать йогурт с семенами чиа.",
      "Оставить минимум на 15 минут, а удобнее — на ночь в холодильнике.",
      "Перед подачей добавить малину и голубику.",
    ],
    storage: "Можно собрать вечером; хранить в закрытой банке до 24 часов.",
  },
  hamOmelet: {
    id: "hamOmelet",
    kind: "breakfast",
    label: "Завтрак",
    title: "Омлет с ветчиной Natura Fit",
    kcal: 385,
    protein: 44,
    fat: 16,
    carbs: 18,
    fiber: 5,
    time: 12,
    brand: "Natura Fit + SVEŽA",
    ingredients: [
      "Ветчина Natura Fit — 100 г",
      "Яйцо — 1 шт.",
      "Яичные белки — 120 г",
      "Брынза SVEŽA — 20 г",
      "Шпинат и томаты — 180 г",
      "Цельнозерновой хлеб — 40 г",
    ],
    steps: [
      "Нарезать ветчину и слегка прогреть на сухой сковороде.",
      "Влить яйцо с белками, добавить шпинат и готовить под крышкой.",
      "Посыпать брынзой и подать с томатами и хлебом.",
    ],
    storage: "Лучше готовить свежим; овощи и ветчину можно нарезать вечером.",
  },
  casserole: {
    id: "casserole",
    kind: "breakfast",
    label: "Завтрак",
    title: "Творожная запеканка с ягодами",
    kcal: 390,
    protein: 32,
    fat: 12,
    carbs: 40,
    fiber: 5,
    time: 40,
    image: "/images/cottage-cream.webp",
    ingredients: [
      "Творог 5% — 180 г",
      "Яйцо — 1 шт.",
      "Рисовая мука — 20 г",
      "Натуральный йогурт — 50 г",
      "Ягоды — 100 г",
    ],
    steps: [
      "Смешать творог, яйцо и рисовую муку.",
      "Выложить в небольшую форму и запекать 30 минут при 180 °C.",
      "Подать с йогуртом и ягодами.",
    ],
    storage: "Удобно сразу сделать три порции; хранить до 3 суток.",
  },
  sausageBreakfast: {
    id: "sausageBreakfast",
    kind: "breakfast",
    label: "Завтрак",
    title: "Сосиски Natura Active с яйцом",
    kcal: 390,
    protein: 34,
    fat: 20,
    carbs: 19,
    fiber: 5,
    time: 10,
    brand: "Natura Active",
    ingredients: [
      "Сосиски Natura Active — 100 г",
      "Яйцо — 1 шт.",
      "Яичные белки — 100 г",
      "Огурец и томаты — 250 г",
      "Ржаной хлеб — 40 г",
    ],
    steps: [
      "Отварить или быстро прогреть сосиски.",
      "Приготовить яйцо с белками на антипригарной сковороде.",
      "Подать со свежими овощами и хлебом.",
    ],
    storage: "Порция сосисок — 100 г, а не вся упаковка.",
  },
  hamSandwich: {
    id: "hamSandwich",
    kind: "breakfast",
    label: "Завтрак",
    title: "Сэндвич с ветчиной и мягким творогом",
    kcal: 380,
    protein: 37,
    fat: 14,
    carbs: 28,
    fiber: 6,
    time: 7,
    brand: "Natura Fit + Савушкин",
    ingredients: [
      "Ветчина Natura Fit — 120 г",
      "Творог мягкий Савушкин 0,1% — 125 г",
      "Хлеб цельнозерновой — 70 г",
      "Огурец, томаты и салат — 180 г",
      "Горчица — 5 г",
    ],
    steps: [
      "Подсушить хлеб и намазать мягким творогом.",
      "Добавить ветчину, овощи, салат и немного горчицы.",
      "Собрать сэндвич и разрезать пополам.",
    ],
    storage: "Начинку можно собрать вечером, хлеб добавить перед едой.",
  },
  chicken: {
    id: "chicken",
    kind: "lunch",
    label: "Обед",
    title: "Курица с гречкой и брокколи",
    kcal: 555,
    protein: 50,
    fat: 14,
    carbs: 56,
    fiber: 9,
    time: 25,
    image: "/images/chicken-buckwheat.webp",
    ingredients: [
      "Куриная грудка — 180 г",
      "Гречка сухая — 70 г",
      "Брокколи — 150 г",
      "Морковь — 80 г",
      "Оливковое масло — 8 г",
    ],
    steps: [
      "Отварить гречку до готовности.",
      "Курицу приправить и запечь или обжарить на сухой сковороде.",
      "Овощи приготовить на пару, собрать порцию и добавить масло.",
    ],
    storage: "Сразу приготовить три порции; хранить до 3 суток.",
  },
  turkey: {
    id: "turkey",
    kind: "lunch",
    label: "Обед",
    title: "Тефтели из индейки с кускусом",
    kcal: 520,
    protein: 46,
    fat: 14,
    carbs: 50,
    fiber: 8,
    time: 35,
    ingredients: [
      "Фарш индейки — 180 г",
      "Кускус сухой — 60 г",
      "Кабачок — 150 г",
      "Протёртые томаты — 120 г",
      "Оливковое масло — 6 г",
    ],
    steps: [
      "Сформировать тефтели и выложить в форму.",
      "Залить томатами и запекать 25 минут при 190 °C.",
      "Залить кускус кипятком и подать с кабачком.",
    ],
    storage: "Тефтели можно приготовить на 3 порции и хранить 3 дня.",
  },
  studenBuckwheat: {
    id: "studenBuckwheat",
    kind: "lunch",
    label: "Обед",
    title: "Студень с гречкой и овощами",
    kcal: 385,
    protein: 31,
    fat: 11,
    carbs: 43,
    fiber: 9,
    time: 12,
    brand: "Брестский мясокомбинат",
    ingredients: [
      "Студень «Праздничный» из мяса птицы — 300 г",
      "Гречка сухая — 45 г",
      "Огурец и томаты — 250 г",
      "Зелень и горчица — по вкусу",
    ],
    steps: [
      "Заранее отварить гречку.",
      "Выложить студень, гречку и свежие овощи на тарелку.",
      "Добавить зелень и немного горчицы.",
    ],
    storage: "Гречку приготовить заранее; студень открыть непосредственно перед едой.",
  },
  carpaccioWrap: {
    id: "carpaccioWrap",
    kind: "lunch",
    label: "Обед",
    title: "Ролл с куриным карпаччо",
    kcal: 510,
    protein: 50,
    fat: 14,
    carbs: 49,
    fiber: 8,
    time: 8,
    brand: "Дзержинка",
    ingredients: [
      "Карпаччо из курицы «Дзержинка» — 120 г",
      "Тортилья цельнозерновая — 70 г",
      "Йогуртовый соус — 60 г",
      "Томаты, огурец и салат — 220 г",
      "Авокадо — 35 г",
    ],
    steps: [
      "Смазать тортилью йогуртовым соусом.",
      "Разложить карпаччо, овощи, салат и авокадо.",
      "Плотно свернуть и разрезать пополам.",
    ],
    storage: "Собирать перед едой; начинку можно взять в отдельном контейнере.",
  },
  salmon: {
    id: "salmon",
    kind: "lunch",
    label: "Обед",
    title: "Лосось с картофелем и фасолью",
    kcal: 520,
    protein: 38,
    fat: 18,
    carbs: 51,
    fiber: 8,
    time: 30,
    ingredients: [
      "Филе лосося — 150 г",
      "Картофель — 220 г",
      "Стручковая фасоль — 180 г",
      "Лимон — 20 г",
      "Оливковое масло — 4 г",
    ],
    steps: [
      "Нарезать картофель и запекать 15 минут при 200 °C.",
      "Добавить лосось и фасоль, запекать ещё 12–15 минут.",
      "Сбрызнуть лимоном.",
    ],
    storage: "Рыбу лучше готовить свежей; картофель можно запечь заранее.",
  },
  softCottage: {
    id: "softCottage",
    kind: "snack",
    label: "Перекус",
    title: "Мягкий творог с ягодами и миндалём",
    kcal: 190,
    protein: 16,
    fat: 8,
    carbs: 17,
    fiber: 4,
    time: 3,
    brand: "Савушкин 0,1%",
    image: "/images/cottage-cream.webp",
    ingredients: [
      "Творог мягкий Савушкин 0,1% — 125 г",
      "Ягоды — 100 г",
      "Миндаль — 14 г",
      "Корица — по вкусу",
    ],
    steps: ["Выложить творог в миску, добавить ягоды, миндаль и корицу."],
    storage: "Собрать непосредственно перед едой или взять компоненты отдельно.",
  },
  appleSnack: {
    id: "appleSnack",
    kind: "snack",
    label: "Перекус",
    title: "Яблоко с миндалём",
    kcal: 205,
    protein: 5,
    fat: 12,
    carbs: 22,
    fiber: 5,
    time: 2,
    ingredients: ["Яблоко — 180 г", "Миндаль — 22 г"],
    steps: ["Нарезать яблоко и подать с порцией миндаля."],
    storage: "Орехи удобно заранее разложить по небольшим контейнерам.",
  },
  teosSnack: {
    id: "teosSnack",
    kind: "snack",
    label: "Перекус",
    title: "TEOS с грушей и чиа",
    kcal: 240,
    protein: 17,
    fat: 8,
    carbs: 27,
    fiber: 6,
    time: 3,
    brand: "TEOS",
    ingredients: [
      "Йогурт TEOS натуральный 2% — 200 г",
      "Семена чиа — 10 г",
      "Груша — 120 г",
    ],
    steps: ["Смешать йогурт с чиа и добавить нарезанную грушу."],
    storage: "Можно приготовить с вечера и хранить до 24 часов.",
  },
  tunaSalad: {
    id: "tunaSalad",
    kind: "dinner",
    label: "Ужин",
    title: "Большой салат с тунцом",
    kcal: 482,
    protein: 44,
    fat: 20,
    carbs: 31,
    fiber: 7,
    time: 12,
    ingredients: [
      "Тунец в собственном соку — 150 г",
      "Картофель отварной — 130 г",
      "Огурец и томаты — 250 г",
      "Авокадо — 60 г",
      "Оливковое масло — 6 г",
    ],
    steps: [
      "Нарезать картофель и овощи.",
      "Добавить тунец и авокадо.",
      "Заправить маслом, лимонным соком и специями.",
    ],
    storage: "Компоненты хранятся 2 дня; смешивать лучше перед едой.",
  },
  salmonLight: {
    id: "salmonLight",
    kind: "dinner",
    label: "Ужин",
    title: "Лёгкий лосось с картофелем",
    kcal: 370,
    protein: 29,
    fat: 10,
    carbs: 38,
    fiber: 6,
    time: 25,
    ingredients: [
      "Филе лосося — 110 г",
      "Картофель — 180 г",
      "Стручковая фасоль — 180 г",
      "Лимон и зелень — по вкусу",
    ],
    steps: [
      "Запечь картофель почти до готовности.",
      "Добавить рыбу и фасоль ещё на 12–15 минут.",
      "Подать с лимоном и зеленью.",
    ],
    storage: "Рыбу готовить в день подачи; гарнир можно подготовить заранее.",
  },
  brynzaChicken: {
    id: "brynzaChicken",
    kind: "dinner",
    label: "Ужин",
    title: "Куриный салат с брынзой SVEŽA",
    kcal: 485,
    protein: 40,
    fat: 22,
    carbs: 22,
    fiber: 8,
    time: 15,
    brand: "SVEŽA",
    ingredients: [
      "Куриная грудка готовая — 130 г",
      "Брынза SVEŽA «Нежная» — 50 г",
      "Томаты, огурец и салат — 300 г",
      "Авокадо — 50 г",
      "Цельнозерновая пита — 40 г",
    ],
    steps: [
      "Нарезать курицу, брынзу, овощи и авокадо.",
      "Смешать с зеленью и лимонным соком.",
      "Подать с подогретой питой.",
    ],
    storage: "Курицу приготовить заранее; салат собирать перед едой.",
  },
  lentilTurkey: {
    id: "lentilTurkey",
    kind: "dinner",
    label: "Ужин",
    title: "Чечевичный суп с индейкой",
    kcal: 522,
    protein: 44,
    fat: 20,
    carbs: 37,
    fiber: 10,
    time: 30,
    ingredients: [
      "Фарш индейки — 150 г",
      "Красная чечевица — 55 г",
      "Томаты в собственном соку — 180 г",
      "Морковь — 70 г",
      "Лук — 50 г",
      "Оливковое масло — 8 г",
    ],
    steps: [
      "Обжарить фарш с луком и морковью.",
      "Добавить чечевицу, томаты и воду.",
      "Варить около 20 минут до мягкости чечевицы.",
    ],
    storage: "Суп хорошо хранится 3 дня и подходит для заморозки.",
  },
  pumpkinTurkey: {
    id: "pumpkinTurkey",
    kind: "dinner",
    label: "Ужин",
    title: "Тыквенный суп с индейкой",
    kcal: 335,
    protein: 22,
    fat: 10,
    carbs: 39,
    fiber: 10,
    time: 30,
    ingredients: [
      "Тыква — 300 г",
      "Филе индейки готовое — 100 г",
      "Нут готовый — 80 г",
      "Морковь — 70 г",
      "Кокосовое молоко light — 40 мл",
    ],
    steps: [
      "Тыкву и морковь отварить до мягкости.",
      "Добавить нут и пробить блендером.",
      "Вмешать кокосовое молоко и добавить кусочки индейки.",
    ],
    storage: "Готовится большой кастрюлей и хранится до 3 суток.",
  },
  carpaccioSalad: {
    id: "carpaccioSalad",
    kind: "dinner",
    label: "Ужин",
    title: "Салат с куриным карпаччо",
    kcal: 330,
    protein: 36,
    fat: 13,
    carbs: 12,
    fiber: 6,
    time: 7,
    brand: "Дзержинка",
    ingredients: [
      "Карпаччо из курицы «Дзержинка» — 100 г",
      "Томаты, огурец и салат — 300 г",
      "Авокадо — 60 г",
      "Йогуртовая заправка — 50 г",
    ],
    steps: [
      "Нарезать овощи и авокадо.",
      "Добавить ломтики карпаччо.",
      "Заправить йогуртовым соусом.",
    ],
    storage: "Собирать перед едой; продукт солёный, поэтому дополнительная соль не нужна.",
  },
  studenSalad: {
    id: "studenSalad",
    kind: "dinner",
    label: "Ужин",
    title: "Студень с карпаччо и салатом",
    kcal: 385,
    protein: 34,
    fat: 11,
    carbs: 30,
    fiber: 8,
    time: 8,
    brand: "Брестский мясокомбинат + Дзержинка",
    ingredients: [
      "Студень «Праздничный» из мяса птицы — 300 г",
      "Карпаччо из курицы «Дзержинка» — 40 г",
      "Хлеб цельнозерновой — 60 г",
      "Огурец, томаты и зелень — 300 г",
    ],
    steps: [
      "Выложить студень и карпаччо на тарелку.",
      "Добавить большой овощной салат.",
      "Подать с цельнозерновым хлебом.",
    ],
    storage: "Студень и карпаччо открыть непосредственно перед едой.",
  },
};

const days: DayPlan[] = [
  { short: "Пн", name: "Понедельник", date: "27 июля", meals: [recipes.chiaBowl, recipes.chicken, recipes.softCottage, recipes.tunaSalad] },
  { short: "Вт", name: "Вторник", date: "28 июля", meals: [recipes.hamOmelet, recipes.turkey, recipes.appleSnack, recipes.salmonLight] },
  { short: "Ср", name: "Среда", date: "29 июля", meals: [recipes.casserole, recipes.studenBuckwheat, recipes.teosSnack, recipes.brynzaChicken] },
  { short: "Чт", name: "Четверг", date: "30 июля", meals: [recipes.chiaBowl, recipes.carpaccioWrap, recipes.softCottage, recipes.lentilTurkey] },
  { short: "Пт", name: "Пятница", date: "31 июля", meals: [recipes.sausageBreakfast, recipes.chicken, recipes.softCottage, recipes.pumpkinTurkey] },
  { short: "Сб", name: "Суббота", date: "1 августа", meals: [recipes.casserole, recipes.salmon, recipes.teosSnack, recipes.carpaccioSalad] },
  { short: "Вс", name: "Воскресенье", date: "2 августа", meals: [recipes.hamSandwich, recipes.turkey, recipes.appleSnack, recipes.studenSalad] },
];

const productCards = [
  { name: "Ветчина Natura Fit", kcal: 100, protein: 16, fat: 3, carbs: 2, portion: "80–120 г", note: "для омлета и сэндвича" },
  { name: "Сосиски Natura Active", kcal: 153, protein: 16, fat: 9, carbs: 2, portion: "100 г", note: "порция, не вся упаковка" },
  { name: "Йогурт TEOS 2%", kcal: 53.2, protein: 5.8, fat: 2, carbs: 3, portion: "150–200 г", note: "для завтрака и перекуса" },
  { name: "Студень «Праздничный»", kcal: 50, protein: 7.5, fat: 2.5, carbs: 0, portion: "300 г", note: "готовый обед или ужин" },
  { name: "Творог мягкий Савушкин 0,1%", kcal: 44, protein: 10, fat: 0.1, carbs: 1, portion: "125 г", note: "одна баночка на перекус" },
  { name: "Брынза SVEŽA «Нежная»", kcal: 184.6, protein: 12.1, fat: 14.2, carbs: 2.1, portion: "20–50 г", note: "в салат или омлет" },
  { name: "Карпаччо «Дзержинка»", kcal: 140, protein: 30, fat: 2.5, carbs: 0, portion: "40–120 г", note: "для салата и ролла" },
  { name: "Семена чиа", kcal: 590, protein: 17, fat: 31, carbs: 42, portion: "10–20 г", note: "клетчатка 37,8 г/100 г" },
];

const shoppingGroups = [
  {
    title: "Подтверждённые продукты",
    icon: PackageCheck,
    items: [
      ["ham", "Ветчина Natura Fit", "1 × 300 г"],
      ["sausages", "Сосиски Natura Active", "1 × 350 г"],
      ["teos", "Йогурт TEOS 2%", "2 × 260 г"],
      ["studen", "Студень «Праздничный»", "2 × 300 г"],
      ["soft-cottage", "Творог мягкий 0,1%", "4 × 125 г"],
      ["brynza", "Брынза SVEŽA", "1 × 250 г"],
      ["carpaccio", "Карпаччо «Дзержинка»", "около 300 г"],
      ["chia", "Семена чиа", "100 г"],
    ],
  },
  {
    title: "Белок, овощи и фрукты",
    icon: Leaf,
    items: [
      ["chicken", "Куриная грудка", "700 г"],
      ["turkey", "Индейка / фарш индейки", "750 г"],
      ["fish", "Лосось", "300 г"],
      ["tuna", "Тунец в собственном соку", "1 большая банка"],
      ["eggs", "Яйца и яичные белки", "6 шт. + 220 г"],
      ["vegetables", "Томаты, огурцы, салат", "около 3,5 кг"],
      ["other-veg", "Брокколи, морковь, кабачок", "1 кг"],
      ["pumpkin-potato", "Тыква и картофель", "1,3 кг"],
      ["berries", "Малина, голубика, смесь ягод", "700 г"],
      ["fruit", "Яблоки, груши, авокадо", "по 3–4 шт."],
    ],
  },
  {
    title: "Крупы и всё остальное",
    icon: ShoppingBasket,
    items: [
      ["buckwheat", "Гречка", "250 г"],
      ["couscous", "Кускус", "150 г"],
      ["lentils", "Красная чечевица", "150 г"],
      ["chickpeas", "Нут готовый", "1 банка"],
      ["bread", "Цельнозерновой хлеб и пита", "2 упаковки"],
      ["wrap", "Цельнозерновая тортилья", "1 упаковка"],
      ["rice-flour", "Рисовая мука", "50 г"],
      ["nuts", "Миндаль", "120 г"],
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

function total(meals: Meal[], field: "kcal" | "protein" | "fat" | "carbs" | "fiber") {
  return Math.round(meals.reduce((sum, meal) => sum + meal[field], 0) * 10) / 10;
}

export default function Home() {
  const [dayIndex, setDayIndex] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [recipeFilter, setRecipeFilter] = useState<"all" | "quick" | "batch" | "breakfast">("all");
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const activeDay = days[dayIndex];
  const totals = useMemo(
    () => ({
      kcal: total(activeDay.meals, "kcal"),
      protein: total(activeDay.meals, "protein"),
      fat: total(activeDay.meals, "fat"),
      carbs: total(activeDay.meals, "carbs"),
      fiber: total(activeDay.meals, "fiber"),
    }),
    [activeDay],
  );
  const recipeCards = useMemo(() => {
    const all = Object.values(recipes);
    if (recipeFilter === "quick") return all.filter((recipe) => recipe.time <= 15);
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
          <a href="#products">Продукты</a>
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
          <span className="eyebrow"><Check size={16} /> Меню пересчитано под цель Светланы</span>
          <h1>Вкусная неделя без лишней готовки</h1>
          <p className="hero-subtitle">
            1450–1500 ккал <span>·</span> Б 120–125 г <span>·</span> Ж 50–53 г
          </p>
          <p className="hero-description">
            Углеводы распределены по остатку. В плане одна взрослая порция,
            две основные готовки в неделю и продукты, которые уже выбрала Светлана.
          </p>
          <div className="hero-actions">
            <button className="button primary" type="button" onClick={scrollToMenu}>
              Открыть меню <ArrowRight size={20} />
            </button>
            <a className="button secondary" href="#products">
              Проверить продукты
            </a>
          </div>
          <div className="trust-row">
            <span><Clock3 size={17} /> до 40 минут</span>
            <span><ShoppingBasket size={17} /> один список покупок</span>
            <span><PackageCheck size={17} /> точные бренды и порции</span>
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
              <strong>{totals.kcal}</strong> ккал
            </div>
          </div>

          <div className="meal-list">
            {activeDay.meals.map((meal) => {
              const KindIcon = kindIcons[meal.kind];
              return (
                <button className="meal-row" key={meal.id} onClick={() => setSelectedMeal(meal)} type="button">
                  {meal.image ? (
                    <img src={meal.image} alt="" />
                  ) : (
                    <span className={`meal-placeholder ${meal.kind}`}><KindIcon size={22} /></span>
                  )}
                  <span className={`meal-kind ${meal.kind}`}><KindIcon size={19} /></span>
                  <span className="meal-copy">
                    <small>{meal.label} · {meal.time} мин{meal.brand && <> · {meal.brand}</>}</small>
                    <strong>{meal.title}</strong>
                  </span>
                  <span className="meal-kcal">{meal.kcal} ккал</span>
                  <ChevronRight className="meal-chevron" size={22} />
                </button>
              );
            })}
          </div>

          <div className="macro-strip" aria-label="Пищевая ценность меню">
            <Macro label="Белки" value={`${totals.protein} г`} tone="green" />
            <Macro label="Жиры" value={`${totals.fat} г`} tone="orange" />
            <Macro label="Углеводы" value={`${totals.carbs} г`} tone="yellow" />
            <Macro label="Клетчатка" value={`${totals.fiber} г`} tone="mint" />
          </div>
        </section>
      </section>

      <section className="quick-benefits" aria-label="Преимущества плана">
        <article><span>01</span><div><strong>Цель по БЖУ соблюдена</strong><p>Каждый день — 120–125 г белка и 50–53 г жиров</p></div></article>
        <article><span>02</span><div><strong>Готовим дважды</strong><p>Основные заготовки в воскресенье и среду</p></div></article>
        <article><span>03</span><div><strong>Быстрые продукты в деле</strong><p>TEOS, Natura, Савушкин, SVEŽA и другие</p></div></article>
      </section>

      <section className="content-section prep-section" id="prep">
        <div className="section-heading">
          <div>
            <span className="section-kicker"><Timer size={16} /> Две готовки</span>
            <h2>Вся неделя — за два подхода</h2>
          </div>
          <p>
            В будни остаётся собрать порцию, разогреть основу или добавить свежие
            овощи. Студень, ветчина, йогурт и творог экономят время.
          </p>
        </div>

        <div className="prep-grid">
          <article className="prep-card prep-card-main">
            <div className="prep-card-heading">
              <span className="prep-day">Воскресенье</span>
              <span className="prep-time"><Clock3 size={16} /> 1 ч 15 мин</span>
            </div>
            <h3>Основа на понедельник–среду</h3>
            <div className="prep-steps">
              <PrepStep number="1" title="Поставить крупы" text="Гречка и кускус готовятся параллельно." />
              <PrepStep number="2" title="Запечь одним противнем" text="Курица, морковь, брокколи и кабачок." />
              <PrepStep number="3" title="Сделать тефтели" text="Сразу две порции индейки." />
              <PrepStep number="4" title="Собрать завтраки" text="Запеканка и банки чиа-йогурта." />
            </div>
          </article>

          <article className="prep-card">
            <div className="prep-card-heading">
              <span className="prep-day mint">Среда</span>
              <span className="prep-time"><Clock3 size={16} /> 55 мин</span>
            </div>
            <h3>Свежая партия до воскресенья</h3>
            <ul className="check-list">
              <li><CircleCheckBig size={19} /> Сварить чечевичный и тыквенный суп</li>
              <li><CircleCheckBig size={19} /> Подготовить картофель и фасоль</li>
              <li><CircleCheckBig size={19} /> Запечь оставшуюся курицу и индейку</li>
              <li><CircleCheckBig size={19} /> Разложить орехи и ягоды по порциям</li>
            </ul>
            <div className="fresh-note">
              <Sparkles size={20} />
              <span><strong>Свежими остаются только рыба, омлет и салаты.</strong> На них уходит 7–25 минут.</span>
            </div>
          </article>
        </div>
      </section>

      <section className="content-section products-section" id="products">
        <div className="section-heading">
          <div>
            <span className="section-kicker"><PackageCheck size={16} /> Продукты Светланы</span>
            <h2>Проверенные КБЖУ с упаковок</h2>
          </div>
          <p>
            Значения указаны на 100 г. В карточках отдельно показана рабочая порция,
            которая используется в меню.
          </p>
        </div>
        <div className="product-grid">
          {productCards.map((product) => (
            <article className="product-card" key={product.name}>
              <span className="product-badge">на 100 г</span>
              <h3>{product.name}</h3>
              <strong>{product.kcal} <small>ккал</small></strong>
              <div className="product-macros">
                <span><b>Б</b>{product.protein} г</span>
                <span><b>Ж</b>{product.fat} г</span>
                <span><b>У</b>{product.carbs} г</span>
              </div>
              <p><b>{product.portion}</b> · {product.note}</p>
            </article>
          ))}
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
              <button className="recipe-card" key={meal.id} onClick={() => setSelectedMeal(meal)} type="button">
                <span className="recipe-visual">
                  {meal.image ? (
                    <img src={meal.image} alt="" />
                  ) : (
                    <span className={`recipe-placeholder ${meal.kind}`}><KindIcon size={30} /></span>
                  )}
                  <span className="recipe-time"><Clock3 size={14} /> {meal.time} мин</span>
                </span>
                <span className="recipe-card-body">
                  <small>{meal.brand || meal.label}</small>
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
              <div><strong>{checkedItems.length} из {totalShoppingItems}</strong><span>уже в корзине</span></div>
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
                          <input checked={checked} onChange={() => toggleShoppingItem(id)} type="checkbox" />
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
            Количество рассчитано на одну взрослую порцию. Специи, соль и вода в список не включены.
          </p>
        </div>
      </section>

      <section className="closing-section">
        <div>
          <span className="section-kicker"><Leaf size={16} /> Спокойный режим</span>
          <h2>План есть. Остаётся только начать.</h2>
          <p>Откройте нужный день, приготовьте первую партию и отмечайте покупки прямо на сайте.</p>
        </div>
        <button className="button primary" type="button" onClick={scrollToMenu}>
          Вернуться к меню <ArrowRight size={20} />
        </button>
      </section>

      <footer>
        <a className="brand" href="#top">ПростоПП <Leaf aria-hidden="true" /></a>
        <p>КБЖУ рассчитаны ориентировочно: итог зависит от конкретной партии и способа приготовления.</p>
        <span>1450–1500 ккал · Б 120–125 г · Ж 50–53 г · 1 порция</span>
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
            <button aria-label="Закрыть рецепт" className="modal-close" onClick={() => setSelectedMeal(null)} type="button">
              <X size={22} />
            </button>
            {selectedMeal.image && <img className="modal-image" src={selectedMeal.image} alt="" />}
            <div className="modal-content">
              <span className="recipe-label">{selectedMeal.brand || selectedMeal.label}</span>
              <h2 id="recipe-title">{selectedMeal.title}</h2>
              <div className="recipe-stats">
                <span><Flame size={17} /> {selectedMeal.kcal} ккал</span>
                <span><Leaf size={17} /> Б {selectedMeal.protein} г</span>
                <span>Ж {selectedMeal.fat} г</span>
                <span>У {selectedMeal.carbs} г</span>
                <span><Clock3 size={17} /> {selectedMeal.time} минут</span>
              </div>
              <div className="recipe-columns">
                <div>
                  <h3>На одну порцию</h3>
                  <ul>{selectedMeal.ingredients.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <div>
                  <h3>Как приготовить</h3>
                  <ol>{selectedMeal.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                </div>
              </div>
              <p className="storage-note"><Clock3 size={18} /> {selectedMeal.storage}</p>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}

function PrepStep({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="prep-step">
      <span>{number}</span>
      <div><strong>{title}</strong><p>{text}</p></div>
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
