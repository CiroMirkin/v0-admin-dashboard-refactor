import { apiFetch } from './apiFetch'
import type { ProductImage } from '@/lib/types'

export interface LinkMediaPayload {
  image_url: string
  is_primary?: boolean
}

export interface UpdateMediaData {
  is_primary?: boolean
}

export const adminMediaApi = {
  /**
   * GET /admin/products/{productId}/media
   */
  async list(productId: string): Promise<ProductImage[]> {
    return apiFetch<ProductImage[]>(`/admin/products/${productId}/media`)
  },

  /**
   * POST /admin/products/{productId}/media/link
   */
  async link(productId: string, payload: LinkMediaPayload): Promise<ProductImage> {
    return apiFetch<ProductImage>(`/admin/products/${productId}/media/link`, {
      method: 'POST',
      body: payload,
    })
  },

  /**
   * POST /admin/products/{productId}/media/upload
   */
  async upload(productId: string, file: File): Promise<ProductImage> {
    const formData = new FormData()
    formData.append('file', file)

    return apiFetch<ProductImage>(`/admin/products/${productId}/media/upload`, {
      method: 'POST',
      body: formData,
    })
  },

  /**
   * PATCH /admin/products/{productId}/media/{mediaId}
   */
  async update(productId: string, mediaId: string, data: UpdateMediaData): Promise<ProductImage> {
    return apiFetch<ProductImage>(`/admin/products/${productId}/media/${mediaId}`, {
      method: 'PATCH',
      body: data,
    })
  },

  /**
   * PATCH /admin/products/{productId}/media/{mediaId}/primary
   */
  async setPrimary(productId: string, mediaId: string): Promise<void> {
    await apiFetch<void>(`/admin/products/${productId}/media/${mediaId}/primary`, {
      method: 'PATCH',
    })
  },

  /**
   * DELETE /admin/products/{productId}/media/{mediaId}
   */
  async remove(productId: string, mediaId: string): Promise<void> {
    await apiFetch<void>(`/admin/products/${productId}/media/${mediaId}`, {
      method: 'DELETE',
    })
  },
}
