<template>
    <div class="flex flex-col p-2 border-r border-gray-200">
        <button v-for="(preset, i) in presets" :key="i"
            class="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="selectPreset(preset)">
            {{ preset.label }}
        </button>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import type { Preset } from '../../types';

const props = defineProps({
    presets: {
        type: Array as () => Preset[],
        default: () => [],
    },
});

const emit = defineEmits(['select']);

const selectPreset = (preset: Preset) => {
    emit('select', preset.range);
};
</script>
