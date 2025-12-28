/* Layout Component - A component that wraps the main content of the app */

import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartSheet from './CartSheet'

export default function Layout() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      <CartSheet />
    </div>
  )
}
