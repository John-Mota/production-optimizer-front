import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MaterialsView from '../views/MaterialsView.vue'
import * as api from '../services/api'

vi.mock('../services/api', () => ({
  getMaterials: vi.fn(),
  createMaterial: vi.fn(),
  updateMaterial: vi.fn(),
  deleteMaterial: vi.fn(),
}))

describe('MaterialsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    ;(api.getMaterials as any).mockReturnValue(new Promise(() => {}))
    const wrapper = mount(MaterialsView)

    expect(wrapper.text()).toContain('Carregando')
  })

  it('renders empty state when no materials', async () => {
    ;(api.getMaterials as any).mockResolvedValue({ data: [] })
    const wrapper = mount(MaterialsView)
    await flushPromises()

    expect(wrapper.text()).toContain('Nenhuma Matéria-Prima')
  })

  it('renders materials table with data', async () => {
    ;(api.getMaterials as any).mockResolvedValue({
      data: [
        { id: '1', name: 'Madeira', stockQuantity: 100 },
        { id: '2', name: 'Aço', stockQuantity: 50 },
      ],
    })
    const wrapper = mount(MaterialsView)
    await flushPromises()

    expect(wrapper.text()).toContain('Madeira')
    expect(wrapper.text()).toContain('Aço')
    expect(wrapper.text()).toContain('100')
    expect(wrapper.text()).toContain('50')
  })

  it('shows form when add button is clicked', async () => {
    ;(api.getMaterials as any).mockResolvedValue({ data: [] })
    const wrapper = mount(MaterialsView)
    await flushPromises()

    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('Nova Matéria-Prima')
  })

  it('creates a material on form submit', async () => {
    ;(api.getMaterials as any).mockResolvedValue({ data: [] })
    ;(api.createMaterial as any).mockResolvedValue({ data: { id: '1', name: 'Ferro', stockQuantity: 30 } })
    const wrapper = mount(MaterialsView)
    await flushPromises()

    // Open form
    await wrapper.find('button').trigger('click')

    // Fill form
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Ferro')
    await inputs[1].setValue(30)

    // Submit
    ;(api.getMaterials as any).mockResolvedValue({
      data: [{ id: '1', name: 'Ferro', stockQuantity: 30 }],
    })
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(api.createMaterial).toHaveBeenCalledWith({ name: 'Ferro', stockQuantity: 30 })
  })

  it('populates form on edit click', async () => {
    ;(api.getMaterials as any).mockResolvedValue({
      data: [{ id: '1', name: 'Madeira', stockQuantity: 100 }],
    })
    const wrapper = mount(MaterialsView)
    await flushPromises()

    // Click edit button
    const editBtn = wrapper.findAll('button').find((b) => b.text().includes('Editar'))
    await editBtn!.trigger('click')

    expect(wrapper.text()).toContain('Editar Matéria-Prima')
    const nameInput = wrapper.find('input[type="text"]')
    expect((nameInput.element as HTMLInputElement).value).toBe('Madeira')
  })

  it('deletes a material after confirmation', async () => {
    ;(api.getMaterials as any).mockResolvedValue({
      data: [{ id: '1', name: 'Madeira', stockQuantity: 100 }],
    })
    ;(api.deleteMaterial as any).mockResolvedValue({})
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    const wrapper = mount(MaterialsView)
    await flushPromises()

    const deleteBtn = wrapper.findAll('button').find((b) => b.text().includes('Excluir'))
    await deleteBtn!.trigger('click')
    await flushPromises()

    expect(api.deleteMaterial).toHaveBeenCalledWith('1')
  })
})
