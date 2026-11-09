export type Role = 'cliente' | 'guincheiro'
export type Status = 'aguardando propostas' | 'proposta recebida' | 'negociação' | 'confirmado' | 'a caminho' | 'em andamento' | 'concluído' | 'cancelado'
export type Vehicle = 'Carro' | 'Moto' | 'Utilitário' | 'Caminhão'
export type ApprovalStatus = 'pendente' | 'em análise' | 'aprovado' | 'reprovado' | 'correção solicitada'
export type ClientStatus = 'ativo' | 'inativo' | 'bloqueado'
export type DocumentKind = 'cnh' | 'rgFrente' | 'rgVerso' | 'fotoFacial'

export interface ClientAccount { id: string; name: string; email: string; cpfMasked: string; status: ClientStatus; createdAt: string }
export interface DriverApplication {
  id: string; professionalId: string; email: string; cpfMasked: string; birthDate: string; phoneMasked: string
  truckBrand: string; truckModel: string; plate: string; licenseCategory: string; stateCode: string
  region: string; radiusKm: number; status: ApprovalStatus; createdAt: string
  documents: Record<DocumentKind, boolean>; history: { status: ApprovalStatus; note: string; at: string }[]
}
export interface Review { id: string; requestId: string; professionalId: string; clientId: string; score: number; comment: string; createdAt: string; demo: boolean }

export interface Professional {
  id: string
  name: string
  region: string
  city: string
  lat: number
  lng: number
  available: boolean
  towType: string
  vehicles: Vehicle[]
  price: number
  phone?: string
  demo: boolean
  about: string
  jobs: number
  approvalStatus?: ApprovalStatus
}

export interface Proposal {
  id: string
  professionalId: string
  amount: number
  note: string
  status: 'pendente' | 'contraproposta' | 'aceita' | 'recusada'
  counterAmount?: number
  createdAt: string
}

export interface ChatMessage {
  id: string
  role: Role
  text: string
  createdAt: string
}

export interface TowRequest {
  id: string
  clientName: string
  clientId?: string
  professionalId?: string
  origin: string
  destination: string
  vehicle: Vehicle
  vehicleDescription: string
  problem: string
  details: string
  status: Status
  proposals: Proposal[]
  messages: ChatMessage[]
  createdAt: string
}

export interface NewRequest {
  origin: string
  destination: string
  vehicle: Vehicle
  vehicleDescription: string
  problem: string
  details: string
  professionalId?: string
}

export interface DemoState {
  role: Role
  clientName: string
  professionalId: string
  professionals: Professional[]
  requests: TowRequest[]
  clientAccounts: ClientAccount[]
  driverApplications: DriverApplication[]
  reviews: Review[]
}
