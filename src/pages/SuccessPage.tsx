import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { trackDualEvent } from '../utils/dualAnalytics';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const checkoutId = searchParams?.get('checkout_id') || null;

  useEffect(() => {
    if (checkoutId) {
      trackDualEvent('checkout_success', {
        checkout_id: checkoutId,
        timestamp: new Date().toISOString(),
      });
    }
  }, [checkoutId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-gray-200 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Payment Successful!</CardTitle>
          <CardDescription className="mt-2">
            Thank you for your pre-order. You'll receive access to the AI Masterclass course soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {checkoutId && (
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600">Checkout ID</p>
              <p className="text-sm font-mono text-gray-900 mt-1">{checkoutId}</p>
            </div>
          )}
          
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>What's next?</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>You'll receive a confirmation email shortly</li>
              <li>Course access will be granted when the course launches</li>
              <li>Check your email for updates and exclusive content</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => router.push('/course-listing')}
              variant="outline"
              className="flex-1 border-gray-300"
            >
              Back to Course
            </Button>
            <Button
              onClick={() => router.push('/course')}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              View My Courses
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

