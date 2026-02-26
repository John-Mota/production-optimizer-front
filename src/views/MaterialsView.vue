<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-white">Raw Materials</h2>
        <p class="text-steel-400 mt-1">Manage your inventory of raw materials</p>
      </div>
      <button @click="showForm = !showForm" class="btn-primary">
        <component :is="showForm ? X : Plus" :size="18" />
        {{ showForm ? 'Cancel' : 'Add Material' }}
      </button>
    </div>

    <!-- Add / Edit Form -->
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
          {{ editingId ? 'Edit Material' : 'New Material' }}
        </h3>
        <form @submit.prevent="handleSubmit" class="flex items-end gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-steel-300 mb-1.5">Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="e.g. Steel Rod"
              class="input-field"
              required
            />
          </div>
          <div class="w-48">
            <label class="block text-sm font-medium text-steel-300 mb-1.5">Stock Quantity</label>
            <input
              v-model.number="form.stockQuantity"
              type="number"
              min="0"
              placeholder="0"
              class="input-field"
              required
            />
          </div>
          <button type="submit" class="btn-primary" :disabled="saving">
            <Loader2 v-if="saving" :size="18" class="animate-spin" />
            <Save v-else :size="18" />
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </form>
      </div>
    </Transition>

    <!-- Loading State -->
    <div v-if="loading" class="card p-12 flex flex-col items-center justify-center">
      <Loader2 :size="40" class="text-forge-500 animate-spin mb-4" />
      <p class="text-steel-400">Loading materials...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="materials.length === 0" class="card p-12 flex flex-col items-center justify-center">
      <div class="w-16 h-16 bg-steel-800 rounded-2xl flex items-center justify-center mb-4">
        <Box :size="32" class="text-steel-600" />
      </div>
      <h3 class="text-lg font-semibold text-steel-300 mb-1">No Materials Yet</h3>
      <p class="text-steel-500 text-sm">Add your first raw material to get started.</p>
    </div>

    <!-- Materials Table -->
    <div v-else class="card overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-steel-800">
            <th class="table-header text-left py-4 px-6">Name</th>
            <th class="table-header text-left py-4 px-6">Stock Quantity</th>
            <th class="table-header text-right py-4 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="material in materials"
            :key="material.id"
            class="border-b border-steel-800/50 hover:bg-steel-800/30 transition-colors"
          >
            <td class="table-cell font-medium">{{ material.name }}</td>
            <td class="table-cell">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-forge-600/10 text-forge-400 rounded-lg text-sm font-medium">
                {{ material.stockQuantity }}
              </span>
            </td>
            <td class="table-cell text-right">
              <div class="flex items-center justify-end gap-2">
                <button @click="startEdit(material)" class="btn-secondary text-sm py-1.5 px-3">
                  <Pencil :size="14" />
                  Edit
                </button>
                <button @click="handleDelete(material.id)" class="btn-danger text-sm py-1.5 px-3">
                  <Trash2 :size="14" />
                  Delete
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
import { ref, onMounted } from 'vue'
import { Plus, X, Save, Loader2, Pencil, Trash2, Box } from 'lucide-vue-next'
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '../services/api'

const materials = ref([])
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const editingId = ref(null)

const form = ref({
  name: '',
  stockQuantity: 0,
})

const resetForm = () => {
  form.value = { name: '', stockQuantity: 0 }
  editingId.value = null
}

const fetchMaterials = async () => {
  loading.value = true
  try {
    const { data } = await getMaterials()
    materials.value = data
  } catch (error) {
    console.error('Failed to fetch materials:', error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  try {
    if (editingId.value) {
      await updateMaterial(editingId.value, form.value)
    } else {
      await createMaterial(form.value)
    }
    resetForm()
    showForm.value = false
    await fetchMaterials()
  } catch (error) {
    console.error('Failed to save material:', error)
  } finally {
    saving.value = false
  }
}

const startEdit = (material) => {
  editingId.value = material.id
  form.value = { name: material.name, stockQuantity: material.stockQuantity }
  showForm.value = true
}

const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this material?')) return
  try {
    await deleteMaterial(id)
    await fetchMaterials()
  } catch (error) {
    console.error('Failed to delete material:', error)
  }
}

onMounted(fetchMaterials)
</script>
