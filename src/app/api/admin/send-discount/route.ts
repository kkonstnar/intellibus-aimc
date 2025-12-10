// Send Discount Email API
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

export async function POST(request: NextRequest) {
  try {
    const { email, name, company } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "email and name are required" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const discountCode = `AIMC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const emailContent = {
      subject: "Your Exclusive AI Masterclass Discount",
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #111;">Hi ${name},</h2>
          
          <p>Thank you for your interest in the AI Masterclass! As requested, here's your exclusive discount.</p>
          
          <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="margin: 0 0 8px; color: #666; font-size: 14px;">Your discount code:</p>
            <p style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">${discountCode}</p>
            <p style="margin: 16px 0 0; color: #666; font-size: 14px;">
              Use this code to get <strong>$400</strong> (60% off!)
            </p>
          </div>
          
          <p>This brings your price down from $1,000 to just <strong>$400</strong>.</p>
          
          <a href="${appUrl}/course" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 16px 0;">
            Enroll Now
          </a>
          
          <p style="color: #666; font-size: 14px; margin-top: 24px;">
            This offer is exclusively for you${company ? ` at ${company}` : ""}. The code expires in 7 days.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            AI Masterclass by NYU & Intellibus
          </p>
        </body>
        </html>
      `,
      text: `Hi ${name},\n\nYour exclusive discount code: ${discountCode}\n\nThis brings your price to $400 (60% off!).\n\nEnroll at: ${appUrl}/course\n\n- AI Masterclass Team`,
    };

    const resend = getResend();

    if (resend) {
      await resend.emails.send({
        from: "AI Masterclass <onboarding@resend.dev>", // Change to your verified domain
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });
      console.log(`[DISCOUNT] Sent discount ${discountCode} to ${email}`);
    } else {
      console.log(`[DISCOUNT] Would send discount ${discountCode} to ${email}`);
    }

    return NextResponse.json({
      success: true,
      discountCode,
      message: resend ? "Email sent" : "Logged (email not configured)",
    });
  } catch (error) {
    console.error("[DISCOUNT] Error:", error);
    return NextResponse.json(
      { error: "Failed to send discount" },
      { status: 500 }
    );
  }
}

