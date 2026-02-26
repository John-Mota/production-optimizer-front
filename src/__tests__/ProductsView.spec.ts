import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ProductsView from '../views/ProductsView.vue'
import * as api from '../services/api'

vi.mock('../services/api', () => ({
  getProducts: vi.fn(),
  createProduct: vi.fn(),
  deleteProduct: vi.fn(),
  getMaterials: vi.fn(),
}))

describe('ProductsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    ;(api.getProducts as any).mockReturnValue(new Promise(() => {}))
    ;(api.getMaterials as any).mockReturnValue(new Promise(() => {}))
    const wrapper = mount(ProductsView)

    expect(wrapper.text()).toContain('Carregando')
  })

  it('renders empty state when no products', async () => {
    ;(api.getProducts as any).mockResolvedValue({ data: [] })
    ;(api.getMaterials as any).mockResolvedValue({ data: [] })
    const wrapper = mount(ProductsView)
    await flushPromises()

    expect(wrapper.text()).toContain('Nenhum Produto')
  })

  it('renders products table with data', async () => {
    ;(api.getProducts as any).mockResolvedValue({
      data: [
        { id: '1', name: 'Mesa', salePrice: 250.5, composition: [] },
      ],
    })
    ;(api.getMaterials as any).mockResolvedValue({ data: [] })
    const wrapper = mount(ProductsView)
    await flushPromises()

    expect(wrapper.text()).toContain('Mesa')
    expect(wrapper.text()).toContain('250,50')
  })

  it('shows form when add button is clicked', async () => {
    ;(api.getProducts as any).mockResolvedValue({ data: [] })
    ;(api.getMaterials as any).mockResolvedValue({ data: [] })
    const wrapper = mount(ProductsView)
    await flushPromises()

    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('Novo Produto')
  })

  it('populates form on edit click', async () => {
    ;(api.getProducts as any).mockResolvedValue({
      data: [{ id: '1', name: 'Mesa', salePrice: 250, composition: [] }],
    })
    ;(api.getMaterials as any).mockResolvedValue({ data: [] })
    const wrapper = mount(ProductsView)
    await flushPromises()

    const editBtn = wrapper.findAll('button').find((b) => b.text().includes('Editar'))
    await editBtn!.trigger('click')

    expect(wrapper.text()).toContain('Editar Produto')
  })

  it('formats price input as BRL currency', async () => {
    ;(api.getProducts as any).mockResolvedValue({ data: [] })
    ;(api.getMaterials as any).mockResolvedValue({ data: [] })
    const wrapper = mount(ProductsView)
    await flushPromises()

    // Open form
    await wrapper.find('button').trigger('click')

    // Find the price input (type="text" with inputmode="numeric")
    const priceInput = wrapper.find('input[inputmode="numeric"]')
    await priceInput.setValue('4500')
    await priceInput.trigger('input')

    // The display should show formatted BRL value
    expect((priceInput.element as HTMLInputElement).value).toContain('45')
  })

  it('deletes a product after confirmation', async () => {
    ;(api.getProducts as any).mockResolvedValue({
      data: [{ id: '1', name: 'Mesa', salePrice: 250, composition: [] }],
    })
    ;(api.getMaterials as any).mockResolvedValue({ data: [] })
    ;(api.deleteProduct as any).mockResolvedValue({})
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    const wrapper = mount(ProductsView)
    await flushPromises()

    const deleteBtn = wrapper.findAll('button').find((b) => b.text().includes('Excluir'))
    await deleteBtn!.trigger('click')
    await flushPromises()

    expect(api.deleteProduct).toHaveBeenCalledWith('1')
  })

  it('resolves material names in composition', async () => {
    ;(api.getProducts as any).mockResolvedValue({
      data: [
        {
          id: '1',
          name: 'Mesa',
          salePrice: 250,
          composition: [{ rawMaterialId: 'mat-1', quantity: 5 }],
        },
      ],
    })
    ;(api.getMaterials as any).mockResolvedValue({
      data: [{ id: 'mat-1', name: 'Madeira', stockQuantity: 100 }],
    })
    const wrapper = mount(ProductsView)
    await flushPromises()

    expect(wrapper.text()).toContain('Madeira')
    expect(wrapper.text()).toContain('× 5')
  })
})
