// components/Button/index.tsx
import { ComponentProps, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/css'  // 假设你有一个 cn utility 函数用于合并类名
import { Loader2 } from 'lucide-react'  // 使用 lucide-react 作为图标库

const buttonVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      // 语义类型
      type: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
      },
      // 大小
      size: {
        small: 'h-8 px-3 text-sm',
        medium: 'h-10 px-4 text-base',
        large: 'h-12 px-6 text-lg',
      },
      // 填充样式
      fill: {
        solid: '',  // 使用 type 变体的默认样式
        outline: 'bg-transparent border-2',
        text: 'bg-transparent hover:bg-opacity-10',
      },
      // 形状
      shape: {
        rounded: 'rounded-md',
        pill: 'rounded-full',
      },
    },
    // 组合规则
    compoundVariants: [
      // Outline 样式的颜色处理
      {
        fill: 'outline',
        type: 'primary',
        class: 'border-blue-600 text-blue-600 hover:bg-blue-50',
      },
      {
        fill: 'outline',
        type: 'secondary',
        class: 'border-gray-600 text-gray-600 hover:bg-gray-50',
      },
      {
        fill: 'outline',
        type: 'success',
        class: 'border-green-600 text-green-600 hover:bg-green-50',
      },
      {
        fill: 'outline',
        type: 'danger',
        class: 'border-red-600 text-red-600 hover:bg-red-50',
      },
      // Text 样式的颜色处理
      {
        fill: 'text',
        type: 'primary',
        class: 'text-blue-600 hover:bg-blue-100',
      },
      {
        fill: 'text',
        type: 'secondary',
        class: 'text-gray-600 hover:bg-gray-100',
      },
      {
        fill: 'text',
        type: 'success',
        class: 'text-green-600 hover:bg-green-100',
      },
      {
        fill: 'text',
        type: 'danger',
        class: 'text-red-600 hover:bg-red-100',
      },
    ],
    defaultVariants: {
      type: 'primary',
      size: 'medium',
      fill: 'solid',
      shape: 'rounded',
    },
  }
)

interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type, size, fill, shape, disabled, loading, icon, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ type, size, fill, shape, className }))}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : icon ? (
          <span className="mr-2">{icon}</span>
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }