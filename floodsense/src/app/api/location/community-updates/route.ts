import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSuccess } from '@/lib/responseHandler';

function formatTimeAgo(date: Date): string {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} hr ago`;
  return `${Math.floor(sec / 86400)} days ago`;
}

/**
 * Returns community updates (alerts) - optionally filtered by radius.
 * Districts don't have coordinates; we return all active alerts as nearby.
 * In production, add lat/lng to District or use a geo lookup.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const _radius = searchParams.get('radius');

  const alerts = await prisma.alert.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { issuedAt: 'desc' },
    take: 10,
    include: {
      district: true,
    },
  });

  const updates = alerts.map((a) => ({
    id: a.id,
    district: a.district.name,
    severity: a.severity,
    title: a.title,
    message: a.message,
    time: formatTimeAgo(a.issuedAt),
    status: a.status,
  }));

  return sendSuccess({ updates });
}
