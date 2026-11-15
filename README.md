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
  │           ├─ Server Components ──► Sanity CDN (read token; public dataset, personal data in path IDs)
  │           ├─ /api/checkout ──────► Sanity (ціни, залишок) ──► Stripe Checkout Session
  │           ├─ /api/webhooks/stripe ◄── Stripe (completed / async_payment_succeeded)
  │           ├─ /api/webhooks/sanity ◄── Sanity (публікація контенту, замовлення → shipped)
  │           └─ Server Actions (кошик, форми) ──► Sanity / Resend / Turnstile
  └─ Stripe hosted page (дані картки ніколи не проходять через наш код)
```

| Шлях | Роль |
| --- | --- |
| `src/app/(site)/…` | Публічні сторінки (Server Components за замовчуванням) |
| `src/app/studio/[[...tool]]` | Sanity Studio |
| `src/lib/sanity/data.ts` | Єдина точка читання контенту (кеш-теги `product`, `collection`, `page`, `settings`; фікстури в офлайн-режимі) |
| `src/lib/checkout.ts` | Створення сесії Stripe (ціни й залишок з Sanity, термін відправки) |
| `src/lib/delivery.ts` | Готові vs на замовлення, терміни, `MAX_QUANTITY` (клієнт і сервер) |
| `src/lib/orders.tsx` | Створення замовлення, номер `DMC-РРРР-NNNN`, списання залишку, листи |
| `src/lib/email/` | Шаблони React Email + відправка через Resend |
| `src/components/cart/` | Кошик: лише `{ id, qty }` у `localStorage`, ціни й залишок — з сервера |
| `src/components/consent/` | Cookie-банер; Vercel Analytics і Meta Pixel — тільки після згоди |

### Продаж: готові й на замовлення

Кожну прикрасу можна купити завжди. `stock` — готові екземпляри; решту Delphine виготовляє на замовлення.

1. Кошик → `POST /api/checkout { items: [{ productId, quantity }] }` (1–5 шт. на прикрасу, до 10 прикрас). Сервер читає товари з Sanity (ціни **тільки** звідти), перевіряє `vacationMode`. Резерву немає.
2. Термін відправки: `settings.shippingDays` (усе готове) або `madeToOrderDays` (хоч одну позицію треба виготовити) — показується на сторінці товару, в кошику, над кнопкою оплати Stripe (`custom_text.submit`) і в листі.
3. `checkout.session.completed` (або `async_payment_succeeded` для SEPA) → у **одній** транзакції: лічильник номерів `counters.orders`, `create` замовлення з `_id = orders.<sessionId>` (ID з крапкою не читається без токена — dataset публічний) і списання `stock` (`ifRevisionID` на опублікованому товарі, дзеркально в чернетці). Кожен рядок отримує `fromStock` і `toMake`.
4. Дві одночасні оплати останнього готового екземпляра: друга транзакція падає на ревізії, повторюється й стає «на замовлення» — `stock` ніколи не йде в мінус.
5. Повторна подія падає на `create` → нічого не дублюється, другий лист не йде (плюс idempotency key у Resend).

## Налаштування сервісів

Повний покроковий чекліст — у [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md). Коротко:

- **Sanity**: dataset `production` публічний (безкоштовний тариф). Персональні дані — лише в документах з `_id` через крапку (`orders.…`, `requests.…`), їх без токена не видно. Токени Viewer (`SANITY_API_READ_TOKEN`) і Editor (`SANITY_API_WRITE_TOKEN`). CORS: домен сайту + `http://localhost:3000` з credentials. Webhook — див. нижче.
- **Stripe**: Settings → Public details → Terms of service URL = `https://<домен>/cgv` (без нього `consent_collection` не працює). Webhook на `/api/webhooks/stripe` з подіями `checkout.session.completed` і `checkout.session.async_payment_succeeded`.
- **Resend**: верифікувати домен, `EMAIL_FROM="Delphine M. Créations <bonjour@домен>"`.
- **Turnstile**: сайт-ключ і секрет для домену.
- **Vercel**: усі змінні з `.env.example`. Cron не потрібен (тариф Hobby підходить).

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
| 1 | Купити 1 товар зі `stock` ≥ 1 карткою `4242 4242 4242 4242` | Order у Studio, `stock` −1, рядок «prêt», 2 листи |
| 2 | `stock: 1`, дві вкладки купують той самий товар і обидві платять | Обидва orders, `stock` 0 (не −1), у другому `toMake: 1`, лист Delphine «(à fabriquer)» |
| 3 | `stock: 1`, у кошику 3 шт. → оплатити; окремо — закрити Stripe без оплати | `fromStock: 1`, `toMake: 2`, у Stripe й листі — термін «на замовлення»; без оплати нічого не змінюється |
| 4 | `stripe events resend evt_…` для `completed` | Один order, жодного нового листа |
| 5 | `curl -X POST localhost:3000/api/webhooks/stripe -H "stripe-signature: x" -d '{}'` | 400, нічого не змінено |
| 6 | `curl -X POST localhost:3000/api/checkout -H "Content-Type: application/json" -d '{"items":[{"productId":"…","quantity":1}],"price":1}'`; те саме з `"quantity":6` | Ціна з Sanity (поле `price` ігнорується); `quantity` 6 → 400 |
| 7 | Картки `4000 0000 0000 0002` (відмова) і `4000 0025 0000 3155` (3DS) | Відмова — Stripe показує помилку, нічого не змінено; 3DS — оплата після підтвердження |
| 8 | Réglages → Mode vacances | Кнопки купівлі вимкнені, банер, `/api/checkout` → 409 |
| 9 | Commande → Expédiée + трек-номер → Publish | Лист «Votre colis est parti» (один раз) |
| 10 | Повернення в Stripe Dashboard | Фаза 2 (`charge.refunded` → `refunded`) |

