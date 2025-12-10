// Check user milestones and send automated emails
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

// Milestone thresholds and email types
const MILESTONES = [
  {
    percent: 25,
    emailType: "milestone_25",
    subject: "You're making progress! 🎯",
  },
  { percent: 50, emailType: "milestone_50", subject: "Halfway there! 🚀" },
  { percent: 75, emailType: "milestone_75", subject: "Almost finished! 💪" },
  { percent: 100, emailType: "milestone_100", subject: "Congratulations! 🎉" },
];

const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

const getMilestoneEmail = (
  percent: number,
  userName: string,
  appUrl: string
) => {
  const name = userName || "there";

  if (percent === 25) {
    return {
      subject: "You're making great progress! 🎯",
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #111;">Great start, ${name}!</h2>
          <p>You've completed 25% of the AI Masterclass. Keep up the momentum!</p>
          <p>Pro tip: Even 15 minutes a day can help you finish the course in no time.</p>
          <a href="${appUrl}/course" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">Continue Learning</a>
        </div>
      `,
    };
  }

  if (percent === 50) {
    return {
      subject: "Halfway there! 🚀",
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #111;">You're halfway done, ${name}!</h2>
          <p>50% complete - you're making excellent progress on the AI Masterclass.</p>
          <p>The best insights are still ahead. Keep going!</p>
          <a href="${appUrl}/course" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">Continue Learning</a>
        </div>
      `,
    };
  }

  if (percent === 75) {
    return {
      subject: "Almost at the finish line! 💪",
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #111;">75% complete, ${name}!</h2>
          <p>You're so close to finishing the AI Masterclass. Just a few more lessons to go!</p>
          <p>Push through and earn your certificate.</p>
          <a href="${appUrl}/course" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">Finish the Course</a>
        </div>
      `,
    };
  }

  // 100%
  return {
    subject: "Congratulations on completing AI Masterclass! 🎉",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; font-size: 48px; margin-bottom: 20px;">🎓</div>
        <h2 style="color: #111; text-align: center;">Congratulations, ${name}!</h2>
        <p style="text-align: center;">You've completed the entire AI Masterclass. You now have a solid foundation in AI for business.</p>
        <p style="text-align: center;">What's next?</p>
        <ul>
          <li>Apply what you learned in your organization</li>
          <li>Share your achievement</li>
          <li>Consider our advanced programs</li>
        </ul>
        <a href="${appUrl}/course" style="display: block; background: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px; text-align: center;">View Certificate</a>
      </div>
    `,
  };
};

// POST - Check and send milestone emails for a specific user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, completionPercent } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Find which milestone they just hit
    const milestone = MILESTONES.find((m) => m.percent === completionPercent);
    if (!milestone) {
      return NextResponse.json({ message: "No milestone hit" });
    }

    // Check if we already sent this milestone email
    const existingEmail = await prisma.emailNotification.findFirst({
      where: {
        userId,
        type: milestone.emailType,
      },
    });

    if (existingEmail) {
      return NextResponse.json({ message: "Milestone email already sent" });
    }

    // Get email content
    const emailContent = getMilestoneEmail(
      milestone.percent,
      user.name,
      appUrl
    );
    const resend = getResend();

    if (resend) {
      await resend.emails.send({
        from: "AI Masterclass <onboarding@resend.dev>", // Change to your verified domain
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
      });
      console.log(`[AUTO EMAIL] Sent ${milestone.emailType} to ${user.email}`);
    } else {
      console.log(
        `[AUTO EMAIL] Would send ${milestone.emailType} to ${user.email}`
      );
    }

    // Record the email
    await prisma.emailNotification.create({
      data: {
        userId,
        email: user.email,
        type: milestone.emailType,
        subject: emailContent.subject,
        status: resend ? "sent" : "logged",
        sentAt: resend ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      milestone: milestone.percent,
      emailSent: !!resend,
    });
  } catch (error) {
    console.error("[AUTO EMAIL] Error:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
