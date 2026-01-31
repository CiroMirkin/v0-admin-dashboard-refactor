import { apiFetch } from './apiFetch'
import type { Product, ProductWithImages } from '@/lib/types'

export interface CreateProductData {
  name: string
  description: string
  price: number
  stock: number
  is_published: boolean
  is_featured: boolean
}

export interface UpdateProductData {
  name?: string
  description?: string
  price?: number
  stock?: number
  is_published?: boolean
  is_featured?: boolean
}

export const adminProductsApi = {
  /**
   * GET /admin/products
   */
  async list(): Promise<ProductWithImages[]> {
    return apiFetch<ProductWithImages[]>('/admin/products')
  },

  /**
   * POST /admin/products
   */
  async create(data: CreateProductData): Promise<Product> {
    return apiFetch<Product>('/admin/products', {
      method: 'POST',
      body: data,
    })
  },

  /**
   * PATCH /admin/products/{productId}
   */
  async update(productId: string, data: UpdateProductData): Promise<Product> {
    return apiFetch<Product>(`/admin/products/${productId}`, {
      method: 'PATCH',
      body: data,
    })
  },

  /**
   * DELETE /admin/products/{productId}
   */
  async remove(productId: string): Promise<void> {
    await apiFetch<void>(`/admin/products/${productId}`, {
      method: 'DELETE',
    })
  },

  /**
   * PATCH /admin/products/{productId}/featured
   */
  async setFeatured(productId: string, featured: boolean): Promise<void> {
    await apiFetch<void>(`/admin/products/${productId}/featured`, {
      method: 'PATCH',
      body: { featured },
    })
  },
}
