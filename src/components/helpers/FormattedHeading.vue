<template>
  <component :is="headingTag" :class="headingClasses">
    <FormattedText 
      v-for="(text, textIndex) in text" 
      :key="textIndex"
      :text="text"
    />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import FormattedText from './FormattedText.vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['heading_1', 'heading_2', 'heading_3'].includes(value)
  },
  text: {
    type: Array,
    required: true
  }
});

const headingTag = computed(() => {
  switch (props.type) {
    case 'heading_1': return 'h1';
    case 'heading_2': return 'h2';
    case 'heading_3': return 'h3';
    default: return 'h1';
  }
});

const headingClasses = computed(() => {
  const baseClasses = 'font-bold text-gray-100';
  switch (props.type) {
    case 'heading_1': return `${baseClasses} text-3xl`;
    case 'heading_2': return `${baseClasses} text-2xl`;
    case 'heading_3': return `${baseClasses} text-xl`;
    default: return baseClasses;
  }
});
</script> 