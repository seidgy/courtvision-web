// Status de jogos
export const GAME_STATUS = {
  SCHEDULED: 'SCHEDULED',
  LIVE: 'LIVE',
  FINISHED: 'FINISHED',
  POSTPONED: 'POSTPONED',
  CANCELLED: 'CANCELLED',
} as const

export const GAME_STATUS_LABELS: Record<string, string> = {
  SCHEDULED: 'Agendado',
  LIVE: 'Ao Vivo',
  FINISHED: 'Finalizado',
  POSTPONED: 'Adiado',
  CANCELLED: 'Cancelado',
}

export const GAME_STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'blue',
  LIVE: 'green',
  FINISHED: 'gray',
  POSTPONED: 'yellow',
  CANCELLED: 'red',
}

// Resultados de parlay
export const PARLAY_RESULT = {
  PENDING: 'PENDING',
  WIN: 'WIN',
  LOSS: 'LOSS',
  PUSH: 'PUSH',
} as const

export const PARLAY_RESULT_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  WIN: 'Ganho',
  LOSS: 'Perdido',
  PUSH: 'Empate',
}

export const PARLAY_RESULT_COLORS: Record<string, string> = {
  PENDING: 'blue',
  WIN: 'green',
  LOSS: 'red',
  PUSH: 'yellow',
}

// Tipos de aposta
export const BET_TYPE_LABELS: Record<string, string> = {
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

// Tipos de temporada
export const SEASON_TYPE_LABELS: Record<string, string> = {
  REGULAR_SEASON: 'Temporada Regular',
  PLAYOFFS: 'Playoffs',
  PRE_SEASON: 'Pré-Temporada',
}

// Posições
export const POSITION_LABELS: Record<string, string> = {
  PG: 'Armador',
  SG: 'Ala-Armador',
  SF: 'Ala',
  PF: 'Ala-Pivô',
  C: 'Pivô',
}

// Conferências
export const CONFERENCE_LABELS: Record<string, string> = {
  East: 'Leste',
  West: 'Oeste',
}

// Cores de confiança
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 70) return 'text-green-400'
  if (confidence >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

export function getConfidenceBgColor(confidence: number): string {
  if (confidence >= 70) return 'bg-green-500/20'
  if (confidence >= 50) return 'bg-yellow-500/20'
  return 'bg-red-500/20'
}
