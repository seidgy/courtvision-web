<template>
  <div>
    <h2 class="text-2xl font-bold text-white text-center mb-2">
      Bem-vindo de volta
    </h2>
    <p class="text-gray-400 text-center mb-8">
      Entre com suas credenciais para continuar
    </p>

    <UForm
      :schema="schema"
      :state="formState"
      class="space-y-6"
      @submit="handleLogin"
    >
      <!-- Email -->
      <UFormGroup
        label="Email"
        name="email"
        :error="errors.email"
      >
        <UInput
          v-model="formState.email"
          type="email"
          placeholder="seu@email.com"
          icon="i-heroicons-envelope"
          size="lg"
          :ui="{ base: 'bg-gray-700 border-gray-600 text-white' }"
        />
      </UFormGroup>

      <!-- Password -->
      <UFormGroup
        label="Senha"
        name="password"
        :error="errors.password"
      >
        <UInput
          v-model="formState.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          icon="i-heroicons-lock-closed"
          size="lg"
          :ui="{ base: 'bg-gray-700 border-gray-600 text-white' }"
          :ui-icon="{ trailing: { pointer: '' } }"
        >
          <template #trailing>
            <UButton
              color="gray"
              variant="link"
              :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
              :padded="false"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormGroup>

      <!-- Error Message -->
      <UAlert
        v-if="authStore.error"
        color="red"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        :title="authStore.error"
        class="animate-fade-in"
      />

      <!-- Submit Button -->
      <UButton
        type="submit"
        color="orange"
        size="lg"
        block
        :loading="authStore.loading"
        :disabled="authStore.loading"
      >
        <template #leading>
          <UIcon name="i-heroicons-arrow-right" />
        </template>
        Entrar
      </UButton>
    </UForm>

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
