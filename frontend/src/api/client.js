// Em produção (Vercel): aponta para o Railway via VITE_API_URL
// Em dev/Docker: usa proxy local do Vite
const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const getToken = () => localStorage.getItem('miniusadas_token')

async function request(method, path, body, options = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: options.multipart ? { Authorization: `Bearer ${token}` } : headers,
    body: options.multipart ? body : (body ? JSON.stringify(body) : undefined),
  })

  if (res.status === 401) {
    localStorage.removeItem('miniusadas_token')
    localStorage.removeItem('miniusadas_user')
    window.location.href = '/entrar'
    return
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Erro ${res.status}`)
  return data
}

export const api = {
  get:    (path)         => request('GET',    path),
  post:   (path, body)   => request('POST',   path, body),
  patch:  (path, body)   => request('PATCH',  path, body),
  delete: (path)         => request('DELETE', path),
  upload: (path, formData) => request('POST', path, formData, { multipart: true }),
}
