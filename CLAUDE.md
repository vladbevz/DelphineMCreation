# CLAUDE.md — DelphineMCreations, бутік e-commerce

> Головний контекст проєкту для Claude Code. Читай цей файл повністю перед кожною сесією.
> Розробник: Влад (AtelierCode). Мова спілкування з розробником — українська.
> **Увесь текст інтерфейсу сайту — французькою.** Коментарі в коді та назви змінних — англійською.

---

## 1. Що будуємо

Інтернет-бутік для **Delphine M. Créations** — бренду прикрас зі шкіри ручної роботи (Vaunage, Gard).
Товарів мало (10–30 на старті), майже всі — **pièces uniques** (залишок 1). Продажі на старті скромні.

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
| CMS / дані | Sanity (dataset `production`, **private** — у ньому персональні дані замовлень), Sanity Studio вбудована в `/studio`; читання тільки на сервері з read-токеном |
| Зображення | Sanity Image CDN (`@sanity/image-url`) + `next/image` |
| Оплата | Stripe Checkout (hosted), Stripe webhooks |
| Листи | Resend + React Email |
| Валідація | Zod |
| Антиспам | Cloudflare Turnstile |
| Хостинг | Vercel (+ Vercel Cron) |
| Моніторинг | Sentry |
| Аналітика | Vercel Analytics або Plausible; Meta Pixel — лише після згоди на cookies |
| Менеджер пакетів | pnpm |

Не додавай інші залежності без потреби. Якщо хочеш додати пакет — спершу поясни навіщо.

---

## 3. Дизайн-система (з напрямку Instagram)

**Кольори** — токени в `@theme` у `src/app/globals.css` (Tailwind v4, без `tailwind.config`):

| Токен | Hex | Використання |
| --- | --- | --- |
| `linen` | `#FBF7F1` | основний фон |
| `cream` | `#F4EDE3` | альтернативний фон секцій |
| `sand` | `#E3D3BE` | плашки, фон фото, бордери `#D9C8B2` |
| `cognac` | `#9C5A33` | акцент, кнопки (білий текст), ціни; hover `#7A4424` |
| `olive` | `#5F6A4B` | другий акцент, бейджі |
| `espresso` | `#2B1D14` | основний текст, темні секції |
| `muted` | `#6B5646` | другорядний текст (перевір контраст 4.5:1 на фоні) |

**Шрифти** (через `next/font/google`):
- Заголовки: **Cormorant Garamond** (variable 300–600) — тонкі капси з трекінгом (утиліта `display-caps`); назви товарів — light, звичайний регістр.
- Акцент: тонкий курсив Cormorant. У `SectionHeading` слово в `<em>` автоматично стає курсивом звичайного регістру (утиліта `italic-accent`): `<>Les dernières <em>créations</em></>`. Лого «Delphine M.» — теж Cormorant italic. Рукописні шрифти не використовуємо (занадто виділялися).
- Текст: **Jost** 400/500. Дрібні лейбли, меню, кнопки, accordion — капс з трекінгом (`label-caps` або `text-[0.7rem] tracking-[0.15em] uppercase`).

**Мотив:** контур краплеподібної сережки з пунктирним «швом» усередині (inline SVG, `stroke="currentColor"`). Використовуй як декоративний елемент і плейсхолдер замість фото.

**Стиль (з жовтня 2026, натхнення — maigojoyas.com):**
- **Гострі кути** у фото, картках, секціях, полях форм. Заокруглення лише в кнопок і бейджів (пігулки, `rounded-full`).
- Фото товарів **квадратні** на фоні `sand`. Hero — фото на всю ширину з білими капсами.
- Кнопки (`Button` / `ButtonLink`): тонкі пігулки капсом — `primary` (espresso), `secondary` (контур), `light` (на фото), `ghost` (підкреслене посилання). `cognac` — лише дрібні акценти.
- Шапка: Boutique / L'atelier / Sur-mesure ліворуч, лого по центру, Entretien du cuir / Contact + кошик (іконка + «PANIER (N)») праворуч; на мобільному — бургер, лого, кошик. Футер і смужка оголошень — `espresso`.
- Без тіней і градієнтів, без емодзі. Рухомий рядок (`Marquee`) і анімації поважають `prefers-reduced-motion`.
- Mobile-first: більшість трафіку прийде з Instagram на телефоні.
- Доступність: справжні `<button>`, `<a>`, `<label>`; `alt` у кожного фото; видимий focus.

---

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
      checkout/route.ts           # POST: резерв + створення Stripe session
      webhooks/stripe/route.ts    # POST: події Stripe
      cron/release-reservations/route.ts
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
    reservations.ts               # логіка резерву pièce unique
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
- `stock` (number, default 1), `status` (`available | reserved | sold`, default `available`, **readOnly у Studio**), `reservedUntil` (datetime, readOnly, hidden)
- `featured` (boolean), `publishedAt` (datetime), `seo` (object: title, description)

**`collection`** — `title`, `slug`, `cover`, `description`, `order`

**`order`** (створює тільки сервер; `_id` = `order-${stripeSessionId}`)
- `number` (string, формат `DMC-2026-0001`), `stripeSessionId`, `stripePaymentIntentId`
- `items[]` (product ref, title, price — знімок на момент покупки)
- `customer` (name, email, phone), `shippingAddress`, `shippingMethod` (`colissimo | retrait`)
- `amounts` (subtotal, shipping, total — центи)
- `status` (`paid | shipped | delivered | refunded | cancelled`) — Delphine змінює
- `trackingNumber` — Delphine вписує; `createdAt`

**`customRequest`** — `name`, `email`, `phone?`, `type`, `colors`, `budget`, `message`, `images[]`, `status` (`new | replied | accepted | closed`), `createdAt`

**`page`** — `title`, `slug`, `body` (Portable Text), `seo`

**`settings`** (singleton) — тарифи доставки (`colissimoPrice`, `freeShippingThreshold`), `pickupEnabled`, контакти, соцмережі, `announcementBar`, `vacationMode` (boolean + message: якщо true — кнопка купівлі вимкнена)

Studio: окремі розділи «Produits», «Commandes» (сортування за датою, фільтр за статусом), «Demandes sur-mesure», «Pages», «Réglages». Delphine має роль Editor.

---

## 6. Ключові потоки

### 6.1 Кошик
- Клієнтський стан (React context + `localStorage`), зберігаємо лише `productId[]`.
- Pièce unique → кількість завжди 1, повторне додавання ігнорується.
- Відкриття drawer → перевірка актуального статусу товарів (server action); проданий товар позначається й прибирається з кнопкою пояснення.

### 6.2 Checkout — `POST /api/checkout`
1. Zod-валідація: `{ productIds: string[] }` (1–10 шт.).
2. Завантажити товари з Sanity **на сервері**. Ціни беремо тільки звідси, ніколи з клієнта.
3. Якщо `settings.vacationMode` — 409.
4. Для кожного товару: якщо `status === 'available'` або (`reserved` і `reservedUntil < now`) → резерв у **transaction** з `ifRevisionID` (оптимістичне блокування): `status: 'reserved'`, `reservedUntil: now + 30 хв`. Якщо хоч один не вдалось — відкотити зроблені резерви й повернути 409 зі списком недоступних.
5. Створити Stripe Checkout Session:
   - `mode: 'payment'`, `line_items` з `price_data` (EUR, назва, фото)
   - `shipping_address_collection: { allowed_countries: ['FR'] }` (ЄС — у фазі 2)
   - `shipping_options`: Colissimo (`settings.colissimoPrice`, безкоштовно від `freeShippingThreshold`) + «Retrait dans la Vaunage» (0 €), якщо `pickupEnabled`
   - `phone_number_collection: { enabled: true }`
   - `consent_collection: { terms_of_service: 'required' }` + `custom_text` з посиланням на CGV
   - `expires_at: now + 30 хв`, `locale: 'fr'`
   - `metadata: { productIds: ids.join(',') }`
   - `success_url: /merci?session_id={CHECKOUT_SESSION_ID}`, `cancel_url: /boutique?annule=1`
6. Повернути `{ url }`, клієнт робить redirect.

### 6.3 Webhook — `POST /api/webhooks/stripe`
- Raw body + `stripe.webhooks.constructEvent` з `STRIPE_WEBHOOK_SECRET`. Невалідний підпис → 400.
- **Ідемпотентність:** order `_id = order-${session.id}`, створення через `createIfNotExists`. Повторна подія нічого не дублює.
- `checkout.session.completed`:
  1. Товари з `metadata.productIds` → `status: 'sold'`, `stock: 0`, `unset reservedUntil`.
  2. Створити `order` (дані з session: customer_details, shipping_details, amounts). Номер — інкремент через лічильник у `settings` в transaction.
  3. Листи: клієнтці (підтвердження) і Delphine (нове замовлення, посилання на Studio).
  4. `revalidatePath` для каталогу й сторінок товарів.
- `checkout.session.expired` → повернути `status: 'available'` для товарів, які ще `reserved` цією сесією.
- Відповідати 200 швидко; будь-яка помилка → Sentry з `session.id`.

### 6.4 Cron — `/api/cron/release-reservations`
- Кожні 15 хв (`vercel.json`), захищений `CRON_SECRET`.
- Знімає резерви з `reservedUntil < now` (страховка, якщо вебхук не дійшов).

### 6.5 Сторінка «Merci»
- Читає `session_id` через Stripe API (не чекає на вебхук), показує номер, суму, що далі.
- Очищує кошик.
- Невалідний `session_id` → редірект на головну.

### 6.6 Відправка
- Delphine у Studio ставить `status: shipped` + `trackingNumber`.
- Sanity webhook (GROQ-фільтр на зміну статусу на `shipped`) → наш route → лист «Votre colis est parti» з трек-номером. Захистити секретом.

### 6.7 Форми (Sur-mesure, Contact)
- Server Actions + Zod + Turnstile + простий rate limit (IP, 5 запитів/год).
- Sur-mesure: створює `customRequest` (фото завантажуються в Sanity assets, макс. 3 × 5 МБ) + лист Delphine.

---

## 7. Сторінки (MVP)

| Сторінка | Зміст |
| --- | --- |
| **Accueil** | Hero з фото та заголовком Cormorant, «Nouvelle collection» (4–8 товарів), блок «Fait main dans la Vaunage» з посиланням на Atelier, 3 переваги (pièce unique, cuir sélectionné, fait main), блок Instagram (статичні фото з посиланням на профіль), newsletter — у фазі 2 |
| **Boutique** | Сітка 2 кол. (mobile) / 3–4 (desktop), фільтр за категорією й кольором шкіри (query params), сортування «Nouveautés / Prix». Продані — з бейджем «Vendu», в кінці списку |
| **Fiche produit** | Галерея зі свайпом і зумом, назва, ціна, бейдж «Pièce unique», колір шкіри, розміри, опис, догляд (accordion), доставка й повернення (accordion), кнопка «Ajouter au panier» / «Vendu» (disabled), «Vous aimerez aussi». JSON-LD `Product` з `availability` |
| **L'atelier** | Історія Delphine, процес (фото рук, інструментів), матеріали |
| **Sur-mesure** | Пояснення, як працює, форма |
| **Entretien du cuir** | Поради з догляду (контент із Sanity `page`) |
| **Contact** | Форма, email, Instagram |
| **Юридичні** | CGV, Mentions légales, Livraison et retours, Confidentialité — з Sanity `page`, тексти дає клієнт |
| **404** | У стилі бренду, посилання в бутік |

Header: лого-напис «Delphine M.» + «CRÉATIONS», меню, іконка кошика з лічильником. Footer: навігація, юридичні посилання, Instagram, «Site réalisé par AtelierCode».

---

## 8. SEO, аналітика, RGPD

- `generateMetadata` на кожній сторінці; Open Graph з фото товару.
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
SANITY_API_READ_TOKEN=           # server-only, Viewer (dataset is private)
SANITY_API_WRITE_TOKEN=          # server-only, Editor
SANITY_WEBHOOK_SECRET=
STRIPE_SECRET_KEY=               # server-only
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
EMAIL_DELPHINE=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
CRON_SECRET=
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
CartProvider, CartDrawer, `/api/checkout` з резервом, Stripe Checkout, сторінка Merci.
✅ Готово, коли: тестова оплата карткою `4242…` проходить end-to-end у test mode.

### Етап 4 — Вебхуки, замовлення, листи
Stripe webhook (completed / expired), створення order, позначка sold, cron, листи React Email, Sanity webhook на `shipped`, revalidation.
✅ Готово, коли: усі сценарії з розділу 13 проходять.

### Етап 5 — Форми, аналітика, RGPD
Sur-mesure і Contact (Turnstile, rate limit), cookie-банер, аналітика, Meta Pixel після згоди.

### Етап 6 — Передзапуск
Домен, Resend-домен, Stripe live keys і live webhook, Sentry alerts, фінальний Lighthouse, README з архітектурою й запуском, інструкція для Delphine (як додати прикрасу, обробити замовлення, вписати трек-номер, зробити повернення в Stripe).

---

## 13. Обов'язкові тест-сценарії (Stripe test mode, Stripe CLI `stripe listen`)

1. Звичайна покупка 1 товару → order створено, товар `sold`, 2 листи надіслано.
2. **Дві вкладки одночасно купують ту саму прикрасу** → лише одна отримує сесію, друга бачить 409 «déjà réservé».
3. Клієнтка закрила Stripe без оплати → після `expired` (або cron) товар знову `available`.
4. Stripe надсилає `completed` двічі → один order, один лист.
5. Невалідний підпис вебхука → 400, нічого не змінено.
6. Підміна ціни/ID з клієнта → сервер ігнорує, ціна з Sanity.
7. Відмова картки (`4000 0000 0000 0002`) і 3D Secure (`4000 0025 0000 3155`) → коректна поведінка.
8. `vacationMode = true` → купити неможливо, видно повідомлення.
9. Статус `shipped` + трек-номер у Studio → лист клієнтці.
10. Повернення коштів через Stripe Dashboard → (фаза 2: вебхук `charge.refunded` → order `refunded`).

---

## 14. Фаза 2 (не робити зараз)

Англійська версія (next-intl) і доставка в ЄС · персоналізація в товарі (колір шкіри, ініціали) · sur-mesure з оплатою acompte через Stripe Payment Link · подарункове пакування, промокоди (Stripe coupons), подарункові картки · newsletter (Brevo) і покинутий кошик · етикетки Boxtal/Sendcloud, Mondial Relay · lookbook / блог.

---

## 15. Відкриті питання (чекаємо від клієнта)

Домен і точна назва бренду · статус Delphine (micro-entreprise, SIRET, франшиза TVA → «TVA non applicable, art. 293 B du CGI») · тексти CGV / mentions légales · тариф Colissimo і поріг безкоштовної доставки · самовивіз так/ні · хто платить за зворотну доставку · фото товарів (спільна зйомка з SMM) · кількість товарів на старті.

---

## 16. Рішення, ухвалені під час розробки (доповнюють розділи вище)

- **Офлайн-режим**: без `NEXT_PUBLIC_SANITY_PROJECT_ID` усі читання йдуть з `src/lib/sanity/fixtures.ts` через `src/lib/sanity/data.ts`. Сторінки читають дані **тільки** через `data.ts`. На Vercel production усі ключі обов'язкові (`REQUIRED_IN_PRODUCTION` у `src/lib/env.ts`).
- **Резерв**: окрім `reservedUntil`, товар отримує `reservationToken` (той самий — у `metadata` сесії Stripe). Сесія Stripe — 31 хв (мінімум Stripe 30), резерв — 32 хв. «Annuler» у Stripe або новий checkout з того ж браузера одразу закривають попередню сесію й знімають резерв. Статус пишеться і в опублікований документ, і в чернетку `drafts.<id>`.
- **Замовлення**: створюється через `create` (не `createIfNotExists`) в одній транзакції з лічильником і `sold` — дублікат події падає цілком і не шле листів. Плюс idempotency key у Resend. Оплати з відкладеним підтвердженням: резерв продовжується на 7 днів, замовлення — на `async_payment_succeeded`.
- **Статус товару в Studio**: редагується лише зі стану `sold` (щоб повернути в продаж повернений товар).
- **Клієнтський бандл**: клієнтські компоненти не імпортують `src/lib/env.ts` і `validation.ts` (Zod) — для публічних змінних є `src/lib/env.client.ts`, для лімітів форм — `src/lib/formLimits.ts`.
- **Фото sur-mesure** стискаються в браузері (≤1600 px) — ліміт тіла запиту на Vercel 4,5 МБ.
- **Rate limit** — у пам'яті інстансу (достатньо разом із Turnstile).
- **Cron** кожні 15 хв потребує Vercel Pro; на Hobby — щоденний (основний механізм — вебхук `expired`).
- Документація: `README.md` (архітектура, сервіси, тест-сценарії), `docs/LAUNCH-CHECKLIST.md`, `docs/GUIDE-DELPHINE.md` (французькою).
