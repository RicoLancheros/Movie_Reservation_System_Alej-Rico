import { describe, it, expect } from 'vitest'
import { cn } from '../cn'

describe('cn utility function', () => {
  it('should combine class names', () => {
    const result = cn('class1', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'conditional', false && 'not-included')
    expect(result).toBe('base conditional')
  })

  it('should handle undefined and null values', () => {
    const result = cn('base', null, undefined, 'valid')
    expect(result).toBe('base valid')
  })

  it('should combine classes without merging conflicts (clsx behavior)', () => {
    const result = cn('p-4', 'p-2')
    // clsx doesn't merge Tailwind classes by default, it just combines them
    expect(result).toBe('p-4 p-2')
  })

  it('should handle arrays', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should handle objects', () => {
    const result = cn({
      'class1': true,
      'class2': false,
      'class3': true
    })
    expect(result).toBe('class1 class3')
  })
}) 