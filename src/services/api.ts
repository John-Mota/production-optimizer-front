import axios, { type AxiosPromise } from 'axios'

const api = axios.create({
  // baseURL: 'http://localhost:8080/api',
  baseURL: 'https://production-optimizer-back.onrender.com/api',
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
  product?: Product
  productName?: string
  unitPrice?: number
  quantity: number
}

export interface OptimizationResult {
  totalProjectedValue: number
  productionSuggestions: ProductionSuggestion[]
}

// ── Materials (Raw Materials / Insumos) ──────────────────────────
export const getMaterials = (): AxiosPromise<Material[]> => api.get('/raw-materials')
export const createMaterial = (data: Omit<Material, 'id'>): AxiosPromise<Material> => api.post('/raw-materials', data)
export const updateMaterial = (id: string, data: Omit<Material, 'id'>): AxiosPromise<Material> => api.put(`/raw-materials/${id}`, data)
export const deleteMaterial = (id: string): AxiosPromise<void> => api.delete(`/raw-materials/${id}`)

// ── Products ─────────────────────────────────────────────────────
export const getProducts = (): AxiosPromise<Product[]> => api.get('/products')
export const createProduct = (data: Omit<Product, 'id'>): AxiosPromise<Product> => api.post('/products', data)
export const deleteProduct = (id: string): AxiosPromise<void> => api.delete(`/products/${id}`)

// ── Optimization ─────────────────────────────────────────────────
export const runOptimization = (): AxiosPromise<OptimizationResult> => api.get('/optimization')

export default api
