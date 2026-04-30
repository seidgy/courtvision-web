<template>
  <div>
    <h2 class="text-2xl font-bold text-white text-center mb-2">
      Bem-vindo de volta
    </h2>
    <p class="text-gray-400 text-center mb-8">
      Entre com suas credenciais para continuar
    </p>

    <CvForm
      :schema="schema"
      :state="formState"
      class="space-y-6"
      @submit="handleLogin"
    >
      <!-- Email -->
      <CvFormGroup
        label="Email"
        name="email"
        :error="errors.email"
      >
        <CvInput
          v-model="formState.email"
          type="email"
          placeholder="seu@email.com"
          icon="i-heroicons-envelope"
          size="lg"
        />
      </CvFormGroup>

      <!-- Password -->
      <CvFormGroup
        label="Senha"
        name="password"
        :error="errors.password"
      >
        <CvInput
          v-model="formState.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          icon="i-heroicons-lock-closed"
          size="lg"
        >
          <template #trailing>
            <button
              type="button"
              class="text-gray-400 hover:text-white transition-colors"
              @click="showPassword = !showPassword"
            >
              <CvIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
            </button>
          </template>
        </CvInput>
      </CvFormGroup>

      <!-- Error Message -->
      <CvAlert
        v-if="authStore.error"
        color="red"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        :title="authStore.error"
        class="animate-fade-in"
      />

      <!-- Submit Button -->
      <CvButton
        type="submit"
        color="orange"
        size="lg"
        block
        :loading="authStore.loading"
        :disabled="authStore.loading"
      >
        <template #leading>
          <CvIcon name="i-heroicons-arrow-right" />
        </template>
        Entrar
      </CvButton>
    </CvForm>

    <!-- Info -->
    <div class="mt-6 text-center">
      <p class="text-gray-500 text-sm">
        Para criar uma conta, entre em contato com um administrador.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth',
  middleware: 'auth',
})

const authStore = useAuthStore()
const showPassword = ref(false)

// Schema de validação
const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

// Estado do formulário
const formState = reactive({
  email: '',
  password: '',
})

// Erros de validação
const errors = reactive({
  email: '',
  password: '',
})

// Login
async function handleLogin() {
  // Limpar erros
  errors.email = ''
  errors.password = ''
  authStore.clearError()

  // Validar
  try {
    schema.parse(formState)
  } catch (error: any) {
    if (error.errors) {
      error.errors.forEach((err: any) => {
        if (err.path[0] === 'email') errors.email = err.message
        if (err.path[0] === 'password') errors.password = err.message
      })
    }
    return
  }

  // Fazer login
  const success = await authStore.login({
    email: formState.email,
    password: formState.password,
  })

  if (success) {
    navigateTo('/dashboard')
  }
}
</script>
