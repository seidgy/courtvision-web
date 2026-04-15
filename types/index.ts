// Tipos de autenticação
export interface User {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  isActive?: boolean
  createdAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  role?: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Tipos de NBA
export interface Team {
  id: number
  apiId: number
  name: string
  code: string
  city: string
  conference: string
  division: string
  logo?: string
}

export interface Player {
  id: number
  apiId: number
  firstName: string
  lastName: string
  fullName?: string
  position?: string
  jerseyNumber?: string
  height?: string
  weight?: string
  country?: string
  college?: string
  dateOfBirth?: string
  teamId?: number
  team?: Team
}

export interface Game {
  id: number
  apiId: number
  homeTeamId: number
  awayTeamId: number
  homeTeam: Team
  awayTeam: Team
  gameDate: string
  season: string
  seasonType: 'REGULAR_SEASON' | 'PLAYOFFS' | 'PRE_SEASON'
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'POSTPONED' | 'CANCELLED'
  homeScore?: number
  awayScore?: number
  arena?: string
  city?: string
  country?: string
}

export interface PlayerStats {
  id: number
  playerId: number
  gameId: number
  teamId: number
  minutes?: string
  points: number
  rebounds: number
  assists: number
  steals: number
  blocks: number
  turnovers: number
  fouls: number
  fgm: number
  fga: number
  fgPercentage: number
  tpm: number
  tpa: number
  tpPercentage: number
  ftm: number
  fta: number
  ftPercentage: number
  offensiveRebounds: number
  defensiveRebounds: number
  plusMinus: number
  player?: Player
  game?: Game
}

// Tipos de Parlay
export type BetType = 
  | 'POINTS' 
  | 'REBOUNDS' 
  | 'ASSISTS' 
  | 'STEALS' 
  | 'BLOCKS' 
  | 'THREES'
  | 'POINTS_REBOUNDS'
  | 'POINTS_ASSISTS'
  | 'REBOUNDS_ASSISTS'
  | 'DOUBLE_DOUBLE'
  | 'TRIPLE_DOUBLE'

export type ParlayResult = 'PENDING' | 'WIN' | 'LOSS' | 'PUSH'
export type ParlayStatus = 'PENDING' | 'ACTIVE' | 'SETTLED' | 'CANCELLED'

export interface ContextFactor {
  factor: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number
  description: string
}

export interface ParlayItem {
  id: string
  parlayId: string
  playerId: number
  player: Player
  betType: BetType
  line: number
  odds: number
  prediction: string
  confidence: number
  predictedValue: number
  contextAnalysis?: {
    factors: ContextFactor[]
    reasoning: string
  }
  result: ParlayResult
  actualValue?: number
}

export interface Parlay {
  id: string
  userId: string
  gameId: number
  game: Game
  totalOdds: number
  stake?: number
  potentialReturn?: number
  confidence: number
  status: ParlayStatus
  aiAnalysis?: string
  reasoning?: string
  result: ParlayResult
  actualReturn?: number
  items: ParlayItem[]
  createdAt: string
  updatedAt: string
  generatedAt: string
}

export interface PlayerAnalysis {
  player: {
    id: number
    name: string
    position?: string
    team?: string
  }
  game: {
    id: number
    homeTeam: string
    awayTeam: string
    date: string
    isPlayoff: boolean
  }
  opponent: string
  analysis: {
    betType: string
    suggestedLine: number
    prediction: string
    confidence: number
    predictedValue: number
    probability: number
    reasoning: string
    contextFactors: ContextFactor[]
  }
  stats: {
    recentAverages?: {
      gamesPlayed: number
      points: number
      rebounds: number
      assists: number
      minutes: number
      fgPercentage: number
    }
    vsTeamStats?: {
      gamesPlayed: number
      points: number
      rebounds: number
      assists: number
    }
    trend?: {
      trend: string
      confidence: number
      percentageChange: number
    }
    teammateImpact?: {
      level: string
      description: string
    }
  }
}

// Tipos de API Response
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: any[]
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

// Tipos de estatísticas
export interface ParlayStats {
  total: number
  wins: number
  losses: number
  pending: number
  winRate: number
  totalStaked: number
  totalReturned: number
  profit: number
  roi: number
}
