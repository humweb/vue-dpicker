<template>
    <div class="flex items-center justify-center p-2 border-t border-gray-200">
        <select v-model="selectedHour" @change="updateTime"
            class="px-2 py-1 border border-gray-300 rounded-md bg-white">
            <option v-for="hour in hours" :key="hour" :value="hour">{{ formatTime(hour) }}</option>
        </select>
        <span class="mx-2 font-bold">:</span>
        <select v-model="selectedMinute" @change="updateTime"
            class="px-2 py-1 border border-gray-300 rounded-md bg-white">
            <option v-for="minute in minutes" :key="minute" :value="minute">{{ formatTime(minute) }}</option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    modelValue: {
        hours: number;
        minutes: number;
    };
}>();

const emit = defineEmits(['update:modelValue']);

const selectedHour = ref(props.modelValue.hours);
const selectedMinute = ref(props.modelValue.minutes);

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

const formatTime = (time: number) => (time < 10 ? `0${time}` : time.toString());

const updateTime = () => {
    emit('update:modelValue', {
        hours: selectedHour.value,
        minutes: selectedMinute.value,
    });
};

watch(() => props.modelValue, (newTime) => {
    selectedHour.value = newTime.hours;
    selectedMinute.value = newTime.minutes;
});
</script>

<style scoped>
/* Styling is now handled by Tailwind CSS classes */
</style>
