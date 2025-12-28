import { useParams } from 'react-router-dom'
import { useStore } from '@/context/StoreContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, Clock, Truck, ChefHat, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

const STATUS_STEPS = [
  { id: 'pending', label: 'Recebido', icon: Clock },
  { id: 'preparing', label: 'Preparando', icon: ChefHat },
  { id: 'delivering', label: 'Saiu para Entrega', icon: Truck },
  { id: 'delivered', label: 'Entregue', icon: CheckCircle2 },
]

export default function Tracking() {
  const { orderId } = useParams()
  const { orders, calculateETA } = useStore()
  const [eta, setEta] = useState(0)

  const order = orders.find((o) => o.id === orderId)

  useEffect(() => {
    // Update ETA every minute or when state changes
    setEta(calculateETA())
    const interval = setInterval(() => setEta(calculateETA()), 60000)
    return () => clearInterval(interval)
  }, [orders, calculateETA])

  if (!order) {
    return <div className="p-20 text-center">Pedido não encontrado.</div>
  }

  const currentStepIndex = STATUS_STEPS.findIndex(
    (step) => step.id === order.status,
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8 text-center">
        <Badge variant="outline" className="mb-2">
          Pedido #{order.id}
        </Badge>
        <h1 className="text-3xl font-bold">Acompanhe seu Pedido</h1>
        {order.status !== 'delivered' && (
          <p className="text-muted-foreground mt-2">
            Previsão de entrega:{' '}
            <span className="font-bold text-primary">{eta} min</span>
          </p>
        )}
      </div>

      {/* Status Timeline */}
      <div className="mb-12 relative flex justify-between items-center w-full px-2">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 transition-all duration-500"
          style={{
            width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
          }}
        />

        {STATUS_STEPS.map((step, index) => {
          const Icon = step.icon
          const isActive = index <= currentStepIndex
          const isCurrent = index === currentStepIndex

          return (
            <div
              key={step.id}
              className="flex flex-col items-center bg-background px-2"
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300',
                  isActive
                    ? 'bg-primary border-primary text-white'
                    : 'bg-muted border-muted text-muted-foreground',
                  isCurrent &&
                    'ring-4 ring-primary/20 animate-pulse-subtle scale-110',
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={cn(
                  'mt-2 text-xs md:text-sm font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-muted-foreground">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>R$ {order.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço de Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  {order.customerAddress}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
