import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { senderEmail, message } = await req.json();

    if (!senderEmail?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('Contact API: RESEND_API_KEY is not set');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'kleckiax@gmail.com',
      subject: `Nuevo mensaje de ${senderEmail} — Portfolio`,
      replyTo: senderEmail,
      text: `De: ${senderEmail}\n\nMensaje:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #14121A; margin-bottom: 4px;">Nuevo mensaje desde tu portfolio</h2>
          <hr style="border: none; border-top: 1px solid #E8E4DC; margin: 16px 0;" />
          <p style="color: #7A7585; font-size: 14px; margin: 0 0 4px;">De:</p>
          <p style="color: #14121A; font-size: 16px; font-weight: 600; margin: 0 0 20px;">${senderEmail}</p>
          <p style="color: #7A7585; font-size: 14px; margin: 0 0 4px;">Mensaje:</p>
          <p style="color: #14121A; font-size: 16px; white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
