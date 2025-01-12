import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="auth bg-gradient-to-r from-gray-100 to-teal-200">{children}</main>
  )
}

export default Layout