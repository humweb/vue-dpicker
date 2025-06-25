<template>
    <div class="vue-datepicker bg-white border border-gray-300 rounded-lg shadow-lg flex">
        <Presets v-if="range && presets.length" :presets="presets" @select="handlePresetSelect" />
        <Calendar v-model="dateValue" :range="range" />
        <TimePicker v-if="enableTime && !range" v-model="timeValue" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import Calendar from './sub-components/Calendar.vue';
import TimePicker from './sub-components/TimePicker.vue';
import Presets from './sub-components/Presets.vue';
import { useDateHelpers } from '../composables/useDateHelpers';
import type { PropType } from 'vue';

const { combineDateAndTime, parseDate } = useDateHelpers();

const props = defineProps({
    modelValue: {
        type: [String, Date, Object] as PropType<string | Date | { start: string | Date | null; end: string | Date | null } | null>,
        default: null,
    },
    enableTime: {
        type: Boolean,
        default: false,
    },
    range: {
        type: Boolean,
        default: false,
    },
    presets: {
        type: Array as PropType<{ label: string; range: { start: Date; end: Date } }[]>,
        default: () => [],
    },
    format: {
        type: String,
        default: 'YYYY-MM-DD HH:mm',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    minDate: {
        type: [String, Date] as PropType<string | Date | null>,
        default: null,
    },
    maxDate: {
        type: [String, Date] as PropType<string | Date | null>,
        default: null,
    },
});

const emit = defineEmits(['update:modelValue', 'on-open', 'on-close', 'date-selected', 'range-selected']);

const internalValue = ref(props.modelValue);

const handlePresetSelect = (range: { start: Date; end: Date }) => {
    internalValue.value = range;
};

const dateValue = computed({
    get() {
        if (props.range) {
            if (props.modelValue && typeof props.modelValue === 'object' && 'start' in props.modelValue) {
                return {
                    start: props.modelValue.start ? parseDate(props.modelValue.start) : null,
                    end: props.modelValue.end ? parseDate(props.modelValue.end) : null,
                };
            }
            return { start: null, end: null };
        }
        if (props.modelValue) {
            return parseDate(props.modelValue as string | Date);
        }
        return new Date();
    },
    set(value) {
        internalValue.value = value;
    }
});

const timeValue = ref({
    hours: props.modelValue instanceof Date ? new Date(props.modelValue).getHours() : 0,
    minutes: props.modelValue instanceof Date ? new Date(props.modelValue).getMinutes() : 0,
});

watch([dateValue, timeValue], ([newDate, newTime], [oldDate, oldTime]) => {
    if (props.range) {
        internalValue.value = newDate;
        return;
    }

    if (newDate && !(newDate instanceof Object)) {
        const combined = combineDateAndTime(newDate, newTime);
        internalValue.value = combined;
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
    emit('update:modelValue', newValue);
    if (props.range) {
        if (newValue && typeof newValue === 'object' && 'start' in newValue) {
            emit('range-selected', newValue);
        }
    } else {
        emit('date-selected', newValue);
    }
});
</script>

<style scoped>
/* No component-specific styles needed with Tailwind */
</style>
