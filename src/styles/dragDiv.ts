import { cva } from 'class-variance-authority';

export const draggableDiv = cva(
  // base styles
  [
    'absolute',
    'cursor-move',
    'select-none',
    'flex',
    'items-center',
    'justify-center',
    'text-white',
    'rounded-lg',
    'shadow-md',
  ],
  {
    variants: {
      size: {
        default: ['w-[100px]', 'h-[100px]'],
        large: ['w-[150px]', 'h-[100px]'],
      },
      type: {
        draggable: ['bg-primary'],
        static: ['bg-muted', 'border-2', 'border-border'],
      },
    },
    defaultVariants: {
      size: 'default',
      type: 'draggable',
    },
  }
);

export const distanceLine = cva(
  [
    'absolute',
    'pointer-events-none',
    'z-50',
  ],
  {
    variants: {
      direction: {
        horizontal: ['h-[2px]', 'bg-rose-500'],
        vertical: ['w-[2px]', 'bg-rose-500'],
      },
    },
    defaultVariants: {
      direction: 'horizontal',
    },
  }
);

export const distanceLabel = cva(
  [
    'absolute',
    'bg-background',
    'text-foreground',
    'p-1',
    'px-2',
    'rounded-md',
    'text-xs',
    'whitespace-nowrap',
    'z-[1000]',
  ],
  {
    variants: {
      direction: {
        horizontal: [
          '-top-5',
          'left-1/2',
          '-translate-x-1/2',
          'min-w-[30px]',
          'text-center',
        ],
        vertical: [
          'left-3',
          'top-1/2',
          '-translate-y-1/2',
          'min-w-[30px]',
          'text-left',
        ],
      },
    },
    defaultVariants: {
      direction: 'horizontal',
    },
  }
);

export const dottedLine = cva(
  [
    'absolute',
    'pointer-events-none',
    'z-40',
  ],
  {
    variants: {
      direction: {
        horizontal: ['border-t', 'border-dashed', 'border-rose-500'],
        vertical: ['border-l', 'border-dashed', 'border-rose-500'],
      },
    },
    defaultVariants: {
      direction: 'horizontal',
    },
  }
);
