<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 flex-shrink-0 bg-steel-900 border-r border-steel-800 flex flex-col">
      <!-- Logo -->
      <div class="px-6 py-6 border-b border-steel-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-forge-600 rounded-xl flex items-center justify-center shadow-lg shadow-forge-600/20">
            <Cog :size="22" class="text-white" />
          </div>
          <div>
            <h1 class="text-sm font-bold text-white tracking-wide">{{ $t('layout.title') }}</h1>
            <p class="text-xs text-steel-400 font-medium">{{ $t('layout.subtitle') }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
          :class="[
            $route.path === item.path
              ? 'bg-forge-600/15 text-forge-400 shadow-sm'
              : 'text-steel-400 hover:text-steel-200 hover:bg-steel-800/60',
          ]"
        >
          <component :is="item.icon" :size="20" />
          <span>{{ $t(`nav.${item.key}`) }}</span>
        </router-link>
      </nav>

      <!-- Language Selector -->
      <div class="px-6 py-4 border-t border-steel-800 flex items-center justify-between">
        <button 
          @click="toggleLanguage" 
          class="flex items-center gap-2 text-xs font-semibold text-steel-400 hover:text-white transition-colors"
        >
          <Languages :size="16" />
          {{ currentLocaleName }}
        </button>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-steel-800">
        <p class="text-xs text-steel-600 text-center">{{ $t('layout.suite') }}</p>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto">
      <div class="p-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Cog, Package, Box, BarChart3, Languages } from 'lucide-vue-next'

const { locale } = useI18n()

const navItems = [
  { path: '/materials', key: 'materials', icon: Box },
  { path: '/products', key: 'products', icon: Package },
  { path: '/optimization', key: 'optimization', icon: BarChart3 },
]

const currentLocaleName = computed(() => {
  return locale.value === 'pt-BR' ? 'Português' : 'English'
})

const toggleLanguage = () => {
  locale.value = locale.value === 'pt-BR' ? 'en' : 'pt-BR'
}
</script>
