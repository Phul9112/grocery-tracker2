# 🛒 PriceBasket Setup Guide for Non-Coders

**Welcome!** This guide will help you set up your grocery pricing app step-by-step. No coding experience needed!

---

## 📋 What You'll Need

1. A computer with internet connection
2. About 30 minutes of time
3. A free Google account (for Firebase)

---

## 🚀 Step-by-Step Setup

### Step 1: Install Node.js

Node.js is required to run the app on your computer.

1. Go to **https://nodejs.org/**
2. Download the **LTS version** (Long Term Support - the one with the green background)
3. Run the installer and click "Next" through all the steps
4. To verify it's installed, open **Command Prompt** (Windows) or **Terminal** (Mac):
   - Press `Windows Key + R`, type `cmd`, press Enter (Windows)
   - Press `Command + Space`, type `terminal`, press Enter (Mac)
5. Type: `node --version` and press Enter
   - You should see something like `v20.x.x`

---

### Step 2: Set Up Firebase (Your Database)

Firebase will store all your grocery prices and sync them across devices.

#### 2.1 Create a Firebase Project

1. Go to **https://console.firebase.google.com/**
2. Click **"Add project"** or **"Create a project"**
3. **Project name**: Enter "PriceBasket" (or any name you like)
4. Click **Continue**
5. **Google Analytics**: Turn it OFF (you don't need it) and click **Continue**
6. Wait for the project to be created, then click **Continue**

#### 2.2 Enable Firestore Database

1. In the left sidebar, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"** and click **Next**
4. Choose your location (pick the one closest to you)
5. Click **Enable**
6. Once created, click the **"Rules"** tab
7. Replace the rules with this (copy and paste):

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

8. Click **Publish**

#### 2.3 Enable Storage (for Photos)

1. In the left sidebar, click **"Build"** → **"Storage"**
2. Click **"Get started"**
3. Click **Next** (keep production mode)
4. Click **Done**
5. Click the **"Rules"** tab
6. Replace the rules with this:

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

7. Click **Publish**

#### 2.4 Enable Anonymous Authentication

1. In the left sidebar, click **"Build"** → **"Authentication"**
2. Click **"Get started"**
3. Click the **"Sign-in method"** tab
4. Click on **"Anonymous"**
5. Toggle the switch to **Enable**
6. Click **Save**

#### 2.5 Get Your Firebase Configuration

1. Click the **gear icon** ⚙️ next to "Project Overview" in the left sidebar
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>`
5. **App nickname**: Enter "PriceBasket Web"
6. **Don't** check "Also set up Firebase Hosting"
7. Click **"Register app"**
8. You'll see a code block with your config. **Keep this page open!**

---

### Step 3: Configure Your App

1. Open your project folder `pricebasket3` in File Explorer (Windows) or Finder (Mac)

2. Find the file called `.env.example`

3. **Create a copy** of this file and name it `.env.local` (note: it starts with a dot!)
   - On Windows: Right-click → Copy → Paste → Rename to `.env.local`
   - On Mac: Duplicate the file and rename it to `.env.local`

4. Open `.env.local` with a text editor (Notepad on Windows, TextEdit on Mac)

5. Go back to your Firebase page (from Step 2.5) and copy the values:

   **From Firebase, copy these values into `.env.local`:**

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

   **Example of what it looks like:**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pricebasket-12345.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=pricebasket-12345
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pricebasket-12345.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxxxxx
   ```

6. **Save** the file

---

### Step 4: Install and Run the App

1. Open **Command Prompt** (Windows) or **Terminal** (Mac)

2. Navigate to your project folder:
   ```bash
   cd path/to/pricebasket3
   ```
   - Replace `path/to/pricebasket3` with the actual path
   - **Tip**: You can drag and drop the folder into the terminal to get the path!

3. Install the required packages (this will take 2-3 minutes):
   ```bash
   npm install
   ```

4. Start the app:
   ```bash
   npm run dev
   ```

5. You should see:
   ```
   ▲ Next.js 14.2.5
   - Local: http://localhost:3000
   ```

6. Open your browser and go to: **http://localhost:3000**

7. **🎉 Your app is now running!**

---

## 📱 How to Use the App

### Add Your First Store

1. Click the **Settings icon** ⚙️ in the top right
2. Enter a store name (e.g., "Walmart")
3. Pick a color for the store
4. Click **"Add Store"**
5. Repeat for all your stores (Kroger, Target, etc.)

### Add Your First Item

1. Click the **+ button** (floating button in bottom right)
2. Fill in:
   - **Name**: e.g., "Milk"
   - **Category**: e.g., "Dairy"
   - **Photo** (optional): Click "Upload Photo" to add a picture
   - **Prices**: Enter the price for each store
   - **Notes** (optional): Any extra info
3. Click **"Add Item"**

### Update Prices

1. Click the **Edit icon** (pencil) on any item card
2. Update the prices
3. Click **"Update Item"**
4. The app automatically saves the price history!

### View Price History

1. Click **"Price History"** on any item card
2. See a **graph** showing price changes over time
3. See **statistics**: lowest, highest, average prices
4. See a **table** with all past prices and dates

### Bulk Edit Multiple Items

1. Check the **checkboxes** on multiple items
2. Click **"Bulk Edit (X)"** button that appears
3. Choose to update:
   - **Category** for all selected items
   - **Prices** for all selected items
4. Click **"Apply Changes"**

### Search and Filter

1. Use the **search bar** at the top to find items
2. Click **category buttons** to filter by category

### Export Your Data

1. Click the **Download icon** 📥 in the header
2. A JSON file will download with all your data
3. Save this file as a backup!

### Import Data

1. Click the **Upload icon** 📤 in the header
2. Select your exported JSON file
3. All data will be imported!

### Sync Across Devices

- **Automatic**: The app syncs automatically in real-time
- **Manual**: Click the **refresh icon** 🔄 to force a sync
- **Setup on another device**: Just follow Steps 1-4 on the new device with the same Firebase config!

---

## 🌐 Access from Your Phone

While the app is running on your computer:

1. Find your computer's IP address:
   - **Windows**: Open Command Prompt, type `ipconfig`, look for "IPv4 Address"
   - **Mac**: System Preferences → Network → look for "IP Address"

2. On your phone's browser, go to: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.10:3000`

3. Make sure your phone and computer are on the **same WiFi network**

---

## 🚀 Deploy Online (Access from Anywhere)

To access your app from anywhere without running it on your computer:

### Deploy to Vercel (Free & Easy)

1. Create a free account at **https://vercel.com/** (sign in with GitHub)

2. Install Vercel CLI (in your terminal):
   ```bash
   npm install -g vercel
   ```

3. In your project folder, run:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - "Set up and deploy?": **Yes**
   - "Which scope?": Choose your account
   - "Link to existing project?": **No**
   - "What's your project's name?": **pricebasket**
   - "In which directory is your code located?": **./** (just press Enter)
   - "Want to override the settings?": **No**

5. When asked about environment variables, add them:
   ```bash
   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
   ```
   (Paste the value from your `.env.local` file)

   Repeat for all 6 variables.

6. Deploy:
   ```bash
   vercel --prod
   ```

7. You'll get a URL like `https://pricebasket.vercel.app` - that's your live app!

8. Now you can access it from **any device** with internet!

---

## 🆘 Troubleshooting

### "Firebase error: Permission denied"
- Make sure you set up the Firestore and Storage rules correctly (Step 2.2 and 2.3)
- Check that Anonymous authentication is enabled (Step 2.4)

### "Module not found" error
- Run `npm install` again in your project folder

### App won't start
- Make sure port 3000 is not already in use
- Try `npm run dev` again
- Check that `.env.local` has all the correct Firebase values

### Images not uploading
- Check Storage rules in Firebase Console
- Make sure Storage is enabled

### Data not syncing
- Check your internet connection
- Click the manual sync button (refresh icon)
- Check Firebase Console → Firestore Database to see if data is there

---

## 📞 Need Help?

If you run into issues:

1. Check the **browser console** (Press F12 in your browser)
2. Look for red error messages
3. Check your Firebase Console to make sure all services are enabled
4. Make sure your `.env.local` file has all the correct values

---

## ✨ Features Summary

✅ **Add/remove grocery items** with photos
✅ **Track prices** across multiple stores
✅ **Price history** with graphs and statistics
✅ **Bulk edit** multiple items at once
✅ **Real-time sync** across all devices
✅ **Export/import** your data
✅ **Search and filter** items
✅ **Mobile-friendly** design
✅ **Automatic backups** to Firebase

---

**Enjoy tracking your grocery prices! 🛒💰**
