import { ShoppingCart, Clock, Truck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface KPICardsProps {
  stats: {
    newOrders: number
    pendingPayment: number
    pendingShipment: number
  }
}

export function KPICards({ stats }: KPICardsProps) {
  const cards = [
    {
      title: 'Pedidos nuevos',
      value: stats.newOrders,
      description: 'Sin contactar',
      icon: ShoppingCart,
      highlight: stats.newOrders > 0,
    },
    {
      title: 'Pendientes de pago',
      value: stats.pendingPayment,
      description: 'Esperando confirmación',
      icon: Clock,
      highlight: stats.pendingPayment > 0,
    },
    {
      title: 'Pendientes de envío',
      value: stats.pendingShipment,
      description: 'Pagados, listos para enviar',
      icon: Truck,
      highlight: stats.pendingShipment > 0,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} className={card.highlight ? 'border-primary/50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-5 w-5 ${card.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${card.highlight ? 'text-foreground' : 'text-foreground'}`}>
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
