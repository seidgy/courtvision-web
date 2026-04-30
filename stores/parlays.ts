// @ts-nocheck
import { defineStore } from 'pinia'
import type { Parlay, ParlayItem, PlayerAnalysis, ParlayStats } from '~/types'

interface ParlaysState {
  parlays: Parlay[]
  currentParlay: Parlay | null
  currentAnalysis: PlayerAnalysis | null
  stats: ParlayStats | null
  loading: boolean
  generating: boolean
  analyzing: boolean
  error: string | null
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null
}

export const useParlaysStore = defineStore('parlays', {
  state: (): ParlaysState => ({
    parlays: [],
    currentParlay: null,
    currentAnalysis: null,
    stats: null,
    loading: false,
    generating: false,
    analyzing: false,
    error: null,
    meta: null,
  }),

  getters: {
    getParlayById: (state) => (id: string) => {
      return state.parlays.find(p => p.id === id)
    },
    pendingParlays: (state) => {
      return state.parlays.filter(p => p.result === 'PENDING')
    },
    wonParlays: (state) => {
      return state.parlays.filter(p => p.result === 'WIN')
    },
    lostParlays: (state) => {
      return state.parlays.filter(p => p.result === 'LOSS')
    },
  },

  actions: {
    // Listar parlays do usuário
    async fetchParlays(params?: {
      page?: number
      limit?: number
      status?: string
    }) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.getPaginated('/parlays', { params })
        
        this.parlays = response.data || []
        this.meta = response.meta || null
        
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao carregar parlays'
        return []
      } finally {
        this.loading = false
      }
    },

    // Obter parlay por ID
    async fetchParlay(id: string) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get(`/parlays/${id}`)
        
        this.currentParlay = response
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao carregar parlay'
        return null
      } finally {
        this.loading = false
      }
    },

    // Gerar novo parlay
    async generateParlay(gameId: number) {
      this.generating = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.post(`/parlays/generate/${gameId}`)
        
        this.currentParlay = response
        this.parlays.unshift(response)
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao gerar parlay'
        return null
      } finally {
        this.generating = false
      }
    },

    // Analisar jogador
    async analyzePlayer(playerId: number, gameId: number, betType?: string, line?: number) {
      this.analyzing = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const params: any = {}
        if (betType) params.betType = betType
        if (line) params.line = line
        
        const response = await $api.get(`/parlays/analyze/${playerId}/${gameId}`, { params })
        
        this.currentAnalysis = response
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao analisar jogador'
        return null
      } finally {
        this.analyzing = false
      }
    },

    // Obter estatísticas
    async fetchStats() {
      this.loading = true
      
      try {
        const { $api } = useNuxtApp()
        const response = await $api.get('/parlays/stats')
        
        this.stats = response
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao carregar estatísticas'
        return null
      } finally {
        this.loading = false
      }
    },

    // Deletar parlay
    async deleteParlay(id: string) {
      this.loading = true
      
      try {
        const { $api } = useNuxtApp()
        await $api.delete(`/parlays/${id}`)
        
        // Remover da lista
        this.parlays = this.parlays.filter(p => p.id !== id)
        
        return true
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao deletar parlay'
        return false
      } finally {
        this.loading = false
      }
    },

    // Listar todos os parlays (admin)
    async fetchAllParlays(params?: {
      page?: number
      limit?: number
      status?: string
    }) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.getPaginated('/parlays/admin/all', { params })
        
        this.parlays = response.data || []
        this.meta = response.meta || null
        
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao carregar parlays'
        return []
      } finally {
        this.loading = false
      }
    },

    // Atualizar resultado (admin)
    async updateResult(id: string, result: string, actualReturn?: number) {
      this.loading = true
      
      try {
        const { $api } = useNuxtApp()
        const response = await $api.post(`/parlays/${id}/result`, {
          result,
          actualReturn,
        })
        
        // Atualizar na lista
        const index = this.parlays.findIndex(p => p.id === id)
        if (index !== -1) {
          this.parlays[index] = response
        }
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao atualizar resultado'
        return null
      } finally {
        this.loading = false
      }
    },

    // Limpar análise atual
    clearAnalysis() {
      this.currentAnalysis = null
    },

    // Limpar erro
    clearError() {
      this.error = null
    },
  },
})
