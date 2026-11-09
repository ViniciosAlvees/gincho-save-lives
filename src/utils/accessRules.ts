import type { ClientAccount, DriverApplication, Professional, Review, TowRequest } from '../types'

export const isActiveClient = (account: ClientAccount | undefined, sessionId: string | null) => !!account && account.id === sessionId && account.status === 'ativo'
export const isApprovedDriver = (professional: Professional | undefined, application: DriverApplication | undefined, sessionId: string | null) => !!professional && !!application && application.professionalId === professional.id && sessionId === professional.id && application.status === 'aprovado'
export const isContractable = (professional: Professional, application: DriverApplication | undefined) => professional.available && application?.status === 'aprovado'
export const canReview = (request: TowRequest | undefined, clientId: string | null, reviews: Review[]) => !!request && !!clientId && request.clientId === clientId && request.status === 'concluído' && !!request.professionalId && !reviews.some(review => review.requestId === request.id)
export const ratingSummary = (reviews: Review[]) => ({ count: reviews.length, average: reviews.length ? reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length : 0, distribution: [5, 4, 3, 2, 1].map(score => ({ score, count: reviews.filter(review => review.score === score).length })) })

export function validCpf(value: string) {
  const digits = value.replace(/\D/g, '')
  if (!/^\d{11}$/.test(digits) || /^(\d)\1{10}$/.test(digits)) return false
  const check = (length: number) => { const sum = digits.slice(0, length).split('').reduce((n, digit, index) => n + Number(digit) * (length + 1 - index), 0); const remainder = (sum * 10) % 11; return (remainder === 10 ? 0 : remainder) === Number(digits[length]) }
  return check(9) && check(10)
}
export const maskCpf = (value: string) => { const digits = value.replace(/\D/g, ''); return `***.***.${digits.slice(6, 9)}-**` }
export const validPlate = (value: string) => /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(value.replace(/[^A-Z0-9]/gi, '').toUpperCase())
export const validPassword = (value: string) => value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value)
