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
        <CvCard class="bg-gray-800 border-gray-700">
          <template #header>
            <h2 class="text-lg font-bold text-white">Informações Pessoais</h2>
          </template>

          <CvForm
            :schema="profileSchema"
            :state="profileForm"
            class="space-y-4"
            @submit="updateProfile"
          >
            <CvFormGroup label="Nome" name="name">
              <CvInput
                v-model="profileForm.name"
                placeholder="Seu nome completo"
                icon="i-heroicons-user"
              />
            </CvFormGroup>

            <CvFormGroup label="Email" name="email">
              <CvInput
                v-model="profileForm.email"
                type="email"
                placeholder="seu@email.com"
                icon="i-heroicons-envelope"
              />
            </CvFormGroup>

            <div class="flex justify-end">
              <CvButton
                type="submit"
                color="orange"
                :loading="updatingProfile"
              >
                Salvar Alterações
              </CvButton>
            </div>
          </CvForm>
        </CvCard>

        <!-- Change Password -->
        <CvCard class="bg-gray-800 border-gray-700">
          <template #header>
            <h2 class="text-lg font-bold text-white">Alterar Senha</h2>
          </template>

          <CvForm
            :schema="passwordSchema"
            :state="passwordForm"
            class="space-y-4"
            @submit="changePassword"
          >
            <CvFormGroup label="Senha Atual" name="currentPassword">
              <CvInput
                v-model="passwordForm.currentPassword"
                type="password"
                placeholder="••••••••"
                icon="i-heroicons-lock-closed"
              />
            </CvFormGroup>

            <CvFormGroup label="Nova Senha" name="newPassword">
              <CvInput
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="Mínimo 6 caracteres"
                icon="i-heroicons-key"
              />
            </CvFormGroup>

            <CvFormGroup label="Confirmar Nova Senha" name="confirmPassword">
              <CvInput
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="••••••••"
                icon="i-heroicons-check-circle"
              />
            </CvFormGroup>

            <div class="flex justify-end">
              <CvButton
                type="submit"
                color="orange"
                :loading="changingPassword"
              >
                Alterar Senha
              </CvButton>
            </div>
          </CvForm>
        </CvCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Profile Card -->
        <CvCard class="bg-gray-800 border-gray-700">
          <div class="text-center">
            <CvAvatar
              :text="userInitials"
              size="3xl"
              class="bg-orange-500 text-2xl mx-auto mb-4"
            />
            <h3 class="text-xl font-bold text-white">{{ authStore.userName }}</h3>
            <p class="text-gray-400">{{ authStore.userEmail }}</p>
            <CvBadge
              :color="authStore.isAdmin ? 'purple' : 'blue'"
              variant="soft"
              class="mt-2"
            >
              {{ authStore.isAdmin ? 'Administrador' : 'Usuário' }}
            </CvBadge>
          </div>
        </CvCard>

        <!-- Stats Card -->
        <CvCard class="bg-gray-800 border-gray-700">
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
            <CvButton
              to="/parlays"
              color="orange"
              variant="soft"
              block
            >
              Ver Meus Parlays
            </CvButton>
          </template>
        </CvCard>
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
