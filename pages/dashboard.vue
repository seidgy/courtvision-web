
<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white">
          Dashboard
        </h1>
        <p class="text-gray-400 mt-1">
          Bem-vindo de volta, {{ authStore.userName }}!
        </p>
      </div>
      <CvButton
        to="/games"
        color="orange"
        icon="i-heroicons-plus"
      >
        Novo Parlay
      </CvButton>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Parlays -->
      <CvCard class="bg-gray-800 border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Total de Parlays</p>
            <p class="text-3xl font-bold text-white mt-1">
              {{ parlaysStore.stats?.total || 0 }}
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <CvIcon name="i-heroicons-ticket" class="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </CvCard>

      <!-- Win Rate -->
      <CvCard class="bg-gray-800 border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Taxa de Acerto</p>
            <p class="text-3xl font-bold text-white mt-1">
              {{ parlaysStore.stats?.winRate?.toFixed(1) || 0 }}%
            </p>
          </div>
          <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <CvIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-green-500" />
          </div>
        </div>
      </CvCard>

      <!-- Profit -->
      <CvCard class="bg-gray-800 border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Lucro/Prejuízo</p>
            <p 
              class="text-3xl font-bold mt-1"
              :class="(parlaysStore.stats?.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'"
            >
              {{ (parlaysStore.stats?.profit || 0) >= 0 ? '+' : '' }}{{ parlaysStore.stats?.profit?.toFixed(2) || '0.00' }}
            </p>
          </div>
          <div 
            class="w-12 h-12 rounded-xl flex items-center justify-center"
            :class="(parlaysStore.stats?.profit || 0) >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'"
          >
            <CvIcon 
              :name="(parlaysStore.stats?.profit || 0) >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'"
              class="w-6 h-6"
              :class="(parlaysStore.stats?.profit || 0) >= 0 ? 'text-green-500' : 'text-red-500'"
            />
          </div>
        </div>
      </CvCard>

      <!-- ROI -->
      <CvCard class="bg-gray-800 border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">ROI</p>
            <p 
              class="text-3xl font-bold mt-1"
              :class="(parlaysStore.stats?.roi || 0) >= 0 ? 'text-green-400' : 'text-red-400'"
            >
              {{ (parlaysStore.stats?.roi || 0) >= 0 ? '+' : '' }}{{ parlaysStore.stats?.roi?.toFixed(1) || '0.0' }}%
            </p>
          </div>
          <div 
            class="w-12 h-12 rounded-xl flex items-center justify-center"
            :class="(parlaysStore.stats?.roi || 0) >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'"
          >
            <CvIcon 
              name="i-heroicons-percent-badge"
              class="w-6 h-6"
              :class="(parlaysStore.stats?.roi || 0) >= 0 ? 'text-green-500' : 'text-red-500'"
            />
          </div>
        </div>
      </CvCard>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Today's Games -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-white">Jogos de Hoje</h2>
          <CvButton
            to="/games"
            variant="ghost"
            color="gray"
            size="sm"
          >
            Ver todos
          </CvButton>
        </div>

        <div v-if="gamesStore.loading" class="space-y-4">
          <CvSkeleton v-for="i in 3" :key="i" class="h-24 bg-gray-800" />
        </div>

        <div v-else-if="gamesStore.todayGames.length === 0" class="text-center py-12">
          <CvIcon name="i-heroicons-calendar" class="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p class="text-gray-400">Nenhum jogo programado para hoje</p>
        </div>

        <div v-else class="space-y-4">
          <CvCard
            v-for="game in gamesStore.todayGames.slice(0, 5)"
            :key="game.id"
            class="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
            @click="navigateTo(`/games/${game.id}`)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="text-center">
                  <p class="text-lg font-bold text-white">{{ game.awayTeam.code }}</p>
                  <p class="text-xs text-gray-500">{{ game.awayTeam.name }}</p>
                </div>
                <span class="text-gray-500">@</span>
                <div class="text-center">
                  <p class="text-lg font-bold text-white">{{ game.homeTeam.code }}</p>
                  <p class="text-xs text-gray-500">{{ game.homeTeam.name }}</p>
                </div>
              </div>
              <div class="text-right">
                <CvBadge
                  :color="getStatusColor(game.status)"
                  variant="soft"
                  size="sm"
                >
                  {{ getStatusLabel(game.status) }}
                </CvBadge>
                <p class="text-sm text-gray-400 mt-1">
                  {{ formatGameTime(game.gameDate) }}
                </p>
              </div>
            </div>
          </CvCard>
        </div>
      </div>

      <!-- Recent Parlays -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-white">Parlays Recentes</h2>
          <CvButton
            to="/parlays"
            variant="ghost"
            color="gray"
            size="sm"
          >
            Ver todos
          </CvButton>
        </div>

        <div v-if="parlaysStore.loading" class="space-y-4">
          <CvSkeleton v-for="i in 3" :key="i" class="h-32 bg-gray-800" />
        </div>

        <div v-else-if="parlaysStore.parlays.length === 0" class="text-center py-12">
          <CvIcon name="i-heroicons-ticket" class="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p class="text-gray-400">Nenhum parlay gerado ainda</p>
          <CvButton
            to="/games"
            color="orange"
            size="sm"
            class="mt-4"
          >
            Gerar Parlay
          </CvButton>
        </div>

        <div v-else class="space-y-4">
          <CvCard
            v-for="parlay in parlaysStore.parlays.slice(0, 5)"
            :key="parlay.id"
            class="bg-gray-800 border-gray-700"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-400">
                  {{ parlay.game.awayTeam.code }} @ {{ parlay.game.homeTeam.code }}
                </span>
                <CvBadge
                  :color="getResultColor(parlay.result)"
                  variant="soft"
                  size="sm"
                >
                  {{ getResultLabel(parlay.result) }}
                </CvBadge>
              </div>
              
              <div class="space-y-1">
                <div
                  v-for="item in parlay.items.slice(0, 2)"
                  :key="item.id"
                  class="flex items-center justify-between text-sm"
                >
                  <span class="text-gray-300">
                    {{ item.player.firstName }} {{ item.player.lastName }}
                  </span>
                  <span class="text-orange-400">
                    {{ item.prediction }} {{ item.line }}
                  </span>
                </div>
                <p v-if="parlay.items.length > 2" class="text-xs text-gray-500">
                  +{{ parlay.items.length - 2 }} mais
                </p>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-gray-700">
                <span class="text-sm text-gray-400">Odds: {{ parlay.totalOdds.toFixed(2) }}</span>
                <span class="text-sm font-medium" :class="getConfidenceColor(parlay.confidence)">
                  {{ parlay.confidence.toFixed(0) }}% confiança
                </span>
              </div>
            </div>
          </CvCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useGamesStore } from '~/stores/games'
import { useParlaysStore } from '~/stores/parlays'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const gamesStore = useGamesStore()
const parlaysStore = useParlaysStore()

// Carregar dados
onMounted(async () => {
  await Promise.all([
    gamesStore.fetchTodayGames(),
    parlaysStore.fetchParlays({ limit: 5 }),
    parlaysStore.fetchStats(),
  ])
})

// Helpers
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

function formatGameTime(dateString: string): any {
  try {
    return format(parseISO(dateString), 'HH:mm', { locale: ptBR })
  } catch {
    return '--:--'
  }
}
</script>
