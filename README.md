# 🛒 Grocery Price Tracker

A modern, feature-rich web application for tracking grocery prices across multiple stores with real-time synchronization across all your devices.

## ✨ Features

### Core Features
- **📊 Price Tracking** - Track prices for grocery items across multiple stores
- **🏪 Store Management** - Add and remove stores in settings
- **🛍️ Item Management** - Add and remove items from your basket
- **📸 Photo Support** - Upload photos for each product
- **🔄 Real-Time Sync** - Automatic synchronization across all devices
- **💾 Export/Import** - Backup and restore your data as JSON

### Advanced Features
- **✏️ Bulk Edit Mode** - Select multiple items and apply changes simultaneously
- **📱 Mobile-Friendly** - Fully responsive design that works on all devices
- **📈 Price History** - Track price changes over time with dates
- **📉 Price Graphs** - Visual charts showing price fluctuations
- **🔍 Best Price Finder** - Automatically identifies the lowest price for each item
- **📊 Price Trends** - Visual indicators showing price increases/decreases
- **🎨 Modern UI** - Clean, intuitive interface built with Tailwind CSS
- **☁️ Cloud Sync** - Real-time Firebase integration for instant updates

## 🚀 Quick Start

### Option 1: Local Use (No Setup Required)
1. Open `index.html` in any modern web browser
2. The app will work locally using browser localStorage
3. Data persists on your device but won't sync across devices

### Option 2: Enable Real-Time Sync (Recommended)

To enable cloud synchronization across multiple devices:

#### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

#### Step 2: Enable Realtime Database
1. In your Firebase project, go to **Build** → **Realtime Database**
2. Click "Create Database"
3. Choose a location (select one close to you)
4. Start in **test mode** (we'll secure it next)

#### Step 3: Configure Database Rules
1. Go to the **Rules** tab in Realtime Database
2. Replace the rules with:
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```
3. Click "Publish"

#### Step 4: Get Your Configuration
1. Go to **Project Settings** (gear icon) → **General**
2. Scroll to "Your apps" section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname
5. Copy the `firebaseConfig` object

#### Step 5: Update the Code
1. Open `index.html` in a text editor
2. Find the Firebase configuration (around line 31):
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```
3. Replace with your actual Firebase configuration values
4. Save the file

#### Step 6: Deploy (Optional)
You can host this app for free on:
- **Firebase Hosting** - `firebase deploy`
- **Netlify** - Drag and drop the `index.html` file
- **GitHub Pages** - Push to a GitHub repository and enable Pages
- **Vercel** - Deploy from GitHub or upload directly

## 📖 How to Use

### Managing Stores
1. Go to the **Settings** tab
2. Enter a store name and click "Add Store"
3. Remove stores by clicking the trash icon

### Adding Items
1. In the **Prices** tab, find the "Add New Item" section
2. Enter item name and category
3. Optionally upload a photo
4. Click "Add Item"

### Updating Prices
1. In the price grid, enter prices in the store columns
2. Prices are automatically saved and synced
3. Price changes are tracked in history

### Bulk Editing
1. Click "Bulk Edit" button
2. Select multiple items using checkboxes
3. Enter a new category
4. Click "Apply" to update all selected items

### Viewing Price History
1. Go to the **History** tab
2. Click on any item to view its price history
3. See a graph of price fluctuations over time
4. View detailed history table with dates and stores

### Export/Import Data
- **Export**: Click "Export" to download a JSON file backup
- **Import**: Click "Import" and select a previously exported JSON file

### Manual Refresh
- Click the "Refresh" button in the header to force sync from cloud
- Useful when opening the app on a new device

## 🔧 Technical Details

### Built With
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Firebase** - Real-time database and authentication
- **Recharts** - Price history charts
- **Lucide Icons** - Modern icon set

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

### Data Storage
- **Local**: Browser localStorage (works offline)
- **Cloud**: Firebase Realtime Database (syncs across devices)
- **Fallback**: If Firebase isn't configured, app works locally only

### Privacy & Security
- Anonymous authentication (no personal data required)
- Each user gets a unique ID
- Database rules prevent unauthorized access
- All data is stored securely in Firebase
- Images are stored as base64 in the database

## 📱 Mobile Features

The app is fully optimized for mobile devices:
- Touch-friendly interface
- Responsive tables with horizontal scrolling
- Mobile-optimized navigation
- Works as a Progressive Web App (can be "installed" on mobile)

## 🎯 Use Cases

- **Price Comparison** - Compare prices across different stores
- **Budget Tracking** - Monitor grocery spending over time
- **Deal Hunting** - Identify when items go on sale
- **Shopping Planning** - Plan where to shop for best prices
- **Historical Analysis** - Track price trends and patterns

## 🔐 Security Best Practices

1. **Never commit your Firebase config** with actual values to public repositories
2. **Use environment variables** or a config file for sensitive data
3. **Review Firebase security rules** regularly
4. **Enable App Check** in production for additional security
5. **Consider using Firebase Authentication** with email/password for multi-user scenarios

## 🐛 Troubleshooting

### Sync not working?
- Check your internet connection (look for cloud icon in header)
- Verify Firebase configuration is correct
- Check browser console for error messages
- Ensure Firebase Realtime Database is enabled

### Data not appearing on another device?
- Click the "Refresh" button to force sync
- Wait a few seconds for real-time sync
- Check that both devices are online

### Icons not showing?
- Ensure you have internet connection (icons load from CDN)
- Clear browser cache and refresh

## 📄 License

MIT License - feel free to use and modify for your needs!

## 🤝 Contributing

This is an open-source project. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Fork and customize

## 🎉 Enjoy!

Happy price tracking! May you always find the best deals! 🎊
