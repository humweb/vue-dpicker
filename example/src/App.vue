<script setup lang='ts'>
import { ref } from 'vue';
import { DatePicker } from '../../src/index';
import Prism from 'vue-prism-component';
import 'prismjs/themes/prism-tomorrow.css';

// --- Refs for Date Models ---
const date = ref(new Date());

const dateRange = ref({
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 7)),
});

const dateWithPresets = ref({
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 7)),
});

const dateTime = ref(new Date());

// --- Code Snippets for Examples (as strings) ---
const dateRangeCode = `<DatePicker
  v-model='dateRange'
/>`;

const datePresetsCode = `<DatePicker
  v-model='dateWithPresets'
  range
  :presets='[
    {
      label: "Today",
      range: { start: new Date(), end: new Date() }
    },
    {
      label: "Next 7 Days",
      range: { start: new Date(), end: new Date(new Date().setDate(new Date().getDate() + 7)) }
    },
    {
      label: "This Month",
      range: {
        start: new Date(new Date().setDate(1)),
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      }
    }
  ]'
/>`;

const dateTimeCode = `<DatePicker
  v-model='dateTime'
  enable-time
/>`;
</script>

<template>
    <div class='bg-gray-100 min-h-screen font-sans text-gray-900'>
        <header class='bg-white border-b border-gray-200'>
            <div class='container mx-auto px-6 py-5'>
                <h1 class='text-3xl font-bold text-blue-600'>Vue dPicker Showcase</h1>
                <p class='text-gray-600 mt-1'>
                    A clean, modern, and flexible date picker for Vue 3.
                </p>
            </div>
        </header>

        <main class='container mx-auto p-6 grid gap-10'>
            <!-- Card 1: Date Range Selection -->
            <div class='bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-2xl'>
                <div class='p-8'>
                    <h2 class='text-2xl font-semibold mb-2'>1. Date Selection</h2>
                    <p class='text-gray-600 mb-6'>
                        Simple date picker
                    </p>
                    <div class='flex justify-center items-center p-8 bg-gray-50 rounded-lg border border-gray-200'>
                        <DatePicker v-model='date' />
                    </div>
                </div>
                <div class='bg-gray-800'>
                    <Prism language='html'>{{ dateRangeCode.trim() }}</Prism>
                </div>
            </div>

            <!-- Card 2: Date Presets -->
            <div class='bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-2xl'>
                <div class='p-8'>
                    <h2 class='text-2xl font-semibold mb-2'>2. Date Presets</h2>
                    <p class='text-gray-600 mb-6'>
                        Enable date range selection by adding the <code>range</code> boolean prop.
                        Provide an array of preset objects for common date selections.
                    </p>
                    <div class='flex justify-center items-center p-8 bg-gray-50 rounded-lg border border-gray-200'>
                        <DatePicker v-model='dateWithPresets' range :presets='[
                            { label: "Today", range: { start: new Date(), end: new Date() } },
                            { label: "Next 7 Days", range: { start: new Date(), end: new Date(new Date().setDate(new Date().getDate() + 7)) } },
                            { label: "This Month", range: { start: new Date(new Date().setDate(1)), end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0) } }
                        ]' />
                    </div>
                </div>
                <div class='bg-gray-800'>
                    <Prism language='html'>{{ datePresetsCode.trim() }}</Prism>
                </div>
            </div>

            <!-- Card 3: Date & Time Picker -->
            <div class='bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-2xl'>
                <div class='p-8'>
                    <h2 class='text-2xl font-semibold mb-2'>3. Date & Time Picker</h2>
                    <p class='text-gray-600 mb-6'>
                        Enable time selection by adding the <code>time-picker</code> boolean prop.
                    </p>
                    <div class='flex justify-center items-center p-8 bg-gray-50 rounded-lg border border-gray-200'>
                        <DatePicker v-model='dateTime' enable-time />
                    </div>
                </div>
                <div class='bg-gray-800'>
                    <Prism language='html'>{{ dateTimeCode.trim() }}</Prism>
                </div>
            </div>
        </main>

        <footer class='text-center py-6 text-gray-500 text-sm'>
            <p>Built with ❤️ and Vue 3.</p>
        </footer>
    </div>
</template>

<style>
/* Overriding prism-tomorrow to better fit the design */
pre[class*='language-'] {
    @apply rounded-none m-0 p-6 text-sm;
}
</style>
