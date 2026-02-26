import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getProducts,
  createProduct,
  deleteProduct,
  runOptimization,
} from '../services/api'

vi.mock('axios', () => {
  const instance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
  return {
    default: {
      create: vi.fn(() => instance),
      __instance: instance,
    },
  }
})

const getAxiosInstance = () => (axios as any).__instance ?? (axios.create as any)()

describe('API Service', () => {
  let instance: any

  beforeEach(() => {
    instance = getAxiosInstance()
    vi.clearAllMocks()
  })

  describe('Materials', () => {
    it('getMaterials calls GET /materials', async () => {
      const mockData = [{ id: '1', name: 'Steel', stockQuantity: 100 }]
      instance.get.mockResolvedValue({ data: mockData })

      const result = await getMaterials()

      expect(instance.get).toHaveBeenCalledWith('/materials')
      expect(result.data).toEqual(mockData)
    })

    it('createMaterial calls POST /materials with data', async () => {
      const newMaterial = { name: 'Iron', stockQuantity: 50 }
      instance.post.mockResolvedValue({ data: { id: '2', ...newMaterial } })

      const result = await createMaterial(newMaterial)

      expect(instance.post).toHaveBeenCalledWith('/materials', newMaterial)
      expect(result.data.id).toBe('2')
    })

    it('updateMaterial calls PUT /materials/:id with data', async () => {
      const updated = { name: 'Steel Updated', stockQuantity: 200 }
      instance.put.mockResolvedValue({ data: { id: '1', ...updated } })

      const result = await updateMaterial('1', updated)

      expect(instance.put).toHaveBeenCalledWith('/materials/1', updated)
      expect(result.data.name).toBe('Steel Updated')
    })

    it('deleteMaterial calls DELETE /materials/:id', async () => {
      instance.delete.mockResolvedValue({})

      await deleteMaterial('1')

      expect(instance.delete).toHaveBeenCalledWith('/materials/1')
    })
  })

  describe('Products', () => {
    it('getProducts calls GET /products', async () => {
      const mockProducts = [{ id: '1', name: 'Table', salePrice: 250, composition: [] }]
      instance.get.mockResolvedValue({ data: mockProducts })

      const result = await getProducts()

      expect(instance.get).toHaveBeenCalledWith('/products')
      expect(result.data).toEqual(mockProducts)
    })

    it('createProduct calls POST /products with data', async () => {
      const newProduct = {
        name: 'Chair',
        salePrice: 120,
        composition: [{ rawMaterialId: 'mat-1', quantity: 5 }],
      }
      instance.post.mockResolvedValue({ data: { id: '2', ...newProduct } })

      const result = await createProduct(newProduct)

      expect(instance.post).toHaveBeenCalledWith('/products', newProduct)
      expect(result.data.id).toBe('2')
    })

    it('deleteProduct calls DELETE /products/:id', async () => {
      instance.delete.mockResolvedValue({})

      await deleteProduct('1')

      expect(instance.delete).toHaveBeenCalledWith('/products/1')
    })
  })

  describe('Optimization', () => {
    it('runOptimization calls GET /optimization/optimize', async () => {
      const mockResult = {
        totalProjectedValue: 1250,
        productionSuggestions: [
          {
            product: { id: '1', name: 'Table', salePrice: 250, composition: [] },
            quantity: 5,
          },
        ],
      }
      instance.get.mockResolvedValue({ data: mockResult })

      const result = await runOptimization()

      expect(instance.get).toHaveBeenCalledWith('/optimization/optimize')
      expect(result.data.totalProjectedValue).toBe(1250)
      expect(result.data.productionSuggestions).toHaveLength(1)
    })
  })
})
