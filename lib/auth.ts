import { setToken, clearToken } from './storage'
import { AUTH_LOGIN } from './endpoints'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export async function login(email: string, password: string): Promise<void> {
  const url = `${API_BASE_URL}${AUTH_LOGIN}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  })

  if (response.status === 401) {
    throw new Error('Credenciales invalidas')
  }

  if (response.status === 422) {
    throw new Error('Faltan credenciales')
  }

  if (!response.ok) {
    console.error('[v0] Login error:', response.status, response.statusText)
    throw new Error('Error al iniciar sesion')
  }

  const data: LoginResponse = await response.json()
  setToken(data.access_token, data.token_type, data.expires_in)
}

export function logout(): void {
  clearToken()
}
