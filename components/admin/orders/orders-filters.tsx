'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { PaymentStatus, OrderStatus } from '@/lib/types'

interface OrdersFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  paymentStatus: PaymentStatus | 'all'
  onPaymentStatusChange: (value: PaymentStatus | 'all') => void
  orderStatus: OrderStatus | 'all'
  onOrderStatusChange: (value: OrderStatus | 'all') => void
  onReset: () => void
}

export function OrdersFilters({
  search,
  onSearchChange,
  paymentStatus,
  onPaymentStatusChange,
  orderStatus,
  onOrderStatusChange,
  onReset,
}: OrdersFiltersProps) {
  const hasFilters = search || paymentStatus !== 'all' || orderStatus !== 'all'

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por cliente o número..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Payment Status */}
      <Select value={paymentStatus} onValueChange={(v) => onPaymentStatusChange(v as PaymentStatus | 'all')}>
        <SelectTrigger className="w-full md:w-[160px]">
          <SelectValue placeholder="Estado de pago" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los pagos</SelectItem>
          <SelectItem value="pending">Pendiente</SelectItem>
          <SelectItem value="paid">Pagado</SelectItem>
        </SelectContent>
      </Select>

      {/* Order Status */}
      <Select value={orderStatus} onValueChange={(v) => onOrderStatusChange(v as OrderStatus | 'all')}>
        <SelectTrigger className="w-full md:w-[160px]">
          <SelectValue placeholder="Estado del pedido" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="new">Nuevo</SelectItem>
          <SelectItem value="contacted">Contactado</SelectItem>
          <SelectItem value="paid">Pagado</SelectItem>
          <SelectItem value="shipped">Enviado</SelectItem>
          <SelectItem value="delivered">Entregado</SelectItem>
          <SelectItem value="canceled">Cancelado</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="h-4 w-4 mr-1" />
          Limpiar
        </Button>
      )}
    </div>
  )
}
