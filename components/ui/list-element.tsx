'use client';

import { withRef } from 'platejs/react';
import { PlateElement } from 'platejs/react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const listVariants = cva('m-0 ps-6', {
  variants: {
    variant: {
      ul: 'list-disc [&_ul]:list-[circle] [&_ul_ul]:list-[square]',
      ol: 'list-decimal',
    },
  },
});

export const ListElement = withRef<
  typeof PlateElement,
  VariantProps<typeof listVariants>
>(({ className, children, variant = 'ul', ...props }, ref) => {
  return (
    <PlateElement
      ref={ref}
      as={variant === 'ol' ? 'ol' : 'ul'}
      className={cn(listVariants({ variant }), className)}
      {...props}
    >
      {children}
    </PlateElement>
  );
});

