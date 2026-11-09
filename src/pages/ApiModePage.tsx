import { useEffect, useState } from 'react'
import { Notice, PageHero } from '../components/UI'
import { apiService } from '../services/towService'

export function ApiModePage() {
  const [state, setState] = useState<'loading' | 'error' | 'empty' | 'ready'>('loading')
  const [message, setMessage] = useState('')
  useEffect(() => { let active = true; apiService.getProfessionals().then(data => { if (active) setState(data.length ? 'ready' : 'empty') }).catch(error => { if (active) { setState('error'); setMessage(error instanceof Error ? error.message : 'Erro desconhecido.') } }); return () => { active = false } }, [])
  return <><PageHero eyebrow="INTEGRAÇÃO FUTURA" title="Modo API em preparação." description="A integração definitiva depende do backend Java e do contrato acordado com a equipe. Este modo nunca substitui falhas da API por dados fictícios."/><div className="page-wrap max-w-3xl py-12">{state === 'loading' && <Notice>Carregando dados da API...</Notice>}{state === 'error' && <Notice tone="error">{message}</Notice>}{state === 'empty' && <Notice>Nenhum guincheiro retornado pela API. Nenhum dado fictício foi exibido.</Notice>}{state === 'ready' && <Notice>Conexão de leitura estabelecida. As telas de escrita e o contrato final ainda dependem da integração com a API Java; use VITE_APP_MODE=demo para testar o protótipo completo.</Notice>}</div></>
}
