export default {
  brand: {
    name: 'AtipicALI Scheduling',
    shortName: 'Scheduling',
    logo: '/scheduling-logo.png',
    primaryColor: '#3B82F6',
    secondaryColor: '#EF4444',
  },
  features: {
    enableNotifications: true,
    enableReports: false,
    enableBulkActions: true,
  },
  integration: {
    parentPlatformUrl: import.meta.env.VITE_PARENT_URL || 'http://localhost:3000',
    parentPlatformName: 'AtipicALI',
    parentPlatformApiUrl: import.meta.env.VITE_PARENT_API_URL || 'http://localhost:8080/api',
  },
  i18n: {
    defaultLocale: 'pt-BR',
    availableLocales: ['pt-BR', 'en-US'],
  }
}
