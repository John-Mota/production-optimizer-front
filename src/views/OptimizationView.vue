<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-white">Otimização de Produção</h2>
        <p class="text-steel-400 mt-1">Calcule as quantidades ideais de produção para lucro máximo</p>
      </div>
      <button @click="handleOptimize" class="btn-primary" :disabled="optimizing">
        <Loader2 v-if="optimizing" :size="18" class="animate-spin" />
        <Play v-else :size="18" />
        {{ optimizing ? 'Calculando...' : 'Executar Otimização' }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="optimizing" class="card p-12 flex flex-col items-center justify-center">
      <div class="relative mb-6">
        <div class="w-20 h-20 rounded-full border-4 border-steel-800 border-t-forge-500 animate-spin" />
      </div>
      <h3 class="text-lg font-semibold text-white mb-1">Otimizando Produção</h3>
      <p class="text-steel-400 text-sm">Executando algoritmo de programação linear...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-8 border-red-500/20">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <AlertTriangle :size="24" class="text-red-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-red-400 mb-1">Falha na Otimização</h3>
          <p class="text-steel-400 text-sm">{{ error }}</p>
          <button @click="handleOptimize" class="btn-secondary mt-4 text-sm">
            <RotateCcw :size="14" />
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>

    <!-- Empty / Initial State -->
    <div v-else-if="!result" class="card p-12 flex flex-col items-center justify-center">
      <div class="w-16 h-16 bg-steel-800 rounded-2xl flex items-center justify-center mb-4">
        <BarChart3 :size="32" class="text-steel-600" />
      </div>
      <h3 class="text-lg font-semibold text-steel-300 mb-1">Pronto para Otimizar</h3>
      <p class="text-steel-500 text-sm text-center max-w-md">
        Clique em "Executar Otimização" para calcular o melhor mix de produção baseado nas matérias-primas disponíveis e nos produtos cadastrados.
      </p>
    </div>

    <!-- Results -->
    <div v-else class="space-y-6">
      <!-- Total Profit Card -->
      <div class="card p-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-forge-600/15 rounded-2xl flex items-center justify-center">
            <TrendingUp :size="28" class="text-forge-400" />
          </div>
          <div>
            <p class="text-sm text-steel-400 font-medium">Lucro Total Projetado</p>
            <p class="text-3xl font-bold text-forge-400">
              R$ {{ Number(result.totalProjectedValue).toFixed(2) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Suggestions Table -->
      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-steel-800">
          <h3 class="text-lg font-semibold text-white">Sugestões de Produção</h3>
          <p class="text-steel-400 text-sm mt-0.5">Quantidades recomendadas para cada produto</p>
        </div>

        <div v-if="result.productionSuggestions.length === 0" class="p-8 text-center">
          <p class="text-steel-500 text-sm">Nenhuma sugestão de produção disponível.</p>
        </div>

        <table v-else class="w-full">
          <thead>
            <tr class="border-b border-steel-800">
              <th class="table-header text-left py-4 px-6">Produto</th>
              <th class="table-header text-left py-4 px-6">Qtd. Sugerida</th>
              <th class="table-header text-left py-4 px-6">Preço Unit.</th>
              <th class="table-header text-right py-4 px-6">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(suggestion, index) in result.productionSuggestions"
              :key="index"
              class="border-b border-steel-800/50 hover:bg-steel-800/30 transition-colors"
            >
              <td class="table-cell font-medium">{{ suggestion.product.name }}</td>
              <td class="table-cell">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-forge-600/10 text-forge-400 rounded-lg text-sm font-semibold">
                  {{ suggestion.quantity }}
                </span>
              </td>
              <td class="table-cell text-steel-300">
                R$ {{ Number(suggestion.product.salePrice).toFixed(2) }}
              </td>
              <td class="table-cell text-right font-semibold text-white">
                R$ {{ (suggestion.quantity * suggestion.product.salePrice).toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Play, Loader2, BarChart3, TrendingUp, AlertTriangle, RotateCcw } from 'lucide-vue-next'
import { runOptimization } from '../services/api'

const optimizing = ref(false)
const result = ref(null)
const error = ref(null)

const handleOptimize = async () => {
  optimizing.value = true
  error.value = null
  result.value = null
  try {
    const { data } = await runOptimization()
    result.value = data
  } catch (err) {
    console.error('Optimization failed:', err)
    error.value =
      err.response?.data?.message ||
      'Não foi possível conectar ao servidor de otimização. Tente novamente mais tarde.'
  } finally {
    optimizing.value = false
  }
}
</script>
