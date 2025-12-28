import { useState } from 'react'
import { Product } from '@/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useStore } from '@/context/StoreContext'
import { useToast } from '@/hooks/use-toast'
import { Plus } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useStore()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({ type: 'ADD_TO_CART', payload: product })
    toast({
      title: 'Adicionado ao carrinho!',
      description: `${product.name} agora está no seu pedido.`,
      duration: 2000,
    })
    setIsOpen(false)
  }

  return (
    <>
      <Card
        className="group overflow-hidden hover:shadow-elevation transition-all duration-300 cursor-pointer border-border/50 animate-fade-in-up"
        onClick={() => setIsOpen(true)}
      >
        <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <Badge variant="secondary" className="text-xs font-normal">
              {product.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            className="rounded-full shadow-sm hover:shadow-md transition-all"
            onClick={handleAddToCart}
          >
            Adicionar <Plus className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg overflow-hidden p-0 gap-0">
          <div className="aspect-video w-full overflow-hidden bg-muted relative">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-white/90">{product.category}</p>
            </div>
          </div>
          <div className="p-6">
            <DialogDescription className="text-base text-foreground mb-4">
              {product.description}
            </DialogDescription>

            <div className="bg-muted/50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-sm mb-2">
                Ingredientes Principais
              </h4>
              <p className="text-sm text-muted-foreground">
                Carne 100% bovina, queijo especial, molho da casa, pão fresco.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </div>
              <Button size="lg" onClick={handleAddToCart} className="px-8">
                Adicionar ao Pedido
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
