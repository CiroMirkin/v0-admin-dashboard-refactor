'use client'

import { useState } from 'react'
import { MessageCircle, MapPin, CreditCard, Truck, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { OrderWithCustomer } from '@/lib/types'
import { formatCurrency, formatDateTime, getWhatsAppLink, getWhatsAppLinkWithCustomMessage } from '@/lib/format'
import { PaymentStatusBadge, OrderStatusBadge } from './status-badges'
import { toast } from 'sonner'

interface OrderSheetProps {
  order: OrderWithCustomer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onMarkAsPaid: (order: OrderWithCustomer) => void
  onMarkAsShipped: (order: OrderWithCustomer) => void
  onOrderUpdate?: () => void
}

export function OrderSheet({
  order,
  open,
  onOpenChange,
  onMarkAsPaid,
  onMarkAsShipped,
  onOrderUpdate,
}: OrderSheetProps) {
  const [notes, setNotes] = useState(order?.notes || '')
  const [whatsappMessage, setWhatsappMessage] = useState('')
  const [copied, setCopied] = useState(false)

  // Reset state when order changes
  if (order && notes !== (order.notes || '') && !open) {
    setNotes(order.notes || '')
  }

  if (!order) return null

  const defaultMessage = `Hola ${order.customer.name}, recibimos tu pedido #${order.order_number} por ${formatCurrency(order.total_amount)}. Coordinamos el pago por acá.`

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(order.customer.phone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Teléfono copiado')
  }

  const handleSaveNotes = () => {
    // In production, this would update the database
    toast.success('Notas guardadas')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-1">
          <div className="flex items-center gap-3">
            <SheetTitle className="text-xl">{order.order_number}</SheetTitle>
            <PaymentStatusBadge status={order.payment_status} />
            <OrderStatusBadge status={order.order_status} />
          </div>
          <p className="text-sm text-muted-foreground">
            Creado el {formatDateTime(order.created_at)}
          </p>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Customer Info */}
          <section>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Cliente</h3>
            <div className="rounded-lg border p-4 space-y-3">
              <div>
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">{order.customer.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={handleCopyPhone}
                >
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {order.customer.phone}
                </Button>
                <Button size="sm" asChild>
                  <a
                    href={getWhatsAppLink(
                      order.customer.phone,
                      order.customer.name,
                      order.order_number,
                      order.total_amount
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          {order.shipping_address && (
            <section>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Dirección de envío</h3>
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p className="text-sm">{order.shipping_address}</p>
                </div>
              </div>
            </section>
          )}

          {/* Order Items */}
          <section>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Productos</h3>
            <div className="rounded-lg border divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x {formatCurrency(item.unit_price)}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(item.quantity * item.unit_price)}
                  </p>
                </div>
              ))}
              <div className="p-4 flex justify-between items-center bg-muted/50">
                <p className="font-semibold">Total</p>
                <p className="font-semibold text-lg">{formatCurrency(order.total_amount)}</p>
              </div>
            </div>
          </section>

          {/* WhatsApp Custom Message */}
          <section>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Mensaje de WhatsApp</h3>
            <div className="space-y-2">
              <Textarea
                placeholder={defaultMessage}
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                rows={3}
              />
              <Button asChild className="w-full">
                <a
                  href={getWhatsAppLinkWithCustomMessage(
                    order.customer.phone,
                    whatsappMessage || defaultMessage
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar mensaje personalizado
                </a>
              </Button>
            </div>
          </section>

          {/* Internal Notes */}
          <section>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Notas internas</h3>
            <div className="space-y-2">
              <Textarea
                placeholder="Agregar notas sobre este pedido..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
              <Button variant="outline" size="sm" onClick={handleSaveNotes}>
                Guardar notas
              </Button>
            </div>
          </section>

          {/* Timeline / Audit Log */}
          {order.events && order.events.length > 0 && (
            <section>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Historial</h3>
              <div className="rounded-lg border p-4">
                <div className="space-y-4">
                  {order.events.map((event, index) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {index < order.events!.length - 1 && (
                          <div className="w-px h-full bg-border mt-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium">{event.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(event.created_at)} - {event.created_by}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <Separator />

          {/* Actions */}
          <section className="space-y-2">
            <Button
              className="w-full"
              onClick={() => onMarkAsPaid(order)}
              disabled={order.payment_status === 'paid'}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Marcar como pagado
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => onMarkAsShipped(order)}
              disabled={order.payment_status !== 'paid' || order.order_status === 'shipped' || order.order_status === 'delivered'}
            >
              <Truck className="h-4 w-4 mr-2" />
              Marcar como enviado
            </Button>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
