import { useState } from 'react'
import { useStore } from '@/context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { CreditCard, Banknote, ArrowRight, Loader2 } from 'lucide-react'
import { Order } from '@/types'

export default function Checkout() {
  const { cart, dispatch, calculateETA } = useStore()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('credit')
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    notes: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
  })

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cart.length === 0) {
      toast({
        title: 'Erro',
        description: 'Seu carrinho está vazio.',
        variant: 'destructive',
      })
      return
    }

    if (!formData.name || !formData.address || !formData.phone) {
      toast({
        title: 'Atenção',
        description: 'Preencha os dados de entrega.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      items: [...cart],
      total: total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      customerName: formData.name,
      customerAddress: formData.address,
      estimatedTime: calculateETA(),
    }

    dispatch({ type: 'CREATE_ORDER', payload: newOrder })
    dispatch({ type: 'CLEAR_CART' })

    setLoading(false)
    toast({
      title: 'Pedido Realizado com Sucesso!',
      description: 'Acompanhe o status da entrega.',
      className: 'bg-success text-success-foreground',
    })

    navigate(`/tracking/${newOrder.id}`)
  }

  if (cart.length === 0) {
    return (
      <div className="container max-w-lg mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
        <Button onClick={() => navigate('/')}>Voltar para o Menu</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
        Finalizar Pedido
      </h1>

      <form onSubmit={handlePayment} className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Delivery & Payment */}
        <div className="space-y-8">
          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle>Dados de Entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Endereço de Entrega</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Rua, Número, Bairro"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(00) 00000-0000"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Ex: Tirar cebola, campainha quebrada..."
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                defaultValue="credit"
                onValueChange={setPaymentMethod}
                className="grid grid-cols-2 gap-4 mb-6"
              >
                <div>
                  <RadioGroupItem
                    value="credit"
                    id="credit"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="credit"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                  >
                    <CreditCard className="mb-3 h-6 w-6" />
                    Cartão
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="pix"
                    id="pix"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="pix"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                  >
                    <Banknote className="mb-3 h-6 w-6" />
                    PIX
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'credit' ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 rounded-xl shadow-xl mb-6">
                    <div className="flex justify-between items-center mb-8">
                      <div className="w-12 h-8 bg-yellow-500/80 rounded-md"></div>
                      <span className="text-xl font-mono tracking-widest">
                        VISA
                      </span>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-gray-400">Número do Cartão</p>
                      <p className="text-xl font-mono tracking-widest">
                        {formData.cardNumber || '•••• •••• •••• ••••'}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Nome</p>
                        <p className="font-medium uppercase">
                          {formData.cardName || 'SEU NOME'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Validade</p>
                        <p className="font-mono">
                          {formData.cardExpiry || 'MM/AA'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Número do Cartão</Label>
                    <Input
                      name="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Validade</Label>
                      <Input
                        name="cardExpiry"
                        placeholder="MM/AA"
                        maxLength={5}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>CVV</Label>
                      <Input
                        name="cardCvv"
                        placeholder="123"
                        maxLength={4}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Nome no Cartão</Label>
                    <Input
                      name="cardName"
                      placeholder="Como impresso no cartão"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 animate-fade-in">
                  <div className="w-48 h-48 bg-muted mx-auto mb-4 rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">
                      QR CODE PIX
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Escaneie o QR Code para pagar.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-8">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
              <CardDescription>
                Confira seus itens antes de finalizar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>

                <Button
                  className="w-full mt-6 text-lg h-12"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Pagar e Finalizar <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
