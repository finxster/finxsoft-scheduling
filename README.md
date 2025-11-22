# FinxSoft Scheduling - Frontend

A white-label scheduling platform for professionals to manage appointments, built with Vue 3 and Tailwind CSS.

## 🎯 Overview

FinxSoft Scheduling is a modern, customizable appointment management system designed for professionals and clinics. The first implementation is for **AtipicALI**, a platform serving the neurodivergent community.

### Key Features

- 📅 **Calendar Management** - View and manage appointments with an intuitive calendar interface
- ⏰ **Time Slot Control** - Configure working hours and block specific time periods
- 👥 **Appointment Management** - Confirm, cancel, and complete appointments
- 📊 **Dashboard** - Overview of daily/weekly appointments and statistics
- 🌐 **Multi-language** - Support for Portuguese (pt-BR) and English (en-US)
- 🎨 **White-label Ready** - Configurable branding and theming
- 📱 **Responsive** - Works on desktop, tablet, and mobile devices

## 🚀 Tech Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Styling**: Tailwind CSS 3.4
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Icons**: Lucide Vue Next
- **Date Handling**: date-fns
- **Build Tool**: Vite 5.1

## 📁 Project Structure

```
src/
├── assets/              # Static assets and styles
├── components/
│   ├── common/         # Reusable UI components
│   ├── layout/         # Layout components (Header, Sidebar)
│   ├── appointments/   # Appointment-specific components
│   └── calendar/       # Calendar components
├── views/              # Page components
├── stores/             # Pinia stores
├── composables/        # Reusable composition functions
├── services/           # API services
├── router/             # Vue Router configuration
├── utils/              # Helper functions
├── config/             # White-label configuration
└── locales/            # i18n translations
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ and npm/yarn

### Environment Variables

Create `.env.development` and `.env.production` files:

```bash
# .env.development
VITE_API_URL=http://localhost:8080/api/v1
VITE_PARENT_URL=http://localhost:3000
VITE_PARENT_API_URL=http://localhost:8080/atipicali-api

# .env.production
VITE_API_URL=https://api.scheduling.atipicali.com/api/v1
VITE_PARENT_URL=https://atipicali.com.br
VITE_PARENT_API_URL=https://api.atipicali.com.br

```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 White-label Configuration

The application is configured for white-labeling through `src/config/whiteLabel.js`:

```javascript
export default {
  brand: {
    name: 'AtipicALI Scheduling',
    logo: '/logo.svg',
    colors: {
      primary: '#06D6A0',    // teal
      secondary: '#FF6B5B',  // coral
      accent: '#FFD166',     // yellow
    }
  },
  features: {
    enableNotifications: true,
    enableReports: false,
    enableBulkActions: true,
  },
  i18n: {
    defaultLocale: 'pt-BR',
    availableLocales: ['pt-BR', 'en-US'],
  }
}
```

## 🔐 Authentication

The application uses JWT-based authentication with the following flow:

1. User logs in with email/password
2. Backend returns JWT token
3. Token is stored in Pinia store
4. Token is automatically included in all API requests via Axios interceptor
5. 401 responses trigger automatic logout and redirect to login

## 📊 Data Models

### Appointment
```typescript
{
  id: string
  professional: { id, externalId, displayName }
  client: { externalId, name, photo, email }
  scheduledAt: string (ISO 8601)
  durationMinutes: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  notes?: string
}
```

### Professional
```typescript
{
  id: string
  email: string
  displayName: string
  slotDurationMinutes: number
  workDays: string[]  // ['MONDAY', 'TUESDAY', ...]
  workStart: string   // "08:00"
  workEnd: string     // "18:00"
}
```

## 🌍 Internationalization

Translations are managed in `src/locales/`:
- `en-US.json` - English (US)
- `pt-BR.json` - Portuguese (Brazil)

Add new translations:
```json
{
  "dashboard": {
    "title": "Dashboard",
    "greeting": "Hello"
  }
}
```

Use in components:
```vue
<template>
  <h1>{{ t('dashboard.title') }}</h1>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
```

## 🎯 Key Views

### Dashboard
- Overview of today's appointments
- Weekly statistics
- Quick actions

### Appointments
- List all appointments with filters
- Confirm/cancel/complete actions
- Search and pagination

### Calendar
- Monthly calendar view
- Time slot management
- Block/unblock time periods

### Settings
- Configure working hours
- Set time slot duration
- Update profile

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code with ESLint
```

## 🧩 Components

### Common Components
- `AppButton` - Customizable button with variants
- `AppCard` - Card container with border accent
- `AppModal` - Modal dialog
- `AppBadge` - Status badges
- `AppInput` - Form input
- `AppTable` - Data table
- `LoadingSpinner` - Loading indicator
- `EmptyState` - Empty state placeholder

### Calendar Components
- `CalendarGrid` - Calendar day grid
- `MonthView` - Month navigation and display
- `DayAppointments` - List of day's appointments
- `TimeSlotPicker` - Time slot selection
- `TimeBlockModal` - Block time periods

## 🔗 Integration

The platform integrates with a parent platform (AtipicALI) to:
- Fetch client information
- Sync appointment data
- Authenticate professionals

Integration endpoints are configured in `src/services/atipicaliService.js`.

## 📝 License

Proprietary - FinxSoft © 2025

## 👥 Support

For questions or support:
- Email: support@finxsoft.com
- Documentation: https://docs.finxsoft.com/scheduling

---

Built with ❤️ by FinxSoft
