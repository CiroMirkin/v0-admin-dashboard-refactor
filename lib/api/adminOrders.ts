import { apiFetch } from './apiFetch'
import type { OrderWithCustomer } from '@/lib/types'

export const adminOrdersApi = {
  /**
   * GET /admin/orders
   */
  async list(): Promise<OrderWithCustomer[]> {
    return apiFetch<OrderWithCustomer[]>('/admin/orders')
  },

  /**
   * GET /admin/orders/{orderId}
   */
  async detail(orderId: string): Promise<OrderWithCustomer> {
    return apiFetch<OrderWithCustomer>(`/admin/orders/${orderId}`)
  },

  /**
   * PATCH /admin/orders/{orderId}/mark-paid
   */
  async markPaid(orderId: string): Promise<void> {
    await apiFetch<void>(`/admin/orders/${orderId}/mark-paid`, {
      method: 'PATCH',
    })
  },

  /**
   * PATCH /admin/orders/{orderId}/mark-shipped
   */
  async markShipped(orderId: string): Promise<void> {
    await apiFetch<void>(`/admin/orders/${orderId}/mark-shipped`, {
      method: 'PATCH',
    })
  },
}
