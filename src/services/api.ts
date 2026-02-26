import axios, { type AxiosPromise } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://production-optimizer-back.onrender.com/api' 
    : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Types ────────────────────────────────────────────────────────
export interface Material {
  id?: string
  name: string
  stockQuantity: number
}

export interface CompositionItem {
  rawMaterialId: string
  quantity: number
}

export interface Product {
  id?: string
  name: string
  salePrice: number
  composition: CompositionItem[]
}

export interface ProductionSuggestion {
  product: Product
  quantity: number
}

export interface OptimizationResult {
  totalProjectedValue: number
  productionSuggestions: ProductionSuggestion[]
}

// ── Materials (Raw Materials / Insumos) ──────────────────────────
export const getMaterials = (): AxiosPromise<Material[]> => api.get('/materials')
export const createMaterial = (data: Omit<Material, 'id'>): AxiosPromise<Material> => api.post('/materials', data)
export const updateMaterial = (id: string, data: Omit<Material, 'id'>): AxiosPromise<Material> => api.put(`/materials/${id}`, data)
export const deleteMaterial = (id: string): AxiosPromise<void> => api.delete(`/materials/${id}`)

// ── Products ─────────────────────────────────────────────────────
export const getProducts = (): AxiosPromise<Product[]> => api.get('/products')
export const createProduct = (data: Omit<Product, 'id'>): AxiosPromise<Product> => api.post('/products', data)
export const deleteProduct = (id: string): AxiosPromise<void> => api.delete(`/products/${id}`)

// ── Optimization ─────────────────────────────────────────────────
export const runOptimization = (): AxiosPromise<OptimizationResult> => api.get('/optimization/optimize')

export default api
