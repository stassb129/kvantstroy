'use client'



import { useEffect, useState } from 'react'



/** Accent reading progress across the top edge — replaces the usual side scrollbar feel. */

export default function ScrollProgress() {

  const [progress, setProgress] = useState(0)



  useEffect(() => {

    const update = () => {

      const doc = document.documentElement

      const max = doc.scrollHeight - window.innerHeight

      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)

    }



    update()

    window.addEventListener('scroll', update, { passive: true })

    window.addEventListener('resize', update)

    return () => {

      window.removeEventListener('scroll', update)

      window.removeEventListener('resize', update)

    }

  }, [])



  const pct = `${progress * 100}%`



  return (

    <div

      aria-hidden

      className="pointer-events-none fixed inset-x-0 top-0 z-[190] h-1 overflow-visible"

    >

      {/* faint segmented track */}

      <div

        className="absolute inset-x-0 top-0 h-px opacity-40"

        style={{

          backgroundImage:

            'repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 6px, transparent 6px 14px)',

        }}

      />

      {/* filled progress */}

      <div

        className="absolute left-0 top-0 h-[2px] bg-accent-gradient shadow-[0_0_14px_rgba(232,106,0,0.7)]"

        style={{ width: pct }}

      />

      {/* glowing head */}

      <div

        className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(232,106,0,0.85)]"

        style={{ left: pct, opacity: progress > 0.01 ? 1 : 0 }}

      />

    </div>

  )

}


