'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowRight } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect common login mistakes
    const currentPath = window.location.pathname
    
    if (currentPath === '/login/admin' || currentPath === '/login') {
      console.log('🔄 Redirigiendo ruta incorrecta:', currentPath, '→ /admin/login')
      router.replace('/admin/login')
      return
    }
    
    if (currentPath === '/admin/login/') {
      console.log('🔄 Removiendo slash extra:', currentPath, '→ /admin/login')
      router.replace('/admin/login')
      return
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Página no encontrada</CardTitle>
          <CardDescription>
            La página que buscas no existe o fue movida
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>¿Buscando el panel de administración?</strong>
            </p>
            <p className="text-xs">
              Las rutas correctas son:
            </p>
            <div className="mt-2 space-y-1 text-xs font-mono bg-muted p-2 rounded">
              <div>• /admin/login</div>
              <div>• /admin</div>
              <div>• /admin/products</div>
              <div>• /admin/orders</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => router.push('/admin/login')}
              className="w-full"
            >
              Ir al Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              Página Principal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}