<template>
  <div class="bg-gray-800 flex shrink-0 flex-row gap-1 py-2">
    <AppBottomNavigationLink
      :to="{ name: 'inbounds' }"
      icon="mdi:view-dashboard-variant-outline"
      text="Dashboard"
      class="basis-1/3"
    />

    <AppBottomNavigationLink
      :to="{ name: 'scan' }"
      icon="mdi:line-scan"
      text="Scan"
      class="basis-1/3"
    />

    <AppBottomNavigationLink
      :to="{ name: 'profile' }"
      icon="i-ph-user-circle"
      text="Profile"
      class="basis-1/3"
    />
  </div>
</template>