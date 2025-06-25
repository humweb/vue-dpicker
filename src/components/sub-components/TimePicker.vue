<template>
    <div class="flex items-center justify-center p-2 border-t border-gray-200">
        <select v-model="displayHour" @change="updateTime" class="px-2 py-1 border border-gray-300 rounded-md bg-white">
            <option v-for="hour in hourOptions" :key="hour" :value="hour">{{ formatTime(hour) }}</option>
        </select>
        <span class="mx-2 font-bold">:</span>
        <select v-model="selectedMinute" @change="updateTime"
            class="px-2 py-1 border border-gray-300 rounded-md bg-white">
            <option v-for="minute in minutes" :key="minute" :value="minute">{{ formatTime(minute) }}</option>
        </select>
        <select v-if="!is24hr" v-model="ampm" @change="updateTime"
            class="px-2 py-1 border border-gray-300 rounded-md bg-white ml-2">
            <option value="AM">AM</option>
            <option value="PM">PM</option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = withDefaults(defineProps<{
    modelValue: {
        hours: number;
        minutes: number;
    };
    is24hr?: boolean;
}>(), {
    is24hr: true,
});

const emit = defineEmits(['update:modelValue']);

const selectedMinute = ref(props.modelValue.minutes);
const ampm = ref(props.modelValue.hours >= 12 ? 'PM' : 'AM');

const displayHour = computed({
    get() {
        if (props.is24hr) {
            return props.modelValue.hours;
        }
        const hour = props.modelValue.hours % 12;
        return hour === 0 ? 12 : hour;
    },
    set(value) {
        updateTimeFromDisplay(value);
    }
});

const hourOptions = computed(() => {
    if (props.is24hr) {
        return Array.from({ length: 24 }, (_, i) => i);
    }
    return Array.from({ length: 12 }, (_, i) => i + 1);
});

const minutes = Array.from({ length: 60 }, (_, i) => i);

const formatTime = (time: number) => (time < 10 ? `0${time}` : time.toString());

const updateTime = () => {
    let hours = displayHour.value;
    if (!props.is24hr) {
        if (ampm.value === 'PM' && hours !== 12) {
            hours += 12;
        }
        if (ampm.value === 'AM' && hours === 12) {
            hours = 0;
        }
    }
    emit('update:modelValue', {
        hours,
        minutes: selectedMinute.value,
    });
};

const updateTimeFromDisplay = (hour: number) => {
    let newHour = hour;
    if (!props.is24hr) {
        if (ampm.value === 'PM' && newHour !== 12) {
            newHour += 12;
        }
        if (ampm.value === 'AM' && newHour === 12) {
            newHour = 0;
        }
    }
    emit('update:modelValue', {
        hours: newHour,
        minutes: selectedMinute.value,
    });
}

watch(() => props.modelValue, (newTime) => {
    selectedMinute.value = newTime.minutes;
    ampm.value = newTime.hours >= 12 ? 'PM' : 'AM';
});
</script>

<style scoped>
/* Styling is now handled by Tailwind CSS classes */
</style>
