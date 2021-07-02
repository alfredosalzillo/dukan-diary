import React, {
  MutableRefObject, useEffect, useMemo, useRef,
} from 'react';

export const useOnIntersect = <E extends Element >(
  ref: MutableRefObject<E>,
  onChange: (intersection: boolean) => void | Promise<any>,
  init?: IntersectionObserverInit,
) => {
  const observer = useMemo(() => {
    let running = false;
    return new IntersectionObserver(
      ([entry]) => {
        if (running) return;
        running = true;
        Promise
          .resolve(onChange(entry.isIntersecting))
          .finally(() => {
            running = false;
          });
      },
      init,
    );
  }, [onChange, init]);
  useEffect(() => {
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [observer, ref]);
};

export type OnIntersectProps = {
  onChange: (intersecting: boolean) => void,
};
const OnIntersect: React.FC<OnIntersectProps> = ({ onChange }) => {
  const ref = useRef<HTMLDivElement>();
  useOnIntersect(ref, onChange);
  return <div ref={ref} />;
};

export default OnIntersect;
