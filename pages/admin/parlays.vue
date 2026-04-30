
<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white">
        Todos os Parlays
      </h1>
      <p class="text-gray-400 mt-1">
        Visualize e gerencie todos os parlays do sistema
      </p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4">
      <CvSelect
        v-model="filters.status"
        :options="statusOptions"
        placeholder="Status"
        class="w-40"
      />
      <CvInput
        v-model="searchQuery"
        placeholder="Buscar parlay..."
        icon="i-heroicons-magnifying-glass"
        class="w-64"
      />
    </div>

    <!-- Parlays Table -->
    <CvCard class="bg-gray-800 border-gray-700">
      <div v-if="parlaysStore.loading" class="space-y-4">
        <CvSkeleton v-for="i in 5" :key="i" class="h-12 bg-gray-700" />
      </div>

      <div v-else-if="filteredParlays.length === 0" class="text-center py-12">
        <CvIcon name="i-heroicons-ticket" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-medium text-white mb-2">
          Nenhum parlay encontrado
        </h3>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-900/50">
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Usuário</th>
              <th class="px-4 py-3">Jogo</th>
              <th class="px-4 py-3">Odds</th>
              <th class="px-4 py-3">Confiança</th>
              <th class="px-4 py-3">Resultado</th>
              <th class="px-4 py-3">Data</th>
              <th class="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr
              v-for="parlay in filteredParlays"
              :key="parlay.id"
              class="hover:bg-gray-700/50"
            >
              <td class="px-4 py-3 text-gray-300 font-mono text-sm">
                #{{ parlay.id.slice(-8).toUpperCase() }}
              </td>
              <td class="px-4 py-3 text-white">
                {{ parlay.user?.name || 'N/A' }}
              </td>
              <td class="px-4 py-3 text-gray-300">
                {{ parlay.game.awayTeam.code }} @ {{ parlay.game.homeTeam.code }}
              </td>
              <td class="px-4 py-3 text-white font-medium">
                {{ parlay.totalOdds.toFixed(2) }}
              </td>
              <td class="px-4 py-3">
                <span :class="getConfidenceColor(parlay.confidence)">
                  {{ parlay.confidence.toFixed(0) }}%
                </span>
              </td>
              <td class="px-4 py-3">
                <CvBadge
                  :color="getResultColor(parlay.result)"
                  variant="soft"
                  size="sm"
                >
                  {{ getResultLabel(parlay.result) }}
                </CvBadge>
              </td>
              <td class="px-4 py-3 text-gray-400 text-sm">
                {{ formatDate(parlay.createdAt) }}
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <CvButton
                    :to="`/parlays/${parlay.id}`"
                    color="gray"
                    variant="soft"
                    size="xs"
                    icon="i-heroicons-eye"
                  >
                    Ver
                  </CvButton>
                  <CvButton
                    v-if="parlay.result === 'PENDING'"
                    color="orange"
                    variant="soft"
                    size="xs"
                    icon="i-heroicons-check"
                    @click="openResultModal(parlay)"
                  >
                    Resultado
                  </CvButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="parlaysStore.meta && parlaysStore.meta.totalPages > 1" class="flex justify-center mt-6">
        <CvPagination
          v-model="page"
          :total="parlaysStore.meta.total"
          :page-count="parlaysStore.meta.limit"
        />
      </div>
    </CvCard>

    <!-- Update Result Modal -->
    <CvModal v-model="showResultModal">
      <CvCard class="bg-gray-800 border-gray-700">
        <template #header>
          <h3 class="text-lg font-bold text-white">Atualizar Resultado</h3>
        </template>

        <div v-if="selectedParlay" class="space-y-4">
          <p class="text-gray-300">
            Parlay: <strong>#{{ selectedParlay.id.slice(-8).toUpperCase() }}</strong>
          </p>
          <p class="text-gray-400 text-sm">
            {{ selectedParlay.game.awayTeam.name }} @ {{ selectedParlay.game.homeTeam.name }}
          </p>

          <CvFormGroup label="Resultado" name="result">
            <CvSelect
              v-model="resultForm.result"
              :options="resultOptions"
            />
          </CvFormGroup>

          <CvFormGroup 
            v-if="resultForm.result === 'WIN'"
            label="Retorno Real" 
            name="actualReturn"
          >
            <CvInput
              v-model="resultForm.actualReturn"
              type="number"
              step="0.01"
              placeholder="0.00"
            />
          </CvFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <CvButton
              color="gray"
              variant="soft"
              @click="showResultModal = false"
            >
              Cancelar
            </CvButton>
            <CvButton
              color="orange"
              :loading="updating"
              @click="updateResult"
            >
              Atualizar
            </CvButton>
          </div>
        </template>
      </CvCard>
    </CvModal>
  </div>
</template>

<script setup lang="ts">
import { useParlaysStore } from '~/stores/parlays'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Parlay } from '~/types'

definePageMeta({
  middleware: ['auth', 'admin'],
})

const parlaysStore = useParlaysStore()

// State
const page = ref(1)
const searchQuery = ref('')
const showResultModal = ref(false)
const updating = ref(false)
const selectedParlay = ref<Parlay | null>(null)

const filters = reactive({
  status: '',
})

const resultForm = reactive({
  result: 'WIN',
  actualReturn: '',
})

// Options
const statusOptions = [
  { label: 'Todos', value: '' },
  { label: 'Pendente', value: 'PENDING' },
  { label: 'Ganho', value: 'WIN' },
  { label: 'Perdido', value: 'LOSS' },
  { label: 'Empate', value: 'PUSH' },
]

const resultOptions = [
  { label: 'Ganho', value: 'WIN' },
  { label: 'Perdido', value: 'LOSS' },
  { label: 'Empate', value: 'PUSH' },
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
      p.user?.name?.toLowerCase().includes(query) ||
      p.game.homeTeam.name.toLowerCase().includes(query) ||
      p.game.awayTeam.name.toLowerCase().includes(query)
    )
  }

  return parlays
})

// Load data
onMounted(() => {
  parlaysStore.fetchAllParlays({ page: page.value })
})

// Watch page changes
watch(page, (newPage) => {
  parlaysStore.fetchAllParlays({ page: newPage })
})

// Methods
function openResultModal(parlay: Parlay) {
  selectedParlay.value = parlay
  resultForm.result = 'WIN'
  resultForm.actualReturn = ''
  showResultModal.value = true
}

async function updateResult() {
  if (!selectedParlay.value) return
  
  updating.value = true
  
  const actualReturn = resultForm.result === 'WIN' 
    ? parseFloat(resultForm.actualReturn) || 0
    : 0
  
  const result = await parlaysStore.updateResult(
    selectedParlay.value.id,
    resultForm.result,
    actualReturn
  )
  
  if (result) {
    showResultModal.value = false
  }
  
  updating.value = false
}

function getResultColor(result: string): any {
  const colors: Record<string, string> = {
    PENDING: 'blue',
    WIN: 'green',
    LOSS: 'red',
    PUSH: 'yellow',
  }
  return colors[result] || 'gray'
}

function getResultLabel(result: string): any {
  const labels: Record<string, string> = {
    PENDING: 'Pendente',
    WIN: 'Ganho',
    LOSS: 'Perdido',
    PUSH: 'Empate',
  }
  return labels[result] || result
}

function getConfidenceColor(confidence: number): any {
  if (confidence >= 70) return 'text-green-400'
  if (confidence >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return '--/--/----'
  }
}
</script>
