import { useStore } from '@/context/StoreContext'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OrderStatus } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

export default function AdminOrders() {
  const { orders, dispatch } = useStore()
  const { toast } = useToast()

  const handleStatusChange = (id: string, status: OrderStatus) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } })
    toast({
      title: 'Status Atualizado',
      description: `Pedido ${id} alterado para ${status}.`,
    })
  }

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'preparing':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'delivering':
        return 'bg-purple-500 hover:bg-purple-600'
      case 'delivered':
        return 'bg-green-500 hover:bg-green-600'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Fila de Pedidos</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedOrders.map((order) => (
          <Card key={order.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{order.id}</CardTitle>
                  <CardDescription>
                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pb-3">
              <div className="mb-4">
                <p className="font-semibold">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  {order.customerAddress}
                </p>
              </div>
              <div className="space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between font-bold">
                <span>Total</span>
                <span>R$ {order.total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 pt-4">
              <Select
                defaultValue={order.status}
                onValueChange={(val) =>
                  handleStatusChange(order.id, val as OrderStatus)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Atualizar Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Recebido</SelectItem>
                  <SelectItem value="preparing">Preparando</SelectItem>
                  <SelectItem value="delivering">Em Entrega</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                </SelectContent>
              </Select>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
