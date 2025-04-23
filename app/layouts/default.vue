<template>
  <div class="flex min-h-screen flex-col items-stretch">
    <AppHeader />

    <div class="grow p-6 max-w-[1440px] mx-auto w-full">
      <slot />
    </div>
  </div>
</template>
