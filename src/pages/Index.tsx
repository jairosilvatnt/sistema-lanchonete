import { useState } from 'react'
import { useStore } from '@/context/StoreContext'
import ProductCard from '@/components/ProductCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const CATEGORIES = [
  'Todos',
  'Burgers',
  'Combos',
  'Lanches',
  'Bebidas',
  'Sobremesas',
]

export default function Index() {
  const { products } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'Todos' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/90 to-red-600/90 z-10" />
        <img
          src="https://img.usecurling.com/p/1200/600?q=delicious%20burger%20restaurant"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Hero Background"
        />
        <div className="relative z-20 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Sua Fome Acaba Aqui
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Os melhores hambúrgueres artesanais, combos e porções entregues
            quentinhos na sua casa.
          </p>

          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="O que você quer comer hoje?"
              className="pl-10 h-12 rounded-full bg-white/95 border-0 text-foreground shadow-lg focus-visible:ring-2 focus-visible:ring-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Categories Ribbon */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b shadow-sm py-4">
        <div className="container mx-auto px-4">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-1">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? 'default' : 'outline'
                  }
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full px-6"
                >
                  {category}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>
      </div>

      {/* Product Grid */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          {selectedCategory === 'Todos'
            ? 'Cardápio Completo'
            : selectedCategory}
        </h2>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              Nenhum produto encontrado.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
