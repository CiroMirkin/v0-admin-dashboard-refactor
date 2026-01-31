'use client'

import { useRouter } from 'next/navigation'
import { ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTE_ADMIN_LOGIN } from '@/lib/routes'

export function NoAuth() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <ShieldX className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">No autorizado</CardTitle>
          <CardDescription>
            No tienes permisos para acceder a esta seccion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => router.push(ROUTE_ADMIN_LOGIN)} 
            className="w-full"
          >
            Volver al login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
