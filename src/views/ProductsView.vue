<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-white">{{ $t('products.title') }}</h2>
        <p class="text-steel-400 mt-1">{{ $t('products.define') }}</p>
      </div>
      <button @click="toggleForm" class="btn-primary">
        <component :is="showForm ? X : Plus" :size="18" />
        {{ showForm ? $t('common.cancel') : $t('products.addProduct') }}
      </button>
    </div>

    <!-- Add / Edit Product Form -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="showForm" class="card p-6 mb-8">
        <h3 class="text-lg font-semibold text-white mb-4">
          {{ editingId ? $t('products.edit') : $t('products.new') }}
        </h3>
        <form @submit.prevent="handleSubmit">
          <!-- Product Info -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-steel-300 mb-1.5">{{ $t('products.name') }}</label>
              <input
                v-model="form.name"
                type="text"
                :placeholder="$t('products.namePlaceholder')"
                class="input-field"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-steel-300 mb-1.5">{{ $t('products.price') }}</label>
              <input
                :value="displayPrice"
                @input="handlePriceInput"
                type="text"
                inputmode="numeric"
                placeholder="0,00"
                class="input-field"
                required
              />
            </div>
          </div>

          <!-- Composition -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <label class="text-sm font-medium text-steel-300">{{ $t('products.composition') }}</label>
              <button
                type="button"
                @click="addCompositionRow"
                class="btn-secondary text-sm py-1.5 px-3"
              >
                <PlusCircle :size="14" />
                {{ $t('products.addLine') }}
              </button>
            </div>

            <div v-if="form.composition.length === 0" class="p-6 border border-dashed border-steel-700 rounded-xl text-center">
              <p class="text-steel-500 text-sm">{{ $t('products.noMaterials') }}</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(row, index) in form.composition"
                :key="index"
                class="flex items-center gap-3 p-3 bg-steel-800/30 rounded-xl"
              >
                <div class="flex-1">
                  <select v-model="row.rawMaterialId" class="input-field text-sm" required>
                    <option value="" disabled>{{ locale === 'pt-BR' ? 'Selecione um material' : 'Select a material' }}</option>
                    <option v-for="mat in availableMaterials" :key="mat.id" :value="mat.id">
                      {{ mat.name }}
                    </option>
                  </select>
                </div>
                <div class="w-36">
                  <input
                    v-model.number="row.quantity"
                    type="number"
                    min="1"
                    placeholder="Qty"
                    class="input-field text-sm"
                    required
                  />
                </div>
                <button
                  type="button"
                  @click="removeCompositionRow(index)"
                  class="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded-lg transition-colors"
                >
                  <Minus :size="16" />
                </button>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <div class="flex justify-end">
            <button type="submit" class="btn-primary" :disabled="saving">
              <Loader2 v-if="saving" :size="18" class="animate-spin" />
              <Save v-else :size="18" />
              {{ saving ? $t('common.saving') : (editingId ? $t('common.save') : $t('products.addProduct')) }}
            </button>
          </div>
        </form>
      </div>
    </Transition>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 flex flex-col items-center justify-center">
      <Loader2 :size="40" class="text-forge-500 animate-spin mb-4" />
      <p class="text-steel-400">{{ $t('common.loading') }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="card p-12 flex flex-col items-center justify-center">
      <div class="w-16 h-16 bg-steel-800 rounded-2xl flex items-center justify-center mb-4">
        <Package :size="32" class="text-steel-600" />
      </div>
      <h3 class="text-lg font-semibold text-steel-300 mb-1">{{ $t('products.noProducts') }}</h3>
      <p class="text-steel-500 text-sm">{{ $t('products.addFirst') }}</p>
    </div>

    <!-- Products Table -->
    <div v-else class="card overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-steel-800">
            <th class="table-header text-left py-4 px-6">{{ $t('products.product') }}</th>
            <th class="table-header text-left py-4 px-6">{{ $t('products.salePrice') }}</th>
            <th class="table-header text-left py-4 px-6">{{ $t('products.composition') }}</th>
            <th class="table-header text-right py-4 px-6">{{ $t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in products"
            :key="product.id"
            class="border-b border-steel-800/50 hover:bg-steel-800/30 transition-colors"
          >
            <td class="table-cell font-medium">{{ product.name }}</td>
            <td class="table-cell">
              <span class="text-forge-400 font-semibold">
                {{ formatCurrency(product.salePrice) }}
              </span>
            </td>
            <td class="table-cell">
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="(comp, i) in product.composition"
                  :key="i"
                  class="inline-flex items-center gap-1 px-2.5 py-1 bg-steel-800 rounded-lg text-xs text-steel-300"
                >
                  {{ getMaterialName(comp.rawMaterialId) }}
                  <span class="text-forge-400 font-semibold">× {{ comp.quantity }}</span>
                </span>
              </div>
            </td>
            <td class="table-cell text-right">
              <div class="flex items-center justify-end gap-2">
                <button @click="startEdit(product)" class="btn-secondary text-sm py-1.5 px-3">
                  <Pencil :size="14" />
                  {{ $t('common.edit') }}
                </button>
                <button @click="handleDelete(product.id)" class="btn-danger text-sm py-1.5 px-3">
                  <Trash2 :size="14" />
                  {{ $t('common.delete') }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus, X, Save, Loader2, PlusCircle, Minus, Pencil, Trash2, Package } from 'lucide-vue-next'
import { getProducts, createProduct, deleteProduct, getMaterials } from '../services/api'

const { t, locale } = useI18n()
const products = ref([])
const availableMaterials = ref([])
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const editingId = ref(null)

// Raw price in centavos (integer)
const priceInCents = ref(0)

const createEmptyForm = () => ({
  name: '',
  salePrice: 0,
  composition: [],
})

const form = ref(createEmptyForm())

// Format a number as currency string based on locale
const formatCurrency = (value) => {
  const currency = locale.value === 'pt-BR' ? 'BRL' : 'USD'
  const style = locale.value === 'pt-BR' ? 'pt-BR' : 'en-US'
  
  return Number(value).toLocaleString(style, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Display price derived from centavos
const displayPrice = computed(() => {
  const value = priceInCents.value / 100
  const style = locale.value === 'pt-BR' ? 'pt-BR' : 'en-US'
  return Number(value).toLocaleString(style, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

// Handle price input: strip non-digits, treat as centavos
const handlePriceInput = (event) => {
  const raw = event.target.value.replace(/\D/g, '')
  priceInCents.value = parseInt(raw || '0', 10)
  form.value.salePrice = priceInCents.value / 100
}

const resetForm = () => {
  form.value = createEmptyForm()
  priceInCents.value = 0
  editingId.value = null
}

const toggleForm = () => {
  if (showForm.value) {
    resetForm()
  }
  showForm.value = !showForm.value
}

const addCompositionRow = () => {
  form.value.composition.push({ rawMaterialId: '', quantity: 1 })
}

const removeCompositionRow = (index) => {
  form.value.composition.splice(index, 1)
}

const fetchData = async () => {
  loading.value = true
  try {
    const [productsRes, materialsRes] = await Promise.all([getProducts(), getMaterials()])
    products.value = productsRes.data
    availableMaterials.value = materialsRes.data
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}

const startEdit = (product) => {
  editingId.value = product.id
  form.value = {
    name: product.name,
    salePrice: product.salePrice,
    composition: product.composition.map((c) => ({ ...c })),
  }
  priceInCents.value = Math.round(product.salePrice * 100)
  showForm.value = true
}

const handleSubmit = async () => {
  saving.value = true
  try {
    if (editingId.value) {
      // Backend has no PUT for products — recreate via DELETE + POST
      await deleteProduct(editingId.value)
      await createProduct(form.value)
    } else {
      await createProduct(form.value)
    }
    resetForm()
    showForm.value = false
    await fetchData()
  } catch (error) {
    console.error('Failed to save product:', error)
  } finally {
    saving.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm(t('common.confirmDelete'))) return
  try {
    await deleteProduct(id)
    await fetchData()
  } catch (error) {
    console.error('Failed to delete product:', error)
  }
}

const getMaterialName = (materialId) => {
  const mat = availableMaterials.value.find((m) => m.id === materialId)
  return mat ? mat.name : locale.value === 'pt-BR' ? 'Desconhecido' : 'Unknown'
}

onMounted(fetchData)
</script>
