import { useState } from 'react'
import type { FormEvent } from 'react'

interface AuthPageProps {
  onSignIn: (email: string, password: string) => Promise<{ error: string | null }>
  onSignUp: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>
}

type Mode = 'login' | 'register'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AuthPage({ onSignIn, onSignUp }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function switchMode(nextMode: Mode) {
    setMode(nextMode)
    setError('')
    setInfo('')
    setPassword('')
    setPasswordConfirm('')
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setInfo('')

    if (!EMAIL_PATTERN.test(email)) {
      setError('Lütfen geçerli bir e-posta adresi girin.')
      return
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.')
      return
    }
    if (mode === 'register' && password !== passwordConfirm) {
      setError('Şifreler eşleşmiyor.')
      return
    }

    setSubmitting(true)
    if (mode === 'login') {
      const { error: signInError } = await onSignIn(email, password)
      setSubmitting(false)
      if (signInError) setError(signInError)
      return
    }

    const { error: signUpError, needsEmailConfirmation } = await onSignUp(
      email,
      password,
    )
    setSubmitting(false)
    if (signUpError) {
      setError(signUpError)
      return
    }
    if (needsEmailConfirmation) {
      setInfo('Kayıt başarılı! E-postanızı kontrol edip hesabınızı onaylayın.')
    }
  }

  return (
    <div className="panel">
      <h2>{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
      <form className="transaction-form" onSubmit={handleSubmit} noValidate>
        <label>
          E-posta
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@eposta.com"
          />
        </label>

        <label>
          Şifre
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="En az 6 karakter"
          />
        </label>

        {mode === 'register' && (
          <label>
            Şifre (tekrar)
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Şifrenizi tekrar girin"
            />
          </label>
        )}

        {error && <p className="form-error">{error}</p>}
        {info && <p>{info}</p>}

        <div className="form-actions">
          <button type="submit" className="primary" disabled={submitting}>
            {submitting
              ? 'Gönderiliyor…'
              : mode === 'login'
                ? 'Giriş Yap'
                : 'Kayıt Ol'}
          </button>
        </div>
      </form>

      {mode === 'login' ? (
        <p>
          Hesabın yok mu?{' '}
          <button type="button" onClick={() => switchMode('register')}>
            Kayıt ol
          </button>
        </p>
      ) : (
        <p>
          Zaten hesabın var mı?{' '}
          <button type="button" onClick={() => switchMode('login')}>
            Giriş yap
          </button>
        </p>
      )}
    </div>
  )
}
