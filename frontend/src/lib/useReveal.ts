import { useCallback, useEffect, useState } from 'react'

export function useReveal<T extends HTMLElement>() {
  const [element, setElement] = useState<T | null>(null)
  const [visible, setVisible] = useState(false)

  const ref = useCallback((node: T | null) => {
    setElement(node)
  }, [])

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])

  return { ref, className: `reveal ${visible ? 'reveal-visible' : ''}` }
}
