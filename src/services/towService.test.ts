import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { demoProfessionals } from '../mocks/data'

describe('API remota de guinchos', () => {
  beforeEach(() => { vi.resetModules(); vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.test/') })
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs() })

  it('consulta e preserva os profissionais recebidos via Fetch', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(demoProfessionals)))
    vi.stubGlobal('fetch', fetch)
    const { apiService } = await import('./towService')
    expect(await apiService.getProfessionals()).toEqual(demoProfessionals)
    expect(fetch).toHaveBeenCalledWith('https://api.example.test/guincheiros', expect.objectContaining({ credentials: 'include' }))
  })

  it('envia a solicitação ao servidor por POST e usa o protocolo retornado', async () => {
    const data = { origin: 'Rua de origem', destination: 'Oficina destino', vehicle: 'Carro' as const, vehicleDescription: 'Hatch prata', problem: 'Pane elétrica', details: '' }
    const created = { ...data, id: 'java-123', status: 'aguardando propostas' }
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(created), { status: 201 }))
    vi.stubGlobal('fetch', fetch)
    const { apiService } = await import('./towService')
    expect(await apiService.createRequest(data)).toEqual(created)
    expect(fetch).toHaveBeenCalledWith('https://api.example.test/solicitacoes', expect.objectContaining({ method: 'POST', body: JSON.stringify(data) }))
  })

  it('aceita lista vazia e rejeita resposta fora do contrato', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(new Response('[]')).mockResolvedValueOnce(new Response('{"content":[]}'))
    vi.stubGlobal('fetch', fetch)
    const { apiService } = await import('./towService')
    expect(await apiService.getProfessionals()).toEqual([])
    await expect(apiService.getProfessionals()).rejects.toThrow('formato inesperado')
  })

  it('informa falhas HTTP e de rede sem retornar mocks', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(new Response('', { status: 401 })).mockRejectedValueOnce(new TypeError('Failed to fetch'))
    vi.stubGlobal('fetch', fetch)
    const { apiService } = await import('./towService')
    await expect(apiService.getProfessionals()).rejects.toThrow('HTTP 401')
    await expect(apiService.getProfessionals()).rejects.toThrow('Falha de rede')
  })

  it('não confirma sucesso de escrita sem protocolo retornado', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}')))
    const { apiService } = await import('./towService')
    await expect(apiService.createRequest({ origin: 'Origem', destination: 'Destino', vehicle: 'Carro', vehicleDescription: 'Carro', problem: 'Pane', details: '' })).rejects.toThrow('evitar duplicidade')
  })

  it('informa configuração ausente antes de chamar a rede', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch)
    const { apiService } = await import('./towService')
    await expect(apiService.getProfessionals()).rejects.toThrow('VITE_API_BASE_URL')
    expect(fetch).not.toHaveBeenCalled()
  })
})
