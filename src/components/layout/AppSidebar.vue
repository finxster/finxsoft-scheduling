<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <img :src="whiteLabel.brand.logo" :alt="whiteLabel.brand.name" class="w-10 h-10" />
        <div>
          <h1 class="font-bold text-gray-900">{{ whiteLabel.brand.shortName }}</h1>
          <p class="text-xs text-gray-500">{{ whiteLabel.integration.parentPlatformName }}</p>
        </div>
      </div>
    </div>
    
    <nav class="flex-1 p-4 space-y-1">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors"
        active-class="bg-blue-50 text-blue-600 border-l-4 border-blue-500 font-semibold"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ t(item.label) }}</span>
      </router-link>
    </nav>
    
    <div class="p-4 border-t border-gray-200">
      <button
        @click="handleLogout"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
      >
        <LogOut class="w-5 h-5" />
        <span>{{ t('auth.logout') }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import whiteLabel from '@/config/whiteLabel'
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  Settings, 
  LogOut 
} from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const menuItems = [
  { path: '/dashboard', label: 'dashboard.title', icon: LayoutDashboard },
  { path: '/appointments', label: 'appointments.title', icon: ClipboardList },
  { path: '/calendar', label: 'calendar.title', icon: Calendar },
  { path: '/settings', label: 'settings.title', icon: Settings }
]

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
