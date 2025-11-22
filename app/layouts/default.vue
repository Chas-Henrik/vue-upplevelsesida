<script setup lang="ts">
const handleMenuClick = (buttonId: string, url: string) => {
  navigateTo(url)
}
</script>

<template>
  <div>
    <Header @menu-click="handleMenuClick" />
    <slot />
  </div>
</template>
