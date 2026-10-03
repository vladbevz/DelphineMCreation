# Чекліст підключення і запуску

Усі акаунти створюються **на клієнтку** (власниця — Delphine, Влад — учасник/адмін). Позначай `[x]` по ходу.

## 0. Отримати від клієнтки (CLAUDE.md §15)

- [ ] Домен і точна назва бренду
- [ ] Статус: micro-entreprise, SIRET, франшиза TVA (→ «TVA non applicable, art. 293 B du CGI» у CGV і футері)
- [ ] Тексти: CGV, mentions légales, livraison et retours, confidentialité, entretien, L'atelier, hero, переваги
- [ ] Тариф Colissimo і поріг безкоштовної доставки; самовивіз так/ні; хто платить зворотну доставку
- [ ] Терміни відправки (для сторінки товару, листів і `delivery_estimate` у Stripe — `src/lib/checkout.ts`)
- [ ] Фото товарів і для сторінки L'atelier, блоку Instagram
- [ ] Посилання на Instagram/Facebook, e-mail і телефон для сайту
- [ ] Погодити тексти, які я написав сам (позначені у звітах етапів): hero, «Réservé», «Vendu», банер cookies, листи

## 1. Sanity

- [ ] sanity.io → проєкт «Delphine M. Créations», dataset `production`, **Private**
- [ ] API → CORS: `http://localhost:3000` і `https://<домен>`, обидва з **Allow credentials**
- [ ] API → Tokens: `site-read` (Viewer), `site-write` (Editor)
- [ ] `.env.local`: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`
- [ ] `pnpm exec sanity login` → `pnpm seed` → перевірити `/studio` і головну
- [ ] Перевірити: SVG-плейсхолдери з seed віддаються CDN і `next/image`; blur (LQIP); OG-картинка товару
- [ ] Критерій етапу 1: створити товар у Studio → опублікувати → з'являється на сайті (≤ 60 с або одразу з вебхуком)
- [ ] Réglages: тариф Colissimo, поріг, самовивіз, контакти, Instagram
- [ ] Members → запросити Delphine з роллю **Editor**
- [ ] Після запуску: видалити документи `seed-*`

## 2. Stripe (спершу test mode)

- [ ] Акаунт на Delphine, профіль бізнесу, IBAN
- [ ] Settings → Public details → **Terms of service URL** = `https://<домен>/cgv`
- [ ] Branding: колір `#9C5A33`, лого
- [ ] Ключ `sk_test_…` → `STRIPE_SECRET_KEY`
- [ ] Локально: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` → `STRIPE_WEBHOOK_SECRET`
- [ ] Пройти сценарії 1–9 з [README](../README.md#тест-сценарії-claudemd-13)

## 3. Resend

- [ ] Акаунт, домен → DNS-записи (SPF, DKIM) → Verified
- [ ] `RESEND_API_KEY`, `EMAIL_FROM="Delphine M. Créations <bonjour@<домен>>"`, `EMAIL_DELPHINE`
- [ ] Тестовий лист кожного типу (замовлення, відправка, sur-mesure, contact) — перевірити в Gmail і Apple Mail

## 4. Cloudflare Turnstile

- [ ] Віджет для домену (і `localhost` для тестів) → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

## 5. Sentry

- [ ] Проєкт Next.js → `SENTRY_DSN` = `NEXT_PUBLIC_SENTRY_DSN`
- [ ] `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` у Vercel (source maps)
- [ ] Alert: будь-яка нова помилка → e-mail Владу (особливо `stripeEvent`, «Paid order for a piece reserved by another checkout»)

## 6. Vercel

- [ ] Проєкт з репозиторію, власник — команда клієнтки (або передача пізніше)
- [ ] Усі змінні з `.env.example` для Production і Preview (Preview — test-ключі Stripe)
- [ ] `CRON_SECRET` (довгий випадковий рядок). Тариф: Pro для cron кожні 15 хв, інакше змінити `vercel.json` на щоденний
- [ ] Домен + `NEXT_PUBLIC_SITE_URL=https://<домен>`
- [ ] Analytics увімкнути в проєкті
- [ ] Sanity webhook (таблиця в README) на `https://<домен>/api/webhooks/sanity`, `SANITY_WEBHOOK_SECRET`

## 7. Meta

- [ ] Pixel у Business Manager клієнтки → `NEXT_PUBLIC_META_PIXEL_ID`
- [ ] Events Manager → Test events: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase (після згоди на cookies)

## 8. Перехід на live

- [ ] Stripe: активувати акаунт, `sk_live_…` у Vercel Production
- [ ] Stripe live webhook на `https://<домен>/api/webhooks/stripe` (4 події) → новий `STRIPE_WEBHOOK_SECRET`
- [ ] Одна реальна покупка дешевого товару → повернення коштів у Dashboard
- [ ] Lighthouse mobile ≥ 90 на головній, бутіку, товарі (на production, з реальними фото)
- [ ] `robots.txt`, `sitemap.xml` → Google Search Console
- [ ] Видалити `seed-*`, перевірити юридичні сторінки, футер (SIRET, TVA)
- [ ] Передати Delphine [інструкцію](GUIDE-DELPHINE.md) і показати Studio наживо
