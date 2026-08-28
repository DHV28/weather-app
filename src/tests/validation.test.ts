// validation.test.ts
// Unit tests for the profile form validation rules.
// These are pure functions so they are easy to test without mounting any component.

import { describe, it, expect } from 'vitest'

// --- Copied from ProfileForm so we can test them in isolation ---
// (In a larger project these would live in a shared validators.ts file)

function validateFullName(value: string): string {
  if (!value.trim()) return 'Full name is required.'
  if (value.trim().length < 2) return 'Full name must be at least 2 characters.'
  if (value.trim().length > 50) return 'Full name cannot exceed 50 characters.'
  return ''
}

function validateEmail(value: string): string {
  if (!value.trim()) return 'Email is required.'
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(value.trim())) return 'Please enter a valid email address.'
  return ''
}

function validatePhone(value: string): string {
  if (!value.trim()) return 'Phone number is required.'
  const digitsOnly = value.replace(/\D/g, '')
  if (digitsOnly.length < 7) return 'Phone number is too short.'
  if (digitsOnly.length > 15) return 'Phone number is too long.'
  const phonePattern = /^[0-9\s\-+(). ]+$/
  if (!phonePattern.test(value.trim())) return 'Phone number contains invalid characters.'
  return ''
}

// --- Full name ---

describe('validateFullName', () => {
  it('returns an error when the field is empty', () => {
    expect(validateFullName('')).toBe('Full name is required.')
  })

  it('returns an error when only whitespace is entered', () => {
    expect(validateFullName('   ')).toBe('Full name is required.')
  })

  it('returns an error when the name is only one character', () => {
    expect(validateFullName('A')).toBe('Full name must be at least 2 characters.')
  })

  it('returns an error when the name exceeds 50 characters', () => {
    expect(validateFullName('A'.repeat(51))).toBe('Full name cannot exceed 50 characters.')
  })

  it('passes for a valid name', () => {
    expect(validateFullName('Jane Doe')).toBe('')
  })
})

// --- Email ---

describe('validateEmail', () => {
  it('returns an error when the field is empty', () => {
    expect(validateEmail('')).toBe('Email is required.')
  })

  it('returns an error when the email has no @ symbol', () => {
    expect(validateEmail('janegmail.com')).toBe('Please enter a valid email address.')
  })

  it('returns an error when the email has no domain', () => {
    expect(validateEmail('jane@')).toBe('Please enter a valid email address.')
  })

  it('passes for a valid email', () => {
    expect(validateEmail('jane@gmail.com')).toBe('')
  })
})

// --- Phone ---

describe('validatePhone', () => {
  it('returns an error when the field is empty', () => {
    expect(validatePhone('')).toBe('Phone number is required.')
  })

  it('returns an error when there are fewer than 7 digits', () => {
    expect(validatePhone('123')).toBe('Phone number is too short.')
  })

  it('returns an error when there are more than 15 digits', () => {
    expect(validatePhone('1234567890123456')).toBe('Phone number is too long.')
  })

  it('returns an error when the input contains letters', () => {
    expect(validatePhone('123-abc-7890')).toBe('Phone number contains invalid characters.')
  })

  it('passes for a valid formatted phone number', () => {
    expect(validatePhone('123 - 456 - 7890')).toBe('')
  })
})
