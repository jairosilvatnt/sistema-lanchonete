import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 text-muted-foreground">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-sm font-semibold text-foreground">
            Lanchonete Express
          </h3>
          <p className="text-xs">O melhor sabor da cidade.</p>
        </div>

        <div className="flex gap-4">
          <a href="#" className="hover:text-primary transition-colors">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            <Twitter className="h-5 w-5" />
          </a>
        </div>

        <div className="text-xs text-center md:text-right">
          <p>© 2024 Lanchonete Express.</p>
          <p>Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
