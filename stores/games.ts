import { defineStore } from 'pinia'
import type { Game, Team, Player, PlayerStats } from '~/types'

interface GamesState {
  games: Game[]
  todayGames: Game[]
  teams: Team[]
  currentGame: Game | null
  currentTeam: Team | null
  currentPlayer: Player | null
  playerStats: PlayerStats[]
  loading: boolean
  error: string | null
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null
}

export const useGamesStore = defineStore('games', {
  state: (): GamesState => ({
    games: [],
    todayGames: [],
    teams: [],
    currentGame: null,
    currentTeam: null,
    currentPlayer: null,
    playerStats: [],
    loading: false,
    error: null,
    meta: null,
  }),

  getters: {
    getGameById: (state) => (id: number) => {
      return state.games.find(g => g.id === id) || state.todayGames.find(g => g.id === id)
    },
    getTeamById: (state) => (id: number) => {
      return state.teams.find(t => t.id === id)
    },
    upcomingGames: (state) => {
      return state.todayGames.filter(g => g.status === 'SCHEDULED')
    },
    liveGames: (state) => {
      return state.todayGames.filter(g => g.status === 'LIVE')
    },
    finishedGames: (state) => {
      return state.todayGames.filter(g => g.status === 'FINISHED')
    },
  },

  actions: {
    // Listar jogos
    async fetchGames(params?: {
      page?: number
      limit?: number
      status?: string
      date?: string
      teamId?: number
      season?: string
    }) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get('/games', { params })
        
        this.games = response.data || []
        this.meta = response.meta || null
        
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao carregar jogos'
        return []
      } finally {
        this.loading = false
      }
    },

    // Obter jogos de hoje
    async fetchTodayGames() {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get('/games/today')
        
        this.todayGames = response || []
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao carregar jogos de hoje'
        return []
      } finally {
        this.loading = false
      }
    },

    // Obter jogo por ID
    async fetchGame(id: number) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get(`/games/${id}`)
        
        this.currentGame = response
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao carregar jogo'
        return null
      } finally {
        this.loading = false
      }
    },

    // Listar times
    async fetchTeams() {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get('/games/teams')
        
        this.teams = response || []
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao carregar times'
        return []
      } finally {
        this.loading = false
      }
    },

    // Obter time por ID
    async fetchTeam(id: number) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get(`/games/teams/${id}`)
        
        this.currentTeam = response
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao carregar time'
        return null
      } finally {
        this.loading = false
      }
    },

    // Obter jogador por ID
    async fetchPlayer(id: number) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get(`/games/players/${id}`)
        
        this.currentPlayer = response
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao carregar jogador'
        return null
      } finally {
        this.loading = false
      }
    },

    // Obter estatísticas do jogador
    async fetchPlayerStats(id: number, lastN: number = 20) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get(`/games/players/${id}/stats`, {
          params: { lastN },
        })
        
        this.playerStats = response || []
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao carregar estatísticas'
        return []
      } finally {
        this.loading = false
      }
    },

    // Obter estatísticas do jogo
    async fetchGameStats(id: number) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get(`/games/${id}/stats`)
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao carregar estatísticas'
        return []
      } finally {
        this.loading = false
      }
    },

    // Sincronizar times (admin)
    async syncTeams() {
      this.loading = true
      
      try {
        const { $api } = useNuxtApp()
        await $api.post('/games/sync/teams')
        
        // Recarregar times
        await this.fetchTeams()
        
        return true
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao sincronizar times'
        return false
      } finally {
        this.loading = false
      }
    },

    // Sincronizar jogadores (admin)
    async syncPlayers(teamId: number) {
      this.loading = true
      
      try {
        const { $api } = useNuxtApp()
        await $api.post(`/games/sync/players/${teamId}`)
        
        return true
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao sincronizar jogadores'
        return false
      } finally {
        this.loading = false
      }
    },

    // Limpar erro
    clearError() {
      this.error = null
    },
  },
})
