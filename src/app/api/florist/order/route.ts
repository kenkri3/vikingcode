import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = `FL-${Math.floor(100000 + Math.random() * 900000)}`;
    return NextResponse.json({
      success: true,
      orderId,
      message: 'Bestilling mottatt! Vi har sendt en bekreftelse og ordredetaljer.',
      order: {
        ...body,
        id: orderId,
        status: 'Mottatt',
        createdAt: new Date().toISOString()
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
