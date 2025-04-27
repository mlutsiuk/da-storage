<template>
  <div class="flex min-h-screen flex-col items-stretch">
    <AppHeader
      class="hidden md:block"
    />

    <div class="grow p-6 max-w-[1440px] mx-auto w-full flex flex-col">
      <slot />
    </div>

    <AppBottomNavigation class="md:hidden" />
  </div>
</template>
