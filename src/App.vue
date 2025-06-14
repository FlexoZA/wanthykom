<script setup>
// No props needed - using dynamic layout system
</script>

<template>
  <component :is="$route.meta.layoutComponent">
    <RouterView />
  </component>
</template>
