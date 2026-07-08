import { api } from './client'

// ── Auth ─────────────────────────────────────
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
}

// ── Listagens (público) ───────────────────────
export const listingsApi = {
  list:   (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString()
    return api.get(`/listings${qs ? '?' + qs : ''}`)
  },
  getById: (id)         => api.get(`/listings/${id}`),
  lead:    (id, data)   => api.post(`/listings/${id}/leads`, data),
}

// ── Concessionária ────────────────────────────
export const dealerApi = {
  myListings:    ()          => api.get('/dealer/listings'),
  create:        (data)      => api.post('/dealer/listings', data),
  submit:        (id)        => api.patch(`/dealer/listings/${id}/submit`),
  pause:         (id)        => api.patch(`/dealer/listings/${id}/pause`),
  markSold:      (id)        => api.patch(`/dealer/listings/${id}/sold`),
  remove:        (id)        => api.delete(`/dealer/listings/${id}`),
  uploadPhotos:  (id, form)  => api.upload(`/dealer/listings/${id}/photos`, form),
  deletePhoto:   (photoId)   => api.delete(`/dealer/photos/${photoId}`),
}

// ── Admin YANMAR ──────────────────────────────
export const adminApi = {
  listings: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString()
    return api.get(`/admin/listings${qs ? '?' + qs : ''}`)
  },
  getById: (id)           => api.get(`/admin/listings/${id}`),
  approve: (id)           => api.patch(`/admin/listings/${id}/approve`),
  reject:  (id, reason)   => api.patch(`/admin/listings/${id}/reject`, { reason }),
}
