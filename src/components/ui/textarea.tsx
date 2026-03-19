import * as React from 'react';

import {cn} from '@/lib/utils';
import { useLayoutEffect, useRef } from 'react';


const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, value, ...props}, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);

    useLayoutEffect(() => {
      const target = (ref as React.RefObject<HTMLTextAreaElement>)?.current || internalRef.current;
      if (target) {
        target.style.height = '0px';
        const scrollHeight = target.scrollHeight;
        target.style.height = `${scrollHeight}px`;
      }
    }, [value]);


    return (
      <textarea
        value={value}
        className={cn(
          'flex min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref || internalRef}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
