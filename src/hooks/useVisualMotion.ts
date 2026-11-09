import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useVisualMotion() {
  const { pathname } = useLocation()

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    const observed = new WeakSet<Element>()
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' })
    const register = () => {
      document.querySelectorAll('main section:not(.cinematic-hero), main article, main .surface').forEach(element => {
        if (observed.has(element)) return
        observed.add(element)
        element.classList.add('motion-reveal')
        revealObserver.observe(element)
      })
    }
    register()
    const mutationObserver = new MutationObserver(register)
    const main = document.querySelector('main')
    if (main) mutationObserver.observe(main, { childList: true, subtree: true })

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const scene = document.querySelector<HTMLElement>('.hero-scene')
    let scrollFrame = 0
    const onScroll = () => {
      if (!scene || !finePointer.matches) return
      cancelAnimationFrame(scrollFrame)
      scrollFrame = requestAnimationFrame(() => scene.style.setProperty('--parallax', `${Math.min(window.scrollY, 700) * .055}px`))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    let lastCard: HTMLElement | null = null
    let lastButton: HTMLElement | null = null
    let frame = 0
    const reset = (element: HTMLElement | null) => {
      element?.style.removeProperty('--rotate-x')
      element?.style.removeProperty('--rotate-y')
      element?.style.removeProperty('--magnet-x')
      element?.style.removeProperty('--magnet-y')
      element?.style.removeProperty('--spot-x')
      element?.style.removeProperty('--spot-y')
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || media.matches) return
      const target = event.target as Element
      const card = target.closest<HTMLElement>('.surface-hover')
      const button = target.closest<HTMLElement>('.btn-primary')
      if (lastCard !== card) reset(lastCard)
      if (lastButton !== button) reset(lastButton)
      lastCard = card
      lastButton = button
      cancelAnimationFrame(frame)
      cancelAnimationFrame(scrollFrame)
      window.removeEventListener('scroll', onScroll)
      frame = requestAnimationFrame(() => {
        if (card) {
          const rect = card.getBoundingClientRect()
          const x = (event.clientX - rect.left) / rect.width - .5
          const y = (event.clientY - rect.top) / rect.height - .5
          card.style.setProperty('--rotate-x', `${-y * 4}deg`)
          card.style.setProperty('--rotate-y', `${x * 4}deg`)
          card.style.setProperty('--spot-x', `${(x + .5) * 100}%`)
          card.style.setProperty('--spot-y', `${(y + .5) * 100}%`)
        }
        if (button) {
          const rect = button.getBoundingClientRect()
          button.style.setProperty('--magnet-x', `${(event.clientX - rect.left - rect.width / 2) * .08}px`)
          button.style.setProperty('--magnet-y', `${(event.clientY - rect.top - rect.height / 2) * .08}px`)
        }
      })
    }
    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) { reset(lastCard); reset(lastButton); lastCard = null; lastButton = null }
    }
    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerout', onPointerOut, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      revealObserver.disconnect()
      mutationObserver.disconnect()
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerout', onPointerOut)
      reset(lastCard)
      reset(lastButton)
      document.querySelectorAll('.motion-reveal').forEach(element => element.classList.remove('motion-reveal', 'is-visible'))
    }
  }, [pathname])
}
