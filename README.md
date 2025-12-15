# React Admin Dashboard Template

A modern, full-featured admin dashboard template built with React, TypeScript, Ant Design v6, Tailwind CSS v4, and Redux Toolkit.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)
![Ant Design](https://img.shields.io/badge/Ant%20Design-6.0.0-1890ff.svg)

## ✨ Features

- 🎨 **Modern UI**: Built with Ant Design v6 for high-quality components
- 🎯 **Tailwind CSS v4**: Flexible utility-first styling with custom design tokens
- 🌓 **Dark/Light Mode**: Complete theme switching with persistence
- 🔐 **Authentication**: Login/Register pages with Redux state management
- 📊 **Dashboard**: Statistical widgets and charts (using Recharts)
- 📱 **Responsive**: Mobile-first design that works on all devices
- 🗂️ **Routing**: React Router v7 with protected routes
- 🔄 **State Management**: Redux Toolkit with redux-persist
- 📝 **TypeScript**: Full type safety throughout the application
- 🎭 **Layout System**: Collapsible sidebar, header with notifications

## 📦 Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **UI Library**: Ant Design 6.0.0
- **CSS Framework**: Tailwind CSS 4.0.0
- **Routing**: React Router 7.1.1
- **State Management**: Redux Toolkit 2.5.0 + Redux Persist 6.0.0
- **Charts**: Recharts 2.15.0
- **Icons**: Ant Design Icons 5.5.1

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository or use this template

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Default Login

For development, any email/password combination will work (mock authentication).

## 📁 Project Structure

```
react-admin/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx       # Top navigation bar
│   │   ├── Sidebar.tsx      # Side navigation menu
│   │   ├── ThemeToggle.tsx  # Dark/Light mode switcher
│   │   ├── NotificationDropdown.tsx
│   │   ├── UserDropdown.tsx
│   │   └── StatCard.tsx     # Dashboard statistics card
│   ├── layouts/             # Layout components
│   │   ├── MainLayout.tsx   # Main app layout (with sidebar)
│   │   └── AuthLayout.tsx   # Authentication pages layout
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx    # Main dashboard page
│   │   ├── Login.tsx        # Login page
│   │   ├── Register.tsx     # Registration page
│   │   ├── TableExample.tsx # Table with CRUD operations
│   │   ├── FormExample.tsx  # Complex form example
│   │   └── NotFound.tsx     # 404 error page
│   ├── routes/              # Routing configuration
│   │   └── index.tsx        # Route definitions
│   ├── store/               # Redux store
│   │   ├── index.ts         # Store configuration
│   │   └── slices/          # Redux slices
│   │       ├── themeSlice.ts   # Theme state
│   │       ├── authSlice.ts    # Auth state
│   │       └── sidebarSlice.ts # Sidebar state
│   ├── hooks/               # Custom React hooks
│   │   ├── useRedux.ts      # Typed Redux hooks
│   │   └── useTheme.ts      # Theme configuration hook
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Global types
│   ├── App.tsx              # Main App component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── tailwind.config.js      # Tailwind configuration (v4)
```

## 🎨 Customization

### Theme Colors

Edit `src/index.css` to customize the color palette:

```css
@theme {
  --color-primary-500: #0ea5e9;
  --color-success-500: #22c55e;
  /* Add your custom colors */
}
```

### Ant Design Theme

Modify theme settings in `src/hooks/useTheme.ts`:

```typescript
const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0ea5e9',
    borderRadius: 8,
    // Add your customizations
  },
};
```

### Sidebar Menu

Update menu items in `src/components/Sidebar.tsx`:

```typescript
const menuItems: MenuItem[] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  // Add your menu items
];
```

## 📋 Available Pages

- **Dashboard** (`/dashboard`): Overview with statistics and charts
- **Table Example** (`/table`): Data table with sorting, filtering, and pagination
- **Form Example** (`/form`): Comprehensive form with validation
- **Login** (`/login`): User authentication page
- **Register** (`/register`): User registration page
- **404** (`*`): Error page for invalid routes

## 🔒 Authentication

The template includes a basic authentication flow:

1. User logs in via `/login`
2. Credentials are stored in Redux (persisted to localStorage)
3. Protected routes check authentication state
4. Unauthenticated users are redirected to login

**Note**: This is a frontend-only implementation. Replace with your backend API.

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

MIT License - feel free to use this template for your projects!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For questions or support, please open an issue in the repository.

---

**Built with ❤️ using React, Ant Design, and Tailwind CSS**
