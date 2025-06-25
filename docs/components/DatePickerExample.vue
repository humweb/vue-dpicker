<script setup>
import { ref } from 'vue'
import { DatePicker } from '../../src'

const date = ref()
const dateRange = ref()
const dateTime = ref()
const dateInline = ref()
const dateWithPresets = ref()

const presets = [
    {
        label: 'Today',
        value: new Date()
    },
    {
        label: 'Tomorrow',
        value: new Date(new Date().setDate(new Date().getDate() + 1))
    },
    {
        label: 'Next week',
        value: new Date(new Date().setDate(new Date().getDate() + 7))
    }
]
</script>

<template>
    <div class="container">
        <div class="example">
            <h3 class="title">
                Basic
            </h3>
            <DatePicker v-model="date" />
        </div>

        <div class="example">
            <h3 class="title">
                Range
            </h3>
            <DatePicker v-model="dateRange" range />
        </div>

        <div class="example">
            <h3 class="title">
                Enable Time
            </h3>
            <DatePicker v-model="dateTime" enable-time />
        </div>

        <div class="example">
            <h3 class="title">
                Inline
            </h3>
            <DatePicker v-model="dateInline" inline />
        </div>

        <div class="example">
            <h3 class="title">
                With Presets
            </h3>
            <DatePicker v-model="dateWithPresets" range :presets="presets" />
        </div>
    </div>
</template>

<style>
.container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.example {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.title {
    font-size: 1.25rem;
    font-weight: 500;
}

input {
    border: 1px solid #ddd;

}
</style>
