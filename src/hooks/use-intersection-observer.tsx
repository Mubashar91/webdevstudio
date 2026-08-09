import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
  /**
   * Start visible and never observe — for content in the first viewport.
   *
   * The reveal pattern below starts every element at `opacity-0` and only
   * clears it once a post-hydration observer callback fires. That is fine for
   * sections a visitor scrolls to, but for content already on screen it means
   * the page ships fully rendered in the prerendered HTML and then deliberately
   * hides it until React has booted, mounted, and the observer has run. A
   * performance audit measured 1.7–3.5s of pure LCP "element render delay" on
   * /services and /projects from exactly this — the LCP element was the first
   * card row, sitting invisible in the DOM the whole time.
   *
   * Pass `true` wherever the element is above the fold. There is nothing to
   * reveal on scroll when the user never had to scroll.
   */
  initialVisible?: boolean;
}

export function useIntersectionObserver({
  threshold = 0.1,
  root = null,
  rootMargin = "0px",
  freezeOnceVisible = true,
  initialVisible = false,
}: UseIntersectionObserverProps = {}): [React.RefObject<HTMLDivElement>, boolean] {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(initialVisible);

  useEffect(() => {
    // Above-the-fold: already visible, and must never be un-set — with
    // freezeOnceVisible:false an observer would happily report the element as
    // out of view and hide content the visitor is currently reading.
    if (initialVisible) return;

    const element = elementRef.current;
    if (!element) return;

    // If already visible and freeze is enabled, don't observe
    if (freezeOnceVisible && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);
        
        // If freeze is enabled and element is visible, disconnect observer
        if (freezeOnceVisible && isIntersecting) {
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible, initialVisible, isVisible]);

  return [elementRef, isVisible];
}
