// Admin Send Email API
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

// Create Resend client
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

// Email templates
const getEmailContent = (
  type: string,
  user: { name?: string | null; email: string },
  stats?: {
    completed: number;
    total: number;
    watchTime: number;
    percentage: number;
  }
) => {
  const name = user.name || "there";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  switch (type) {
    case "reminder":
      return {
        subject: "Continue Your AI Masterclass Journey",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${appUrl}/AIMC_Angled_Horiz_w Title_Violet.png" alt="AI Masterclass" style="height: 40px;">
            </div>
            
            <h2 style="color: #1a1a1a; margin-bottom: 20px;">Hey ${name}! 👋</h2>
            
            <p>We noticed you haven't visited the AI Masterclass recently. Your progress is saved and waiting for you!</p>
            
            <p>Learning AI skills is one of the best investments you can make for your career. Even just 15 minutes a day can make a huge difference.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${appUrl}/course" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Continue Learning</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Keep building your AI expertise!</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              AI Masterclass by NYU & Intellibus
            </p>
          </body>
          </html>
        `,
        text: `Hey ${name}!\n\nWe noticed you haven't visited the AI Masterclass recently. Your progress is saved and waiting for you!\n\nContinue Learning: ${appUrl}/course\n\n- AI Masterclass Team`,
      };

    case "progress":
      return {
        subject: "Your AI Masterclass Progress Report 📊",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${appUrl}/AIMC_Angled_Horiz_w Title_Violet.png" alt="AI Masterclass" style="height: 40px;">
            </div>
            
            <h2 style="color: #1a1a1a; margin-bottom: 20px;">Your Progress Report</h2>
            
            <p>Hey ${name}! Here's how you're doing in the AI Masterclass:</p>
            
            <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                <div style="text-align: center; flex: 1;">
                  <div style="font-size: 28px; font-weight: bold; color: #7c3aed;">${stats?.completed || 0}</div>
                  <div style="font-size: 12px; color: #666;">Modules Done</div>
                </div>
                <div style="text-align: center; flex: 1;">
                  <div style="font-size: 28px; font-weight: bold; color: #7c3aed;">${stats?.percentage || 0}%</div>
                  <div style="font-size: 12px; color: #666;">Complete</div>
                </div>
                <div style="text-align: center; flex: 1;">
                  <div style="font-size: 28px; font-weight: bold; color: #7c3aed;">${Math.round((stats?.watchTime || 0) / 60)}m</div>
                  <div style="font-size: 12px; color: #666;">Watched</div>
                </div>
              </div>
              
              <div style="background: #e5e7eb; border-radius: 9999px; height: 8px; overflow: hidden;">
                <div style="background: #7c3aed; height: 100%; width: ${stats?.percentage || 0}%; border-radius: 9999px;"></div>
              </div>
            </div>
            
            <p>${
              (stats?.percentage || 0) >= 100
                ? "🎉 Congratulations! You've completed the course!"
                : `You're ${stats?.total || 6 - (stats?.completed || 0)} modules away from completing the course. Keep going!`
            }</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${appUrl}/course" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Continue Learning</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              AI Masterclass by NYU & Intellibus
            </p>
          </body>
          </html>
        `,
        text: `Your Progress Report\n\nHey ${name}! Here's how you're doing:\n\n- Modules Completed: ${stats?.completed || 0}/${stats?.total || 6}\n- Progress: ${stats?.percentage || 0}%\n- Watch Time: ${Math.round((stats?.watchTime || 0) / 60)} minutes\n\nContinue Learning: ${appUrl}/course\n\n- AI Masterclass Team`,
      };

    case "completion":
      return {
        subject: "Congratulations on Completing AI Masterclass! 🎉",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${appUrl}/AIMC_Angled_Horiz_w Title_Violet.png" alt="AI Masterclass" style="height: 40px;">
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 64px;">🎓</div>
            </div>
            
            <h2 style="color: #1a1a1a; margin-bottom: 20px; text-align: center;">Congratulations, ${name}!</h2>
            
            <p style="text-align: center; font-size: 18px;">You've completed the AI Masterclass!</p>
            
            <p>You're now equipped with essential AI knowledge for business leaders. Here's what you can do next:</p>
            
            <ul style="margin: 20px 0; padding-left: 20px;">
              <li style="margin-bottom: 10px;">Apply what you've learned in your organization</li>
              <li style="margin-bottom: 10px;">Share your achievement on LinkedIn</li>
              <li style="margin-bottom: 10px;">Explore our advanced programs</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${appUrl}/course" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Your Certificate</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              AI Masterclass by NYU & Intellibus
            </p>
          </body>
          </html>
        `,
        text: `Congratulations, ${name}!\n\nYou've completed the AI Masterclass!\n\nYou're now equipped with essential AI knowledge for business leaders.\n\nView Your Certificate: ${appUrl}/course\n\n- AI Masterclass Team`,
      };

    default:
      return {
        subject: "AI Masterclass Update",
        html: `<p>Hello ${name},</p><p>Thank you for being part of the AI Masterclass.</p>`,
        text: `Hello ${name},\n\nThank you for being part of the AI Masterclass.`,
      };
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, customSubject, customMessage } = body;

    if (!userId || !type) {
      return NextResponse.json(
        { error: "userId and type are required" },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { courseProgress: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate user stats
    const totalModules = (await prisma.courseModule.count()) || 6;
    const stats = {
      completed: user.courseProgress.filter((p) => p.completed).length,
      total: totalModules,
      watchTime: user.courseProgress.reduce(
        (sum, p) => sum + p.watchedSeconds,
        0
      ),
      percentage: Math.round(
        (user.courseProgress.filter((p) => p.completed).length / totalModules) *
          100
      ),
    };

    // Get email content
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    let emailContent;

    if (type === "offer" && customSubject && customMessage) {
      emailContent = {
        subject: customSubject,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #111;">Hey ${user.name || "there"},</h2>
            <div style="white-space: pre-wrap;">${customMessage}</div>
            <a href="${appUrl}/course" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">View Course</a>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">AI Masterclass by NYU & Intellibus</p>
          </body>
          </html>
        `,
        text: `Hey ${user.name || "there"},\n\n${customMessage}\n\nView Course: ${appUrl}/course`,
      };
    } else {
      emailContent = getEmailContent(type, user, stats);
    }

    // Get Resend client
    const resend = getResend();

    if (resend) {
      // Send email
      await resend.emails.send({
        from: "AI Masterclass <onboarding@resend.dev>", // Change to your verified domain
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      console.log(`[EMAIL] Sent ${type} email to ${user.email}`);
    } else {
      console.log(
        `[EMAIL] Would send ${type} email to ${user.email} (email not configured)`
      );
      console.log(`[EMAIL] Subject: ${emailContent.subject}`);
    }

    // Record the notification
    await prisma.emailNotification.create({
      data: {
        userId,
        email: user.email,
        type,
        subject: emailContent.subject,
        status: resend ? "sent" : "pending",
        sentAt: resend ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: resend
        ? "Email sent successfully"
        : "Email logged (email not configured)",
    });
  } catch (error) {
    console.error("[ADMIN] Send email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
