import { Link } from 'react-router-dom'
import { ShoppingBag, UtensilsCrossed, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/context/StoreContext'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { cart, dispatch } = useStore()
  const [animate, setAnimate] = useState(false)

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    if (cartCount > 0) {
      setAnimate(true)
      const timer = setTimeout(() => setAnimate(false), 500)
      return () => clearTimeout(timer)
    }
  }, [cartCount])

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground hidden sm:inline-block">
            Lanchonete Express
          </span>
        </Link>

        {/* Center Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Cardápio
          </Link>
          <Link
            to="/admin/orders"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Acompanhar Pedidos (Admin)
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link to="/admin/products">
            <Button variant="ghost" size="icon" title="Admin">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>

          <Button
            variant="outline"
            className={cn(
              'relative rounded-full border-primary/20 hover:bg-primary/10',
              animate && 'animate-bounce-short',
            )}
            onClick={() => dispatch({ type: 'TOGGLE_CART', payload: true })}
          >
            <ShoppingBag className="h-5 w-5 text-primary" />
            {cartCount > 0 && (
              <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-primary p-0 flex items-center justify-center text-[10px] text-primary-foreground">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </nav>
  )
}
