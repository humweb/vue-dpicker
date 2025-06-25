<script setup>
import { ref } from 'vue'
import { DatePicker } from '../../src'

const date = ref()
</script>

<template>
    <DatePicker v-model="date" />
</template>
