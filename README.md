# Empower Sync - Calendar & Booking System

A life-first calendar and booking application built with Next.js, featuring admin calendar management and client booking with Stripe payment integration.
<img width="2841" height="1518" alt="image" src="https://github.com/user-attachments/assets/0a3b8a8e-4340-494d-a4da-671e7e2fcbdb" />

## 🚀 Current Status

✅ **Fully Functional (Development Mode)**
- Admin authentication with login/logout
- Full calendar with month/week/day views
- Event management (create/edit/delete)
- Daily notes feature
- Work hours enforcement (10am-6pm Mon-Fri)
- Client booking view with privacy controls
- Data stored in localStorage

## 📋 Next Steps: Production Setup

To make this production-ready, you need to integrate:
1. **Firebase** - For authentication and database
2. **Stripe** - For payment processing

---

## 🔥 Firebase Integration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "Empower Sync" (or your preferred name)
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Enable Firebase Services

**Authentication:**
1. In Firebase Console, go to **Authentication** → **Get Started**
2. Enable **Email/Password** sign-in method
3. Add your admin email and password

**Firestore Database:**
1. Go to **Firestore Database** → **Create Database**
2. Start in **Production mode**
3. Choose your region (closest to your users)

### Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register app name: "Empower Sync Web"
5. Copy the `firebaseConfig` object

### Step 4: Add Firebase to Your Project

**Install Firebase SDK:**
```bash
npm install firebase
```

**Create environment file:**
Create a file called `.env.local` in your project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Files to update:**
- `app/utils/firebase.ts` (will be created for you)
- `app/utils/auth.ts` (replace localStorage with Firebase Auth)
- `app/utils/eventManager.ts` (replace localStorage with Firestore)

### Step 5: Firestore Database Structure

Your Firestore will have these collections:

```
📁 events
  └── {eventId}
      ├── title: string
      ├── type: "event" | "task" | "appointment"
      ├── startTime: timestamp
      ├── endTime: timestamp
      ├── date: string
      ├── duration: number
      ├── location: string
      ├── description: string
      ├── invitees: array
      ├── color: string
      ├── userId: string
      └── createdAt: timestamp

📁 dailyNotes
  └── {date-YYYY-MM-DD}
      ├── content: string
      ├── userId: string
      └── updatedAt: timestamp

📁 bookings
  └── {bookingId}
      ├── serviceId: string
      ├── serviceName: string
      ├── date: string
      ├── time: string
      ├── clientEmail: string
      ├── amount: number
      ├── paymentStatus: "pending" | "completed" | "failed"
      ├── stripePaymentId: string
      └── createdAt: timestamp
```

### Step 6: Firestore Security Rules

In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Events - only authenticated admin can read/write
    match /events/{eventId} {
      allow read, write: if request.auth != null;
    }
    
    // Daily Notes - only authenticated admin can read/write
    match /dailyNotes/{noteId} {
      allow read, write: if request.auth != null;
    }
    
    // Bookings - admin can read all, clients can create
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if true; // Clients can create bookings
      allow update, delete: if request.auth != null;
    }
  }
}
```

---

## 💳 Stripe Integration

### Step 1: Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Sign up for an account
3. Complete business verification

### Step 2: Get API Keys

1. In Stripe Dashboard, go to **Developers** → **API Keys**
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### Step 3: Add Stripe to Your Project

**Install Stripe SDK:**
```bash
npm install @stripe/stripe-js stripe
```

**Add to `.env.local`:**
```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

### Step 4: Create Stripe Products

In Stripe Dashboard → **Products**:

1. **Virtual Assistant**
   - Name: "Virtual Assistant - Hourly"
   - Price: £40.00 / hour
   - Recurring: No

2. **Automation Build**
   - Name: "Automation Build - Deposit"
   - Price: £100.00
   - Recurring: No

3. **Web Discovery**
   - Name: "Web Discovery Call"
   - Price: £0.00 (Free)
   - Recurring: No

Copy the **Price IDs** for each product.

### Step 5: Update Service Configuration

**Add to `.env.local`:**
```env
# Stripe Price IDs
NEXT_PUBLIC_STRIPE_PRICE_VA=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_AUTOMATION=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_WEB=price_xxx
```

**Files to update:**
- `app/components/Checkout.tsx` (integrate Stripe Elements)
- `app/api/create-payment-intent/route.ts` (new API route)
- `app/api/webhooks/stripe/route.ts` (new webhook handler)

---

## 🔧 Implementation Checklist

### Phase 1: Firebase Setup
- [ ] Create Firebase project
- [ ] Enable Authentication (Email/Password)
- [ ] Enable Firestore Database
- [ ] Get Firebase config and add to `.env.local`
- [ ] Install Firebase SDK: `npm install firebase`
- [ ] Update `app/utils/auth.ts` to use Firebase Auth
- [ ] Update `app/utils/eventManager.ts` to use Firestore
- [ ] Set Firestore security rules
- [ ] Test admin login with Firebase
- [ ] Test event creation/editing with Firestore

### Phase 2: Stripe Setup
- [ ] Create Stripe account
- [ ] Get API keys and add to `.env.local`
- [ ] Install Stripe SDK: `npm install @stripe/stripe-js stripe`
- [ ] Create products in Stripe Dashboard
- [ ] Get Price IDs and add to `.env.local`
- [ ] Create API route for payment intents
- [ ] Update Checkout component with Stripe Elements
- [ ] Create webhook handler for payment confirmation
- [ ] Test payment flow in test mode
- [ ] Verify bookings save to Firestore after payment

### Phase 3: Testing
- [ ] Test admin login/logout
- [ ] Test event CRUD operations
- [ ] Test client booking flow
- [ ] Test payment processing
- [ ] Test webhook handling
- [ ] Verify data persistence in Firestore

### Phase 4: Production Deployment
- [ ] Switch Stripe to live mode (get live API keys)
- [ ] Update Firebase security rules for production
- [ ] Deploy to Vercel/Netlify
- [ ] Set environment variables in hosting platform
- [ ] Configure custom domain
- [ ] Test production deployment

---

## 📁 Files That Will Need Updates

### For Firebase Integration:

**New Files:**
- `app/utils/firebase.ts` - Firebase initialization
- `app/lib/firestore.ts` - Firestore helper functions

**Files to Update:**
- `app/utils/auth.ts` - Replace localStorage with Firebase Auth
- `app/utils/eventManager.ts` - Replace localStorage with Firestore
- `app/components/admin/DailyNotes.tsx` - Use Firestore for notes

### For Stripe Integration:

**New Files:**
- `app/api/create-payment-intent/route.ts` - Server-side payment creation
- `app/api/webhooks/stripe/route.ts` - Handle Stripe webhooks
- `app/utils/stripe.ts` - Stripe client initialization

**Files to Update:**
- `app/components/Checkout.tsx` - Integrate Stripe Elements
- `app/components/ServiceSelection.tsx` - Add Stripe Price IDs
- `app/types/booking.ts` - Add payment-related types

---

## 🌐 Deployment Guide

### Option 1: Vercel (Recommended for Next.js)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy

### Option 2: Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Import your repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Add environment variables
7. Deploy

---

## 🔐 Security Checklist

Before going live:

- [ ] Remove hardcoded admin credentials
- [ ] Use Firebase Authentication for admin login
- [ ] Enable Firestore security rules
- [ ] Use environment variables for all API keys
- [ ] Never commit `.env.local` to Git (already in `.gitignore`)
- [ ] Enable Stripe webhook signature verification
- [ ] Use HTTPS only (automatic with Vercel/Netlify)
- [ ] Set up proper CORS policies
- [ ] Enable rate limiting on API routes
- [ ] Add CSRF protection

---

## 💰 Stripe Webhook Setup

After deployment:

1. In Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to environment variables:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

---

## 📞 Support & Next Steps

Once you have:
1. Created your Firebase project
2. Created your Stripe account
3. Obtained all API keys

**Let me know and I can:**
- Create the Firebase integration files
- Set up the Stripe payment flow
- Create the API routes
- Update all necessary components
- Help with deployment

---

## 🎯 Current Features (Working Now)

✅ Admin authentication (localStorage)  
✅ Calendar views (month/week/day)  
✅ Event management (CRUD)  
✅ Daily notes  
✅ Work hours enforcement  
✅ Client booking view  
✅ Privacy controls  

## 🚀 Coming Soon (After Integration)

🔄 Firebase Authentication  
🔄 Cloud database (Firestore)  
🔄 Stripe payment processing  
🔄 Email notifications  
🔄 Multi-device sync  
🔄 Production deployment  

---

## 📝 Notes

- Keep your `.env.local` file secure and never commit it to Git
- Use test mode for Stripe until you're ready to go live
- Firebase has a generous free tier perfect for getting started
- Stripe test cards: `4242 4242 4242 4242` (any future date, any CVC)

---

**Ready to integrate? Just provide your Firebase config and Stripe keys, and I'll set everything up for you!** 🚀
