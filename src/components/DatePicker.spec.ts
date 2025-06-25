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
