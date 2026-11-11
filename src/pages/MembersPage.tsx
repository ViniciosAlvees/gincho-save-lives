import { Github, Linkedin } from 'lucide-react'
import { PageHero } from '../components/UI'
import { teamMembers } from '../data/team'

export function Members() {
  return <>
    <PageHero
      eyebrow="NOSSA EQUIPE"
      title="Integrantes"
      description="Conheça as pessoas por trás do GUINCHO SAVE LIVES e conecte-se com a equipe."
    />
    <section className="page-wrap py-16" aria-labelledby="team-title">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">CONSTRUÍDO POR PESSOAS. PARA PESSOAS.</p>
          <h2 id="team-title" className="mt-3 text-2xl font-bold">Nossa equipe</h2>
        </div>
        <p className="text-sm text-slate-400">FIAP <span aria-hidden="true">•</span> Turma 1TDSPY</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map(member => <article key={member.rm} className="surface flex flex-col">
          <div className="flex h-64 items-end justify-center border-b border-white/10 bg-[radial-gradient(ellipse_at_50%_90%,#00d9ff26,transparent_70%)] px-6 pt-6">
            <img
              src={member.photo}
              alt={`Foto de ${member.name}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain object-bottom"
            />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <h3 className="text-xl font-bold">{member.name}</h3>
            <p className="mt-2 text-sm text-slate-400">RM {member.rm} <span aria-hidden="true">•</span> Turma {member.turma}</p>
            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`LinkedIn de ${member.name} (abre em nova aba)`}
                className="btn-secondary flex-1"
              >
                <Linkedin size={18} aria-hidden="true"/> LinkedIn
              </a>
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub de ${member.name} (abre em nova aba)`}
                className="btn-secondary flex-1"
              >
                <Github size={18} aria-hidden="true"/> GitHub
              </a>
            </div>
          </div>
        </article>)}
      </div>
    </section>
  </>
}
