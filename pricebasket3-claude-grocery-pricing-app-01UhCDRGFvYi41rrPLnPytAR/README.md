# 🛒 PriceBasket - Grocery Price Tracker

A modern, mobile-friendly web application for tracking and comparing grocery prices across different stores. Built with Next.js, Firebase, and Tailwind CSS.

## ✨ Features

- **📱 Mobile-Friendly Design** - Fully responsive interface that works seamlessly on all devices
- **🏪 Multi-Store Support** - Track prices across multiple grocery stores with color-coded organization
- **📸 Product Photos** - Upload and attach photos to your grocery items
- **📊 Price History** - Detailed price history with interactive graphs showing price fluctuations over time
- **🔄 Real-Time Sync** - Automatically syncs data across all your devices in real-time
- **✏️ Bulk Edit Mode** - Select and edit multiple items simultaneously
- **📥 Export/Import** - Export your data to JSON and import it on other devices
- **🔍 Search & Filter** - Quickly find items with search and category filters
- **📈 Price Trends** - Visual indicators showing price increases and decreases
- **💾 Automatic Backups** - All data is stored securely in the cloud

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Firebase account (free tier works great)

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable the following services:
   - **Firestore Database** (in Native mode)
   - **Storage** (for image uploads)
   - **Authentication** (enable Anonymous sign-in)
4. Get your Firebase configuration from Project Settings

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd pricebasket3
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

4. Add your Firebase configuration to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 How to Use

### Adding Stores

1. Click the **Settings** icon in the header
2. Enter a store name and select a color
3. Click **Add Store**

### Adding Items

1. Click the **+** floating button
2. Fill in the item details:
   - Name (required)
   - Category (required)
   - Upload a photo (optional)
   - Set prices for different stores
   - Add notes (optional)
3. Click **Add Item**

### Editing Items

- Click the **Edit** icon on any item card
- Update the information
- Click **Update Item**

### Bulk Editing

1. Check the boxes on multiple items
2. Click the **Bulk Edit** button
3. Choose to update either:
   - Category for all selected items
   - Prices for all selected items

### Viewing Price History

1. Click **Price History** on any item card
2. View:
   - Current, lowest, highest, and average prices
   - Interactive price trend graph
   - Complete price history table

### Syncing Data

- Data syncs automatically in real-time
- Click the **Sync** icon in the header for manual sync
- Green indicator shows last sync time

### Exporting/Importing Data

**Export:**
1. Click the **Download** icon in the header
2. Save the JSON file

**Import:**
1. Click the **Upload** icon in the header
2. Select your exported JSON file

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth (Anonymous)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript

## 📂 Project Structure

```
pricebasket3/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # App header with search & actions
│   ├── ItemsList.tsx      # Items grid display
│   ├── ItemCard.tsx       # Individual item card
│   ├── AddItemModal.tsx   # Add/Edit item modal
│   ├── SettingsModal.tsx  # Settings & store management
│   ├── BulkEditModal.tsx  # Bulk edit interface
│   └── PriceHistoryModal.tsx  # Price history & charts
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Firebase initialization
│   └── db.ts             # Database operations
├── types/                 # TypeScript type definitions
│   └── index.ts          # Shared types
└── public/               # Static assets

```

## 🔒 Security & Privacy

- All data is stored in your personal Firebase project
- Anonymous authentication ensures data isolation
- Images are securely stored in Firebase Storage
- Real-time security rules can be configured in Firebase Console

### Recommended Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /stores/{storeId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Recommended Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy!

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Railway
- Render

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Firebase](https://firebase.google.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

If you encounter any issues or have questions:
1. Check the Firebase Console for any configuration issues
2. Ensure all environment variables are set correctly
3. Check the browser console for error messages

---

**Happy Price Tracking! 🛒💰**
