import { useState } from 'react'
import { useStore } from '@/context/StoreContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Product } from '@/types'

export default function AdminProducts() {
  const { products, dispatch } = useStore()
  const { toast } = useToast()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({})
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  const handleEdit = (product: Product) => {
    setCurrentProduct(product)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setCurrentProduct({
      name: '',
      description: '',
      price: 0,
      category: 'Burgers',
      image: 'https://img.usecurling.com/p/400/300?q=food',
    })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!currentProduct.name || !currentProduct.price) {
      toast({
        title: 'Erro',
        description: 'Preencha os campos obrigatórios',
        variant: 'destructive',
      })
      return
    }

    if (currentProduct.id) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: currentProduct as Product })
      toast({ title: 'Sucesso', description: 'Produto atualizado.' })
    } else {
      const newProduct = {
        ...currentProduct,
        id: Math.random().toString(36).substr(2, 9),
      } as Product
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct })
      toast({ title: 'Sucesso', description: 'Produto criado.' })
    }
    setIsModalOpen(false)
  }

  const confirmDelete = (id: string) => {
    setProductToDelete(id)
    setIsDeleteAlertOpen(true)
  }

  const handleDelete = () => {
    if (productToDelete) {
      dispatch({ type: 'DELETE_PRODUCT', payload: productToDelete })
      toast({ title: 'Sucesso', description: 'Produto removido.' })
      setIsDeleteAlertOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Novo Produto
        </Button>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => confirmDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentProduct.id ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={currentProduct.name || ''}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={currentProduct.category}
                onValueChange={(val) =>
                  setCurrentProduct({ ...currentProduct, category: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Burgers">Burgers</SelectItem>
                  <SelectItem value="Combos">Combos</SelectItem>
                  <SelectItem value="Lanches">Lanches</SelectItem>
                  <SelectItem value="Bebidas">Bebidas</SelectItem>
                  <SelectItem value="Sobremesas">Sobremesas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={currentProduct.price || ''}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    price: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={currentProduct.description || ''}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                value={currentProduct.image || ''}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    image: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              produto do catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
