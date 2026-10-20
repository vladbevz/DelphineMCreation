# Чекліст підключення і запуску

Усі акаунти створюються **на клієнтку** (власниця — Delphine, Влад — учасник/адмін). Позначай `[x]` по ходу.

## 0. Отримати від клієнтки (CLAUDE.md §15)

- [ ] Домен і точна назва бренду
- [x] Реквізити (INSEE/RNE, 19.10.2026): EI Delphine De Meulemeester, SIRET 104 189 527 00013, 4 rue de la Farigoule 30870 Clarensac, tel, e-mail → `owner` у `src/lib/sanity/legalDrafts.ts`, вписано в юридичні сторінки, CGV і Réglages (seed)
- [ ] Підтвердити: micro-entreprise + franchise en base TVA (є номер TVA FR61104189527 — «TVA non applicable, art. 293 B» лише якщо franchise); чи згодна публікувати домашню адресу (інакше domiciliation); публічний e-mail — gmail чи bonjour@домен
- [ ] Тексти: CGV, mentions légales, livraison et retours, confidentialité, entretien, L'atelier, hero, переваги
- [ ] Тариф Colissimo і поріг безкоштовної доставки; самовивіз так/ні; хто платить зворотну доставку
- [ ] Терміни відправки (для сторінки товару, листів і `delivery_estimate` у Stripe — `src/lib/checkout.ts`)
- [ ] Фото товарів і для сторінки L'atelier, блоку Instagram. Зараз там стокові фото Unsplash (`src/lib/photos.ts`) — замінити: покласти в `assets/photos/` з тими ж іменами → `pnpm images`
- [ ] Посилання на Instagram/Facebook, e-mail і телефон для сайту
- [ ] Бухгалтер Delphine: чи потрібна facture для B2C-продажів (зараз — «на запит», вручну); чи вмикати Stripe `invoice_creation` (платно)
- [ ] Юридичні сторінки (CGV, mentions légales, livraison et retours, confidentialité): чернетки в `src/lib/sanity/legalDrafts.ts`, `pnpm seed` створює їх у Studio → Pages. Заповнити всі `[À COMPLÉTER]` / `[À DÉCIDER]` / `[À VALIDER]` у Studio, прибрати абзац «Projet à valider», звірити адресу хостингу Vercel і прив'язку сервісів (Analytics, Sentry retention) з реальними налаштуваннями
- [ ] Проєкт CGV: `docs/legal/cgv.html` (джерело) → `docs/legal/CGV-PROJET.pdf`. Заповнити всі `[À COMPLÉTER]`, вирішити: хто платить повернення, виняток для сережок (гігієна), acompte для sur-mesure, медіатор (обов'язково). Дати на перевірку юристу/CCI, прибрати рамку «PROJET», перегенерувати PDF (Chrome → Друк → Зберегти як PDF, A4, з фоном) → Réglages → CGV (PDF); той самий текст — у Pages → cgv
- [ ] CGV мають містити: droit de rétractation 14 днів і як повертати; виняток для sur-mesure (L221-28 3°); «facture sur demande»; TVA non applicable
- [ ] Погодити тексти, які я написав сам (позначені у звітах етапів): hero, «Réservé», «Vendu», банер cookies, листи, зокрема короткий абзац «Droit de rétractation» у листі — `src/lib/email/templates/WithdrawalInfo.tsx`)

## 1. Sanity

- [x] sanity.io → проєкт, dataset `production` (публічний, free; замовлення і запити — `orders.…`/`requests.…`, перевірено: без токена не читаються)
- [x] API → CORS: `http://localhost:3000` з **Allow credentials**
- [ ] CORS: адреса Vercel і `https://<домен>`, з **Allow credentials**
- [x] API → Tokens: `site-read` (Viewer), `site-write` (Editor)
- [x] `.env.local` і Vercel: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`
- [x] `pnpm exec sanity login` → `pnpm seed` → перевірити `/studio` і головну
- [ ] Перевірити: SVG-плейсхолдери з seed віддаються CDN і `next/image`; blur (LQIP); OG-картинка товару
- [x] Критерій етапу 1: створити товар у Studio → опублікувати → з'являється на сайті (≤ 60 с або одразу з вебхуком)
- [ ] Réglages: тариф Colissimo, поріг, самовивіз, контакти, Instagram
- [ ] Réglages → Documents légaux: **PDF CGV** і **поштова адреса** (йдуть у лист-підтвердження з бланком відмови, L221-13). Перевірити, що PDF прикріпився в тестовому замовленні
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

- [ ] **Видалити `DEMO_MODE` з Environment Variables у Vercel** (інакше сайт закритий від індексації, а перевірка ключів вимкнена) → Redeploy
- [ ] Stripe: активувати акаунт, `sk_live_…` у Vercel Production
- [ ] Stripe live webhook на `https://<домен>/api/webhooks/stripe` (4 події) → новий `STRIPE_WEBHOOK_SECRET`
- [ ] Одна реальна покупка дешевого товару → повернення коштів у Dashboard
- [ ] Lighthouse mobile ≥ 90 на головній, бутіку, товарі (на production, з реальними фото)
- [ ] `robots.txt`, `sitemap.xml` → Google Search Console
- [ ] Видалити `seed-*`, перевірити юридичні сторінки, футер (SIRET, TVA)
- [ ] Передати Delphine [інструкцію](GUIDE-DELPHINE.md) і показати Studio наживо
