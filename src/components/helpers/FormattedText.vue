<template>
  <span
    :class="{
      'font-bold': text.isBold,
      'italic': text.isItalic,
      'line-through': text.isStrikethrough,
      'underline': text.isUnderline,
      'font-mono bg-gray-800 px-1 rounded': text.isCode,
      'text-red-400': text.color === 'red',
      'text-blue-400': text.color === 'blue',
      'text-green-400': text.color === 'green',
      'text-yellow-400': text.color === 'yellow',
      'text-purple-400': text.color === 'purple',
      'text-pink-400': text.color === 'pink',
      'text-gray-400': text.color === 'gray'
    }"
  >
    {{ text.content }}
  </span>
</template>

<script setup>
defineProps({
  text: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value.content === 'string';
    }
  }
});
</script> 