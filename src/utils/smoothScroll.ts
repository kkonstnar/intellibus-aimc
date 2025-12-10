// Smooth scroll utility for enhanced anchor link navigation
export const smoothScrollTo = (elementId: string, offset: number = 80) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Enhanced scroll function with easing
export const smoothScrollToWithEasing = (elementId: string, offset: number = 80) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const startPosition = window.pageYOffset;
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  const distance = targetPosition - startPosition;
  const duration = 1500; // Increased to 1500ms for slower, more noticeable animation
  let start: number | null = null;

  // Smoother easing function for more dramatic animation
  const easeInOutQuart = (t: number): number => {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
  };

  const animation = (currentTime: number) => {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easeInOutQuart(progress);
    
    window.scrollTo(0, startPosition + distance * easedProgress);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

// Add click handlers to all anchor links
export const initializeSmoothScroll = () => {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  console.log(`Found ${anchorLinks.length} anchor links`); // Debug log
  
  anchorLinks.forEach((link, index) => {
    console.log(`Setting up link ${index}: ${link.getAttribute('href')}`); // Debug log
    
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      console.log(`Clicked anchor link: ${href}`); // Debug log
      
      if (href && href.startsWith('#')) {
        const elementId = href.substring(1);
        console.log(`Scrolling to element: ${elementId}`); // Debug log
        // Use the enhanced easing function for more dramatic animation
        smoothScrollToWithEasing(elementId, 80);
      }
    });
  });
};

// Alternative very slow scroll for testing
export const verySlowSmoothScroll = (elementId: string, offset: number = 80) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const startPosition = window.pageYOffset;
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  const distance = targetPosition - startPosition;
  const duration = 2500; // Very slow 2.5 seconds
  let start: number | null = null;

  // Very smooth easing for dramatic effect
  const easeInOutQuint = (t: number): number => {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
  };

  const animation = (currentTime: number) => {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easeInOutQuint(progress);
    
    window.scrollTo(0, startPosition + distance * easedProgress);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};
