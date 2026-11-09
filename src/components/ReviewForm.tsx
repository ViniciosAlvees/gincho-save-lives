import { useState, type FormEvent } from 'react'
import { Star } from 'lucide-react'
import { useDemo } from '../contexts/DemoContext'
import { canReview } from '../utils/accessRules'
import { Notice } from './UI'

export function ReviewForm({ requestId }: { requestId: string }) {
  const demo = useDemo(); const [score, setScore] = useState(0); const [comment, setComment] = useState(''); const [feedback, setFeedback] = useState('')
  const request = demo.requests.find(r => r.id === requestId)
  if (!canReview(request, demo.clientSessionId, demo.reviews)) return demo.reviews.some(r => r.requestId === requestId && r.clientId === demo.clientSessionId) ? <Notice tone="success">Avaliação registrada. Obrigado por avaliar este atendimento demonstrativo.</Notice> : null
  function submit(e: FormEvent) { e.preventDefault(); try { demo.addReview(requestId, score, comment); setFeedback('Avaliação registrada nesta demonstração.') } catch (err) { setFeedback(err instanceof Error ? err.message : 'Não foi possível avaliar.') } }
  return <section className="surface p-6"><h2 className="text-xl font-bold">Avalie este atendimento</h2><p className="mt-2 text-sm text-slate-400">Disponível uma vez após a conclusão do serviço.</p><form onSubmit={submit} className="mt-5 space-y-4"><fieldset><legend className="text-sm font-semibold">Nota de 1 a 5 estrelas</legend><div className="mt-2 flex gap-2">{[1,2,3,4,5].map(value => <button type="button" key={value} aria-label={`${value} estrela${value > 1 ? 's' : ''}`} aria-pressed={score === value} onClick={() => setScore(value)} className={`rounded-lg p-2 ${score >= value ? 'text-cyan' : 'text-slate-500'}`}><Star fill={score >= value ? 'currentColor' : 'none'}/></button>)}</div></fieldset><label className="field">Comentário opcional<textarea className="input min-h-24" maxLength={500} value={comment} onChange={e => setComment(e.target.value)}/></label><button className="btn-primary" disabled={!score}>Enviar avaliação</button></form>{feedback && <div className="mt-4"><Notice tone={feedback.startsWith('Avaliação registrada') ? 'success' : 'error'}>{feedback}</Notice></div>}</section>
}
