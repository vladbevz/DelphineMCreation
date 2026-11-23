# CLAUDE.md — DelphineMCreations, бутік e-commerce

> Головний контекст проєкту для Claude Code. Читай цей файл повністю перед кожною сесією.
> Розробник: Влад (AtelierCode). Мова спілкування з розробником — українська.
> **Увесь текст інтерфейсу сайту — французькою.** Коментарі в коді та назви змінних — англійською.

---

## 1. Що будуємо

Інтернет-бутік для **Delphine M. Créations** — бренду прикрас зі шкіри ручної роботи (Vaunage, Gard).
Товарів мало (10–30 на старті). **Кожну прикрасу можна купити завжди** (рішення клієнтки, листопад 2026): `stock` — це вже готові екземпляри, а коли їх немає, Delphine виготовляє прикрасу на замовлення за кілька днів. Продажі на старті скромні.

Цілі:
- Сайт написаний з нуля під бренд, **без шаблонів і без Shopify**.
- Виглядає як вітрина бутіка, а не як типовий магазин: великі фото, текстура шкіри, історія кожної прикраси.
- Delphine сама керує товарами й замовленнями (Sanity Studio + Stripe Dashboard), без розробника.
- Lighthouse mobile ≥ 90 на всіх публічних сторінках.
- Запуск до Black Friday (27.11.2026).

**Головне правило безпеки:** дані картки ніколи не проходять через наш код. Оплата — лише на хостинговій сторінці **Stripe Checkout**.

---

## 2. Стек

| Шар | Технологія |
| --- | --- |
| Фреймворк | Next.js (остання стабільна, App Router), React, TypeScript (strict) |
| Стилі | Tailwind CSS, Framer Motion (стримано) |
| CMS / дані | Sanity (dataset `production`, публічний — безкоштовний тариф; персональні дані лише в документах з `_id` через крапку, див. §16), Sanity Studio вбудована в `/studio`; читання тільки на сервері з read-токеном |
| Зображення | Sanity Image CDN (`@sanity/image-url`) + `next/image` |
| Оплата | Stripe Checkout (hosted), Stripe webhooks |
| Листи | Resend + React Email |
| Валідація | Zod |
| Антиспам | Cloudflare Turnstile |
| Хостинг | Vercel |
| Моніторинг | Sentry |
| Аналітика | Vercel Analytics або Plausible; Meta Pixel — лише після згоди на cookies |
| Менеджер пакетів | pnpm |

Не додавай інші залежності без потреби. Якщо хочеш додати пакет — спершу поясни навіщо.

---

## 3. Дизайн-система — charte graphique «Delphine M» (листопад 2026)

Джерело — чартера клієнтки (`Charte graphique Delphine M.pdf`): лого D + рукописна M, «Delphine M», «Créations en cuir»; темно-сірий `#252626` + рожевий «flash» `#ED0A90` на білому. Бренд: радість, динаміка, сучасність; багато клієнток люблять колір. Попередні напрями (Joie colorée, Concept 2) — відкинуті; Concept 2 збережено в локальній гілці `design/concept-2`.

**Лого** — `src/components/brand/BrandLogo.tsx`: векторизовано (potrace) з її мастер-файлу, частини на тих самих позиціях, що в оригіналі. Варіанти: `full` (монограма + назва + baseline: футер), `name` (назва + «Créations en cuir»: шапка, як зворот візитки), `mark` (монограма D/M: favicon `src/app/icon.svg`, 404, плейсхолдери фото — `mono` + `text-graphite/15`). `mono` = усі літери одним кольором (`currentColor`) — **лише на темному фоні** (футер — білим). Для листів — `public/brand/logo-email.png` (поштовики блокують SVG).
- Заборони чартери: не деформувати, не міняти шрифти лого, **не класти лого на фото**. Якщо Delphine дасть оригінальний SVG/AI — замінити контури в `BrandLogo.tsx`.

**Кольори** — токени в `@theme` у `src/app/globals.css` (Tailwind v4, без `tailwind.config`):

| Токен | Hex | Використання |
| --- | --- | --- |
| `blanc` | `#FFFFFF` | фон сторінки |
| `graphite` | `#252626` | колір чартери: текст, футер |
| `gris` | `#5E5F5F` | другорядний текст |
| `rose` | `#ED0A90` | рожевий чартери: лого, декор, лінія під карткою при hover, великий текст (≥ 24px) |
| `rose-texte` | `#C2077A` | кнопки `primary`, посилання, дрібний рожевий текст, смужка оголошень (hover `rose-hover` `#A30667`) |
| `rose-pale` | `#FDEEF6` | альтернативні секції |
| `rose-clair` | `#FAD3E8` | фон hero головної (graphite 12:1) |
| `nuage` | `#F5F3F4` | фон фото й плейсхолдерів |
| `trait` | `#E8E2E5` | бордери, поля форм |

Контраст (перевірено): graphite/blanc 15.2, gris/blanc 6.4, gris/rose-pale 5.7, gris/nuage 5.8, rose-texte/blanc 5.8, blanc/rose-texte 5.8, graphite/rose-pale 13.5. Рожевий чартери `#ED0A90` на білому — 4.2: **не для дрібного тексту і кнопок** — для них `rose-texte`. Інших кольорів (категорій, золота) немає.

**Шрифти** (`next/font/google`, `src/app/layout.tsx`; редакційна пара, листопад 2026): **Instrument Serif** (лише 400, display) для заголовків, назв товарів, великих цитат; **Instrument Sans** (variable 400–700) для тексту й інтерфейсу. Змінні next/font `--font-instrument-serif`, `--font-instrument-sans`; токени `font-display` (serif), `font-body` = `font-sans`. Шрифти лого (Adelle, Existence, Beauty Heart, Adelia) — лише в самому лого.
- Заголовки (`h1–h4` у base, утиліта `heading` для інших елементів): Instrument Serif 400, звичайний регістр, `line-height: 1.02`, `-0.01em`, `text-wrap: balance`, `overflow-wrap: anywhere` + `hyphens: auto`. Шрифт вузький і дрібний — заголовки великі: `SectionHeading` h1 `text-[2.8rem] sm:text-6xl`, h2 `text-[2.3rem] sm:text-5xl`; H1 головної `clamp(3.5rem, 14vw, 9.5rem)`.
- Текст: Instrument Sans 400, 16px, `leading-relaxed`, рядок ≤ 65 символів (`measure`).
- Назви товарів: `product-title` (serif, `text-xl sm:text-2xl` у картці). Ціни: `price` (sans 600, `tabular-nums`).
- **Без капсу**: меню, кнопки, лейбли форм, accordion, бейджі — звичайним регістром, sans 500–600 (`label-caps` / `display-caps` лишились як імена утиліт, але без uppercase). Розріджений капс читається як шаблон.
- Без рядків-«метаданих» через « · » і без стрілок → у кнопках і посиланнях.
- Акцентів у заголовках немає: `<em>` (утиліта `word-accent`) успадковує стиль.
- **Рукописний — лише H1 головної**: **Corinthia** 400 (`font-script`, змінна `--font-corinthia`) — найближчий Google Font до Adelia з лого («Créations en cuir»). Великий розмір і `leading-[0.95] sm:leading-[1.05]`, інакше виносні елементи налазять.
- Листи: `EmailLayout.tsx` — Instrument Sans → Helvetica/Arial, лого PNG, рожева лінія 2px під лого, кнопка `rose-texte`.

**Без шаблонних «ШІ»-прийомів**: без надписів-«eyebrow» над заголовками, без акцентного слова в заголовку, без плаваючих мотивів, без shimmer/градієнтів, без іконок-тріад, без нумерованих кружечків. Кроки — «1. Назва». Прибрано: рухомий рядок, Blobs, леопард, кольорові смужки, мотив сережки, шов.

**Анімації** — `motion` (LazyMotion + `m`), спільні easing/тривалості/варіанти в `src/lib/motion.ts`, компоненти в `src/components/motion/`. Лише transform / opacity. **Один момент на сторінку**: сітки й секції не «з'являються» при прокручуванні (`Stagger` / `StaggerItem` — звичайна розмітка); анімація лише у відповідь на дію (кошик, кнопка «Ajouté», view transition). Заголовки й фото секцій — без анімацій. Ніколи на LCP-елементі (hero-фото, перше фото галереї, h1). Анімовані елементи мають `data-reveal` — CSS при `prefers-reduced-motion` показує їх одразу. View Transitions (React `ViewTransition`) — фото картки → галерея.

**Стиль:**
- **Гострі кути** у фото, картках, секціях, полях форм. Заокруглення лише в кнопок і бейджів (пігулки, `rounded-full`).
- Фото товарів **квадратні** на фоні `nuage`.
- **Головна — одне «вау»**: hero на світло-рожевому `rose-clair` `#FAD3E8` (текст graphite 12:1), рукописний H1 і фото в білій «картці» з нахилом 2.5° (як прикраси на картках презентації). Hero займає рівно перший екран під шапкою (`h-[calc(100svh-4.5rem-1px)]`, фото підлаштовує висоту). Далі: текст по центру + три переваги під ним, «Nouvelle collection», цитата з атель'є, sur-mesure на фото, FAQ (+ FAQPage JSON-LD), Instagram. Блоку категорій «Par envie» немає (прибрано на прохання).
- Кнопки (`Button` / `ButtonLink`): пігулки, звичайний регістр, 600 — `primary` (`rose-texte`, білий текст), `secondary` (контур `rose-texte`), `light` (на фото), `inverse` (біла пігулка з `rose-texte` — на рожевому hero), `ghost` (підкреслене посилання).
- Шапка: Boutique / L'atelier / Sur-mesure ліворуч, лого «Delphine M / Créations en cuir» по центру, Entretien du cuir / Contact + кошик праворуч; на мобільному — бургер, лого, кошик. Футер — `graphite` (текст білий, hover — підкреслення, лого `full` білим). Смужка оголошень — `rose-texte`, білий текст.
- Без тіней, без градієнтів, без емодзі. Анімації поважають `prefers-reduced-motion`.
- Mobile-first: більшість трафіку прийде з Instagram на телефоні.
- Доступність: справжні `<button>`, `<a>`, `<label>`; `alt` у кожного фото; видимий focus (`rose-texte`, на graphite — білий).

## 4. Структура проєкту

```
src/
  app/
    (site)/
      page.tsx                    # Accueil
      boutique/page.tsx           # каталог + фільтри
      boutique/[slug]/page.tsx    # fiche produit
      collections/[slug]/page.tsx
      atelier/page.tsx
      sur-mesure/page.tsx
      entretien/page.tsx
      contact/page.tsx
      merci/page.tsx              # після оплати (?session_id=)
      [legal]/page.tsx            # cgv, mentions-legales, livraison-retours, confidentialite
      layout.tsx
    studio/[[...tool]]/page.tsx   # Sanity Studio
    api/
      checkout/route.ts           # POST: створення Stripe session (ціни з Sanity)
      webhooks/stripe/route.ts    # POST: події Stripe
    sitemap.ts
    robots.ts
  components/
    ui/                           # Button, Badge, Drawer, Input…
    product/                      # ProductCard, Gallery, AddToCart…
    cart/                         # CartProvider, CartDrawer
    layout/                       # Header, Footer, CookieBanner
  lib/
    sanity/                       # client.ts (read), writeClient.ts (server-only), queries.ts, image.ts
    stripe.ts                     # server-only
    email/                        # templates React Email + send.ts
    delivery.ts                   # готові vs на замовлення, терміни, MAX_QUANTITY (і клієнт, і сервер)
    validation.ts                 # Zod схеми
  sanity/
    schemaTypes/                  # product, collection, order, customRequest, page, settings
    structure.ts                  # кастомна структура Studio
```

`writeClient`, `stripe.ts`, токени — тільки на сервері (`import 'server-only'`).

---

## 5. Модель даних Sanity

**`product`**
- `title` (string, req), `slug` (slug, req), `collection` (ref → collection), `category` (string list: `boucles-d-oreilles | collier | bracelet | bague | autre`)
- `price` (number, **у центах**, req), `images` (array image з hotspot + `alt`, min 1), `leatherColor` (string), `dimensions` (string), `weight` (number, грами — для доставки)
- `description` (Portable Text), `care` (Portable Text)
- `stock` (number, default 0) — **готові до відправки** екземпляри. Delphine вписує, вебхук зменшує після оплати. При 0 товар лишається в продажу: виготовляється на замовлення. Статусів `available/reserved/sold` немає. Зняти модель з продажу — Unpublish у Studio.
- `featured` (boolean), `publishedAt` (datetime), `seo` (object: title, description)

**`collection`** — `title`, `slug`, `cover`, `description`, `order`

**`order`** (створює тільки сервер; `_id` = `orders.${stripeSessionId}`)
- `number` (string, формат `DMC-2026-0001`), `stripeSessionId`, `stripePaymentIntentId`
- `items[]` (product ref, title, `quantity`, price — сума рядка, знімок на момент покупки; `fromStock` — взято з готових, `toMake` — виготовити)
- `customer` (name, email, phone), `shippingAddress`, `shippingMethod` (`colissimo | retrait`)
- `amounts` (subtotal, shipping, total — центи)
- `status` (`paid | shipped | delivered | refunded | cancelled`) — Delphine змінює
- `trackingNumber` — Delphine вписує; `createdAt`

**`customRequest`** — `name`, `email`, `phone?`, `type`, `colors`, `budget`, `message`, `imageCount` (самі фото — лише у вкладенні листа), `status` (`new | replied | accepted | closed`), `createdAt`; `_id` = `requests.<uuid>`

**`page`** — `title`, `slug`, `body` (Portable Text), `seo`

**`settings`** (singleton) — тарифи доставки (`colissimoPrice`, `freeShippingThreshold`), терміни відправки в робочих днях (`shippingDays` — готова прикраса, `madeToOrderDays` — на замовлення), `pickupEnabled`, контакти, соцмережі, `announcementBar`, `vacationMode` (boolean + message: якщо true — кнопка купівлі вимкнена)

Studio: окремі розділи «Produits», «Commandes» (сортування за датою, фільтр за статусом), «Demandes sur-mesure», «Pages», «Réglages». Delphine має роль Editor.

---

## 6. Ключові потоки

### 6.1 Кошик
- Клієнтський стан (React context + `localStorage`), зберігаємо лише `{ id, qty }[]` (старий формат `id[]` конвертується).
- Кількість 1–`MAX_QUANTITY` (5) на прикрасу, до `MAX_CART_LINES` (10) різних прикрас (`src/lib/delivery.ts`). Повторне «Ajouter au panier» додає ще один екземпляр; у drawer — степпер − / +.
- Відкриття drawer → актуальні ціни й `stock` (server action); біля кожного рядка — «Prêt à partir» або «Fabriqué pour vous» з терміном. Знятий з публікації товар прибирається з поясненням.

### 6.2 Checkout — `POST /api/checkout`
1. Zod-валідація: `{ items: { productId, quantity 1–5 }[] }` (1–10 рядків, без повторів).
2. Завантажити товари з Sanity **на сервері** (лише опубліковані, зі slug і фото). Ціни беремо тільки звідси, ніколи з клієнта. Немає товару → 409 `unavailable` зі списком.
3. Якщо `settings.vacationMode` — 409.
4. **Резерву немає**: товар не може «закінчитися». Залишок списує вебхук після оплати.
5. Створити Stripe Checkout Session:
   - `mode: 'payment'`, `line_items` з `price_data` (EUR, назва, фото) і `quantity`
   - `shipping_address_collection: { allowed_countries: ['FR'] }` (ЄС — у фазі 2)
   - `shipping_options`: Colissimo (`settings.colissimoPrice`, безкоштовно від `freeShippingThreshold`) + «Retrait dans la Vaunage» (0 €), якщо `pickupEnabled`
   - `phone_number_collection: { enabled: true }`
   - `consent_collection: { terms_of_service: 'required' }` + `custom_text` з посиланням на CGV; `custom_text.submit` — термін відправки (довший, якщо хоч одну позицію треба виготовити; L216-1 — термін до оплати)
   - `locale: 'fr'`, `expires_at` за замовчуванням Stripe (24 год)
   - `metadata: { items: 'id:qty,id:qty' }`
   - `success_url: /merci?session_id={CHECKOUT_SESSION_ID}`, `cancel_url: /boutique?annule=1`
6. Повернути `{ url }`, клієнт робить redirect.

### 6.3 Webhook — `POST /api/webhooks/stripe`
- Raw body + `stripe.webhooks.constructEvent` з `STRIPE_WEBHOOK_SECRET`. Невалідний підпис → 400.
- **Ідемпотентність:** order `_id = orders.${session.id}`, створення через `create` в одній транзакції (див. §16). Повторна подія нічого не дублює.
- `checkout.session.completed` / `async_payment_succeeded` (якщо `unpaid` — чекаємо на `async_payment_succeeded`):
  1. В одній transaction: номер замовлення (лічильник `counters.orders`), `create` order, для кожного рядка `fromStock = min(qty, stock)` → `stock -= fromStock` (опублікований документ з `ifRevisionID`, чернетка — дзеркально), `toMake = qty - fromStock`. Конфлікт ревізії → повтор: друга одночасна оплата останнього готового екземпляра стає «на замовлення».
  2. Листи: клієнтці (підтвердження з терміном) і Delphine (нове замовлення, «À fabriquer : N», посилання на Studio).
  3. `revalidateTag` каталогу (змінився залишок → термін на сторінці).
- `expired` / `async_payment_failed` — нічого не робимо (резерву не було).
- Відповідати 200 швидко; будь-яка помилка → Sentry з `session.id`, 500 → Stripe повторює.

### 6.4 Cron
- Немає (був для зняття резервів; з моделлю «завжди в продажу» не потрібен).

### 6.5 Сторінка «Merci»
- Читає `session_id` через Stripe API (не чекає на вебхук), показує номер, суму, кількості, термін відправки (якщо вебхук уже створив order), що далі.
- Очищує кошик.
- Невалідний `session_id` → редірект на головну.

### 6.6 Відправка
- Delphine у Studio ставить `status: shipped` + `trackingNumber`.
- Sanity webhook (GROQ-фільтр на зміну статусу на `shipped`) → наш route → лист «Votre colis est parti» з трек-номером. Захистити секретом.

### 6.7 Форми (Sur-mesure, Contact)
- Server Actions + Zod + Turnstile + простий rate limit (IP, 5 запитів/год).
- Sur-mesure: створює `customRequest` + лист Delphine з фото у вкладенні (макс. 3 × 5 МБ; у Sanity фото не зберігаються).

---

## 7. Сторінки (MVP)

| Сторінка | Зміст |
| --- | --- |
| **Accueil** | Hero з фото та заголовком, «Nouvelle collection» (4–8 товарів), блок «Fait main dans la Vaunage» з посиланням на Atelier, 3 переваги (fait main, ultra léger, cuir de Colombie), блок Instagram (статичні фото з посиланням на профіль), newsletter — у фазі 2 |
| **Boutique** | Сітка 2 кол. (mobile) / 3–4 (desktop), фільтр за категорією й кольором шкіри (query params), сортування «Nouveautés / Prix». Усі товари завжди в продажу (без «Vendu») |
| **Fiche produit** | Галерея зі свайпом і зумом, назва, ціна, колір шкіри, розміри, кнопка «Ajouter au panier» + термін («Prêt à partir» / «Fabriqué à la main pour vous»), опис, догляд (accordion), доставка й повернення (accordion), «Vous aimerez aussi». JSON-LD `Product` з `availability` `InStock` або `MadeToOrder` |
| **L'atelier** | Історія Delphine, 4 кроки процесу (фото рук, інструментів), матеріали, «Fabriqué pour vous» (на замовлення + sur-mesure) |
| **Sur-mesure** | Пояснення, як працює, форма |
| **Entretien du cuir** | Поради з догляду (контент із Sanity `page`) |
| **Contact** | Форма, email, Instagram |
| **Юридичні** | CGV, Mentions légales, Livraison et retours, Confidentialité — з Sanity `page`, тексти дає клієнт |
| **404** | У стилі бренду, посилання в бутік |

Header: лого клієнтки «Delphine M / Créations en cuir», меню, іконка кошика з лічильником. Footer: навігація, юридичні посилання, Instagram, «Site réalisé par AtelierCode».

---

## 8. SEO, аналітика, RGPD

- `generateMetadata` на кожній сторінці; Open Graph з фото товару. Тексти для пошуку — в `src/lib/seo.ts` (title/description сторінок, H1 і вступ кожної категорії бутіка — `?categorie=` має власний canonical, FAQ). Тільки факти від Delphine; формулювання — чернетка на погодження.
- `sitemap.ts` (товари, колекції, сторінки), `robots.ts` (закрити `/studio`, `/api`, `/merci`).
- JSON-LD: `Product` на товарах, `Organization` + `LocalBusiness` на головній.
- ISR: сторінки товарів і каталог — `revalidate` + on-demand revalidation з вебхука Sanity при публікації.
- Банер cookies (власний, простий): аналітика й Meta Pixel вантажаться **тільки після згоди**. Без згоди — лише необхідні cookies.
- Meta Pixel події: `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase` (з вебхука або сторінки Merci, без дублів).

---

## 9. Листи (React Email, французькою, у стилі бренду)

1. **Confirmation de commande** — клієнтці: номер, товари з фото, сума, адреса/самовивіз, що далі.
2. **Nouvelle commande** — Delphine: хто, що, куди, посилання на замовлення в Studio.
3. **Votre colis est parti** — клієнтці: трек-номер з посиланням Colissimo.
4. **Nouvelle demande sur-mesure** — Delphine.
5. **Message de contact** — Delphine.

Відправник: `bonjour@[домен]` (домен верифікувати в Resend). Поки домену немає — тестовий відправник Resend.

---

## 10. Змінні середовища

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=           # server-only, Viewer (needed for orders.* / requests.* docs)
SANITY_API_WRITE_TOKEN=          # server-only, Editor
SANITY_WEBHOOK_SECRET=
STRIPE_SECRET_KEY=               # server-only
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
EMAIL_DELPHINE=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=          # same DSN, for the browser SDK (lazy-loaded)
NEXT_PUBLIC_META_PIXEL_ID=
```

Тримай `.env.example` актуальним. Валідуй env через Zod при старті (`lib/env.ts`).

---

## 11. Правила роботи

- **Спочатку план (Plan Mode), потім код.** Один етап — одна сесія. Між етапами — `/clear`.
- Перед кодом прочитай відповідний розділ цього файлу. Якщо щось суперечить — спитай, не вигадуй.
- Не вигадуй тексти, ціни, дані про Delphine. Плейсхолдери: `[NOM DU BIJOU]`, `[PRIX]`, `[TEXTE À FOURNIR]`.
- Server Components за замовчуванням; `'use client'` — тільки де потрібна інтерактивність.
- Після зміни схем Sanity або GROQ-запитів — `pnpm typegen` (типи в `src/sanity/types.ts`, запити тільки через `defineQuery`).
- Іконки Sanity — тільки поштучно: `import { TagIcon } from '@sanity/icons/Tag'` (v5 не має іменованих експортів з кореня).
- Гроші — завжди цілі числа в центах; форматування через `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })`.
- Ніякої бізнес-логіки на клієнті, що впливає на ціну чи наявність.
- Після кожного етапу: `pnpm lint`, `pnpm typecheck`, `pnpm build` без помилок; коротко звітуй, що зроблено і що лишилось.
- Коміти маленькі, повідомлення англійською в форматі `feat: …`, `fix: …`.

---

## 12. Етапи

### Етап 0 — Фундамент
Next.js + TS strict + Tailwind (токени з розділу 3) + шрифти + ESLint/Prettier + `lib/env.ts` + Sentry. Layout: Header, Footer, базові UI-компоненти (Button, Badge, Container, Section heading), SVG-мотив сережки.
✅ Готово, коли: головна з плейсхолдерами рендериться, Lighthouse mobile ≥ 90.

### Етап 1 — Sanity
Проєкт Sanity, усі схеми з розділу 5, Studio на `/studio` з кастомною структурою, `readOnly` поля, тестові дані (6–8 товарів-заглушок з плейсхолдер-фото). GROQ-запити й типи.
✅ Готово, коли: Delphine-подібний користувач може створити товар у Studio, і він з'являється на сайті.

### Етап 2 — Вітрина
Accueil, Boutique (фільтри, сортування), Fiche produit (галерея, accordion, JSON-LD), Atelier, Entretien, юридичні сторінки, 404, sitemap/robots, metadata.
✅ Готово, коли: усі сторінки з розділу 7 працюють на тестових даних, mobile-first, доступність базово перевірена.

### Етап 3 — Кошик і оплата
CartProvider, CartDrawer, `/api/checkout`, Stripe Checkout, сторінка Merci.
✅ Готово, коли: тестова оплата карткою `4242…` проходить end-to-end у test mode.

### Етап 4 — Вебхуки, замовлення, листи
Stripe webhook (completed / async), створення order зі списанням залишку, листи React Email, Sanity webhook на `shipped`, revalidation.
✅ Готово, коли: усі сценарії з розділу 13 проходять.

### Етап 5 — Форми, аналітика, RGPD
Sur-mesure і Contact (Turnstile, rate limit), cookie-банер, аналітика, Meta Pixel після згоди.

### Етап 6 — Передзапуск
Домен, Resend-домен, Stripe live keys і live webhook, Sentry alerts, фінальний Lighthouse, README з архітектурою й запуском, інструкція для Delphine (як додати прикрасу, обробити замовлення, вписати трек-номер, зробити повернення в Stripe).

---

## 13. Обов'язкові тест-сценарії (Stripe test mode, Stripe CLI `stripe listen`)

1. Звичайна покупка 1 товару зі `stock` ≥ 1 → order створено, `stock` −1, `toMake: 0`, 2 листи надіслано.
2. **`stock: 1`, дві вкладки одночасно купують ту саму прикрасу** → обидві оплати проходять, `stock` 0 (не −1), друге замовлення має `toMake: 1`, Delphine бачить «À fabriquer».
3. Кількість більша за залишок (`stock: 1`, купують 3) → `fromStock: 1`, `toMake: 2`, у Stripe і в листі — термін «на замовлення». Закрила Stripe без оплати → нічого не змінилось.
4. Stripe надсилає `completed` двічі → один order, один лист.
5. Невалідний підпис вебхука → 400, нічого не змінено.
6. Підміна ціни/ID з клієнта → сервер ігнорує, ціна з Sanity; `quantity: 6`, дробова чи повтор товару → 400.
7. Відмова картки (`4000 0000 0000 0002`) і 3D Secure (`4000 0025 0000 3155`) → коректна поведінка.
8. `vacationMode = true` → купити неможливо, видно повідомлення.
9. Статус `shipped` + трек-номер у Studio → лист клієнтці.
10. Повернення коштів через Stripe Dashboard → (фаза 2: вебхук `charge.refunded` → order `refunded`).

---

## 14. Фаза 2 (не робити зараз)

Англійська версія (next-intl) і доставка в ЄС · персоналізація в товарі (колір шкіри, ініціали) · sur-mesure з оплатою acompte через Stripe Payment Link · подарункове пакування, промокоди (Stripe coupons), подарункові картки · newsletter (Brevo) і покинутий кошик · e-reporting B2C (реформа e-facturation, з 09.2027) · автоматичні factures (Stripe `invoice_creation`), якщо бухгалтер скаже · етикетки Boxtal/Sendcloud, Mondial Relay · lookbook / блог.

---

## 15. Відкриті питання (чекаємо від клієнта)

Домен і точна назва бренду · статус Delphine (micro-entreprise, SIRET, франшиза TVA → «TVA non applicable, art. 293 B du CGI») · тексти CGV / mentions légales · тариф Colissimo і поріг безкоштовної доставки · самовивіз так/ні · хто платить за зворотну доставку · фото товарів (спільна зйомка з SMM) · кількість товарів на старті.

---

## 16. Рішення, ухвалені під час розробки (доповнюють розділи вище)

- **Публічний dataset** (безкоштовний тариф Sanity не має приватних): документи з персональними даними мають `_id` з крапкою — `orders.<sessionId>`, `requests.<uuid>` — такі не читаються без токена (як `drafts.`). Нові типи з персональними даними — так само. Товари, сторінки, settings — публічні.
- **Офлайн-режим**: без `NEXT_PUBLIC_SANITY_PROJECT_ID` усі читання йдуть з `src/lib/sanity/fixtures.ts` через `src/lib/sanity/data.ts`. Сторінки читають дані **тільки** через `data.ts`. На Vercel production усі ключі обов'язкові (`REQUIRED_IN_PRODUCTION` у `src/lib/env.ts`).
- **Модель «завжди в продажу»** (листопад 2026, замість pièce unique з резервом): `stock` = готові екземпляри, решта виготовляється на замовлення; без резерву, статусів, cron і `CRON_SECRET`. Залишок списується у транзакції замовлення (опублікований документ з `ifRevisionID` + чернетка `drafts.<id>`, якщо є). Терміни — `settings.shippingDays` / `madeToOrderDays`, тексти — `src/lib/delivery.ts`; поки не заповнені — `[DÉLAI]`. Право відмови 14 днів лишається: повтор моделі з каталогу — не персоналізація (L221-28 3° — лише sur-mesure).
- **Замовлення**: створюється через `create` (не `createIfNotExists`) в одній транзакції з лічильником і списанням `stock` — дублікат події падає цілком і не шле листів. Плюс idempotency key у Resend. Оплати з відкладеним підтвердженням: замовлення — на `async_payment_succeeded`.
- **Клієнтський бандл**: клієнтські компоненти не імпортують `src/lib/env.ts` і `validation.ts` (Zod) — для публічних змінних є `src/lib/env.client.ts`, для лімітів форм — `src/lib/formLimits.ts`.
- **Фото sur-mesure** стискаються в браузері (≤1600 px) — ліміт тіла запиту на Vercel 4,5 МБ. Не зберігаються в Sanity (assets публічні навіть за ID): лише вкладення в лист Delphine; у `customRequest` — `imageCount`.
- **Лічильник замовлень** — окремий документ `counters.orders` (не `settings`: чернетка Réglages відкотила б його). Лист-підтвердження обов'язковий: якщо не пішов — webhook 500, Stripe повторює, `order.emailsSent` позначає успіх.
- **Rate limit** — у пам'яті інстансу (достатньо разом із Turnstile).
- **CGV у листі**: лист «Confirmation de commande» = підтвердження на support durable (L221-13) — CGV PDF з `settings.cgvPdf` у вкладенні (Resend `attachments`), посилання на `/cgv`, блок «Droit de rétractation» і офіційний formulaire type (R221-1) з `settings.postalAddress`. Facture — не автоматично, на запит (уточнює бухгалтер клієнтки).
- Документація: `README.md` (архітектура, сервіси, тест-сценарії), `docs/LAUNCH-CHECKLIST.md`, `docs/GUIDE-DELPHINE.md` (французькою).
