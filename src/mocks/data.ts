import type { DemoState, DriverApplication, Professional, Review } from '../types'

export const demoProfessionals: Professional[] = [
  { id: 'g-01', name: 'Alex Martins', region: 'São Paulo • Centro', city: 'São Paulo', lat: -23.5505, lng: -46.6333, available: true, towType: 'Plataforma', vehicles: ['Carro', 'Moto'], price: 180, demo: true, about: 'Atendimento ilustrativo para veículos leves na região central.', jobs: 128 },
  { id: 'g-02', name: 'Camila Rocha', region: 'São Paulo • Zona Sul', city: 'São Paulo', lat: -23.6237, lng: -46.6831, available: true, towType: 'Plataforma', vehicles: ['Carro', 'Moto', 'Utilitário'], price: 220, demo: true, about: 'Remoção demonstrativa de veículos leves e utilitários.', jobs: 96 },
  { id: 'g-03', name: 'Rafael Costa', region: 'São Paulo • Zona Leste', city: 'São Paulo', lat: -23.5432, lng: -46.4822, available: false, towType: 'Pesado', vehicles: ['Carro', 'Utilitário', 'Caminhão'], price: 320, demo: true, about: 'Perfil fictício especializado em veículos de grande porte.', jobs: 210 },
  { id: 'g-04', name: 'Beatriz Lima', region: 'Campinas • Centro', city: 'Campinas', lat: -22.9056, lng: -47.0608, available: true, towType: 'Plataforma', vehicles: ['Carro', 'Moto'], price: 195, demo: true, about: 'Atendimento ilustrativo em Campinas e região.', jobs: 74 },
]

export const initialState: DemoState = {
  role: 'cliente', clientName: 'Motorista Demo', professionalId: 'g-01',
  professionals: demoProfessionals.map(p => ({ ...p, approvalStatus: 'aprovado' })), requests: [], clientAccounts: [],
  driverApplications: demoProfessionals.map((p, index): DriverApplication => ({
    id: `app-${p.id}`, professionalId: p.id, email: `motorista${index + 1}@exemplo.test`, cpfMasked: '***.***.***-**', birthDate: '', phoneMasked: '(**) *****-****', truckBrand: 'Marca fictícia', truckModel: p.towType, plate: '***-****', licenseCategory: 'D', stateCode: 'SP', region: p.region, radiusKm: 30, status: 'aprovado', createdAt: '2026-10-01T12:00:00.000Z', documents: { cnh: true, rgFrente: true, rgVerso: true, fotoFacial: true }, history: [{ status: 'aprovado', note: 'Perfil de exemplo pré-aprovado para demonstração.', at: '2026-10-01T12:00:00.000Z' }],
  })),
  reviews: demoProfessionals.flatMap((p, index): Review[] => [
    { id: `review-${p.id}-1`, requestId: `example-${p.id}-1`, professionalId: p.id, clientId: 'example', score: [5, 5, 5, 5][index], comment: 'Atendimento ilustrativo para visualizar a interface.', createdAt: '2026-10-20T12:00:00.000Z', demo: true },
    { id: `review-${p.id}-2`, requestId: `example-${p.id}-2`, professionalId: p.id, clientId: 'example', score: [5, 4, 5, 4][index], comment: 'Avaliação fictícia, sem serviço real associado.', createdAt: '2026-10-22T12:00:00.000Z', demo: true },
  ]),
}
