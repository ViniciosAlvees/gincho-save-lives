import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useDemo } from '../contexts/DemoContext'
import { isApiMode } from '../services/towService'
import { usePageTitle } from '../hooks/usePageTitle'
import { useVisualMotion } from '../hooks/useVisualMotion'
import brandMark from '../assets/brand-mark.svg'

const nav = [['/', 'Início'], ['/buscar-guincho', 'Encontrar guincho'], ['/sobre', 'A solução'], ['/integrantes', 'Integrantes'], ['/faq', 'FAQ'], ['/contato', 'Contato']]

export function Layout({ children }: { children: React.ReactNode }) {
  usePageTitle()
  useVisualMotion()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { role, setRole } = useDemo()
  const dashboard = role === 'cliente' ? '/cliente/painel' : '/guincheiro/painel'
  return <div className="app-shell min-h-screen bg-ink text-mist">
    <div className="app-ambient" aria-hidden="true"><span/><span/><span/></div>
    <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-lime focus:p-3 focus:text-ink">Pular para o conteúdo</a>
    <div className="demo-ribbon px-4 py-1.5 text-center text-[10px] font-bold tracking-[.16em] text-lime sm:text-xs" role="status">{isApiMode ? 'Modo API — integração Java pendente' : 'MODO DEMONSTRAÇÃO • dados fictícios • funcionamento local neste navegador'}</div>
    <header className="site-header sticky top-0 z-[1000] border-b border-white/10 backdrop-blur-xl">
      <div className="page-wrap flex h-18 items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-sm font-black tracking-tight sm:text-base" onClick={() => setOpen(false)}><img src={brandMark} alt="" className="size-9 rounded-lg"/><span>GUINCHO<span className="text-lime"> SAVE LIVES</span></span></Link>
        <nav className="hidden items-center gap-4 xl:flex" aria-label="Navegação principal">{nav.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `nav-link text-sm font-semibold transition hover:text-lime ${isActive ? 'is-active text-lime' : 'text-slate-300'}`}>{label}</NavLink>)}<details className="access-menu relative"><summary className="cursor-pointer text-sm font-semibold text-cyan">Acessos</summary><div className="surface absolute right-0 top-9 z-50 flex w-64 flex-col gap-1 p-3">{[['/cadastro/cliente','Cadastro cliente'],['/login/cliente','Entrada cliente'],['/cadastro/guincheiro','Cadastro guincheiro'],['/login/guincheiro','Entrada guincheiro'],['/funcionarios/acesso','Acesso Funcionários']].map(([to,label]) => <Link key={to} to={to} className="rounded-lg p-2 text-sm hover:bg-cyan/10" onClick={e => e.currentTarget.closest('details')?.removeAttribute('open')}>{label}</Link>)}</div></details></nav>
        <div className="hidden items-center gap-2 xl:flex"><label htmlFor="profile-switch" className="sr-only">Perfil de demonstração</label><select id="profile-switch" className="input !min-h-9 !w-auto !py-1 text-xs" value={role} onChange={e => setRole(e.target.value as 'cliente' | 'guincheiro')}><option value="cliente">Cliente demo</option><option value="guincheiro">Guincheiro demo</option></select><Link to={dashboard} className="btn-primary !min-h-9 !px-3 text-xs">Meu painel <ArrowRight size={14}/></Link></div>
        <button className="menu-toggle rounded-lg border border-white/20 p-2 xl:hidden" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      </div>
      {open && <nav className="mobile-nav page-wrap flex max-h-[calc(100dvh-110px)] flex-col gap-1 overflow-y-auto border-t border-white/10 py-3 xl:hidden" aria-label="Menu mobile">{[...nav, ['/cadastro/cliente', 'Cadastro cliente'], ['/login/cliente', 'Entrada cliente'], ['/cadastro/guincheiro', 'Cadastro guincheiro'], ['/login/guincheiro', 'Entrada guincheiro'], ['/funcionarios/acesso', 'Acesso Funcionários']].map(([to, label]) => <Link key={to} to={to} onClick={() => setOpen(false)} className={`rounded-lg px-3 py-2 text-sm ${pathname === to ? 'bg-lime/15 text-lime' : 'text-slate-200'}`}>{label}</Link>)}<label className="field px-3">Perfil de demonstração<select className="input" value={role} onChange={e => setRole(e.target.value as 'cliente' | 'guincheiro')}><option value="cliente">Cliente demo</option><option value="guincheiro">Guincheiro demo</option></select></label><Link to={dashboard} onClick={() => setOpen(false)} className="btn-primary mt-2">Meu painel</Link></nav>}
    </header>
    <main id="conteudo" key={pathname} className="route-frame">{children}</main>
    <footer className="site-footer border-t border-white/10 py-12"><div className="page-wrap grid gap-8 md:grid-cols-3"><div><div className="font-black tracking-wide">GUINCHO <span className="text-lime">SAVE LIVES</span></div><p className="mt-3 max-w-xs text-sm text-slate-400">Tecnologia que conecta. Agilidade que faz a diferença.</p><p className="mt-3 text-xs text-slate-500">Projeto acadêmico • Global Solution 2026/2 • FIAP</p></div><div className="flex flex-col items-start gap-2 text-sm text-slate-300"><Link to="/sobre" className="hover:text-lime">Sobre</Link><Link to="/integrantes" className="hover:text-lime">Integrantes</Link><Link to="/faq" className="hover:text-lime">Perguntas frequentes</Link></div><div className="flex flex-col items-start gap-2 text-sm text-slate-300"><Link to="/contato" className="hover:text-lime">Contato</Link><Link to="/cadastro/guincheiro" className="hover:text-lime">Seja um parceiro</Link><p className="mt-2 text-xs text-slate-500">Não é um serviço real de emergência ou transporte.</p></div></div></footer>
  </div>
}
