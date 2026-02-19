'use client'

import React, { useMemo, useEffect } from 'react'
import { Plus, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { ProductVariant } from '@/lib/types'

interface ProductVariantsFormProps {
  hasVariants: boolean
  onHasVariantsChange: (hasVariants: boolean) => void
  variants: ProductVariant[]
  onVariantsChange: (variants: ProductVariant[]) => void
  disabled?: boolean
  onValidationChange?: (hasErrors: boolean) => void
}

// Initial variant template
const createEmptyVariant = (): ProductVariant => ({
  id: '',
  product_id: '',
  label: '',
  measure_value: '',
  price: 0,
  stock: 0,
  is_default: false,
  sort_order: 0,
  created_at: new Date().toISOString()
})

export function ProductVariantsForm({
  hasVariants,
  onHasVariantsChange,
  variants,
  onVariantsChange,
  disabled = false,
  onValidationChange
}: ProductVariantsFormProps) {
  
  // Check for duplicate labels
  const duplicateLabels = useMemo(() => {
    const labels = variants.map(v => v.label.trim().toLowerCase()).filter(l => l !== '')
    const duplicates: string[] = []
    const seen = new Set<string>()
    
    for (const label of labels) {
      if (seen.has(label)) {
        if (!duplicates.includes(label)) {
          duplicates.push(label)
        }
      } else {
        seen.add(label)
      }
    }
    
    return duplicates
  }, [variants])
  
  const hasDuplicates = duplicateLabels.length > 0

  // Notify parent about validation state
  useEffect(() => {
    onValidationChange?.(hasDuplicates)
  }, [hasDuplicates, onValidationChange])

  const handleToggleVariants = (checked: boolean) => {
    onHasVariantsChange(checked)
    // If enabling variants and no variants exist, add an empty one
    if (checked && variants.length === 0) {
      const newVariant = createEmptyVariant()
      newVariant.is_default = true
      onVariantsChange([newVariant])
    }
  }

  const handleAddVariant = () => {
    const newVariant = createEmptyVariant()
    newVariant.sort_order = variants.length
    // If it's the first variant, make it default
    if (variants.length === 0) {
      newVariant.is_default = true
    }
    onVariantsChange([...variants, newVariant])
  }

  const handleRemoveVariant = (index: number) => {
    let updatedVariants = variants.filter((_, i) => i !== index)
    
    // If we removed the default variant and there are still variants, make the first one default
    const removedWasDefault = variants[index]?.is_default
    if (removedWasDefault && updatedVariants.length > 0) {
      updatedVariants = updatedVariants.map((v, i) => 
        i === 0 ? { ...v, is_default: true } : v
      )
    }
    
    // Update sort orders - create new array to avoid mutation
    updatedVariants = updatedVariants.map((v, i) => ({ ...v, sort_order: i }))
    
    onVariantsChange(updatedVariants)
  }

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
    const updatedVariants = [...variants]
    if (field === 'price' || field === 'stock') {
      updatedVariants[index][field] = value === '' ? 0 : parseFloat(value)
    } else {
      (updatedVariants[index][field] as any) = value
    }
    onVariantsChange(updatedVariants)
  }

  const handleSetDefaultVariant = (index: number) => {
    const updatedVariants = variants.map((v, i) => ({
      ...v,
      is_default: i === index
    }))
    onVariantsChange(updatedVariants)
  }

  const isDuplicate = (label: string) => {
    return duplicateLabels.includes(label.trim().toLowerCase())
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="hasVariants"
            checked={hasVariants}
            onCheckedChange={handleToggleVariants}
            disabled={disabled}
          />
          <Label htmlFor="hasVariants" className="font-medium cursor-pointer">
            Este producto tiene presentaciones / medidas?
          </Label>
        </div>
        <span className="text-sm text-muted-foreground">
          {hasVariants ? 'Sí' : 'No'}
        </span>
      </div>
      
      {hasVariants && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Variantes</div>
            {hasDuplicates && (
              <div className="text-xs text-destructive font-medium">
                Hay etiquetas duplicadas
              </div>
            )}
          </div>
          
          {hasDuplicates && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-xs text-destructive">
                Las etiquetas deben ser únicas. Etiquetas duplicadas: {duplicateLabels.join(', ')}
              </p>
            </div>
          )}
          
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Etiqueta</th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Detalle <span className="text-xs">(opcional)</span></th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground w-28">Precio</th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground w-24">Stock</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground w-16">Default</th>
                  <th className="px-3 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {variants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-4 text-center text-muted-foreground">
                      No hay variantes. Agrega una para comenzar.
                    </td>
                  </tr>
                ) : (
                  variants.map((variant, index) => (
                    <tr key={variant.id || `variant-${index}`} className="border-t">
                      <td className="px-3 py-2">
                        <Input
                          value={variant.label}
                          onChange={(e) => handleVariantChange(index, 'label', e.target.value)}
                          placeholder="Ej: 40x50 - Común"
                          className={`h-8 text-sm ${isDuplicate(variant.label) ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                          disabled={disabled}
                        />
                        {isDuplicate(variant.label) && (
                          <span className="text-xs text-destructive mt-1 block">
                            Duplicado
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          value={variant.measure_value || ''}
                          onChange={(e) => handleVariantChange(index, 'measure_value', e.target.value)}
                          placeholder="Ej: Bulto (20 paquetes)"
                          className="h-8 text-sm"
                          disabled={disabled}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={variant.price === 0 ? '' : variant.price}
                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                            placeholder="0.00"
                            className="h-8 text-sm pl-6"
                            disabled={disabled}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min="0"
                          value={variant.stock === 0 ? '' : variant.stock}
                          onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                          placeholder="0"
                          className="h-8 text-sm"
                          disabled={disabled}
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <RadioGroup
                          key={`radio-group-${variant.id || index}`}
                          value={variants.findIndex(v => v.is_default).toString()}
                          onValueChange={(value) => handleSetDefaultVariant(parseInt(value))}
                          className="flex justify-center"
                        >
                          <RadioGroupItem
                            value={index.toString()}
                            id={`default-${variant.id || index}`}
                            disabled={disabled}
                          />
                        </RadioGroup>
                      </td>
                      <td className="px-3 py-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveVariant(index)}
                          disabled={disabled}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddVariant}
            disabled={disabled}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar variante
          </Button>
        </div>
      )}
    </div>
  )
}
