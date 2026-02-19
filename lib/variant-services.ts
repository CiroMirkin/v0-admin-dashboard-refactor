import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'
import type { ProductVariant } from '@/lib/types'
import { toast } from 'sonner'

// Update all variants for a product using Supabase directly
// This is more reliable than the backend API for handling variant updates
export const useUpdateProductVariants = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({
      productId,
      variants
    }: {
      productId: string
      variants: ProductVariant[]
    }): Promise<void> => {
      // Filter out empty labels and trim all labels
      const cleanedVariants = variants
        .map((v, index) => ({
          ...v,
          label: v.label.trim(),
          measure_value: v.measure_value?.trim() || null,
          sort_order: index
        }))
        .filter(v => v.label !== '')
      
      // Check for duplicates
      const labels = cleanedVariants.map(v => v.label.toLowerCase())
      const uniqueLabels = new Set(labels)
      if (labels.length !== uniqueLabels.size) {
        const duplicates = labels.filter((item, index) => labels.indexOf(item) !== index)
        throw new Error(`Etiquetas duplicadas detectadas: ${duplicates.join(', ')}`)
      }
      
      // Step 1: Delete all existing variants for this product
      const { error: deleteError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', productId)
      
      if (deleteError) {
        throw new Error(`Error al eliminar variantes existentes: ${deleteError.message}`)
      }
      
      // Step 2: Insert new variants if there are any
      if (cleanedVariants.length > 0) {
        const variantsToInsert = cleanedVariants.map(v => ({
          product_id: productId,
          label: v.label,
          measure_value: v.measure_value,
          price: v.price,
          stock: v.stock,
          is_default: v.is_default,
          sort_order: v.sort_order
        }))
        
        const { error: insertError } = await supabase
          .from('product_variants')
          .insert(variantsToInsert)
        
        if (insertError) {
          throw new Error(`Error al crear variantes: ${insertError.message}`)
        }
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products', variables.productId] })
      toast.success('Variantes actualizadas exitosamente')
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error al actualizar variantes')
      }
    }
  })
}

// Delete all variants for a product
export const useDeleteAllVariants = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (productId: string): Promise<void> => {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', productId)
      
      if (error) {
        throw new Error(`Error al eliminar variantes: ${error.message}`)
      }
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products', productId] })
      toast.success('Variantes eliminadas exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar variantes')
    }
  })
}
