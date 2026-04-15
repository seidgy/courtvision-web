<template>
  <div class="space-y-8">
    <!-- Loading -->
    <div v-if="parlaysStore.loading" class="space-y-6">
      <USkeleton class="h-32 bg-gray-800" />
      <USkeleton class="h-64 bg-gray-800" />
    </div>

    <template v-else-if="parlay">
      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-4">
        <UButton
          to="/parlays"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-left"
        >
          Voltar
        </UButton>
        <UBadge
          :color="getResultColor(parlay.result)"
          variant="soft"
          size="lg"
        >
          {{ getResultLabel(parlay.result) }}
        </UBadge>
      </div>

      <!-- Parlay Overview -->
      <UCard class="bg-gray-800 border-gray-700">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-white mb-2">
            Parlay #{{ parlay.id.slice(-8).toUpperCase() }}
          </h1>
          <p class="text-gray-400">
            Gerado em {{ formatDate(parlay.generatedAt) }}
          </p>
        </div>

        <!-- Game Info -->
        <div class="bg-gray-900/50 rounded-xl p-6 mb-6">
          <div class="flex items-center justify-center gap-8">
            <div class="text-center">
              <p class="text-2xl font-bold text-white">{{ parlay.game.awayTeam.code }}</p>
              <p class="text-sm text-gray-400">{{ parlay.game.awayTeam.name }}</p>
            </div>
            <div class="text-center">
              <p class="text-gray-500">@</p>
              <UBadge
                :color="getGameStatusColor(parlay.game.status)"
                variant="soft"
                size="sm"
                class="mt-1"
              >
                {{ getGameStatusLabel(parlay.game.status) }}
              </UBadge>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-white">{{ parlay.game.homeTeam.code }}</p>
              <p class="text-sm text-gray-400">{{ parlay.game.homeTeam.name }}</p>
            </div>
          </div>
          <p class="text-center text-gray-400 mt-4">
            {{ formatGameDate(parlay.game.gameDate) }}
          </p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-gray-900/30 rounded-lg">
            <p class="text-gray-400 text-sm">Odds Totais</p>
            <p class="text-2xl font-bold text-white">{{ parlay.totalOdds.toFixed(2) }}</p>
          </div>
          <div class="text-center p-4 bg-gray-900/30 rounded-lg">
            <p class="text-gray-400 text-sm">Confiança</p>
            <p 
              class="text-2xl font-bold"
              :class="getConfidenceColor(parlay.confidence)"
            >
              {{ parlay.confidence.toFixed(0) }}%
            </p>
          </div>
          <div class="text-center p-4 bg-gray-900/30 rounded-lg">
            <p class="text-gray-400 text-sm">Nº de Apostas</p>
            <p class="text-2xl font-bold text-white">{{ parlay.items.length }}</p>
          </div>
          <div v-if="parlay.result !== 'PENDING'" class="text-center p-4 bg-gray-900/30 rounded-lg">
            <p class="text-gray-400 text-sm">Retorno</p>
            <p 
              class="text-2xl font-bold"
              :class="parlay.result === 'WIN' ? 'text-green-400' : 'text-red-400'"
            >
              {{ parlay.result === 'WIN' ? '+' : '' }}{{ parlay.actualReturn?.toFixed(2) || '0.00' }}
            </p>
          </div>
        </div>
      </UCard>

      <!-- AI Analysis -->
      <UCard v-if="parlay.aiAnalysis" class="bg-gray-800 border-gray-700">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-orange-500" />
            <h2 class="text-lg font-bold text-white">Análise da IA</h2>
          </div>
        </template>
        <p class="text-gray-300 leading-relaxed">{{ parlay.aiAnalysis }}</p>
        <p v-if="parlay.reasoning" class="text-gray-400 mt-4 text-sm italic">
          {{ parlay.reasoning }}
        </p>
      </UCard>

      <!-- Parlay Items -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-white">Apostas do Parlay</h2>
        
        <UCard
          v-for="(item, index) in parlay.items"
          :key="item.id"
          class="bg-gray-800 border-gray-700"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-4">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="getItemResultBg(item.result)"
              >
                <UIcon
                  :name="getItemResultIcon(item.result)"
                  :class="getItemResultColor(item.result)"
                  class="w-6 h-6"
                />
              </div>
              <div>
                <p class="text-lg font-bold text-white">
                  {{ item.player.firstName }} {{ item.player.lastName }}
                </p>
                <p class="text-gray-400">
                  {{ getBetTypeLabel(item.betType) }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-orange-400">
                {{ item.prediction }} {{ item.line }}
              </p>
              <p class="text-gray-400">
                Odds @{{ item.odds.toFixed(2) }}
              </p>
            </div>
          </div>

          <!-- Item Details -->
          <div class="mt-4 pt-4 border-t border-gray-700">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-gray-400 text-sm">Valor Previsto</p>
                <p class="text-white font-medium">{{ item.predictedValue.toFixed(1) }}</p>
              </div>
              <div>
                <p class="text-gray-400 text-sm">Confiança</p>
                <p 
                  class="font-medium"
                  :class="getConfidenceColor(item.confidence)"
                >
                  {{ item.confidence.toFixed(0) }}%
                </p>
              </div>
              <div v-if="item.actualValue !== null">
                <p class="text-gray-400 text-sm">Valor Real</p>
                <p class="text-white font-medium">{{ item.actualValue.toFixed(1) }}</p>
              </div>
              <div>
                <p class="text-gray-400 text-sm">Resultado</p>
                <p :class="getItemResultColor(item.result)">
                  {{ getResultLabel(item.result) }}
                </p>
              </div>
            </div>

            <!-- Context Analysis -->
            <div v-if="item.contextAnalysis?.factors?.length" class="mt-4">
              <p class="text-gray-400 text-sm mb-2">Fatores de Análise:</p>
              <div class="space-y-2">
                <div
                  v-for="(factor, fIndex) in item.contextAnalysis.factors"
                  :key="fIndex"
                  class="flex items-start space-x-2 text-sm"
                >
                  <UIcon
                    :name="factor.impact === 'positive' ? 'i-heroicons-arrow-up' : factor.impact === 'negative' ? 'i-heroicons-arrow-down' : 'i-heroicons-minus'"
                    :class="factor.impact === 'positive' ? 'text-green-400' : factor.impact === 'negative' ? 'text-red-400' : 'text-gray-400'"
                    class="w-4 h-4 mt-0.5"
                  />
                  <div>
                    <span class="text-white font-medium">{{ factor.factor }}</span>
                    <span class="text-gray-400"> - {{ factor.description }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reasoning -->
            <div v-if="item.contextAnalysis?.reasoning" class="mt-4 p-3 bg-gray-900/50 rounded-lg">
              <p class="text-gray-400 text-sm">Raciocínio:</p>
              <p class="text-gray-300 text-sm mt-1">{{ item.contextAnalysis.reasoning }}</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <UButton
          to="/games"
          color="gray"
          variant="soft"
          icon="i-heroicons-arrow-left"
        >
          Ver Mais Jogos
        </UButton>
        <UButton
          v-if="parlay.game.status === 'SCHEDULED'"
          color="orange"
          icon="i-heroicons-share"
          @click="shareParlay"
        >
          Compartilhar
        </UButton>
      </div>
    </template>

    <!-- Not Found -->
    <div v-else class="text-center py-16">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-white mb-2">Parlay não encontrado</h2>
      <UButton to="/parlays" color="orange">Voltar para parlays</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useParlaysStore } from '~/stores/parlays'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const parlaysStore = useParlaysStore()

const parlayId = route.params.id as string
const parlay = computed(() => parlaysStore.currentParlay)

// Load parlay data
onMounted(async () => {
  await parlaysStore.fetchParlay(parlayId)
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

function getItemResultBg(result: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-gray-700',
    WIN: 'bg-green-500/20',
    LOSS: 'bg-red-500/20',
    PUSH: 'bg-yellow-500/20',
  }
  return colors[result] || 'bg-gray-700'
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

function formatGameDate(dateString: string): string {
  try {
    return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
  } catch {
    return '--/--/----'
  }
}

function shareParlay() {
  // Implementar compartilhamento
  const text = `Confira meu parlay da NBA! ${parlay.value?.game.awayTeam.code} @ ${parlay.value?.game.homeTeam.code} - Odds ${parlay.value?.totalOdds.toFixed(2)}`
  
  if (navigator.share) {
    navigator.share({
      title: 'Meu Parlay NBA',
      text,
      url: window.location.href,
    })
  } else {
    // Copiar para clipboard
    navigator.clipboard.writeText(`${text}\n${window.location.href}`)
    // Mostrar toast
  }
}
</script>
