import React from "react"

// This layout exists to prevent the login page from inheriting the AdminGuard
// from the parent admin layout. It renders children without any protection.
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
