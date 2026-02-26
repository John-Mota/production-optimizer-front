import { createRouter, createWebHistory } from 'vue-router'
import MaterialsView from '../views/MaterialsView.vue'
import ProductsView from '../views/ProductsView.vue'
import OptimizationView from '../views/OptimizationView.vue'

const routes = [
  { path: '/', redirect: '/materials' },
  { path: '/materials', name: 'Materials', component: MaterialsView },
  { path: '/products', name: 'Products', component: ProductsView },
  { path: '/optimization', name: 'Optimization', component: OptimizationView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
