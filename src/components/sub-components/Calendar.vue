<template>
    <div class="p-4">
        <div class="flex justify-between items-center mb-2">
            <button @click="$emit('prev-month')" class="p-2 rounded-full hover:bg-gray-100"
                :class="{ 'invisible': props.hidePrev }" aria-label="Previous Month">&lt;
            </button>
            <span class="text-sm font-semibold">{{ monthYear }}</span>
            <button @click="$emit('next-month')" class="p-2 rounded-full hover:bg-gray-100"
                :class="{ 'invisible': props.hideNext }" aria-label="Next Month">&gt;
            </button>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center text-sm text-gray-500">
            <div v-for="day in daysOfWeek" :key="day">{{ day }}</div>
        </div>
        <div class="grid grid-cols-7 gap-1 mt-2">
            <div v-for="(day, index) in days" :key="index" class="text-xs text-center py-1.5 cursor-pointer" :class="{
                'text-gray-400': !day.isCurrentMonth,
                'bg-blue-500 text-white': isSelected(day.date) && (!props.range || day.isCurrentMonth),
                'rounded-full': isSelected(day.date) && !range,
                'bg-blue-100 hover:rounded-none': (isInRange(day.date) || isBetween(day.date)) && !isSelected(day.date) && day.isCurrentMonth,
                'rounded-l-full': isRangeStart(day.date) && !isRangeEnd(day.date) && day.isCurrentMonth,
                'rounded-r-full': isRangeEnd(day.date) && !isRangeStart(day.date) && day.isCurrentMonth,
                'hover:bg-gray-200 hover:rounded-full': !isSelected(day.date)
            }" @click="selectDate(day.date)" @mouseover="$emit('date-hover', day.date)"
                :aria-label="`day-${new Date(day.date).getDate()}`">
                {{ new Date(day.date).getDate() }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import dayjs from 'dayjs';
import { useDateHelpers } from '../../composables/useDateHelpers';
import type { DateRange } from '../../types';

const props = defineProps({
    modelValue: {
        type: [Object, Date] as PropType<Date | DateRange | null>,
        default: null,
    },
    range: {
        type: Boolean,
        default: false,
    },
    currentDate: {
        type: Date,
        default: () => new Date(),
    },
    hidePrev: {
        type: Boolean,
        default: false,
    },
    hideNext: {
        type: Boolean,
        default: false,
    },
    hoveredDate: {
        type: Date as PropType<Date | null>,
        default: null,
    },
});

const emit = defineEmits(['update:modelValue', 'prev-month', 'next-month', 'date-hover']);

const { getDaysInMonth, isDateInRange, isSameDate } = useDateHelpers();


const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const days = computed(() =>
    getDaysInMonth(props.currentDate.getMonth(), props.currentDate.getFullYear())
);

const monthYear = computed(() =>
    dayjs(props.currentDate).format('MMMM YYYY')
);

const selectDate = (date: Date) => {
    if (!props.range) {
        emit('update:modelValue', date);
        return;
    }

    const currentRange = props.modelValue as DateRange | null;
    const start = currentRange?.start;
    const end = currentRange?.end;

    let newRange: DateRange;

    if (!start || (start && end)) {
        // No start date, or range is complete. Start a new range.
        newRange = { start: date, end: null };
    } else {
        // Start date is set, but no end date.
        if (date < start) {
            newRange = { start: date, end: start };
        } else {
            newRange = { start: start, end: date };
        }
    }

    emit('update:modelValue', newRange);
};

const isSelected = (date: Date) => {
    if (!props.modelValue) return false;

    if (props.range && 'start' in props.modelValue) {
        const { start, end } = props.modelValue;
        if (start && isSameDate(date, start)) return true;
        return !!(end && isSameDate(date, end));

    }

    if (props.modelValue instanceof Date) {
        return isSameDate(date, props.modelValue);
    }

    return false;
};

const isInRange = (date: Date) => {
    if (!props.range || !props.modelValue || !('start' in props.modelValue) || !props.modelValue.start || !props.modelValue.end) {
        return false;
    }
    return isDateInRange(date, props.modelValue.start, props.modelValue.end);
};

const isBetween = (date: Date) => {
    if (!props.range) return false;
    const currentRange = props.modelValue as DateRange | null;
    // Only apply hover effect if a start date is selected but an end date is not.
    if (!currentRange || !currentRange.start || currentRange.end || !props.hoveredDate) {
        return false;
    }

    const start = currentRange.start;
    const hover = props.hoveredDate;

    // Don't highlight if hovering over the start date itself
    if (isSameDate(hover, start)) {
        return false;
    }

    const d = dayjs(date);
    const s = dayjs(start);
    const h = dayjs(hover);

    // Check if the date is between the start and hover dates
    if (h.isBefore(s)) {
        return d.isAfter(h) && d.isBefore(s);
    }
    return d.isAfter(s) && d.isBefore(h);
};

const isRangeStart = (date: Date) => {
    if (!props.range || !props.modelValue || !('start' in props.modelValue) || !props.modelValue.start) {
        return false;
    }
    return isSameDate(date, props.modelValue.start);
}

const isRangeEnd = (date: Date) => {
    if (!props.range || !props.modelValue || !('start' in props.modelValue) || !props.modelValue.end) {
        return false;
    }
    return isSameDate(date, props.modelValue.end);
}
</script>

<style scoped>
/* Styling is now handled by Tailwind CSS classes */
</style>
