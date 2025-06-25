<template>
    <div class="p-4">
        <div class="flex justify-between items-center mb-2">
            <button @click="$emit('prev-month')" class="p-2 rounded-full hover:bg-gray-100"
                :class="{ 'invisible': props.hidePrev }"></button>
            <span class="text-lg font-semibold">{{ monthYear }}</span>
            <button @click="$emit('next-month')" class="p-2 rounded-full hover:bg-gray-100"
                :class="{ 'invisible': props.hideNext }">></button>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center text-sm text-gray-500">
            <div v-for="day in daysOfWeek" :key="day">{{ day }}</div>
        </div>
        <div class="grid grid-cols-7 gap-1 mt-2">
            <div v-for="(day, index) in days" :key="index" class="text-center p-2 rounded-full cursor-pointer" :class="{
                'text-gray-400': !day.isCurrentMonth,
                'bg-blue-500 text-white': isSelected(day.date),
                'bg-blue-100': isInRange(day.date) && !isSelected(day.date),
                'rounded-l-full': isRangeStart(day.date) && !isRangeEnd(day.date),
                'rounded-r-full': isRangeEnd(day.date) && !isRangeStart(day.date),
                'hover:bg-gray-200': !isSelected(day.date)
            }" @click="selectDate(day.date)">
                {{ new Date(day.date).getDate() }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PropType } from 'vue';
import { useDateHelpers } from '../../composables/useDateHelpers';

const props = defineProps({
    modelValue: {
        type: [Object, Date] as PropType<Date | { start: Date | null; end: Date | null } | null>,
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
});

const emit = defineEmits(['update:modelValue', 'prev-month', 'next-month']);

const { getDaysInMonth, formatDate, isDateInRange, isSameDate } = useDateHelpers();

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const days = computed(() =>
    getDaysInMonth(props.currentDate.getMonth(), props.currentDate.getFullYear())
);

const monthYear = computed(() =>
    formatDate(props.currentDate, 'MMMM YYYY')
);

const selectDate = (date: Date) => {
    if (!props.range) {
        emit('update:modelValue', date);
        return;
    }

    let range = {
        start: props.modelValue && 'start' in props.modelValue ? props.modelValue.start : null,
        end: props.modelValue && 'end' in props.modelValue ? props.modelValue.end : null
    };

    if (!range.start || (range.start && range.end)) {
        range = { start: date, end: null };
    } else if (range.start && !range.end) {
        if (date < range.start) {
            range = { start: date, end: null };
        } else {
            range.end = date;
        }
    }

    emit('update:modelValue', range);
};

const isSelected = (date: Date) => {
    if (!props.modelValue) return false;

    if (props.range && 'start' in props.modelValue) {
        const { start, end } = props.modelValue;
        if (start && isSameDate(date, start)) return true;
        if (end && isSameDate(date, end)) return true;
        return false;
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
