'use client'

import Link from 'next/link'
import { ExternalLink, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { OrderWithCustomer } from '@/lib/types'
import { formatCurrency, formatDate, getWhatsAppLink } from '@/lib/format'
import { PaymentStatusBadge, OrderStatusBadge } from '@/components/admin/orders/status-badges'

interface RecentOrdersTableProps {
  orders: OrderWithCustomer[]
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const recentOrders = orders.slice(0, 5)

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">Pedidos recientes</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders" className="flex items-center gap-1">
            Ver todos
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No hay pedidos recientes
              </TableCell>
            </TableRow>
          ) : (
            recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_number}</TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                <TableCell>
                  <PaymentStatusBadge status={order.payment_status} />
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.order_status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8"
                  >
                    <a
                      href={getWhatsAppLink(
                        order.customer.phone,
                        order.customer.name,
                        order.order_number,
                        order.total_amount
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Contactar por WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
