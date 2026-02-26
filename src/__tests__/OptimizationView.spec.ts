import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import OptimizationView from '../views/OptimizationView.vue'
import * as api from '../services/api'

vi.mock('../services/api', () => ({
  runOptimization: vi.fn(),
}))

describe('OptimizationView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders initial ready state', () => {
    const wrapper = mount(OptimizationView)

    expect(wrapper.text()).toContain('Pronto para Otimizar')
    expect(wrapper.text()).toContain('Executar Otimização')
  })

  it('shows loading state during optimization', async () => {
    ;(api.runOptimization as any).mockReturnValue(new Promise(() => {}))
    const wrapper = mount(OptimizationView)

    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('Otimizando Produção')
    expect(wrapper.text()).toContain('Calculando...')
  })

  it('renders optimization results', async () => {
    ;(api.runOptimization as any).mockResolvedValue({
      data: {
        totalProjectedValue: 1252.5,
        productionSuggestions: [
          {
            product: { id: '1', name: 'Mesa de Jantar', salePrice: 250.5, composition: [] },
            quantity: 5,
          },
        ],
      },
    })

    const wrapper = mount(OptimizationView)
    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Lucro Total Projetado')
    expect(wrapper.text()).toContain('1252.50')
    expect(wrapper.text()).toContain('Mesa de Jantar')
    expect(wrapper.text()).toContain('5')
  })

  it('shows error state when optimization fails', async () => {
    ;(api.runOptimization as any).mockRejectedValue({
      response: { data: { message: 'Estoque insuficiente' } },
    })

    const wrapper = mount(OptimizationView)
    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Falha na Otimização')
    expect(wrapper.text()).toContain('Estoque insuficiente')
    expect(wrapper.text()).toContain('Tentar Novamente')
  })

  it('shows default error message when no response message', async () => {
    ;(api.runOptimization as any).mockRejectedValue(new Error('Network Error'))

    const wrapper = mount(OptimizationView)
    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Não foi possível conectar')
  })

  it('shows empty suggestions message when no products to produce', async () => {
    ;(api.runOptimization as any).mockResolvedValue({
      data: {
        totalProjectedValue: 0,
        productionSuggestions: [],
      },
    })

    const wrapper = mount(OptimizationView)
    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Nenhuma sugestão de produção')
  })
})
