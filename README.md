# FarmFlow - Offline-First Farm Management PWA

FarmFlow is a progressive web app designed for smallholder farmers in rural Africa. It works completely offline, syncs when online, and provides comprehensive farm financial management tools.

## Features

- 📊 **Dashboard** with key farm KPIs (income, expenses, balance, net income)
- 💰 **Transaction tracking** with categories for different enterprises
- 🏢 **Multi-enterprise support** (dairy, poultry, crops, livestock)
- 📱 **Mobile-first design** with large tap targets for rural users
- 🌐 **Offline-first** - works without internet connection
- 🔄 **Automatic sync** when online
- 📸 **Receipt photo capture**
- 📈 **Charts and reports**
- 💾 **Backup & restore** with encrypted exports
- 🌓 **Light/dark mode** with Material Design
- 🔤 **Multi-language support** (English & Swahili)

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: IndexedDB with Dexie.js wrapper
- **Offline**: Service Workers with Cache API
- **Storage**: LocalForage for key-value storage
- **Charts**: Chart.js for data visualization
- **Icons**: Material Icons

## Setup for Development

1. Clone the repository
2. Serve the files using any static file server
3. Open `index.html` in a modern browser

For testing service workers, use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .