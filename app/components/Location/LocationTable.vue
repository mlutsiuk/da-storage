<script setup lang="ts">
import { ref, h } from 'vue'
import { useToast } from '#imports'
import { upperFirst } from 'scule'
import type { TableColumn } from '@nuxt/ui'
import { LazyLocationCreateModal } from '#components'

const table = useTemplateRef('table')
const toast = useToast()
const overlay = useOverlay()

const { data, refresh } = await useAsyncData('locations', () =>
  useTrpc().locations.getAll.query()
)

const modal = overlay.create(LazyLocationCreateModal)

async function openAddLocationModal() {
  const shouldRefetch = await modal.open()
  if (shouldRefetch) {
    toast.add({ title: 'Location created', color: 'success' })
    await refresh()
  }
}

const columns: TableColumn<any>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At'
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right w-full' }, 'Actions'),
    enableHiding: false
  }
]
</script>

<template>
  <div class="flex-1 divide-y divide-accented w-full">
    <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto justify-between">
      <UInput
        :model-value="(table?.tableApi?.getColumn('name')?.getFilterValue() as string)"
        class="max-w-sm min-w-[12ch]"
        placeholder="Search by name"
        @update:model-value="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
      />

      <div class="flex flex-row gap-2 items-center">
        <UButton
          label="Add location"
          icon="i-lucide-plus"
          color="primary"
          @click="openAddLocationModal"
        />

        <UDropdownMenu
          :items="table?.tableApi?.getAllColumns().filter(c => c.getCanHide()).map(c => ({
            label: upperFirst(c.id),
            type: 'checkbox',
            checked: c.getIsVisible(),
            onUpdateChecked: (v: boolean) => table?.tableApi?.getColumn(c.id)?.toggleVisibility(!!v),
            onSelect: (e?: Event) => e?.preventDefault()
          }))"
        >
          <UButton
            label="Columns"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-chevron-down"
          />
        </UDropdownMenu>
      </div>
    </div>

    <UTable
      ref="table"
      :data="data"
      :columns="columns"
      sticky
      class="min-h-96"
    >
      <template #createdAt-cell="{ row }">
        {{ new Date(row.getValue('createdAt')).toLocaleString('uk-UA', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }) }}
      </template>

      <template #actions-cell="{ row }">
        <div class="flex justify-end">
          <UDropdownMenu
            :items="[
              { type: 'label', label: 'Actions' },
              {
                label: 'Copy ID',
                onSelect: () => navigator.clipboard.writeText(row.original.id)
              },
              {
                label: row.getIsExpanded() ? 'Collapse' : 'Expand',
                onSelect: () => row.toggleExpanded()
              }
            ]"
            :content="{ align: 'end' }"
          >
            <UButton
              icon="i-lucide-ellipsis-vertical"
              color="neutral"
              variant="ghost"
              aria-label="Actions"
            />
          </UDropdownMenu>
        </div>
      </template>

      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
    </UTable>
  </div>
</template>
