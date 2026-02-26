<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-white">Products</h2>
        <p class="text-steel-400 mt-1">Define products and their material composition</p>
      </div>
      <button @click="showForm = !showForm" class="btn-primary">
        <component :is="showForm ? X : Plus" :size="18" />
        {{ showForm ? 'Cancel' : 'Add Product' }}
      </button>
    </div>

    <!-- Add Product Form -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="showForm" class="card p-6 mb-8">
        <h3 class="text-lg font-semibold text-white mb-4">New Product</h3>
        <form @submit.prevent="handleSubmit">
          <!-- Product Info -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-steel-300 mb-1.5">Product Name</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="e.g. Industrial Gear"
                class="input-field"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-steel-300 mb-1.5">Sale Price (R$)</label>
              <input
                v-model.number="form.salePrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="input-field"
                required
              />
            </div>
          </div>

          <!-- Composition -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <label class="text-sm font-medium text-steel-300">Material Composition</label>
              <button
                type="button"
                @click="addCompositionRow"
                class="btn-secondary text-sm py-1.5 px-3"
              >
                <PlusCircle :size="14" />
                Add Row
              </button>
            </div>

            <div v-if="form.composition.length === 0" class="p-6 border border-dashed border-steel-700 rounded-xl text-center">
              <p class="text-steel-500 text-sm">No materials added yet. Click "Add Row" to define the composition.</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(row, index) in form.composition"
                :key="index"
                class="flex items-center gap-3 p-3 bg-steel-800/30 rounded-xl"
              >
                <div class="flex-1">
                  <select v-model="row.rawMaterialId" class="input-field text-sm" required>
                    <option value="" disabled>Select a material</option>
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
              {{ saving ? 'Saving...' : 'Save Product' }}
            </button>
          </div>
        </form>
      </div>
    </Transition>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 flex flex-col items-center justify-center">
      <Loader2 :size="40" class="text-forge-500 animate-spin mb-4" />
      <p class="text-steel-400">Loading products...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="card p-12 flex flex-col items-center justify-center">
      <div class="w-16 h-16 bg-steel-800 rounded-2xl flex items-center justify-center mb-4">
        <Package :size="32" class="text-steel-600" />
      </div>
      <h3 class="text-lg font-semibold text-steel-300 mb-1">No Products Yet</h3>
      <p class="text-steel-500 text-sm">Create your first product with its material composition.</p>
    </div>

    <!-- Products Table -->
    <div v-else class="card overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-steel-800">
            <th class="table-header text-left py-4 px-6">Product</th>
            <th class="table-header text-left py-4 px-6">Sale Price</th>
            <th class="table-header text-left py-4 px-6">Composition</th>
            <th class="table-header text-right py-4 px-6">Actions</th>
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
                R$ {{ Number(product.salePrice).toFixed(2) }}
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
              <button @click="handleDelete(product.id)" class="btn-danger text-sm py-1.5 px-3">
                <Trash2 :size="14" />
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, X, Save, Loader2, PlusCircle, Minus, Trash2, Package } from 'lucide-vue-next'
import { getProducts, createProduct, deleteProduct, getMaterials } from '../services/api'

const products = ref([])
const availableMaterials = ref([])
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)

const createEmptyForm = () => ({
  name: '',
  salePrice: 0,
  composition: [],
})

const form = ref(createEmptyForm())

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

const handleSubmit = async () => {
  saving.value = true
  try {
    await createProduct(form.value)
    form.value = createEmptyForm()
    showForm.value = false
    await fetchData()
  } catch (error) {
    console.error('Failed to save product:', error)
  } finally {
    saving.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) return
  try {
    await deleteProduct(id)
    await fetchData()
  } catch (error) {
    console.error('Failed to delete product:', error)
  }
}

const getMaterialName = (materialId) => {
  const mat = availableMaterials.value.find((m) => m.id === materialId)
  return mat ? mat.name : 'Unknown'
}

onMounted(fetchData)
</script>
