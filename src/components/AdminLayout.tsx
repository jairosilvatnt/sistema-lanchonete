import { Outlet, NavLink } from 'react-router-dom'
import { Package, ShoppingBag, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminLayout() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full flex-col md:flex-row bg-muted/20">
      <aside className="w-full md:w-64 border-r bg-sidebar p-4">
        <div className="mb-6 px-2">
          <h2 className="text-lg font-bold text-sidebar-foreground">
            Painel Admin
          </h2>
        </div>
        <nav className="space-y-1">
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive
                  ? 'bg-sidebar-accent text-primary'
                  : 'text-muted-foreground',
              )
            }
          >
            <Package className="h-4 w-4" />
            Produtos
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive
                  ? 'bg-sidebar-accent text-primary'
                  : 'text-muted-foreground',
              )
            }
          >
            <ShoppingBag className="h-4 w-4" />
            Pedidos
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
