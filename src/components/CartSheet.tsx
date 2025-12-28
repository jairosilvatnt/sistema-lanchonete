import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useStore } from '@/context/StoreContext'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CartSheet() {
  const { cart, isCartOpen, dispatch } = useStore()
  const navigate = useNavigate()

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const handleOpenChange = (open: boolean) => {
    dispatch({ type: 'TOGGLE_CART', payload: open })
  }

  const handleCheckout = () => {
    dispatch({ type: 'TOGGLE_CART', payload: false })
    navigate('/checkout')
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-md">
        <SheetHeader className="px-1">
          <SheetTitle>Seu Carrinho</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 pr-6">
          {cart.length === 0 ? (
            <div className="flex h-[50vh] flex-col items-center justify-center space-y-2 text-center">
              <div className="text-4xl">🛒</div>
              <h3 className="font-semibold text-lg">Seu carrinho está vazio</h3>
              <p className="text-sm text-muted-foreground">
                Adicione alguns lanches deliciosos!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-md border">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="grid gap-1">
                      <h4 className="font-semibold line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          dispatch({
                            type: 'UPDATE_CART_QUANTITY',
                            payload: {
                              id: item.id,
                              quantity: item.quantity - 1,
                            },
                          })
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-4 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          dispatch({
                            type: 'UPDATE_CART_QUANTITY',
                            payload: {
                              id: item.id,
                              quantity: item.quantity + 1,
                            },
                          })
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <div className="ml-auto">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() =>
                            dispatch({
                              type: 'REMOVE_FROM_CART',
                              payload: item.id,
                            })
                          }
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        {cart.length > 0 && (
          <div className="grid gap-4 pr-6 pb-6 pt-4">
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <SheetClose asChild>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Finalizar Pedido
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
