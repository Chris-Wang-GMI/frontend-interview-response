import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../test/test-utils'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'
import { Play } from 'lucide-react'

describe('Button Component Tests', () => {
  const user = userEvent.setup()

  describe('Happy Path Scenarios', () => {
    it('should render with default variant and size', () => {
      // GIVEN: A button with default props
      render(<Button>Default Button</Button>)

      // THEN: Should render with default styling
      const button = screen.getByRole('button', { name: 'Default Button' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-blue-500', 'text-white', 'h-9', 'px-4', 'py-2')
    })

    it('should apply different variants correctly', () => {
      // GIVEN: Buttons with different variants
      const { rerender } = render(<Button variant="success">Success</Button>)
      
      expect(screen.getByRole('button')).toHaveClass('bg-green-600')

      rerender(<Button variant="destructive">Destructive</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-red-500')

      rerender(<Button variant="purple">Purple</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-purple-500')

      rerender(<Button variant="warning">Warning</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-yellow-500')
    })

    it('should apply different sizes correctly', () => {
      // GIVEN: Buttons with different sizes
      const { rerender } = render(<Button size="sm">Small</Button>)
      
      expect(screen.getByRole('button')).toHaveClass('h-8', 'px-3', 'text-xs')

      rerender(<Button size="lg">Large</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-10', 'px-8', 'text-lg', 'font-semibold')

      rerender(<Button size="icon">Icon</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-9', 'w-9')
    })

    it('should handle click events correctly', async () => {
      // GIVEN: A button with click handler
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click Me</Button>)

      // WHEN: Button is clicked
      await user.click(screen.getByRole('button'))

      // THEN: Handler should be called
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should render with icons correctly', () => {
      // GIVEN: A button with icon child
      render(
        <Button>
          <Play size={16} />
          Start Search
        </Button>
      )

      // THEN: Should render both icon and text
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Start Search')
    })

    it('should apply custom className alongside variants', () => {
      // GIVEN: A button with custom className
      render(
        <Button variant="success" className="custom-class">
          Custom Button
        </Button>
      )

      // THEN: Should have both variant classes and custom class
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-green-600', 'custom-class')
    })
  })

  describe('Exception Path Scenarios', () => {
    it('should handle disabled state correctly', async () => {
      // GIVEN: A disabled button
      const handleClick = vi.fn()
      render(
        <Button disabled onClick={handleClick}>
          Disabled Button
        </Button>
      )

      const button = screen.getByRole('button')

      // THEN: Should be disabled and have disabled styling
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')

      // WHEN: User tries to click disabled button
      await user.click(button)

      // THEN: Click handler should not be called
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should handle asChild prop correctly', () => {
      // GIVEN: A button with asChild prop
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )

      // THEN: Should render as link instead of button
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
      expect(link).toHaveClass('bg-blue-500') // Should still have button styling
    })

    it('should handle missing children gracefully', () => {
      // GIVEN: A button with no children
      render(<Button />)

      // THEN: Should render empty button without errors
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toBeEmptyDOMElement()
    })

    it('should handle invalid variant gracefully', () => {
      // GIVEN: A button with invalid variant (TypeScript should prevent this, but testing runtime)
      render(
        // @ts-ignore - Testing invalid variant
        <Button variant="invalid">Invalid Variant</Button>
      )

      // THEN: Should fallback to default styling
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      // Should not crash and should render with some styling
    })

    it('should handle multiple rapid clicks', async () => {
      // GIVEN: A button with click handler
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Rapid Click Test</Button>)

      const button = screen.getByRole('button')

      // WHEN: Multiple rapid clicks occur
      await user.click(button)
      await user.click(button)
      await user.click(button)

      // THEN: All clicks should be registered
      expect(handleClick).toHaveBeenCalledTimes(3)
    })
  })

  describe('Accessibility Tests', () => {
    it('should be keyboard accessible', async () => {
      // GIVEN: A button in the document
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Keyboard Test</Button>)

      const button = screen.getByRole('button')

      // WHEN: Button is activated via keyboard
      button.focus()
      await user.keyboard('{Enter}')

      // THEN: Click handler should be called
      expect(handleClick).toHaveBeenCalledTimes(1)

      // Test space key activation
      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalledTimes(2)
    })

    it('should have proper ARIA attributes', () => {
      // GIVEN: A button with various states
      render(
        <Button disabled aria-label="Custom Label">
          Button Text
        </Button>
      )

      const button = screen.getByRole('button')

      // THEN: Should have proper accessibility attributes
      expect(button).toHaveAttribute('aria-label', 'Custom Label')
      expect(button).toBeDisabled()
    })

    it('should maintain focus styles', () => {
      // GIVEN: A button that can receive focus
      render(<Button>Focus Test</Button>)

      const button = screen.getByRole('button')

      // THEN: Should have focus-visible styles defined
      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-1')
    })
  })
})