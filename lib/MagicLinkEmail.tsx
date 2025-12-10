import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface MagicLinkEmailProps {
  email: string;
  magicLinkUrl: string;
  userId: string;
  trackingUrl: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || 'http://localhost:3000';

export const MagicLinkEmail = ({
  email,
  magicLinkUrl,
  userId,
  trackingUrl,
}: MagicLinkEmailProps) => {
  // Create tracking URL for the magic link (use /api/track/click route)
  const trackedLink = `${trackingUrl}/api/track/click?redirect=${encodeURIComponent(
    magicLinkUrl
  )}&user_id=${encodeURIComponent(userId)}`;
  
  // Image URL with proper encoding for the space in filename
  const imageUrl = `${trackingUrl}/${encodeURIComponent('AIMC_Angled_Horiz_w Title_Violet.png')}`;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Access your free AI Masterclass course</Preview>
        <Container style={container}>
          <Section style={header}>
            <Heading style={heading}>Access Your Course</Heading>
          </Section>

          <Section style={content}>
            <Text style={text}>
              Click the link below to access your free AI Masterclass course.
              This link will expire in 15 minutes.
            </Text>

            <Link href={trackedLink} style={button}>
              Access Your Course →
            </Link>

            <Text style={textSmall}>
              Or, copy and paste this link into your browser:
            </Text>

            <Text style={codeBlock}>{magicLinkUrl}</Text>

            <Text style={textSmall}>
              If you didn&apos;t request this email, you can safely ignore it.
            </Text>
          </Section>

          <Section style={footer}>
            <Img
              src={imageUrl}
              width="120"
              height="auto"
              alt="AI Masterclass"
              style={logo}
            />
            <Text style={footerText}>
              <Link href={baseUrl} style={footerLink}>
                AI Masterclass
              </Link>
              , presented by NYU and Intellibus
              <br />
              Learn how executives and business leaders can effectively think
              about, strategize, and implement AI in their organizations.
            </Text>
          </Section>

          {/* Email open tracking pixel */}
          <Img
            src={`${trackingUrl}/api/track/email-open?user_id=${encodeURIComponent(
              userId
            )}&email=${encodeURIComponent(email)}`}
            width="1"
            height="1"
            alt=""
            style={trackingPixel}
          />
        </Container>
      </Body>
    </Html>
  );
};

// Styles matching Notion's clean aesthetic
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 24px 0',
};

const heading = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#333333',
  margin: '0 0 10px',
  padding: '0',
};

const content = {
  padding: '0 24px',
};

const text = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#333333',
  margin: '0 0 24px',
};

const textSmall = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#ababab',
  margin: '24px 0 8px',
};

const button = {
  backgroundColor: '#4C1D95', // Dark violet/purple to match AIMC branding
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  margin: '24px 0',
  width: 'fit-content',
};

const codeBlock = {
  backgroundColor: '#f4f4f4',
  borderRadius: '6px',
  border: '1px solid #eeeeee',
  color: '#333333',
  fontSize: '13px',
  fontFamily: 'Monaco,Menlo,monospace',
  padding: '12px',
  margin: '8px 0 24px',
  wordBreak: 'break-all' as const,
  lineHeight: '1.5',
};

const footer = {
  padding: '32px 24px 0',
  borderTop: '1px solid #eeeeee',
  marginTop: '32px',
};

const logo = {
  marginBottom: '12px',
};

const footerText = {
  fontSize: '12px',
  lineHeight: '1.5',
  color: '#898989',
  margin: '0',
};

const footerLink = {
  color: '#898989',
  textDecoration: 'underline',
};

const trackingPixel = {
  display: 'none',
  opacity: 0,
  position: 'absolute' as const,
  width: '1px',
  height: '1px',
};

export default MagicLinkEmail;

