<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white">
          Gerenciar Usuários
        </h1>
        <p class="text-gray-400 mt-1">
          Crie, edite e gerencie usuários do sistema
        </p>
      </div>
      <UButton
        color="orange"
        icon="i-heroicons-plus"
        @click="showCreateModal = true"
      >
        Novo Usuário
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4">
      <UInput
        v-model="searchQuery"
        placeholder="Buscar usuário..."
        icon="i-heroicons-magnifying-glass"
        class="w-64"
        @keyup.enter="applySearch"
      />
      <UButton
        color="gray"
        variant="soft"
        icon="i-heroicons-magnifying-glass"
        @click="applySearch"
      >
        Buscar
      </UButton>
    </div>

    <!-- Users Table -->
    <UCard class="bg-gray-800 border-gray-700">
      <div v-if="usersStore.loading" class="space-y-4">
        <USkeleton v-for="i in 5" :key="i" class="h-12 bg-gray-700" />
      </div>

      <div v-else-if="usersStore.users.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-users" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-medium text-white mb-2">
          Nenhum usuário encontrado
        </h3>
        <p class="text-gray-400">
          Clique em "Novo Usuário" para criar o primeiro usuário
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-900/50">
              <th class="px-4 py-3">Nome</th>
              <th class="px-4 py-3">Email</th>
              <th class="px-4 py-3">Função</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Criado em</th>
              <th class="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr
              v-for="user in usersStore.users"
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
              <td class="px-4 py-3 text-right">
                <UDropdown
                  :items="getUserActions(user)"
                  :popper="{ placement: 'bottom-end' }"
                >
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-ellipsis-vertical"
                  />
                </UDropdown>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="usersStore.meta && usersStore.meta.totalPages > 1" class="flex justify-center mt-6">
        <UPagination
          v-model="page"
          :total="usersStore.meta.total"
          :page-count="usersStore.meta.limit"
        />
      </div>
    </UCard>

    <!-- Create User Modal -->
    <UModal v-model="showCreateModal">
      <UCard class="bg-gray-800 border-gray-700">
        <template #header>
          <h3 class="text-lg font-bold text-white">Criar Novo Usuário</h3>
        </template>

        <UForm
          :schema="createSchema"
          :state="createForm"
          class="space-y-4"
          @submit="createUser"
        >
          <UFormGroup label="Nome" name="name">
            <UInput
              v-model="createForm.name"
              placeholder="Nome completo"
            />
          </UFormGroup>

          <UFormGroup label="Email" name="email">
            <UInput
              v-model="createForm.email"
              type="email"
              placeholder="email@exemplo.com"
            />
          </UFormGroup>

          <UFormGroup label="Senha" name="password">
            <UInput
              v-model="createForm.password"
              type="password"
              placeholder="Mínimo 6 caracteres"
            />
          </UFormGroup>

          <UFormGroup label="Função" name="role">
            <USelect
              v-model="createForm.role"
              :options="roleOptions"
            />
          </UFormGroup>

          <div class="flex justify-end gap-2 pt-4">
            <UButton
              color="gray"
              variant="soft"
              @click="showCreateModal = false"
            >
              Cancelar
            </UButton>
            <UButton
              type="submit"
              color="orange"
              :loading="creating"
            >
              Criar
            </UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>

    <!-- Edit User Modal -->
    <UModal v-model="showEditModal">
      <UCard class="bg-gray-800 border-gray-700">
        <template #header>
          <h3 class="text-lg font-bold text-white">Editar Usuário</h3>
        </template>

        <UForm
          :schema="editSchema"
          :state="editForm"
          class="space-y-4"
          @submit="updateUser"
        >
          <UFormGroup label="Nome" name="name">
            <UInput
              v-model="editForm.name"
              placeholder="Nome completo"
            />
          </UFormGroup>

          <UFormGroup label="Email" name="email">
            <UInput
              v-model="editForm.email"
              type="email"
              placeholder="email@exemplo.com"
            />
          </UFormGroup>

          <UFormGroup label="Função" name="role">
            <USelect
              v-model="editForm.role"
              :options="roleOptions"
            />
          </UFormGroup>

          <UFormGroup label="Status" name="isActive">
            <UToggle v-model="editForm.isActive" />
            <span class="ml-2 text-gray-400">
              {{ editForm.isActive ? 'Ativo' : 'Inativo' }}
            </span>
          </UFormGroup>

          <div class="flex justify-end gap-2 pt-4">
            <UButton
              color="gray"
              variant="soft"
              @click="showEditModal = false"
            >
              Cancelar
            </UButton>
            <UButton
              type="submit"
              color="orange"
              :loading="updating"
            >
              Salvar
            </UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>

    <!-- Reset Password Modal -->
    <UModal v-model="showResetPasswordModal">
      <UCard class="bg-gray-800 border-gray-700">
        <template #header>
          <h3 class="text-lg font-bold text-white">Resetar Senha</h3>
        </template>

        <p class="text-gray-300 mb-4">
          Digite a nova senha para <strong>{{ selectedUser?.name }}</strong>
        </p>

        <UForm
          :schema="resetPasswordSchema"
          :state="resetPasswordForm"
          class="space-y-4"
          @submit="resetPassword"
        >
          <UFormGroup label="Nova Senha" name="newPassword">
            <UInput
              v-model="resetPasswordForm.newPassword"
              type="password"
              placeholder="Mínimo 6 caracteres"
            />
          </UFormGroup>

          <div class="flex justify-end gap-2 pt-4">
            <UButton
              color="gray"
              variant="soft"
              @click="showResetPasswordModal = false"
            >
              Cancelar
            </UButton>
            <UButton
              type="submit"
              color="orange"
              :loading="resetting"
            >
              Resetar
            </UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>

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
          Tem certeza que deseja excluir o usuário <strong>{{ selectedUser?.name }}</strong>?
          Esta ação não pode ser desfeita.
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
              @click="deleteUser"
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
import { z } from 'zod'
import { useUsersStore } from '~/stores/users'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { User } from '~/types'

definePageMeta({
  middleware: ['auth', 'admin'],
})

const usersStore = useUsersStore()

// State
const page = ref(1)
const searchQuery = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showResetPasswordModal = ref(false)
const showDeleteModal = ref(false)
const creating = ref(false)
const updating = ref(false)
const resetting = ref(false)
const deleting = ref(false)
const selectedUser = ref<User | null>(null)

// Schemas
const createSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['USER', 'ADMIN']),
})

const editSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  role: z.enum(['USER', 'ADMIN']),
  isActive: z.boolean(),
})

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

// Forms
const createForm = reactive({
  name: '',
  email: '',
  password: '',
  role: 'USER' as 'USER' | 'ADMIN',
})

const editForm = reactive({
  name: '',
  email: '',
  role: 'USER' as 'USER' | 'ADMIN',
  isActive: true,
})

const resetPasswordForm = reactive({
  newPassword: '',
})

// Options
const roleOptions = [
  { label: 'Usuário', value: 'USER' },
  { label: 'Administrador', value: 'ADMIN' },
]

// Load data
onMounted(() => {
  usersStore.fetchUsers({ page: page.value })
})

// Watch page changes
watch(page, (newPage) => {
  usersStore.fetchUsers({ page: newPage })
})

// Methods
function getUserActions(user: User) {
  return [
    [
      {
        label: 'Editar',
        icon: 'i-heroicons-pencil-square',
        click: () => openEditModal(user),
      },
      {
        label: 'Resetar Senha',
        icon: 'i-heroicons-key',
        click: () => openResetPasswordModal(user),
      },
    ],
    [
      {
        label: user.isActive ? 'Desativar' : 'Ativar',
        icon: user.isActive ? 'i-heroicons-x-circle' : 'i-heroicons-check-circle',
        click: () => toggleUserStatus(user),
      },
      {
        label: 'Excluir',
        icon: 'i-heroicons-trash',
        click: () => confirmDelete(user),
      },
    ],
  ]
}

function openEditModal(user: User) {
  selectedUser.value = user
  editForm.name = user.name
  editForm.email = user.email
  editForm.role = user.role
  editForm.isActive = user.isActive ?? true
  showEditModal.value = true
}

function openResetPasswordModal(user: User) {
  selectedUser.value = user
  resetPasswordForm.newPassword = ''
  showResetPasswordModal.value = true
}

function confirmDelete(user: User) {
  selectedUser.value = user
  showDeleteModal.value = true
}

async function createUser() {
  creating.value = true
  
  const user = await usersStore.createUser({
    name: createForm.name,
    email: createForm.email,
    password: createForm.password,
    role: createForm.role,
  })
  
  if (user) {
    showCreateModal.value = false
    // Reset form
    createForm.name = ''
    createForm.email = ''
    createForm.password = ''
    createForm.role = 'USER'
  }
  
  creating.value = false
}

async function updateUser() {
  if (!selectedUser.value) return
  
  updating.value = true
  
  const user = await usersStore.updateUser(selectedUser.value.id, {
    name: editForm.name,
    email: editForm.email,
    role: editForm.role,
    isActive: editForm.isActive,
  })
  
  if (user) {
    showEditModal.value = false
  }
  
  updating.value = false
}

async function resetPassword() {
  if (!selectedUser.value) return
  
  resetting.value = true
  
  const success = await usersStore.resetPassword(
    selectedUser.value.id,
    resetPasswordForm.newPassword
  )
  
  if (success) {
    showResetPasswordModal.value = false
  }
  
  resetting.value = false
}

async function deleteUser() {
  if (!selectedUser.value) return
  
  deleting.value = true
  
  const success = await usersStore.deleteUser(selectedUser.value.id)
  
  if (success) {
    showDeleteModal.value = false
    selectedUser.value = null
  }
  
  deleting.value = false
}

async function toggleUserStatus(user: User) {
  await usersStore.toggleUserStatus(user.id)
}

function applySearch() {
  usersStore.fetchUsers({ 
    page: 1, 
    search: searchQuery.value 
  })
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
