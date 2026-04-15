<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white">
        Painel Administrativo
      </h1>
      <p class="text-gray-400 mt-1">
        Gerencie usuários e configurações do sistema
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard class="bg-gray-800 border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Total de Usuários</p>
            <p class="text-3xl font-bold text-white mt-1">{{ stats.totalUsers }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <UIcon name="i-heroicons-users" class="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </UCard>

      <UCard class="bg-gray-800 border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Usuários Ativos</p>
            <p class="text-3xl font-bold text-green-400 mt-1">{{ stats.activeUsers }}</p>
          </div>
          <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <UIcon name="i-heroicons-user-check" class="w-6 h-6 text-green-500" />
          </div>
        </div>
      </UCard>

      <UCard class="bg-gray-800 border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Total de Parlays</p>
            <p class="text-3xl font-bold text-white mt-1">{{ stats.totalParlays }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <UIcon name="i-heroicons-ticket" class="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </UCard>

      <UCard class="bg-gray-800 border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Taxa de Acerto Geral</p>
            <p class="text-3xl font-bold text-white mt-1">{{ stats.globalWinRate.toFixed(1) }}%</p>
          </div>
          <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <UIcon name="i-heroicons-chart-pie" class="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Quick Actions -->
    <UCard class="bg-gray-800 border-gray-700">
      <template #header>
        <h2 class="text-lg font-bold text-white">Ações Rápidas</h2>
      </template>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UButton
          to="/admin/users"
          color="blue"
          variant="soft"
          icon="i-heroicons-users"
          block
        >
          Gerenciar Usuários
        </UButton>
        <UButton
          to="/admin/parlays"
          color="orange"
          variant="soft"
          icon="i-heroicons-ticket"
          block
        >
          Todos os Parlays
        </UButton>
        <UButton
          color="green"
          variant="soft"
          icon="i-heroicons-arrow-path"
          block
          :loading="syncing"
          @click="syncData"
        >
          Sincronizar Dados
        </UButton>
      </div>
    </UCard>

    <!-- Recent Users -->
    <UCard class="bg-gray-800 border-gray-700">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-white">Usuários Recentes</h2>
          <UButton
            to="/admin/users"
            color="gray"
            variant="ghost"
            size="sm"
          >
            Ver todos
          </UButton>
        </div>
      </template>

      <div v-if="usersStore.loading" class="space-y-4">
        <USkeleton v-for="i in 5" :key="i" class="h-12 bg-gray-700" />
      </div>

      <div v-else-if="recentUsers.length === 0" class="text-center py-8">
        <p class="text-gray-400">Nenhum usuário encontrado</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              <th class="px-4 py-3">Nome</th>
              <th class="px-4 py-3">Email</th>
              <th class="px-4 py-3">Função</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Criado em</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr
              v-for="user in recentUsers"
              :key="user.id"
              class="hover:bg-gray-700/50"
            >
              <td class="px-4 py-3 text-white">{{ user.name }}</td>
              <td class="px-4 py-3 text-gray-300">{{ user.email }}</td>
              <td class="px-4 py-3">
                <UBadge
                  :color="user.role === 'ADMIN' ? 'purple' : 'blue'"
                  variant="soft"
                  size="sm"
                >
                  {{ user.role === 'ADMIN' ? 'Admin' : 'Usuário' }}
                </UBadge>
              </td>
              <td class="px-4 py-3">
                <UBadge
                  :color="user.isActive ? 'green' : 'red'"
                  variant="soft"
                  size="sm"
                >
                  {{ user.isActive ? 'Ativo' : 'Inativo' }}
                </UBadge>
              </td>
              <td class="px-4 py-3 text-gray-400">
                {{ formatDate(user.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useUsersStore } from '~/stores/users'
import { useGamesStore } from '~/stores/games'
import { useParlaysStore } from '~/stores/parlays'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

definePageMeta({
  middleware: ['auth', 'admin'],
})

const usersStore = useUsersStore()
const gamesStore = useGamesStore()
const parlaysStore = useParlaysStore()

const syncing = ref(false)

const stats = reactive({
  totalUsers: 0,
  activeUsers: 0,
  totalParlays: 0,
  globalWinRate: 0,
})

const recentUsers = computed(() => usersStore.users.slice(0, 5))

// Load data
onMounted(async () => {
  await usersStore.fetchUsers({ limit: 5 })
  
  // Calcular estatísticas
  stats.totalUsers = usersStore.meta?.total || 0
  stats.activeUsers = usersStore.activeUsers.length
  
  // Buscar todos os parlays para estatísticas
  await parlaysStore.fetchAllParlays({ limit: 100 })
  stats.totalParlays = parlaysStore.meta?.total || 0
  
  // Calcular taxa de acerto global
  const allParlays = parlaysStore.parlays
  const settledParlays = allParlays.filter(p => p.result !== 'PENDING')
  const wins = settledParlays.filter(p => p.result === 'WIN').length
  stats.globalWinRate = settledParlays.length > 0 
    ? (wins / settledParlays.length) * 100 
    : 0
})

async function syncData() {
  syncing.value = true
  
  try {
    await gamesStore.syncTeams()
    // Sincronizar outros dados...
  } catch (error) {
    console.error('Erro ao sincronizar:', error)
  } finally {
    syncing.value = false
  }
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '--/--/----'
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return '--/--/----'
  }
}
</script>
