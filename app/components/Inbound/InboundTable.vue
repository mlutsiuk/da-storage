<script setup lang="ts">
import { upperFirst } from 'scule'
import type { TableColumn } from '@nuxt/ui'
import { LazyInboundCreateModal, LazyInboundDeleteModal } from '#components'

const table = useTemplateRef('table')
const overlay = useOverlay()
const mitt = useMitt()

const { data, refresh } = await useAsyncData('inbounds', () =>
  useTrpc().inbound.getAll.query({ page: 1, limit: 20 })
)

const createModal = overlay.create(LazyInboundCreateModal)
const deleteModal = overlay.create(LazyInboundDeleteModal)

function openAddInboundModal() {
  mitt.emit('scanner:start', {
    onScanned: async (code) => {
      const shouldRefetch = await createModal.open({ trackingCode: code })
      if (shouldRefetch) {
        await refresh()
      }
    }
  })
}
async function openDeleteInboundModal(id: string) {
  const confirmed = await deleteModal.open({ id })
  if (confirmed) {
    await refresh()
  }
}

const columns: TableColumn<any>[] = [
  {
    accessorKey: 'trackingCode',
    header: 'Tracking'
  },
  {
    accessorKey: 'location.name',
    header: 'Location'
  },
  {
    accessorKey: 'quantity',
    header: 'Qty'
  },
  {
    accessorKey: 'defectiveQuantity',
    header: 'Defects'
  },
  {
    accessorKey: 'createdAt',
    header: 'Received'
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
        :model-value="(table?.tableApi?.getColumn('trackingCode')?.getFilterValue() as string)"
        class="max-w-sm min-w-[12ch]"
        placeholder="Search tracking code"
        @update:model-value="table?.tableApi?.getColumn('trackingCode')?.setFilterValue($event)"
      />

      <div class="flex flex-row gap-2 items-center">
        <UButton
          label="Add inbound"
          icon="i-lucide-plus"
          color="primary"
          @click="openAddInboundModal"
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
      :data="data?.inbounds"
      :columns="columns"
      sticky
      class="min-h-96"
    >
      <template #trackingCode-cell="{ row }">
        <UTooltip :text="row.original.trackingCode">
          <span class="font-mono">*{{ row.original.trackingCode.slice(-4) }}</span>
        </UTooltip>
      </template>

      <template #location.name-cell="{ row }">
        {{ row.original.location?.name ?? '—' }}
      </template>

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
                label: 'Copy tracking code',
                icon: 'i-lucide-copy',
                onSelect: () => copyText(row.original.trackingCode)
              },
              {
                label: 'Delete',
                icon: 'i-lucide-trash-2',
                onSelect: () => openDeleteInboundModal(row.original.id)
              },
              {
                label: row.getIsExpanded() ? 'Collapse' : 'Expand',
                icon: row.getIsExpanded() ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down',
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