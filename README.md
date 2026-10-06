# Delphine M. Créations

Інтернет-бутік прикрас зі шкіри ручної роботи. Next.js (App Router) + Sanity + Stripe Checkout, хостинг на Vercel.
Повний бриф і правила — у [CLAUDE.md](CLAUDE.md). Інструкція для клієнтки (французькою) — [docs/GUIDE-DELPHINE.md](docs/GUIDE-DELPHINE.md). Чекліст запуску — [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md).

## Швидкий старт

```bash
pnpm install
cp .env.example .env.local   # можна залишити порожнім — див. «Офлайн-режим»
pnpm dev                     # http://localhost:3000, Studio на /studio
```

| Команда | Що робить |
| --- | --- |
| `pnpm dev` / `build` / `start` | Next.js |
| `pnpm lint` / `typecheck` / `format` | ESLint, `tsc --noEmit`, Prettier |
| `pnpm typegen` | Витягує схему Sanity і генерує типи для GROQ-запитів (`src/sanity/types.ts`). Запускати після зміни схем або запитів |
| `pnpm seed` | Тестові дані в Sanity (потрібен `pnpm exec sanity login`). Документи з `_id` `seed-*` прибрати перед запуском |

### Офлайн-режим

Без `NEXT_PUBLIC_SANITY_PROJECT_ID` сайт бере тестові дані з `src/lib/sanity/fixtures.ts` (8 товарів, 2 колекції): усі сторінки й кошик працюють. Без ключів Stripe `/api/checkout` відповідає 503 і кошик показує «paiement pas encore disponible». Без Resend листи пишуться в лог. На Vercel **production** усі ключі обов'язкові — збірка впаде зі списком відсутніх (`src/lib/env.ts`). Виняток — демо-деплой до підключення акаунтів: `DEMO_MODE=1` у Vercel вимикає перевірку й закриває сайт від індексації (`robots.txt` + `noindex`). Прибрати перед запуском.

## Архітектура

```
Браузер ──► Next.js (Vercel)
  │           ├─ Server Components ──► Sanity CDN (read token, dataset private)
  │           ├─ /api/checkout ──────► Sanity (резерв, transaction + ifRevisionID) ──► Stripe Checkout Session
  │           ├─ /api/webhooks/stripe ◄── Stripe (completed / expired / async_*)
  │           ├─ /api/webhooks/sanity ◄── Sanity (публікація контенту, замовлення → shipped)
  │           ├─ /api/cron/release-reservations ◄── Vercel Cron
  │           └─ Server Actions (кошик, форми) ──► Sanity / Resend / Turnstile
  └─ Stripe hosted page (дані картки ніколи не проходять через наш код)
```

| Шлях | Роль |
| --- | --- |
| `src/app/(site)/…` | Публічні сторінки (Server Components за замовчуванням) |
| `src/app/studio/[[...tool]]` | Sanity Studio |
| `src/lib/sanity/data.ts` | Єдина точка читання контенту (кеш-теги `product`, `collection`, `page`, `settings`; фікстури в офлайн-режимі) |
| `src/lib/checkout.ts`, `reservations.ts` | Резерв pièce unique і створення сесії Stripe |
| `src/lib/orders.tsx` | Створення замовлення, номер `DMC-РРРР-NNNN`, позначка «sold», листи |
| `src/lib/email/` | Шаблони React Email + відправка через Resend |
| `src/components/cart/` | Кошик: лише id товарів у `localStorage`, ціни/наявність — з сервера |
| `src/components/consent/` | Cookie-банер; Vercel Analytics і Meta Pixel — тільки після згоди |

### Продаж pièce unique

1. Кошик → `POST /api/checkout { productIds }`. Сервер читає товари з Sanity (ціни **тільки** звідти), перевіряє `vacationMode` і наявність.
2. Резерв однією транзакцією з `ifRevisionID` на кожен товар: дві вкладки, що купують ту саму прикрасу, — друга отримує 409. Статус пишеться і в опублікований документ, і в чернетку (якщо Delphine її відкрила), інакше публікація чернетки повернула б `available`.
3. Резерв має `reservationToken` (також у `metadata` сесії Stripe) і `reservedUntil` = 32 хв. Сесія Stripe живе 31 хв (мінімум Stripe — 30).
4. Повернення зі Stripe через «Annuler» або новий checkout з того ж браузера одразу закриває стару сесію й знімає резерв (не треба чекати 30 хв).
5. `checkout.session.completed` → у **одній** транзакції: лічильник номерів у `settings` (`ifRevisionID`), `create` замовлення з `_id = order-<sessionId>` і `sold` для товарів. Повторна подія падає на `create` → нічого не дублюється, другий лист не йде (плюс idempotency key у Resend).
6. `expired` / `async_payment_failed` → знімає резерви з цим токеном. Cron кожні 15 хв — страховка.
7. Оплати з відкладеним підтвердженням (SEPA): `completed` з `unpaid` продовжує резерв на 7 днів, замовлення створюється на `async_payment_succeeded`.

## Налаштування сервісів

Повний покроковий чекліст — у [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md). Коротко:

- **Sanity**: dataset `production` **private** (у ньому персональні дані). Токени Viewer (`SANITY_API_READ_TOKEN`) і Editor (`SANITY_API_WRITE_TOKEN`). CORS: домен сайту + `http://localhost:3000` з credentials. Webhook — див. нижче.
- **Stripe**: Settings → Public details → Terms of service URL = `https://<домен>/cgv` (без нього `consent_collection` не працює). Webhook на `/api/webhooks/stripe` з подіями `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`.
- **Resend**: верифікувати домен, `EMAIL_FROM="Delphine M. Créations <bonjour@домен>"`.
- **Turnstile**: сайт-ключ і секрет для домену.
- **Vercel**: усі змінні з `.env.example`, `CRON_SECRET`. Cron кожні 15 хв потребує тарифу **Pro**; на Hobby поставити `0 3 * * *` у `vercel.json` (основний механізм — вебхук `expired`).

### Sanity webhook

| Поле | Значення |
| --- | --- |
| URL | `https://<домен>/api/webhooks/sanity` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type in ["product", "collection", "page", "settings"] \|\| (_type == "order" && status == "shipped")` |
| Projection | `{_id, _type}` |
| Drafts | вимкнено |
| Secret | значення `SANITY_WEBHOOK_SECRET` |

## Тест-сценарії (CLAUDE.md §13)

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe   # скопіювати whsec_… у STRIPE_WEBHOOK_SECRET
```

| # | Як перевірити | Очікування |
| --- | --- | --- |
| 1 | Купити 1 товар карткою `4242 4242 4242 4242` | Order у Studio, товар `Vendu`, 2 листи |
| 2 | Дві вкладки, той самий товар, «Passer commande» майже одночасно | Одна йде у Stripe, друга бачить «viennent d'être réservées» |
| 3 | Закрити Stripe без оплати; або `stripe checkout sessions expire cs_…` | Товар знову доступний (одразу при «Annuler», або після `expired`/cron) |
| 4 | `stripe events resend evt_…` для `completed` | Один order, жодного нового листа |
| 5 | `curl -X POST localhost:3000/api/webhooks/stripe -H "stripe-signature: x" -d '{}'` | 400, нічого не змінено |
| 6 | `curl -X POST localhost:3000/api/checkout -H "Content-Type: application/json" -d '{"productIds":["…"],"price":1}'` | Ціна з Sanity (поле `price` ігнорується) |
| 7 | Картки `4000 0000 0000 0002` (відмова) і `4000 0025 0000 3155` (3DS) | Відмова — Stripe показує помилку, резерв живе до `expired`; 3DS — оплата після підтвердження |
| 8 | Réglages → Mode vacances | Кнопки купівлі вимкнені, банер, `/api/checkout` → 409 |
| 9 | Commande → Expédiée + трек-номер → Publish | Лист «Votre colis est parti» (один раз) |
| 10 | Повернення в Stripe Dashboard | Фаза 2 (`charge.refunded` → `refunded`) |

Cron локально: `curl -H "Authorization: Bearer $CRON_SECRET" localhost:3000/api/cron/release-reservations`.
