// BaseInput.test.ts
// Component tests for the BaseInput atom.
// We check that the label, value, and error message render correctly.

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '../components/atoms/BaseInput.vue'

describe('BaseInput', () => {
  it('renders the label text', () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: '', label: 'Full name' },
    })
    expect(wrapper.find('.base-input__label').text()).toBe('Full name')
  })

  it('displays the current value in the input', () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: 'Jane Doe', label: 'Full name' },
    })
    const input = wrapper.find('.base-input__field')
    expect((input.element as HTMLInputElement).value).toBe('Jane Doe')
  })

  it('shows the error message when the error prop is provided', () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: '', label: 'Email', error: 'Email is required.' },
    })
    expect(wrapper.find('.base-input__error').text()).toBe('Email is required.')
  })

  it('does not show an error message when there is no error', () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: 'jane@gmail.com', label: 'Email' },
    })
    expect(wrapper.find('.base-input__error').exists()).toBe(false)
  })

  it('applies the error border class when error prop is set', () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: '', label: 'Email', error: 'Required' },
    })
    expect(wrapper.find('.base-input--error').exists()).toBe(true)
  })

  it('emits update:modelValue when the user types', async () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: '', label: 'Full name' },
    })
    await wrapper.find('.base-input__field').setValue('Jane')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Jane'])
  })
})
