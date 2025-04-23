<template>
  <div class="border-b shadow-sm">
    <div class="flex flex-row items-center justify-between gap-6 max-w-[1440px] mx-auto w-full p-6">
      <NuxtLink
        :to="{ name: 'index'}"
        class="flex flex-row items-center gap-4"
      >
        <UIcon name="maki:warehouse" class="size-6" />

        <div class="text-3xl font-medium">
          DA Storage
        </div>
      </NuxtLink>

      <div class="grow">
        <UButton
          variant="link"
          color="neutral"
          label="Items"
          :to="{ name: 'items' }"
        />
      </div>

      <div class="flex flex-row items-center gap-2">
        <ThemePicker />
        <ColorModeButton />

        <AppHeaderMenu />
      </div>
    </div>
  </div>
</template>
