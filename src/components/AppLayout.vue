<template>
  <div class="flex h-screen overflow-hidden bg-steel-950">
    <header class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-steel-900 border-b border-steel-800 flex items-center justify-between px-6 z-40">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-forge-600 rounded-lg flex items-center justify-center shadow-lg shadow-forge-600/20">
          <Cog :size="18" class="text-white" />
        </div>
        <h1 class="text-xs font-bold text-white tracking-wide uppercase">{{ $t('layout.title') }}</h1>
      </div>
      <button @click="isSidebarOpen = true" class="p-2 text-steel-400 hover:text-white transition-colors">
        <Menu :size="24" />
      </button>
    </header>

    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isSidebarOpen" 
        @click="isSidebarOpen = false"
        class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />
    </Transition>

    <aside 
      class="fixed lg:static inset-y-0 left-0 w-64 bg-steel-900 border-r border-steel-800 flex flex-col z-50 transform lg:transform-none transition-transform duration-300 ease-in-out"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="px-6 py-6 border-b border-steel-800 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-forge-600 rounded-xl flex items-center justify-center shadow-lg shadow-forge-600/20">
            <Cog :size="22" class="text-white" />
          </div>
          <div>
            <h1 class="text-sm font-bold text-white tracking-wide">{{ $t('layout.title') }}</h1>
            <p class="text-xs text-steel-400 font-medium">{{ $t('layout.subtitle') }}</p>
          </div>
        </div>
        <button @click="isSidebarOpen = false" class="lg:hidden p-1 text-steel-500 hover:text-white transition-colors">
          <X :size="20" />
        </button>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          @click="isSidebarOpen = false"
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

      <div class="px-6 py-4 border-t border-steel-800 flex items-center justify-between">
        <button 
          @click="toggleLanguage" 
          class="flex items-center gap-2 text-xs font-semibold text-steel-400 hover:text-white transition-colors"
        >
          <Languages :size="16" />
          {{ currentLocaleName }}
        </button>
      </div>

      <div class="px-6 py-4 border-t border-steel-800">
        <p class="text-xs text-steel-600 text-center">{{ $t('layout.suite') }}</p>
      </div>
    </aside>

    <main class="flex-1 overflow-auto pt-16 lg:pt-0">
      <div class="p-4 lg:p-8 max-w-7xl mx-auto">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Cog, Package, Box, BarChart3, Languages, Menu, X } from 'lucide-vue-next'

const { locale } = useI18n()
const isSidebarOpen = ref(false)

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
