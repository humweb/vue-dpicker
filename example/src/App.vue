<template>
    <div id="app" class="bg-gray-100 min-h-screen p-8">
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 class="text-2xl font-bold mb-6 text-center">Vue Date Picker Example</h1>

            <div class="mb-8">
                <h2 class="text-xl font-semibold mb-4">Date Only</h2>
                <DatePicker v-model="selectedDate" @date-selected="logDate" />
                <p class="mt-2 text-gray-600">Selected Date: {{ selectedDate }}</p>
            </div>

            <hr class="my-6" />

            <div class="mb-8">
                <h2 class="text-xl font-semibold mb-4">Date and Time (String Input)</h2>
                <DatePicker v-model="selectedDateTimeString" :enableTime="true" @date-selected="logDate" />
                <p class="mt-2 text-gray-600">Selected Date Time: {{ selectedDateTimeString }}</p>
            </div>

            <hr class="my-6" />

            <div>
                <h2 class="text-xl font-semibold mb-4">Date Range</h2>
                <DatePicker v-model="selectedRange" :range="true" :presets="presets" @range-selected="logRange" />
                <p class="mt-2 text-gray-600">Selected Range: {{ selectedRange }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker } from '../../src';

const selectedDate = ref<string | Date | null>(new Date());
const selectedDateTimeString = ref<string | Date | null>('2025-07-04T12:30:00.000Z');
const selectedRange = ref<{ start: Date | string | null, end: Date | string | null }>({ start: new Date(), end: '2025-08-01' });

const logDate = (date: Date | string) => {
    console.log('Date Selected:', date);
};

const logRange = (range: { start: Date | string | null, end: Date | string | null }) => {
    console.log('Range Selected:', range);
};

const presets = ref([
    {
        label: 'Last 7 days',
        range: {
            start: new Date(new Date().setDate(new Date().getDate() - 7)),
            end: new Date(),
        },
    },
    {
        label: 'Last 30 days',
        range: {
            start: new Date(new Date().setDate(new Date().getDate() - 30)),
            end: new Date(),
        },
    },
]);
</script>

<style>
/* Styles are now handled by Tailwind CSS */
</style>
