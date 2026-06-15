'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Re-bind intersection observer whenever route changes
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (scrollElements.length === 0 && timelineItems.length === 0) return;

    const scrollObserverOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // Trigger slightly before element enters view
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');

          // Sequential animation helper for timeline items
          if (entry.target.classList.contains('timeline-item')) {
            entry.target.classList.add('visible');
          }
          observer.unobserve(entry.target);
        }
      });
    }, scrollObserverOptions);

    scrollElements.forEach((el) => observer.observe(el));
    timelineItems.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
