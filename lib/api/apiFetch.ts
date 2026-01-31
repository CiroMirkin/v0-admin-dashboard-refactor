const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown> | FormData | string
  skipAuth?: boolean
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`API Error: ${status} ${statusText}`)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { body, skipAuth = false, headers: customHeaders, ...restOptions } = options

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  }

  // Add auth token if not skipped
  if (!skipAuth && typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  // Handle body serialization
  let processedBody: string | FormData | undefined

  if (body !== undefined) {
    if (body instanceof FormData) {
      // Don't set Content-Type for FormData - browser will set it with boundary
      processedBody = body
    } else if (typeof body === 'string') {
      // Already a string (e.g., URLSearchParams)
      processedBody = body
    } else {
      // JSON object
      headers['Content-Type'] = 'application/json'
      processedBody = JSON.stringify(body)
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers,
    body: processedBody,
  })

  // Handle auth errors - logout and redirect
  if (response.status === 401 || response.status === 403) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      window.location.assign('/login')
    }
    throw new ApiError(response.status, response.statusText)
  }

  if (!response.ok) {
    let errorData: unknown
    try {
      errorData = await response.json()
    } catch {
      errorData = null
    }
    throw new ApiError(response.status, response.statusText, errorData)
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    return {} as T
  }

  return response.json()
}
