<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white">
          Meus Parlays
        </h1>
        <p class="text-gray-400 mt-1">
          Gerencie seus parlays gerados
        </p>
      </div>
      <UButton
        to="/games"
        color="orange"
        icon="i-heroicons-plus"
      >
        Novo Parlay
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4">
      <USelect
        v-model="filters.status"
        :options="statusOptions"
        placeholder="Status"
        class="w-40"
      />
      <UInput
        v-model="searchQuery"
        placeholder="Buscar parlay..."
        icon="i-heroicons-magnifying-glass"
        class="w-64"
      />
    </div>

    <!-- Parlays List -->
    <div v-if="parlaysStore.loading" class="space-y-4">
      <USkeleton v-for="i in 5" :key="i" class="h-48 bg-gray-800" />
    </div>

    <div v-else-if="filteredParlays.length === 0" class="text-center py-16">
      <UIcon name="i-heroicons-ticket" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 class="text-xl font-medium text-white mb-2">
        Nenhum parlay encontrado
      </h3>
      <p class="text-gray-400 mb-6">
        Você ainda não gerou nenhum parlay
      </p>
      <UButton to="/games" color="orange">
        Gerar Meu Primeiro Parlay
      </UButton>
    </div>

    <div v-else class="space-y-4">
      <UCard
        v-for="parlay in filteredParlays"
        :key="parlay.id"
        class="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors"
      >
        <div class="space-y-4">
          <!-- Header -->
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center space-x-3">
              <UBadge
                :color="getResultColor(parlay.result)"
                variant="soft"
                size="lg"
              >
                {{ getResultLabel(parlay.result) }}
              </UBadge>
              <span class="text-gray-400">
                {{ formatDate(parlay.createdAt) }}
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <UButton
                :to="`/parlays/${parlay.id}`"
                color="gray"
                variant="soft"
                size="sm"
                icon="i-heroicons-eye"
              >
                Ver
              </UButton>
              <UButton
                color="red"
                variant="soft"
                size="sm"
                icon="i-heroicons-trash"
                @click="confirmDelete(parlay)"
              >
                Excluir
              </UButton>
            </div>
          </div>

          <!-- Game Info -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <span class="text-lg font-bold text-white">{{ parlay.game.awayTeam.code }}</span>
              <span class="text-gray-500">@</span>
              <span class="text-lg font-bold text-white">{{ parlay.game.homeTeam.code }}</span>
            </div>
            <UBadge
              :color="getGameStatusColor(parlay.game.status)"
              variant="soft"
              size="sm"
            >
              {{ getGameStatusLabel(parlay.game.status) }}
            </UBadge>
          </div>

          <!-- Parlay Items -->
          <div class="bg-gray-900/50 rounded-lg p-4 space-y-3">
            <div
              v-for="item in parlay.items"
              :key="item.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <UIcon
                  :name="getItemResultIcon(item.result)"
                  :class="getItemResultColor(item.result)"
                  class="w-5 h-5"
                />
                <span class="text-white">
                  {{ item.player.firstName }} {{ item.player.lastName }}
                </span>
                <span class="text-gray-400">
                  {{ getBetTypeLabel(item.betType) }}
                </span>
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-orange-400 font-medium">
                  {{ item.prediction }} {{ item.line }}
                </span>
                <span class="text-gray-400 text-sm">
                  @{{ item.odds.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-700">
            <div class="flex items-center space-x-6">
              <div>
                <span class="text-gray-400 text-sm">Odds Totais</span>
                <p class="text-xl font-bold text-white">{{ parlay.totalOdds.toFixed(2) }}</p>
              </div>
              <div>
                <span class="text-gray-400 text-sm">Confiança</span>
                <p 
                  class="text-xl font-bold"
                  :class="getConfidenceColor(parlay.confidence)"
                >
                  {{ parlay.confidence.toFixed(0) }}%
                </p>
              </div>
            </div>
            <div v-if="parlay.result !== 'PENDING'" class="text-right">
              <span class="text-gray-400 text-sm">Retorno</span>
              <p 
                class="text-xl font-bold"
                :class="parlay.result === 'WIN' ? 'text-green-400' : 'text-red-400'"
              >
                {{ parlay.result === 'WIN' ? '+' : '' }}{{ parlay.actualReturn?.toFixed(2) || '0.00' }}
              </p>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Pagination -->
    <div v-if="parlaysStore.meta && parlaysStore.meta.totalPages > 1" class="flex justify-center">
      <UPagination
        v-model="page"
        :total="parlaysStore.meta.total"
        :page-count="parlaysStore.meta.limit"
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteModal">
      <UCard class="bg-gray-800 border-gray-700">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-500" />
            <h3 class="text-lg font-medium text-white">Confirmar Exclusão</h3>
          </div>
        </template>
        
        <p class="text-gray-300">
          Tem certeza que deseja excluir este parlay? Esta ação não pode ser desfeita.
        </p>
        
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="gray"
              variant="soft"
              @click="showDeleteModal = false"
            >
              Cancelar
            </UButton>
            <UButton
              color="red"
              :loading="deleting"
              @click="deleteParlay"
            >
              Excluir
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useParlaysStore } from '~/stores/parlays'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Parlay } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const parlaysStore = useParlaysStore()

// State
const page = ref(1)
const searchQuery = ref('')
const showDeleteModal = ref(false)
const deleting = ref(false)
const parlayToDelete = ref<Parlay | null>(null)

const filters = reactive({
  status: '',
})

// Options
const statusOptions = [
  { label: 'Todos', value: '' },
  { label: 'Pendente', value: 'PENDING' },
  { label: 'Ganho', value: 'WIN' },
  { label: 'Perdido', value: 'LOSS' },
]

// Computed
const filteredParlays = computed(() => {
  let parlays = parlaysStore.parlays

  // Filter by status
  if (filters.status) {
    parlays = parlays.filter(p => p.result === filters.status)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    parlays = parlays.filter(p =>
      p.game.homeTeam.name.toLowerCase().includes(query) ||
      p.game.awayTeam.name.toLowerCase().includes(query) ||
      p.items.some(i => 
        `${i.player.firstName} ${i.player.lastName}`.toLowerCase().includes(query)
      )
    )
  }

  return parlays
})

// Load data
onMounted(() => {
  parlaysStore.fetchParlays({ page: page.value })
})

// Watch page changes
watch(page, (newPage) => {
  parlaysStore.fetchParlays({ page: newPage })
})

// Methods
function getResultColor(result: string): string {
  const colors: Record<string, string> = {
    PENDING: 'blue',
    WIN: 'green',
    LOSS: 'red',
    PUSH: 'yellow',
  }
  return colors[result] || 'gray'
}

function getResultLabel(result: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pendente',
    WIN: 'Ganho',
    LOSS: 'Perdido',
    PUSH: 'Empate',
  }
  return labels[result] || result
}

function getGameStatusColor(status: string): string {
  const colors: Record<string, string> = {
    SCHEDULED: 'blue',
    LIVE: 'green',
    FINISHED: 'gray',
    POSTPONED: 'yellow',
    CANCELLED: 'red',
  }
  return colors[status] || 'gray'
}

function getGameStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    SCHEDULED: 'Agendado',
    LIVE: 'Ao Vivo',
    FINISHED: 'Finalizado',
    POSTPONED: 'Adiado',
    CANCELLED: 'Cancelado',
  }
  return labels[status] || status
}

function getItemResultIcon(result: string): string {
  const icons: Record<string, string> = {
    PENDING: 'i-heroicons-clock',
    WIN: 'i-heroicons-check-circle',
    LOSS: 'i-heroicons-x-circle',
    PUSH: 'i-heroicons-minus-circle',
  }
  return icons[result] || 'i-heroicons-question-mark-circle'
}

function getItemResultColor(result: string): string {
  const colors: Record<string, string> = {
    PENDING: 'text-gray-400',
    WIN: 'text-green-400',
    LOSS: 'text-red-400',
    PUSH: 'text-yellow-400',
  }
  return colors[result] || 'text-gray-400'
}

function getBetTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    POINTS: 'Pontos',
    REBOUNDS: 'Rebotes',
    ASSISTS: 'Assistências',
    STEALS: 'Roubos',
    BLOCKS: 'Tocos',
    THREES: 'Cestas de 3',
    POINTS_REBOUNDS: 'Pontos + Rebotes',
    POINTS_ASSISTS: 'Pontos + Assistências',
    REBOUNDS_ASSISTS: 'Rebotes + Assistências',
    DOUBLE_DOUBLE: 'Duplo-Duplo',
    TRIPLE_DOUBLE: 'Triplo-Duplo',
  }
  return labels[type] || type
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 70) return 'text-green-400'
  if (confidence >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  } catch {
    return '--/--/----'
  }
}

function confirmDelete(parlay: Parlay) {
  parlayToDelete.value = parlay
  showDeleteModal.value = true
}

async function deleteParlay() {
  if (!parlayToDelete.value) return
  
  deleting.value = true
  
  const success = await parlaysStore.deleteParlay(parlayToDelete.value.id)
  
  if (success) {
    showDeleteModal.value = false
    parlayToDelete.value = null
  }
  
  deleting.value = false
}
</script>
