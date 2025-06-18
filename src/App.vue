<script setup>
// No props needed - using dynamic layout system
</script>

<template>
  <component :is="$route.meta.layoutComponent">
    <RouterView />
  </component>
</template>

<style>
/* Global cursor styles */
button,
[role='button'],
a,
.cursor-pointer {
  cursor: pointer;
}

/* Disabled state */
button:disabled,
[role='button']:disabled,
.cursor-not-allowed {
  cursor: not-allowed;
}
</style>
