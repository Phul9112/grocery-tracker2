# 🚀 Quick Start Guide

## ✅ Your App is Ready!

All features have been implemented:

- ✅ **Add/Remove Items** - Full CRUD for grocery items
- ✅ **Multi-Store Pricing** - Track prices across unlimited stores
- ✅ **Photo Upload** - Attach product photos via Firebase Storage
- ✅ **Price History** - Complete history with dates + interactive graphs
- ✅ **Bulk Edit Mode** - Select multiple items and edit them together
- ✅ **Export/Import** - Backup and restore your data as JSON
- ✅ **Real-Time Sync** - Firebase automatically syncs across all devices
- ✅ **Manual Sync Button** - Force refresh with the sync icon
- ✅ **Mobile-Friendly** - Fully responsive design
- ✅ **Modern UI** - Beautiful Tailwind CSS design

---

## 🎯 3-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase
See **SETUP_GUIDE.md** for detailed Firebase setup (takes ~15 minutes)

Quick summary:
- Create Firebase project
- Enable Firestore, Storage, and Anonymous Auth
- Copy config values to `.env.local`

### 3. Run the App
```bash
npm run dev
```

Open **http://localhost:3000** 🎉

---

## 📱 Key Features Overview

### Header Actions
- **🔍 Search** - Find items instantly
- **🔄 Sync** - Manual sync + shows last sync time
- **📥 Export** - Download all data as JSON
- **📤 Import** - Upload previously exported data
- **⚙️ Settings** - Manage stores (add/edit/delete)

### Item Management
- **➕ Add Button** - Floating button (bottom right)
- **✏️ Edit** - Click edit icon on any item
- **🗑️ Delete** - Click delete icon on any item
- **📸 Photos** - Upload product images
- **📊 Price History** - View trends + graphs

### Bulk Operations
1. Check boxes on multiple items
2. Click "Bulk Edit" button
3. Update category or prices for all at once

### Category Filtering
- Click category pills to filter
- Auto-detects all categories from your items

---

## 🔥 Firebase Features

### Real-Time Sync
- Changes sync **instantly** across all devices
- No manual save needed
- Uses Firebase Firestore real-time listeners

### Price History Tracking
- Every price update is automatically saved with timestamp
- View price trends over time
- See lowest, highest, and average prices

### Photo Storage
- Images uploaded to Firebase Storage
- Secure user-specific folders
- Automatic optimization

---

## 🌍 Deploy to Production

### Vercel (Recommended - Free)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... add all 6 Firebase variables

# Deploy to production
vercel --prod
```

### Other Platforms
Works on: Netlify, AWS Amplify, Railway, Render

---

## 📊 How It Works

### Data Structure

**Items Collection** (`/items/{itemId}`)
```json
{
  "userId": "user123",
  "name": "Milk",
  "category": "Dairy",
  "imageUrl": "https://...",
  "prices": {
    "store1": 3.99,
    "store2": 4.29
  },
  "priceHistory": [
    { "storeId": "store1", "price": 3.99, "date": "2025-11-30T..." }
  ],
  "notes": "Organic whole milk",
  "createdAt": "2025-11-30T...",
  "updatedAt": "2025-11-30T..."
}
```

**Stores Collection** (`/stores/{storeId}`)
```json
{
  "userId": "user123",
  "name": "Walmart",
  "color": "#0071ce",
  "createdAt": "2025-11-30T..."
}
```

### Security Rules
- Users can only access their own data (via `userId`)
- Anonymous authentication ensures data isolation
- Storage rules prevent unauthorized access

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Auth**: Firebase Anonymous Auth
- **Charts**: Recharts
- **Icons**: Lucide React

---

## 💡 Pro Tips

1. **Backup Regularly**: Use Export to save your data
2. **Sync Check**: Green dot in header = synced successfully
3. **Price Trends**: Click "Price History" to see which stores have best deals
4. **Bulk Edit**: Great for changing categories or updating prices after a shopping trip
5. **Photos**: Take quick snapshots of products while shopping
6. **Categories**: Use consistent names (Dairy, Produce, Meat, etc.)
7. **Multi-Device**: Open on phone + desktop simultaneously - they sync in real-time!

---

## 🔒 Privacy & Security

- **Your Data**: All data is in YOUR Firebase project (not shared)
- **Anonymous Auth**: No email/password required
- **User Isolation**: Each user's data is completely separate
- **Firestore Rules**: Enforced at database level
- **Storage Rules**: Images are user-specific

---

## 📞 Troubleshooting

### Common Issues

**"Firebase error" on launch**
→ Check `.env.local` has all 6 Firebase config values

**Images not uploading**
→ Verify Storage is enabled + rules are set

**Data not syncing**
→ Check internet connection + Firestore rules

**Build fails**
→ Run `npm install` again

### Need Help?

See **SETUP_GUIDE.md** for detailed troubleshooting section.

---

## 🎨 Customization Ideas

- Change color scheme in `tailwind.config.js`
- Add more item fields (brand, size, unit)
- Create custom categories
- Add receipt scanning (future enhancement)
- Generate shopping lists from lowest prices

---

**Happy Price Tracking! 🛒💰**
