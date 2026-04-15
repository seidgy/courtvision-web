<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white">
        Meu Perfil
      </h1>
      <p class="text-gray-400 mt-1">
        Gerencie suas informações pessoais
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profile Info -->
      <div class="lg:col-span-2 space-y-6">
        <UCard class="bg-gray-800 border-gray-700">
          <template #header>
            <h2 class="text-lg font-bold text-white">Informações Pessoais</h2>
          </template>

          <UForm
            :schema="profileSchema"
            :state="profileForm"
            class="space-y-4"
            @submit="updateProfile"
          >
            <UFormGroup label="Nome" name="name">
              <UInput
                v-model="profileForm.name"
                placeholder="Seu nome completo"
                icon="i-heroicons-user"
              />
            </UFormGroup>

            <UFormGroup label="Email" name="email">
              <UInput
                v-model="profileForm.email"
                type="email"
                placeholder="seu@email.com"
                icon="i-heroicons-envelope"
              />
            </UFormGroup>

            <div class="flex justify-end">
              <UButton
                type="submit"
                color="orange"
                :loading="updatingProfile"
              >
                Salvar Alterações
              </UButton>
            </div>
          </UForm>
        </UCard>

        <!-- Change Password -->
        <UCard class="bg-gray-800 border-gray-700">
          <template #header>
            <h2 class="text-lg font-bold text-white">Alterar Senha</h2>
          </template>

          <UForm
            :schema="passwordSchema"
            :state="passwordForm"
            class="space-y-4"
            @submit="changePassword"
          >
            <UFormGroup label="Senha Atual" name="currentPassword">
              <UInput
                v-model="passwordForm.currentPassword"
                type="password"
                placeholder="••••••••"
                icon="i-heroicons-lock-closed"
              />
            </UFormGroup>

            <UFormGroup label="Nova Senha" name="newPassword">
              <UInput
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="Mínimo 6 caracteres"
                icon="i-heroicons-key"
              />
            </UFormGroup>

            <UFormGroup label="Confirmar Nova Senha" name="confirmPassword">
              <UInput
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="••••••••"
                icon="i-heroicons-check-circle"
              />
            </UFormGroup>

            <div class="flex justify-end">
              <UButton
                type="submit"
                color="orange"
                :loading="changingPassword"
              >
                Alterar Senha
              </UButton>
            </div>
          </UForm>
        </UCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Profile Card -->
        <UCard class="bg-gray-800 border-gray-700">
          <div class="text-center">
            <UAvatar
              :text="userInitials"
              size="3xl"
              class="bg-orange-500 text-2xl mx-auto mb-4"
            />
            <h3 class="text-xl font-bold text-white">{{ authStore.userName }}</h3>
            <p class="text-gray-400">{{ authStore.userEmail }}</p>
            <UBadge
              :color="authStore.isAdmin ? 'purple' : 'blue'"
              variant="soft"
              class="mt-2"
            >
              {{ authStore.isAdmin ? 'Administrador' : 'Usuário' }}
            </UBadge>
          </div>
        </UCard>

        <!-- Stats Card -->
        <UCard class="bg-gray-800 border-gray-700">
          <template #header>
            <h3 class="text-lg font-bold text-white">Minhas Estatísticas</h3>
          </template>

          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Total de Parlays</span>
              <span class="text-white font-bold">{{ parlaysStore.stats?.total || 0 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Taxa de Acerto</span>
              <span class="text-white font-bold">{{ parlaysStore.stats?.winRate?.toFixed(1) || 0 }}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Lucro/Prejuízo</span>
              <span 
                class="font-bold"
                :class="(parlaysStore.stats?.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'"
              >
                {{ (parlaysStore.stats?.profit || 0) >= 0 ? '+' : '' }}{{ parlaysStore.stats?.profit?.toFixed(2) || '0.00' }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400">ROI</span>
              <span 
                class="font-bold"
                :class="(parlaysStore.stats?.roi || 0) >= 0 ? 'text-green-400' : 'text-red-400'"
              >
                {{ (parlaysStore.stats?.roi || 0) >= 0 ? '+' : '' }}{{ parlaysStore.stats?.roi?.toFixed(1) || '0.0' }}%
              </span>
            </div>
          </div>

          <template #footer>
            <UButton
              to="/parlays"
              color="orange"
              variant="soft"
              block
            >
              Ver Meus Parlays
            </UButton>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { useAuthStore } from '~/stores/auth'
import { useParlaysStore } from '~/stores/parlays'

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const parlaysStore = useParlaysStore()

// State
const updatingProfile = ref(false)
const changingPassword = ref(false)

// Schemas
const profileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

// Forms
const profileForm = reactive({
  name: authStore.userName,
  email: authStore.userEmail,
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Computed
const userInitials = computed(() => {
  const name = authStore.userName
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

// Load stats
onMounted(() => {
  parlaysStore.fetchStats()
})

// Methods
async function updateProfile() {
  updatingProfile.value = true
  
  const success = await authStore.updateProfile({
    name: profileForm.name,
    email: profileForm.email,
  })
  
  if (success) {
    // Show success toast
  }
  
  updatingProfile.value = false
}

async function changePassword() {
  changingPassword.value = true
  
  const success = await authStore.changePassword(
    passwordForm.currentPassword,
    passwordForm.newPassword
  )
  
  if (success) {
    // Reset form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    // Show success toast
  }
  
  changingPassword.value = false
}
</script>
