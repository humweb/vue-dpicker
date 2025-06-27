import {describe, it, expect, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import {nextTick} from 'vue';
import DatePicker from './DatePicker.vue';
import Calendar from './sub-components/Calendar.vue';
import TimePicker from './sub-components/TimePicker.vue';

// Mock Teleport
const Teleport = {
    template: '<slot />',
};

(global as any).ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));


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
                inline: true,
            },
        });
        expect(wrapper.findAllComponents({name: 'Calendar'}).length).toBe(2);
    });

    it('renders time picker when enableTime prop is true', () => {
        const wrapper = mount(DatePicker, {
            props: {
                enableTime: true,
                inline: true,
            },
        });
        expect(wrapper.findComponent({name: 'TimePicker'}).exists()).toBe(true);
    });

    it('does not render time picker when range is true', () => {
        const wrapper = mount(DatePicker, {
            props: {
                enableTime: true,
                range: true,
                inline: true,
            },
        });
        expect(wrapper.findComponent({name: 'TimePicker'}).exists()).toBe(false);
    });

    it('renders the correct number of calendars', () => {
        const wrapper = mount(DatePicker, {
            props: {
                calendars: 3,
                inline: true,
            },
        });
        expect(wrapper.findAllComponents({name: 'Calendar'}).length).toBe(3);
    });

    it('selects a single date', async () => {
        const wrapper = mount(DatePicker, {
            props: {
                inline: true,
            },
        });

        const calendar = wrapper.findComponent(Calendar);
        const testDate = new Date(2025, 5, 15);
        await calendar.find('[aria-label="day-15"]').trigger('click');

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeDefined();
        expect(emitted?.[0]).toEqual([new Date(2025, 5, 15)]);
    });

    it('selects a date range', async () => {
        const wrapper = mount(DatePicker, {
            props: {
                range: true,
                inline: true,
            },
        });

        const calendar = wrapper.findComponent(Calendar);
        const startDate = new Date(2025, 5, 10, 0, 0, 0, 0);
        const endDate = new Date(2025, 5, 20, 0, 0, 0, 0);

        await calendar.find('[aria-label="day-10"]').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();

        await calendar.find('[aria-label="day-20"]').trigger('click');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeDefined();
        const emittedValue = emitted?.[0] as any;
        expect(emittedValue[0]).toEqual({start: startDate, end: endDate});
    });

    it('selects a date with time', async () => {
        const wrapper = mount(DatePicker, {
            props: {
                inline: true,
                enableTime: true,
            },
        });

        const calendar = wrapper.findComponent(Calendar);
        const timePicker = wrapper.findComponent(TimePicker);

        const testDate = new Date(2025, 5, 15, 0, 0, 0, 0);
        await calendar.find('[aria-label="day-15"]').trigger('click');

        await timePicker.vm.$emit('update:modelValue', {hours: 10, minutes: 30});

        const expectedDate = new Date(2025, 5, 15, 10, 30, 0, 0);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeDefined();
        const emittedValue = (emitted?.[1] as Date[])?.[0];
        expect(emittedValue).toBeDefined();
        if (emittedValue) {
            expect(emittedValue.getTime()).toBe(expectedDate.getTime());
        }
    });

    it('displays the formatted date in the input', async () => {
        const wrapper = mount(DatePicker, {
            props: {
                modelValue: new Date(2025, 5, 15),
            },
            global: {
                stubs: {
                    Teleport,
                },
            },
        });

        const input = wrapper.find('input');
        expect(input.element.value).toBe('06/15/2025');
    });

    it('displays the formatted date range in the input', async () => {
        const wrapper = mount(DatePicker, {
            props: {
                range: true,
                modelValue: {start: new Date(2025, 5, 10), end: new Date(2025, 5, 20)},
            },
            global: {
                stubs: {
                    Teleport,
                },
            },
        });

        const input = wrapper.find('input');
        expect(input.element.value).toBe('06/10/2025 - 06/20/2025');
    });

    it('displays the formatted date with a custom format', async () => {
        const wrapper = mount(DatePicker, {
            props: {
                modelValue: new Date(2025, 5, 15),
                outputFormat: 'YYYY-MM-DD',
            },
            global: {
                stubs: {
                    Teleport,
                },
            },
        });

        const input = wrapper.find('input');
        expect(input.element.value).toBe('2025-06-15');
        wrapper.unmount()
    });

    // it('opens and closes the datepicker when not inline', async () => {
    //     const wrapper = mount(DatePicker, {
    //         global: {
    //             stubs: {
    //                 teleport: true
    //             }
    //         },
    //     });
    //
    //     const input = wrapper.find('input');
    //     expect(wrapper.find('.vue-datepicker').exists()).toBe(false);
    //
    //     await input.trigger('click');
    //     expect(wrapper.find('.vue-datepicker').exists()).toBe(true);
    //
    //     await input.trigger('click');
    //     expect(wrapper.find('.vue-datepicker').exists()).toBe(false);
    //
    //     // Make sure to unmount the component to clean up
    //     wrapper.unmount();
    // });

    it('navigates to the previous and next months', async () => {
        const wrapper = mount(DatePicker, {
            props: {
                inline: true,
            },
        });

        const calendar = wrapper.findComponent(Calendar);
        const initialMonth = 'June 2025';
        expect(calendar.find('.text-sm.font-semibold').text()).toBe(initialMonth);

        await wrapper.find('[aria-label="Previous Month"]').trigger('click');
        const prevMonth = calendar.find('.text-sm.font-semibold').text();
        expect(prevMonth).toBe('May 2025');

        await wrapper.find('[aria-label="Next Month"]').trigger('click');
        const nextMonth = calendar.find('.text-sm.font-semibold').text();
        expect(nextMonth).toBe(initialMonth);
    });
});
