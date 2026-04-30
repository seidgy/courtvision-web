
<template>
  <div class="space-y-8">
    <!-- Loading -->
    <div v-if="gamesStore.loading" class="space-y-6">
      <CvSkeleton class="h-32 bg-gray-800" />
      <CvSkeleton class="h-64 bg-gray-800" />
    </div>

    <template v-else-if="game">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <CvButton
          to="/games"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-left"
        >
          Voltar
        </CvButton>
        <CvButton
          color="orange"
          icon="i-heroicons-sparkles"
          :loading="parlaysStore.generating"
          :disabled="game.status !== 'SCHEDULED' && game.status !== 'LIVE'"
          @click="generateParlay"
        >
          Gerar Parlay
        </CvButton>
      </div>

      <!-- Game Header Card -->
      <CvCard class="bg-gray-800 border-gray-700">
        <div class="text-center mb-6">
          <CvBadge
            :color="getStatusColor(game.status)"
            variant="soft"
            size="lg"
          >
            {{ getStatusLabel(game.status) }}
          </CvBadge>
          <p class="text-gray-400 mt-2">
            {{ formatGameDate(game.gameDate) }}
          </p>
        </div>

        <div class="flex items-center justify-center gap-8 md:gap-16">
          <!-- Away Team -->
          <div class="flex flex-col items-center">
            <div class="w-24 h-24 md:w-32 md:h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <span class="text-4xl md:text-5xl font-bold text-white">{{ game.awayTeam.code }}</span>
            </div>
            <h2 class="text-xl md:text-2xl font-bold text-white text-center">{{ game.awayTeam.name }}</h2>
            <p class="text-gray-400">{{ game.awayTeam.city }}</p>
            <p v-if="game.awayScore !== null" class="text-4xl font-bold text-white mt-2">
              {{ game.awayScore }}
            </p>
          </div>

          <!-- VS -->
          <div class="text-center">
            <span class="text-2xl md:text-3xl text-gray-500 font-bold">VS</span>
          </div>

          <!-- Home Team -->
          <div class="flex flex-col items-center">
            <div class="w-24 h-24 md:w-32 md:h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <span class="text-4xl md:text-5xl font-bold text-white">{{ game.homeTeam.code }}</span>
            </div>
            <h2 class="text-xl md:text-2xl font-bold text-white text-center">{{ game.homeTeam.name }}</h2>
            <p class="text-gray-400">{{ game.homeTeam.city }}</p>
            <p v-if="game.homeScore !== null" class="text-4xl font-bold text-white mt-2">
              {{ game.homeScore }}
            </p>
          </div>
        </div>

        <!-- Game Info -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-700">
          <div class="text-center">
            <p class="text-gray-400 text-sm">Temporada</p>
            <p class="text-white font-medium">{{ game.season }}</p>
          </div>
          <div class="text-center">
            <p class="text-gray-400 text-sm">Tipo</p>
            <p class="text-white font-medium">{{ getSeasonTypeLabel(game.seasonType) }}</p>
          </div>
          <div class="text-center">
            <p class="text-gray-400 text-sm">Arena</p>
            <p class="text-white font-medium">{{ game.arena || 'N/A' }}</p>
          </div>
          <div class="text-center">
            <p class="text-gray-400 text-sm">Local</p>
            <p class="text-white font-medium">{{ game.city || 'N/A' }}</p>
          </div>
        </div>
      </CvCard>

      <!-- Players Tabs -->
      <CvTabs v-model="activeTab" :items="tabItems" class="w-full" />
      
      <CvCard class="bg-gray-800 border-gray-700 mt-4">
        <div v-if="playersLoading" class="space-y-4">
          <CvSkeleton v-for="i in 5" :key="i" class="h-16 bg-gray-700" />
        </div>
        
        <div v-else-if="activeTab === 'away' && awayPlayers.length === 0" class="text-center py-8">
          <p class="text-gray-400">Nenhum jogador encontrado</p>
        </div>
        
        <div v-else-if="activeTab === 'home' && homePlayers.length === 0" class="text-center py-8">
          <p class="text-gray-400">Nenhum jogador encontrado</p>
        </div>
        
        <div v-else class="space-y-2">
          <div
            v-for="player in activeTab === 'away' ? awayPlayers : homePlayers"
            :key="player.id"
            class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <span class="text-lg font-bold text-white">
                  {{ player.jerseyNumber || '?' }}
                </span>
              </div>
              <div>
                <p class="text-white font-medium">
                  {{ player.firstName }} {{ player.lastName }}
                </p>
                <p class="text-gray-400 text-sm">
                  {{ player.position || 'N/A' }} • {{ player.height || '?' }}m
                </p>
              </div>
            </div>
            <CvButton
              color="orange"
              variant="soft"
              size="sm"
              icon="i-heroicons-chart-bar"
              :to="`/games/players/${player.id}`"
            >
              Analisar
            </CvButton>
          </div>
        </div>
      </CvCard>
    </template>

    <!-- Not Found -->
    <div v-else class="text-center py-16">
      <CvIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-white mb-2">Jogo não encontrado</h2>
      <CvButton to="/games" color="orange">Voltar para jogos</CvButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGamesStore } from '~/stores/games'
import { useParlaysStore } from '~/stores/parlays'
import { format, parseISO, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Player } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const gamesStore = useGamesStore()
const parlaysStore = useParlaysStore()

const gameId = Number(route.params.id)
const game = computed(() => gamesStore.currentGame)

const playersLoading = ref(false)
const awayPlayers = ref<Player[]>([])
const homePlayers = ref<Player[]>([])
const activeTab = ref('away')

const tabItems = computed(() => [
  {
    key: 'away',
    label: game.value?.awayTeam.name || 'Time Visitante',
    icon: 'i-heroicons-users',
  },
  {
    key: 'home',
    label: game.value?.homeTeam.name || 'Time da Casa',
    icon: 'i-heroicons-users',
  },
])

// Load game data
onMounted(async () => {
  await gamesStore.fetchGame(gameId)
  
  if (game.value) {
    await loadPlayers()
  }
})

async function loadPlayers() {
  playersLoading.value = true
  
  try {
    const { $api } = useNuxtApp()
    
    // Fetch away team players
    awayPlayers.value = await $api.get(`/games/teams/${game.value?.awayTeamId}/players`)
    
    // Fetch home team players
    homePlayers.value = await $api.get(`/games/teams/${game.value?.homeTeamId}/players`)
  } catch (error) {
    console.error('Erro ao carregar jogadores:', error)
  } finally {
    playersLoading.value = false
  }
}

async function generateParlay() {
  const parlay = await parlaysStore.generateParlay(gameId)
  
  if (parlay) {
    navigateTo(`/parlays/${(parlay as any).id}`)
  }
}

function getStatusColor(status: string): any {
  const colors: Record<string, string> = {
    SCHEDULED: 'blue',
    LIVE: 'green',
    FINISHED: 'gray',
    POSTPONED: 'yellow',
    CANCELLED: 'red',
  }
  return colors[status] || 'gray'
}

function getStatusLabel(status: string): any {
  const labels: Record<string, string> = {
    SCHEDULED: 'Agendado',
    LIVE: 'Ao Vivo',
    FINISHED: 'Finalizado',
    POSTPONED: 'Adiado',
    CANCELLED: 'Cancelado',
  }
  return labels[status] || status
}

function getSeasonTypeLabel(type: string): any {
  const labels: Record<string, string> = {
    REGULAR_SEASON: 'Temporada Regular',
    PLAYOFFS: 'Playoffs',
    PRE_SEASON: 'Pré-Temporada',
  }
  return labels[type] || type
}

function formatGameDate(dateString: string): any {
  try {
    const date = parseISO(dateString)
    if (isToday(date)) {
      return `Hoje, ${format(date, 'HH:mm', { locale: ptBR })}`
    }
    return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })
  } catch {
    return '--/--/----'
  }
}
</script>
