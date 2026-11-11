import raphaelPhoto from '../assets/team/raphael.png'
import bryanPhoto from '../assets/team/bryan.png'
import enzoPhoto from '../assets/team/enzo.png'
import victorPhoto from '../assets/team/victor.png'
import viniciosPhoto from '../assets/team/vinicios.png'

interface TeamMember {
  name: string
  rm: string
  turma: string
  photo: string
  linkedin: string
  github: string
}

// Dados e fotos do repositório indicado pela equipe:
// https://github.com/alvesdemacedoenzo-beep/challenge-front-end-fiap/tree/ab68687687319ec60cab98737dc10b34fca58f44
export const teamMembers: readonly TeamMember[] = [
  {
    name: 'Raphael Ferreira Tavares',
    rm: '569767',
    turma: '1TDSPY',
    photo: raphaelPhoto,
    linkedin: 'https://www.linkedin.com/in/raphael-ferreira-0111323b8/',
    github: 'https://github.com/raph-ferreira',
  },
  {
    name: 'Bryan Germano',
    rm: '569716',
    turma: '1TDSPY',
    photo: bryanPhoto,
    linkedin: 'https://www.linkedin.com/in/bryan-germano-84016729b/',
    github: 'https://github.com/BryanGermano',
  },
  {
    name: 'Enzo Macedo',
    rm: '569427',
    turma: '1TDSPY',
    photo: enzoPhoto,
    linkedin: 'https://www.linkedin.com/in/enzo-alves-de-macedo-408359356/',
    github: 'https://github.com/alvesdemacedoenzo-beep',
  },
  {
    name: 'Victor Hugo Velasco Guzman',
    rm: '573173',
    turma: '1TDSPY',
    photo: victorPhoto,
    linkedin: 'https://www.linkedin.com/in/victor-hugo-velasco-guzman-296256235/',
    github: 'https://github.com/velascoguzmanvictorhugo-ui',
  },
  {
    name: 'Vinicios Alves',
    rm: '573002',
    turma: '1TDSPY',
    photo: viniciosPhoto,
    linkedin: 'https://www.linkedin.com/in/vinicios-alves-dos-santos-434128327/',
    github: 'https://github.com/ViniciosAlvees',
  },
]
