import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DatePicker from './DatePicker.vue';

describe('DatePicker', () => {
  it('renders successfully', () => {
    const wrapper = mount(DatePicker);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders inline when inline prop is true', () => {
    const wrapper = mount(DatePicker, {
      props: {
        inline: true,
      },
    });
    expect(wrapper.find('.vue-datepicker').exists()).toBe(true);
    expect(wrapper.find('input').exists()).toBe(false);
  });

  it('renders for range selection when range prop is true', () => {
    const wrapper = mount(DatePicker, {
      props: {
        range: true,
        inline: true, // Render inline to avoid dealing with teleport
      },
    });
    expect(wrapper.findAllComponents({ name: 'Calendar' }).length).toBe(2);
  });

  it('renders time picker when enableTime prop is true', () => {
    const wrapper = mount(DatePicker, {
      props: {
        enableTime: true,
        inline: true, // Render inline to avoid dealing with teleport
      },
    });
    expect(wrapper.findComponent({ name: 'TimePicker' }).exists()).toBe(true);
  });

  it('renders the correct number of calendars', () => {
    const wrapper = mount(DatePicker, {
      props: {
        calendars: 3,
        inline: true, // Render inline to avoid dealing with teleport
      },
    });
    expect(wrapper.findAllComponents({ name: 'Calendar' }).length).toBe(3);
  });
});

it('does not emit update:modelValue until end date is selected in range mode', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        range: true,
        inline: true,
        outputFormat: 'object',
      },
    });

    const calendar = wrapper.findComponent({ name: 'Calendar' });
    
    // Select start date
    await calendar.vm.$emit('update:modelValue', { start: new Date(2024, 6, 10), end: null });
    
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();

    // Select end date
    await calendar.vm.$emit('update:modelValue', { start: new Date(2024, 6, 10), end: new Date(2024, 6, 15) });
    
    expect(wrapper.emitted('update:modelValue')).toBeDefined();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{
      start: new Date(2024, 6, 10),
      end: new Date(2024, 6, 15),
    }]);
  });

  it('emits a formatted string with default format when outputFormat is not specified', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        range: true,
        inline: true,
      },
    });

    const calendar = wrapper.findComponent({ name: 'Calendar' });

    // Select start and end date
    await calendar.vm.$emit('update:modelValue', { start: new Date(2025, 5, 2), end: new Date(2025, 5, 28) });

    expect(wrapper.emitted('update:modelValue')).toBeDefined();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['06/02/2025 - 06/28/2025']);
  });

  it('emits a formatted string with custom format when outputFormat is a string', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        range: true,
        inline: true,
        outputFormat: 'YYYY-MM-DD',
      },
    });

    const calendar = wrapper.findComponent({ name: 'Calendar' });

    // Select start and end date
    await calendar.vm.$emit('update:modelValue', { start: new Date(2025, 5, 2), end: new Date(2025, 5, 28) });

    expect(wrapper.emitted('update:modelValue')).toBeDefined();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2025-06-02 - 2025-06-28']);
  });
