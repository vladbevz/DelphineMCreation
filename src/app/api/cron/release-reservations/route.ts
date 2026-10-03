import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { serverEnv } from '@/lib/env.server';
import { revalidateCatalog } from '@/lib/orders';
import { releaseExpiredReservations } from '@/lib/reservations';

/** Safety net if a checkout.session.expired webhook never arrived. Called by Vercel Cron. */
export async function GET(request: Request) {
  const secret = serverEnv.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const released = await releaseExpiredReservations();
    if (released > 0) revalidateCatalog();
    return NextResponse.json({ released });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
