'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Loader2, Phone, User, X } from 'lucide-react'
import { EASE } from '@/lib/motion'
import { formatRuPhone, isValidRuPhone } from '@/lib/phone'

type LeadModalContextValue = {
  openLeadModal: (source?: string) => void
  closeLeadModal: () => void
}

const LeadModalContext = createContext<LeadModalContextValue | null>(null)

export function useLeadModal() {
  const ctx = useContext(LeadModalContext)
  if (!ctx) throw new Error('useLeadModal must be used within LeadModalProvider')
  return ctx
}

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState('Заявка с сайта')

  const openLeadModal = useCallback((nextSource = 'Заявка с сайта') => {
    setSource(nextSource)
    setOpen(true)
  }, [])

  const closeLeadModal = useCallback(() => setOpen(false), [])

  return (
    <LeadModalContext.Provider value={{ openLeadModal, closeLeadModal }}>
      {children}
      <LeadModal open={open} source={source} onClose={closeLeadModal} />
    </LeadModalContext.Provider>
  )
}

type LeadModalProps = {
  open: boolean
  source: string
  onClose: () => void
}

type Status = 'idle' | 'submitting' | 'success'

function LeadModal({ open, source, onClose }: LeadModalProps) {
  const titleId = useId()
  const nameRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+7')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const [status, setStatus] = useState<Status>('idle')

  // Reset form each time the modal opens; lock body scroll while it's visible.
  useEffect(() => {
    if (!open) return

    setName('')
    setPhone('+7')
    setErrors({})
    setStatus('idle')
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => nameRef.current?.focus(), 80)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const validate = () => {
    const next: { name?: string; phone?: string } = {}
    if (name.trim().length < 2) next.name = 'Укажите имя'
    if (!isValidRuPhone(phone)) next.phone = 'Введите номер полностью'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return
    if (!validate()) return

    setStatus('submitting')
    // Placeholder for CRM / API — keeps UX responsive until a backend is wired.
    await new Promise((resolve) => setTimeout(resolve, 700))
    // eslint-disable-next-line no-console
    console.log('[lead]', { name: name.trim(), phone, source })
    setStatus('success')
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Закрыть"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl border border-white/10 bg-ink-800 shadow-glass sm:rounded-3xl"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/25 blur-3xl"
            />

            <div className="relative flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
              <div>
                <span className="section-label !text-[10px]">
                  <span className="h-px w-8 bg-accent" />
                  Обратный звонок
                </span>
                <h2 id={titleId} className="mt-2 text-xl font-black uppercase tracking-tight sm:text-2xl">
                  Оставить заявку
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть форму"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-accent hover:text-accent"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative px-6 py-6 sm:px-8 sm:py-7">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center py-6 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <CheckCircle2 size={34} />
                  </span>
                  <p className="mt-5 text-xl font-extrabold uppercase tracking-tight">Заявка принята</p>
                  <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-white/55">
                    Инженер перезвонит в течение 15 минут по номеру {phone}
                  </p>
                  <button type="button" onClick={onClose} className="btn-accent mt-8 w-full">
                    Закрыть
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
                  <p className="text-sm font-light leading-relaxed text-white/50">
                    Оставьте контакты — перезвоним, согласуем замер и подготовим смету. Расчёт бесплатный.
                  </p>

                  <Field
                    label="Имя"
                    error={errors.name}
                    icon={<User size={17} className="text-accent" />}
                  >
                    <input
                      ref={nameRef}
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Как к вам обращаться"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                      }}
                      className="field-input"
                    />
                  </Field>

                  <Field
                    label="Телефон"
                    error={errors.phone}
                    icon={<Phone size={17} className="text-accent" />}
                  >
                    <input
                      type="tel"
                      name="phone"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+7 (___) ___-__-__"
                      value={phone}
                      onChange={(e) => {
                        setPhone(formatRuPhone(e.target.value))
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
                      }}
                      onFocus={() => {
                        if (phone === '' || phone === '+') setPhone('+7')
                      }}
                      className="field-input"
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-accent mt-1 w-full !py-4 disabled:cursor-wait disabled:opacity-80"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Отправляем…
                      </>
                    ) : (
                      'Отправить заявку'
                    )}
                  </button>

                  <p className="text-center text-[11px] font-light leading-relaxed text-white/35">
                    Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function Field({
  label,
  error,
  icon,
  children,
}: {
  label: string
  error?: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">{label}</span>
      <span
        className={`flex items-center gap-3 rounded-2xl border bg-black/25 px-4 transition-colors duration-300 focus-within:border-accent ${
          error ? 'border-red-400/60' : 'border-white/[0.12]'
        }`}
      >
        {icon}
        {children}
      </span>
      {error && <span className="mt-2 block text-xs font-medium text-red-400">{error}</span>}
    </label>
  )
}
