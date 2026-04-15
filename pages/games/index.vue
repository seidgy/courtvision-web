<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white">
          Jogos da NBA
        </h1>
        <p class="text-gray-400 mt-1">
          Selecione um jogo para gerar um parlay
        </p>
      </div>
      
      <!-- Date Filter -->
      <div class="flex items-center space-x-2">
        <UButton
          color="gray"
          variant="soft"
          icon="i-heroicons-calendar"
          @click="showDatePicker = true"
        >
          {{ selectedDateLabel }}
        </UButton>
        <UButton
          v-if="selectedDate !== today"
          color="gray"
          variant="ghost"
          size="sm"
          @click="resetDate"
        >
          Hoje
        </UButton>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4">
      <USelect
        v-model="filters.status"
        :options="statusOptions"
        placeholder="Status"
        class="w-40"
      />
      <USelect
        v-model="filters.teamId"
        :options="teamOptions"
        placeholder="Time"
        class="w-48"
      />
      <UInput
        v-model="searchQuery"
        placeholder="Buscar jogo..."
        icon="i-heroicons-magnifying-glass"
        class="w-64"
      />
    </div>

    <!-- Games Grid -->
    <div v-if="gamesStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <USkeleton v-for="i in 6" :key="i" class="h-64 bg-gray-800" />
    </div>

    <div v-else-if="filteredGames.length === 0" class="text-center py-16">
      <UIcon name="i-heroicons-calendar" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 class="text-xl font-medium text-white mb-2">
        Nenhum jogo encontrado
      </h3>
      <p class="text-gray-400">
        Tente ajustar os filtros ou selecionar outra data
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="game in filteredGames"
        :key="game.id"
        class="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-all duration-300 group"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <UBadge
            :color="getStatusColor(game.status)"
            variant="soft"
            size="sm"
          >
            {{ getStatusLabel(game.status) }}
          </UBadge>
          <span class="text-sm text-gray-400">
            {{ formatGameDate(game.gameDate) }}
          </span>
        </div>

        <!-- Teams -->
        <div class="flex items-center justify-between mb-6">
          <!-- Away Team -->
          <div class="flex flex-col items-center flex-1">
            <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-2">
              <span class="text-2xl font-bold text-white">{{ game.awayTeam.code }}</span>
            </div>
            <p class="text-sm text-gray-300 text-center">{{ game.awayTeam.name }}</p>
            <p v-if="game.awayScore !== null" class="text-2xl font-bold text-white mt-1">
              {{ game.awayScore }}
            </p>
          </div>

          <!-- VS -->
          <div class="px-4">
            <span class="text-gray-500 font-medium">VS</span>
          </div>

          <!-- Home Team -->
          <div class="flex flex-col items-center flex-1">
            <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-2">
              <span class="text-2xl font-bold text-white">{{ game.homeTeam.code }}</span>
            </div>
            <p class="text-sm text-gray-300 text-center">{{ game.homeTeam.name }}</p>
            <p v-if="game.homeScore !== null" class="text-2xl font-bold text-white mt-1">
              {{ game.homeScore }}
            </p>
          </div>
        </div>

        <!-- Season Info -->
        <div class="flex items-center justify-between text-sm text-gray-400 mb-4">
          <span>{{ game.season }}</span>
          <span>{{ getSeasonTypeLabel(game.seasonType) }}</span>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <UButton
            :to="`/games/${game.id}`"
            color="gray"
            variant="soft"
            block
            size="sm"
          >
            Detalhes
          </UButton>
          <UButton
            color="orange"
            block
            size="sm"
            :loading="parlaysStore.generating && selectedGameId === game.id"
            :disabled="game.status !== 'SCHEDULED' || parlaysStore.generating"
            @click="generateParlay(game.id)"
          >
            Gerar Parlay
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Pagination -->
    <div v-if="gamesStore.meta && gamesStore.meta.totalPages > 1" class="flex justify-center">
      <UPagination
        v-model="page"
        :total="gamesStore.meta.total"
        :page-count="gamesStore.meta.limit"
      />
    </div>

    <!-- Date Picker Modal -->
    <UModal v-model="showDatePicker">
      <UCard class="bg-gray-800 border-gray-700">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-white">Selecionar Data</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="showDatePicker = false"
            />
          </div>
        </template>
        
        <div class="p-4">
          <input
            v-model="selectedDate"
            type="date"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
        </div>
        
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="gray"
              variant="soft"
              @click="showDatePicker = false"
            >
              Cancelar
            </UButton>
            <UButton
              color="orange"
              @click="applyDateFilter"
            >
              Aplicar
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useGamesStore } from '~/stores/games'
import { useParlaysStore } from '~/stores/parlays'
import { format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns'
import { ptBR } from 'date-fns/locale'

definePageMeta({
  middleware: 'auth',
})

const gamesStore = useGamesStore()
const parlaysStore = useParlaysStore()

// State
const page = ref(1)
const searchQuery = ref('')
const showDatePicker = ref(false)
const selectedDate = ref(format(new Date(), 'yyyy-MM-dd'))
const today = format(new Date(), 'yyyy-MM-dd')
const selectedGameId = ref<number | null>(null)

const filters = reactive({
  status: '',
  teamId: '',
})

// Options
const statusOptions = [
  { label: 'Todos', value: '' },
  { label: 'Agendado', value: 'SCHEDULED' },
  { label: 'Ao Vivo', value: 'LIVE' },
  { label: 'Finalizado', value: 'FINISHED' },
]

const teamOptions = computed(() => [
  { label: 'Todos os times', value: '' },
  ...gamesStore.teams.map(team => ({
    label: `${team.city} ${team.name}`,
    value: team.id.toString(),
  })),
])

// Computed
const selectedDateLabel = computed(() => {
  const date = new Date(selectedDate.value)
  if (isToday(date)) return 'Hoje'
  if (isTomorrow(date)) return 'Amanhã'
  if (isYesterday(date)) return 'Ontem'
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
})

const filteredGames = computed(() => {
  let games = gamesStore.games

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    games = games.filter(game =>
      game.homeTeam.name.toLowerCase().includes(query) ||
      game.awayTeam.name.toLowerCase().includes(query) ||
      game.homeTeam.code.toLowerCase().includes(query) ||
      game.awayTeam.code.toLowerCase().includes(query)
    )
  }

  return games
})

// Load data
onMounted(async () => {
  await Promise.all([
    gamesStore.fetchGames({ page: page.value }),
    gamesStore.fetchTeams(),
  ])
})

// Watch page changes
watch(page, (newPage) => {
  gamesStore.fetchGames({ page: newPage })
})

// Methods
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    SCHEDULED: 'blue',
    LIVE: 'green',
    FINISHED: 'gray',
    POSTPONED: 'yellow',
    CANCELLED: 'red',
  }
  return colors[status] || 'gray'
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    SCHEDULED: 'Agendado',
    LIVE: 'Ao Vivo',
    FINISHED: 'Finalizado',
    POSTPONED: 'Adiado',
    CANCELLED: 'Cancelado',
  }
  return labels[status] || status
}

function getSeasonTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    REGULAR_SEASON: 'Temporada Regular',
    PLAYOFFS: 'Playoffs',
    PRE_SEASON: 'Pré-Temporada',
  }
  return labels[type] || type
}

function formatGameDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    if (isToday(date)) {
      return `Hoje, ${format(date, 'HH:mm', { locale: ptBR })}`
    }
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR })
  } catch {
    return '--/--/----'
  }
}

async function generateParlay(gameId: number) {
  selectedGameId.value = gameId
  const parlay = await parlaysStore.generateParlay(gameId)
  
  if (parlay) {
    navigateTo(`/parlays/${parlay.id}`)
  }
}

function applyDateFilter() {
  showDatePicker.value = false
  gamesStore.fetchGames({ 
    page: 1, 
    date: selectedDate.value 
  })
}

function resetDate() {
  selectedDate.value = today
  gamesStore.fetchGames({ page: 1 })
}
</script>
