<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Item } from '@prisma/client'
import { LazyItemCreateModal } from '#components'
import { useToast } from '#imports'

const table = useTemplateRef('table')
const toast = useToast()

const { data, refresh } = await useAsyncData(() =>
  useTrpc().items.getAll.query({
    page: 1,
    limit: 20
  })
)
const overlay = useOverlay()
const modal = overlay.create(LazyItemCreateModal)

async function openAddItemModal() {
  const shouldRefetch = await modal.open()

  if (shouldRefetch) {
    toast.add({ title: 'Item created', color: 'success' })
    await refresh()
  }
}

const columns: TableColumn<Item>[] = [
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

const copyText = (text: string) => navigator.clipboard.writeText(text)
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
          label="Add item"
          icon="i-lucide-plus"
          color="primary"
          @click="openAddItemModal"
        />

        <UDropdownMenu
          :items="table?.tableApi?.getAllColumns().filter(c => c.getCanHide()).map(c => ({
            label: c.id,
            type: 'checkbox',
            checked: c.getIsVisible(),
            onUpdateChecked: (v: boolean) => table?.tableApi?.getColumn(c.id)?.toggleVisibility(!!v),
            onSelect: (e?: Event) => e?.preventDefault(),
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
      :data="data?.items"
      sticky
      :columns
      class="min-h-96"
    >
      <template #select-header="{ table }">
        <UCheckbox
          :model-value="table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected()"
          aria-label="Select all"
          @update:model-value="(v) => table.toggleAllPageRowsSelected(!!v)"
        />
      </template>

      <template #select-cell="{ row }">
        <UCheckbox
          :model-value="row.getIsSelected()"
          aria-label="Select row"
          @update:model-value="(v) => row.toggleSelected(!!v)"
        />
      </template>

      <template #name-header>
        Name
      </template>

      <template #name-cell="{ row }">
        <span class="capitalize">{{ row.getValue('name') }}</span>
      </template>

      <template #createdAt-header>
        Created At
      </template>

      <template #createdAt-cell="{ row }">
        {{ new Date(row.getValue('createdAt')).toLocaleString('uk-UA', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }) }}
      </template>

      <template #actions-cell="{ row }">
        <div class="flex justify-end">
          <UDropdownMenu
            :items="[
              { type: 'label', label: 'Actions' },
              {
                label: 'Copy ID',
                onSelect: () => {
                  copyText(row.original.id)
                  toast.add({ title: 'ID copied', icon: 'i-lucide-check-circle', color: 'success' })
                },
              },
              {
                label: row.getIsExpanded() ? 'Collapse' : 'Expand',
                onSelect: () => row.toggleExpanded(),
              },
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
