"use client";

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Play, Loader2, CheckCircle, Gift } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { sendMagicLink, authClient } from '../lib/auth-client'
import { trackDualEvent } from '../utils/dualAnalytics'

export default function CourseSidebar() {
  const [activeTab, setActiveTab] = useState<'paid' | 'free'>('paid')
  const [showFreeEmailDialog, setShowFreeEmailDialog] = useState(false)
  const [showWishlistDialog, setShowWishlistDialog] = useState(false)
  const [showDiscountDialog, setShowDiscountDialog] = useState(false)
  const [email, setEmail] = useState('')
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  
  // Discount form state
  const [discountForm, setDiscountForm] = useState({
    name: '',
    email: '',
    company: '',
    jobTitle: ''
  })
  const [discountSubmitted, setDiscountSubmitted] = useState(false)
  const [discountLoading, setDiscountLoading] = useState(false)
  
  const handleFreeEnroll = async () => {
    if (!email) return
    
    setLoading(true)
    setError(null)

    // Track form submission
    trackDualEvent('course_email_form_submitted', {
      email,
      source: 'course_listing_sidebar',
      timestamp: new Date().toISOString(),
    })

    // Send magic link
    const result = await sendMagicLink(email)

    if (result.success) {
      setEmailSent(true)
      trackDualEvent('magic_link_request_success', {
        email,
        source: 'course_listing_sidebar',
        timestamp: new Date().toISOString(),
      })
      // Keep dialog open to show success message
    } else {
      setError(result.error || 'Failed to send magic link. Please try again.')
      trackDualEvent('magic_link_request_failed', {
        email,
        error: result.error,
        source: 'course_listing_sidebar',
        timestamp: new Date().toISOString(),
      })
    }

    setLoading(false)
  }
  
  const handleWishlist = () => {
    console.log('[v0] Added to wishlist with email:', email)
    // In production, this would send to your backend
    setShowWishlistDialog(false)
    setEmail('')
  }
  
  const handleCloseFreeDialog = () => {
    setShowFreeEmailDialog(false)
    setEmail('')
    setEmailSent(false)
    setError(null)
  }
  
  const handleDiscountSubmit = async () => {
    if (!discountForm.name || !discountForm.email || !discountForm.company || !discountForm.jobTitle) return
    
    setDiscountLoading(true)
    setError(null)
    
    // Track discount form submission
    trackDualEvent('discount_form_submitted', {
      name: discountForm.name,
      email: discountForm.email,
      company: discountForm.company,
      jobTitle: discountForm.jobTitle,
      source: 'course_listing_sidebar',
      timestamp: new Date().toISOString(),
    })
    
    try {
      // Send to backend API
      const response = await fetch('/api/course/discount-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discountForm),
      })
      
      if (response.ok) {
        setDiscountSubmitted(true)
        trackDualEvent('discount_form_success', {
          email: discountForm.email,
          timestamp: new Date().toISOString(),
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit request')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      trackDualEvent('discount_form_failed', {
        email: discountForm.email,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      })
    }
    
    setDiscountLoading(false)
  }
  
  const handleCloseDiscountDialog = () => {
    setShowDiscountDialog(false)
    setDiscountForm({ name: '', email: '', company: '', jobTitle: '' })
    setDiscountSubmitted(false)
    setError(null)
  }
  
  const handlePreOrder = async () => {
    setCheckoutLoading(true)
    setError(null)
    
    try {
      trackDualEvent('preorder_button_clicked', {
        source: 'course_listing_sidebar',
        timestamp: new Date().toISOString(),
      })
      
      console.log('Starting Polar checkout...')
      
      // Initialize Polar checkout
      const result = await authClient.checkout({
        slug: 'ai-masterclass-preorder',
      })
      
      console.log('Checkout result:', result)
      
      // If checkout returns a URL, redirect manually
      const data = result?.data as { url?: string; checkoutUrl?: string } | undefined
      if (data?.url) {
        window.location.href = data.url
      } else if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
      
      // Note: The checkout should redirect automatically, but if not, we handle it above
    } catch (error) {
      console.error('Checkout error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(`Failed to start checkout: ${errorMessage}. Please make sure the server is running and Polar is configured.`)
      trackDualEvent('checkout_failed', {
        error: errorMessage,
        timestamp: new Date().toISOString(),
      })
      setCheckoutLoading(false)
    }
  }
  
  return (
    <>
      <div className="lg:sticky lg:top-8 space-y-4">
        <Card className="overflow-hidden border-2 border-gray-200 shadow-lg">
          <div className="relative aspect-video bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 overflow-hidden group">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src="/executive-in-professional-setting-with-ai-technolo.jpg"
                alt="Course preview"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-300"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
            
            {/* Play Button */}
            <button 
              onClick={() => setIsPlayingVideo(true)}
              className="absolute inset-0 flex items-center justify-center group/play z-10"
              aria-label="Play course preview"
            >
              <div className="w-24 h-24 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center group-hover/play:bg-white group-hover/play:scale-110 transition-all duration-300 shadow-2xl border-4 border-white/50">
                <Play className="w-10 h-10 text-purple-600 ml-1" fill="currentColor" />
              </div>
            </button>
            
            {/* Course Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <p className="text-sm font-medium">Course Preview (2:34) — Executive Foundations</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    <span className="text-xs text-white font-medium">HD</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M9 9l6 3-6 3V9z" fill="currentColor"/>
                    </svg>
                    <span className="text-xs text-white font-medium">CC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('paid')}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'paid'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setActiveTab('free')}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'free'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Free
            </button>
          </div>

          <CardContent className="p-6 space-y-4">
            {activeTab === 'paid' ? (
              <>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-balance">
                    Pre-order AI Masterclass
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Get early access to this premium course with exclusive bonuses and lifetime updates.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl font-bold">$600</span>
                      <span className="text-xl text-muted-foreground line-through">$1,000</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Pre-order price - Save $400!</p>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <Button 
                    onClick={handlePreOrder}
                    disabled={checkoutLoading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold"
                  >
                    {checkoutLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Pre-order Now'
                    )}
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-base font-semibold border-2 hover:bg-muted"
                    onClick={() => setShowWishlistDialog(true)}
                  >
                    Add to Wishlist
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-base font-semibold border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all"
                    onClick={() => setShowDiscountDialog(true)}
                  >
                    <Gift className="mr-2 h-5 w-5" />
                    Get a Bigger Discount
                  </Button>

                  <div className="text-center text-xs text-muted-foreground space-y-1">
                    <p>30-Day Money-Back Guarantee</p>
                    <p>Full Lifetime Access</p>
                    <p>Early Access to All Updates</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-balance">
                    Free Course Preview
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Access selected lessons and get a taste of what this course offers before committing.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold"
                    onClick={() => setShowFreeEmailDialog(true)}
                  >
                    Get Free Course
                  </Button>

                  <div className="text-center text-xs text-muted-foreground space-y-1">
                    <p>Access to 3 free lessons</p>
                    <p>No credit card required</p>
                    <p>Upgrade anytime</p>
                  </div>
                </div>
              </>
            )}

            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <button className="hover:text-primary text-muted-foreground">Share</button>
                <button className="hover:text-primary text-muted-foreground">Gift this course</button>
                <button className="hover:text-primary text-muted-foreground">Apply Coupon</button>
              </div>
            </div>

            {activeTab === 'paid' && (
              <div className="border rounded p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">KEEPLEARNING</Badge>
                  <span className="text-xs text-muted-foreground">is applied</span>
                </div>
                <p className="text-xs text-muted-foreground">Course coupon</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Coupon"
                    className="h-10 text-sm"
                  />
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isPlayingVideo} onOpenChange={setIsPlayingVideo}>
        <DialogContent className="max-w-4xl">
          <div className="aspect-video bg-black">
            <video
              src="/placeholder-video.mp4"
              controls
              autoPlay
              muted
              className="w-full h-full"
              onError={(e) => {
                console.error('Video playback error:', e);
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFreeEmailDialog} onOpenChange={handleCloseFreeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {emailSent ? 'Check Your Email!' : 'Get Free Access'}
            </DialogTitle>
            <DialogDescription>
              {emailSent 
                ? `We sent a magic link to ${email}. Click the link in the email to access your free course.`
                : 'Enter your email to receive free access to selected course lessons.'}
            </DialogDescription>
          </DialogHeader>
          {emailSent ? (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-center p-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                The magic link is valid for <strong>15 minutes</strong>. Check your spam folder if you don't see it.
              </p>
              <Button 
                onClick={handleCloseFreeDialog}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && email && !loading) {
                    handleFreeEnroll()
                  }
                }}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button 
                onClick={handleFreeEnroll}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!email || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Me Free Access'
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showWishlistDialog} onOpenChange={setShowWishlistDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Wishlist</DialogTitle>
            <DialogDescription>
              Enter your email to save this course to your wishlist and receive updates.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
            <Button 
              onClick={handleWishlist}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!email}
            >
              Add to Wishlist
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDiscountDialog} onOpenChange={handleCloseDiscountDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {discountSubmitted ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Request Submitted!
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5 text-purple-600" />
                  Get a Bigger Discount
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {discountSubmitted 
                ? "Thank you! We'll review your information and send you a personalized discount code for $400 (60% off!) within 24-48 hours."
                : "Tell us about yourself to unlock our exclusive $400 price (60% off the regular $1,000 price)."}
            </DialogDescription>
          </DialogHeader>
          {discountSubmitted ? (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-center p-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Check your email at <strong>{discountForm.email}</strong> for your exclusive $400 discount code.
              </p>
              <Button 
                onClick={handleCloseDiscountDialog}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  type="text"
                  placeholder="John Smith"
                  value={discountForm.name}
                  onChange={(e) => setDiscountForm(prev => ({ ...prev, name: e.target.value }))}
                  className="h-11"
                  disabled={discountLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Work Email *</label>
                <Input
                  type="email"
                  placeholder="john@company.com"
                  value={discountForm.email}
                  onChange={(e) => setDiscountForm(prev => ({ ...prev, email: e.target.value }))}
                  className="h-11"
                  disabled={discountLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company *</label>
                <Input
                  type="text"
                  placeholder="Acme Inc."
                  value={discountForm.company}
                  onChange={(e) => setDiscountForm(prev => ({ ...prev, company: e.target.value }))}
                  className="h-11"
                  disabled={discountLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Title *</label>
                <Input
                  type="text"
                  placeholder="VP of Engineering"
                  value={discountForm.jobTitle}
                  onChange={(e) => setDiscountForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                  className="h-11"
                  disabled={discountLoading}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button 
                onClick={handleDiscountSubmit}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!discountForm.name || !discountForm.email || !discountForm.company || !discountForm.jobTitle || discountLoading}
              >
                {discountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Get My Discount'
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                We'll never share your information with third parties.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
