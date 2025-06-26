<template>
    <div v-if="inline" class="vue-datepicker bg-white border border-gray-300 rounded-lg shadow-lg flex">
        <Presets v-if="range && presets.length" :presets="presets" @select="handlePresetSelect" />
        <div>
            <div class="flex">
                <Calendar v-for="calendar in calendars" :key="calendar" v-model="dateValue" :range="range"
                    :current-date="new Date(new Date(currentDate).setMonth(currentDate.getMonth() + (calendar - 1)))"
                    @prev-month="prevMonth" @next-month="nextMonth" :hide-prev="calendar !== 1"
                    :hide-next="calendar !== calendars" />
            </div>
            <TimePicker v-if="enableTime && !range" v-model="timeValue" :is24hr="is24hr" />
        </div>
    </div>
    <div v-else>
        <input ref="reference" :value="formattedDate" @click="isOpen = !isOpen" readonly
            class="border p-2 rounded w-full" />
        <Teleport to="body">
            <div ref="floating" v-if="isOpen" :style="floatingStyles"
                class="vue-datepicker bg-white border border-gray-300 rounded-lg shadow-lg flex z-10">
                <Presets v-if="range && presets.length" :presets="presets" @select="handlePresetSelect" />
                <div>
                    <div class="flex">
                        <Calendar v-for="calendar in calendars" :key="calendar" v-model="dateValue" :range="range"
                            :current-date="new Date(new Date(currentDate).setMonth(currentDate.getMonth() + (calendar - 1)))"
                            @prev-month="prevMonth" @next-month="nextMonth" :hide-prev="calendar !== 1"
                            :hide-next="calendar !== calendars" />
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

const { combineDateAndTime, parseDate, formatDate } = useDateHelpers();

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

const isOpen = ref(props.inline);
const reference = ref(null);
const floating = ref(null);

const { floatingStyles } = useFloating(reference, floating, {
    placement: 'bottom-start',
    open: isOpen,
    whileElementsMounted: autoUpdate,
});

const currentDate = ref(new Date());
const internalValue = ref(props.modelValue);

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

const dateValue = ref(props.modelValue ? parseDate(props.modelValue as string | Date) : null);

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

watch(() => props.modelValue, (newValue) => {
    internalValue.value = newValue;
    if (props.range) {
        if (newValue && typeof newValue === 'object' && 'start' in newValue) {
            // Range mode, do nothing to timeValue
        }
    }
    else if (newValue instanceof Date) {
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
    if (props.range && newValue && typeof newValue === 'object' && 'start' in newValue && newValue.start && !newValue.end) {
        return;
    }
    let formattedValue: ModelValue = newValue;

    if (props.outputFormat !== 'object') {
        if (typeof props.outputFormat === 'string') {
            if (props.range) {
                if (newValue && typeof newValue === 'object' && 'start' in newValue && newValue.start && newValue.end) {
                    const format = props.outputFormat || 'MM/DD/YYYY';
                    const startStr = formatDate(newValue.start, format);
                    const endStr = formatDate(newValue.end, format);
                    formattedValue = `${startStr} - ${endStr}`;
                }
            } else if (newValue instanceof Date) {
                formattedValue = useDateHelpers().formatDate(newValue, props.outputFormat || 'MM/DD/YYYY');
            }
        } else if (typeof props.outputFormat === 'function') {
            const { parseDate } = useDateHelpers();
            if (props.range && typeof newValue === 'object' && newValue && 'start' in newValue) {
                formattedValue = {
                    start: newValue.start ? props.outputFormat(parseDate(newValue.start)) : null,
                    end: newValue.end ? props.outputFormat(parseDate(newValue.end)) : null,
                };
            } else if (newValue) {
                formattedValue = props.outputFormat(parseDate(newValue as string | Date));
            }
        }
    }

    emit('update:modelValue', formattedValue);
    if (props.range) {
        if (newValue && typeof newValue === 'object' && 'start' in newValue) {
            emit('range-selected', formattedValue);
        }
    } else {
        emit('date-selected', formattedValue);
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

watch(internalValue, (newValue) => {
    if (!props.inline && !props.range) {
        isOpen.value = false;
    }
});

</script>
