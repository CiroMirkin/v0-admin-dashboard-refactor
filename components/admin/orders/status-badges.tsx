import { Badge } from '@/components/ui/badge'
import type { PaymentStatus, OrderStatus } from '@/lib/types'

interface PaymentStatusBadgeProps {
  status: PaymentStatus
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  if (status === 'paid') {
    return (
      <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
        Pagado
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="text-muted-foreground">
      Pendiente
    </Badge>
  )
}

interface OrderStatusBadgeProps {
  status: OrderStatus
}

const orderStatusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  new: { label: 'Nuevo', variant: 'outline' },
  contacted: { label: 'Contactado', variant: 'secondary' },
  paid: { label: 'Pagado', variant: 'default' },
  shipped: { label: 'Enviado', variant: 'secondary' },
  delivered: { label: 'Entregado', variant: 'secondary' },
  canceled: { label: 'Cancelado', variant: 'destructive' },
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = orderStatusConfig[status]

  if (status === 'paid') {
    return (
      <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
        {config.label}
      </Badge>
    )
  }

  if (status === 'new') {
    return (
      <Badge variant="outline" className="border-primary text-primary">
        {config.label}
      </Badge>
    )
  }

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  )
}
