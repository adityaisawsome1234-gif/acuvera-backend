'use client'

import { cn } from '@/lib/utils'
import {
  ButtonHTMLAttributes,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
} from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      asChild,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25',
      secondary: 'bg-surface-light hover:bg-surface text-white',
      outline: 'border border-surface-light hover:bg-surface/50 text-white',
      ghost: 'hover:bg-surface/50 text-white',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    const mergedClassName = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      'btn-glow',
      className
    )

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string }>
      return cloneElement(child, {
        ...props,
        className: cn(mergedClassName, child.props.className),
      } as never)
    }

    return (
      <button ref={ref} className={mergedClassName} {...props}>
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
