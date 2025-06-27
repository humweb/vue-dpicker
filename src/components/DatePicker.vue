<template>
    <div v-if="inline" class="vue-datepicker bg-white border border-gray-300 rounded-lg shadow-lg flex">
        <Presets v-if="range && presets.length" :presets="presets" @select="handlePresetSelect" />
        <div>
            <div class="flex" @mouseleave="hoveredDate = null">
                <Calendar v-for="(calendarDate, index) in calendarDates" :key="index" v-model="calendarValue"
                    :range="range" :current-date="calendarDate" @prev-month="prevMonth" @next-month="nextMonth"
                    :hide-prev="index !== 0" :hide-next="index !== calendarDates.length - 1" :hovered-date="hoveredDate"
                    @date-hover="hoveredDate = $event" />
            </div>
            <TimePicker v-if="enableTime && !range" v-model="timeValue" :is24hr="is24hr" />
        </div>
    </div>
    <div v-else>
        <input ref="inputRef" :value="formattedDate" @click="isOpen = !isOpen" readonly
            class="border p-2 rounded w-full" />
        <Teleport to="body">
            <div ref="floating" v-if="isOpen" :style="floatingStyles"
                class="vue-datepicker bg-white border border-gray-300 rounded-lg shadow-lg flex z-10">
                <Presets v-if="range && presets.length" :presets="presets" @select="handlePresetSelect" />
                <div>
                    <div class="flex" @mouseleave="hoveredDate = null">
                        <Calendar v-for="(calendarDate, index) in calendarDates" :key="index" v-model="calendarValue"
                            :range="range" :current-date="calendarDate" @prev-month="prevMonth" @next-month="nextMonth"
                            :hide-prev="index !== 0" :hide-next="index !== calendarDates.length - 1"
                            :hovered-date="hoveredDate" @date-hover="hoveredDate = $event" />
                    </div>
                    <TimePicker v-if="enableTime && !range" v-model="timeValue" :is24hr="is24hr" />
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { autoUpdate, useFloating } from '@floating-ui/vue';
import dayjs from 'dayjs';
import Calendar from './sub-components/Calendar.vue';
import TimePicker from './sub-components/TimePicker.vue';
import Presets from './sub-components/Presets.vue';
import { useDateHelpers } from '../composables/useDateHelpers';
import type { DatePickerProps, ModelValue } from '../types';

const { combineDateAndTime, parseDate } = useDateHelpers();

const props = withDefaults(defineProps<DatePickerProps>(), {
    modelValue: null,
    inline: false,
    enableTime: false,
    range: false,
    presets: () => [],
    outputFormat: '',
    is24hr: true,
    calendars: 2,
    disabled: false,
    minDate: null,
    maxDate: null,
});

const emit = defineEmits(['update:modelValue', 'on-open', 'on-close', 'date-selected', 'range-selected']);

const isOpen = ref(false);
const inputRef = ref(null);
const floating = ref(null);

const { floatingStyles } = useFloating(inputRef, floating, {
    placement: 'bottom-start',
    open: isOpen,
    whileElementsMounted: autoUpdate,
});

const currentDate = ref(new Date());
const internalValue = ref(props.modelValue);
const hoveredDate = ref<Date | null>(null);

const calendarDates = computed(() => {
    const dates = [];
    for (let i = 1; i <= props.calendars; i++) {
        dates.push(new Date(new Date(currentDate.value).setMonth(currentDate.value.getMonth() + (i - 1))));
    }
    return dates;
});

const prevMonth = () => {
    currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() - 1));
};

const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + 1));
};

const handlePresetSelect = (range: { start: Date; end: Date }) => {
    internalValue.value = range;
    if (!props.range) {
        isOpen.value = false;
    }
};

const dateValue = ref<ModelValue>(props.modelValue);

const calendarValue = computed({
    get: () => {
        if (typeof dateValue.value === 'string') {
            return parseDate(dateValue.value);
        }
        if (dateValue.value && typeof dateValue.value === 'object' && 'start' in dateValue.value) {
            return {
                start: dateValue.value.start ? parseDate(dateValue.value.start as string | Date) : null,
                end: dateValue.value.end ? parseDate(dateValue.value.end as string | Date) : null,
            };
        }
        return dateValue.value;
    },
    set: (newValue) => {
        dateValue.value = newValue;
    }
});

const timeValue = ref({
    hours: props.modelValue instanceof Date ? new Date(props.modelValue).getHours() : 0,
    minutes: props.modelValue instanceof Date ? new Date(props.modelValue).getMinutes() : 0,
});

watch(dateValue, (newDate) => {

    if (props.range) {
        internalValue.value = newDate;
        return;
    }

    if (newDate && newDate instanceof Date) {
        internalValue.value = combineDateAndTime(newDate, timeValue.value);
    }
}, { deep: true });

watch(timeValue, (newTime) => {
    if (!props.range && dateValue.value && dateValue.value instanceof Date) {
        internalValue.value = combineDateAndTime(dateValue.value, newTime);
    }
}, { deep: true });

watch(() => props.modelValue, (newValue) => {
    if (JSON.stringify(newValue) === JSON.stringify(internalValue.value)) return;
    internalValue.value = newValue;
    dateValue.value = newValue;

    if (props.range) {
        if (newValue && typeof newValue === 'object' && 'start' in newValue) {
            // Range mode, do nothing to timeValue
        }
    } else if (newValue instanceof Date) {
        timeValue.value = {
            hours: new Date(newValue).getHours(),
            minutes: new Date(newValue).getMinutes(),
        };
    } else if (typeof newValue === 'string') {
        const parsedDate = parseDate(newValue);
        timeValue.value = {
            hours: parsedDate.getHours(),
            minutes: parsedDate.getMinutes(),
        };
    } else {
        timeValue.value = { hours: 0, minutes: 0 };
    }
});

watch(internalValue, (newValue) => {
    if (JSON.stringify(newValue) === JSON.stringify(props.modelValue)) return;

    if (props.range && newValue && typeof newValue === 'object' && 'start' in newValue && newValue.start && !newValue.end) {
        return;
    }

    emit('update:modelValue', newValue);

    if (props.range) {
        if (newValue && typeof newValue === 'object' && 'start' in newValue) {
            emit('range-selected', newValue);
        }
    } else {
        emit('date-selected', newValue);
    }
});


const formattedDate = computed(() => {
    if (!internalValue.value) return '';

    const format = (typeof props.outputFormat === 'string' && props.outputFormat) ? props.outputFormat : 'MM/DD/YYYY';

    if (props.range && typeof internalValue.value === 'object' && internalValue.value && 'start' in internalValue.value) {
        const start = internalValue.value.start ? dayjs(internalValue.value.start).format(format) : '';
        const end = internalValue.value.end ? dayjs(internalValue.value.end).format(format) : '';
        return start && end ? `${start} - ${end}` : '';
    }

    if (internalValue.value instanceof Date || typeof internalValue.value === 'string') {
        return dayjs(internalValue.value).format(format);
    }

    return '';
});

watch(internalValue, (newValue, oldValue) => {
    if (!props.inline && !props.range && JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        isOpen.value = false;
    }
});

</script>
