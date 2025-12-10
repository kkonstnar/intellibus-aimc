# Business Overview: Intellibus AI Masterclass

## 1. Business Description

**Intellibus** is a Software Engineering Consultancy that specializes in delivering cutting-edge technology education and professional development programs. In collaboration with **New York University (NYU)**, Intellibus is launching an online AI Masterclass course designed to provide comprehensive, industry-relevant training in artificial intelligence and machine learning.

The company focuses on bridging the gap between academic knowledge and practical industry application, offering courses that combine theoretical foundations with real-world implementation strategies. This partnership with NYU leverages the university's academic excellence and Intellibus's industry expertise to create a premium educational experience.

---

## 2. Product Offering: AI Masterclass Course

### What We Sell

The **AI Masterclass** is a comprehensive online course that provides students with in-depth knowledge and practical skills in artificial intelligence. The course is designed as a self-paced learning experience with interactive elements and community support.

### Features Included

1. **4+ Hours of Video Content**
   - High-quality, professionally produced video lectures
   - Structured curriculum covering fundamental and advanced AI topics
   - Accessible on-demand for flexible learning schedules

2. **Interactive Quizzes**
   - Assessment tools integrated throughout the course
   - Real-time feedback on understanding and progress
   - Helps reinforce key concepts and track learning outcomes

3. **Learning Resources for Each Topic**
   - Supplementary materials including articles, papers, and documentation
   - Code examples and practical exercises
   - Downloadable resources for offline study

4. **Access to Alumni Network**
   - Exclusive community access for course graduates
   - Networking opportunities with peers and industry professionals
   - Ongoing support and knowledge sharing platform

5. **Certification of Completion**
   - Official certificate upon successful course completion
   - NYU-branded credential demonstrating AI expertise
   - Verifiable certification for professional profiles and resumes

6. **Q&A Discussion Forum**
   - Interactive forum for student questions and instructor responses
   - Peer-to-peer learning and collaboration
   - Direct access to course instructors and teaching assistants

---

## 3. Polar Integration

### Current Implementation

Polar is fully integrated into the platform as the primary payment processing solution for course purchases. The integration is built using the **@polar-sh/better-auth** plugin, which seamlessly connects authentication and payment processing.

### Technical Integration Details

**Authentication & Customer Management:**

- Polar automatically creates customer records when users sign up
- Customer metadata includes user ID, email, and signup date
- Integrated with Better Auth for unified user management

**Checkout Process:**

- Product configured with slug: `ai-masterclass-preorder`
- Checkout flow accessible from course listing pages
- Supports both authenticated and unauthenticated checkouts
- Success redirect to `/success` page with checkout confirmation

**Webhook Integration:**

- Real-time payment event handling via Polar webhooks
- Tracks order payments, subscription activations, and customer state changes
- Integrated with PostHog analytics for payment event tracking
- Automatic event logging for business intelligence

**Customer Portal:**

- Self-service customer portal for managing subscriptions and payments
- Access to billing history and account management
- Seamless user experience for payment-related actions

### Integration Architecture

```
User Flow:
1. User browses course content on landing page
2. Clicks "Pre-order" or "Purchase" button
3. Polar checkout initialized via authClient.checkout()
4. User completes payment through Polar's secure checkout
5. Webhook confirms payment → User granted course access
6. Success page confirms purchase completion
```

**Key Configuration:**

- Environment variables: `POLAR_ACCESS_TOKEN`, `POLAR_PRODUCT_ID`, `POLAR_WEBHOOK_SECRET`
- Server environment: Sandbox (testing) or Production
- Webhook endpoint: `/polar/webhooks` for payment event processing

---

## 4. Customer Acquisition Channels

### Primary Channels

1. **Google Ads**
   - Targeted search and display advertising campaigns
   - Focus on keywords related to AI education, machine learning courses, and professional development
   - Retargeting campaigns for website visitors
   - A/B testing of ad creatives and landing pages

2. **University Groups & Partnerships**
   - Direct partnerships with university student organizations
   - Collaboration with NYU's network of academic departments
   - Outreach to computer science and engineering student groups
   - University-affiliated marketing channels and newsletters

3. **Content Marketing**
   - Educational blog posts and articles on AI topics
   - Free resources and syllabus previews to attract leads
   - SEO-optimized content to capture organic search traffic

4. **Social Media & Community**
   - LinkedIn targeting for senior engineers and tech professionals
   - Reddit and specialized tech communities
   - YouTube channel with course previews and free content

5. **Referral Program**
   - Alumni network referrals
   - Incentivized sharing for course graduates

### Target Audience

**Primary:**

- **Senior Engineers**: Experienced software engineers looking to upskill in AI/ML
- **University Students**: Computer science and engineering students seeking practical AI training

**Secondary:**

- Tech professionals transitioning to AI-focused roles
- Product managers and technical leaders needing AI literacy
- Career changers entering the technology field

### Marketing Strategy

- **Value Proposition**: NYU-branded certification + practical industry skills
- **Pricing Strategy**: Pre-order discounts and early-bird pricing
- **Conversion Optimization**: Landing page A/B testing, analytics tracking via PostHog and Google Analytics
- **Retention**: Alumni network access and ongoing community engagement

---

## Technical Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API routes, Better Auth
- **Database**: Prisma ORM with SQLite
- **Payment Processing**: Polar (via @polar-sh/better-auth)
- **Analytics**: PostHog, Google Analytics 4
- **Email**: Nodemailer for magic link authentication
- **Hosting**: Next.js deployment (configurable)

---

## Success Metrics

- Course enrollment rates
- Payment conversion rates (tracked via Polar webhooks)
- Student completion rates
- Alumni network engagement
- Customer acquisition cost (CAC) by channel
- Lifetime value (LTV) of enrolled students



