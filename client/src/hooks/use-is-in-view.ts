import * as React from 'react';

export type UseIsInViewOptions = {
  inView?: boolean;
  inViewMargin?: string;
  inViewOnce?: boolean;
};

export function useIsInView(
  ref?: any,
  options?: UseIsInViewOptions
): { ref: any; isInView: boolean } {
  const fallbackRef = React.useRef<Element | null>(null);
  const targetRef = ref || fallbackRef;
  const [isInView, setIsInView] = React.useState(options?.inView ?? true);

  React.useEffect(() => {
    const element = typeof targetRef === 'object' && targetRef ? targetRef.current : null;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options?.inViewOnce) {
            observer.disconnect();
          }
        } else if (!options?.inViewOnce) {
          setIsInView(false);
        }
      },
      { rootMargin: options?.inViewMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [targetRef, options?.inViewOnce, options?.inViewMargin]);

  return { ref: targetRef, isInView };
}
