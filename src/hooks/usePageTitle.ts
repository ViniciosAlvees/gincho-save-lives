import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const titles: Record<string, string> = {
  '/': 'Início', '/sobre': 'Sobre', '/integrantes': 'Integrantes', '/faq': 'FAQ', '/contato': 'Contato',
  '/entrar': 'Acesso demonstrativo', '/cadastro/cliente': 'Cadastro de cliente', '/cadastro/guincheiro': 'Cadastro de guincheiro',
  '/login/cliente': 'Login do cliente', '/login/guincheiro': 'Login do guincheiro', '/guincheiro/status': 'Análise cadastral',
  '/funcionarios/acesso': 'Acesso funcionários', '/funcionarios/painel': 'Painel de funcionários',
  '/buscar-guincho': 'Buscar guincho', '/solicitar-guincho': 'Solicitar guincho',
  '/cliente/painel': 'Painel do cliente', '/guincheiro/painel': 'Painel do guincheiro',
}

export function usePageTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    const title = titles[pathname] || (pathname.endsWith('/chat') ? 'Chat demonstrativo' : pathname.startsWith('/solicitacoes/') ? 'Solicitação' : pathname.startsWith('/guincheiros/') ? 'Profissional' : 'Página')
    document.title = `${title} | GUINCHO SAVE LIVES`
  }, [pathname])
}
