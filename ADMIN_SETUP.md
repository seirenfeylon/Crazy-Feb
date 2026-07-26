# Admin Setup Guide for Firebase Custom Claims

To restrict write access in Firestore and Cloud Storage to administrators securely, the security rules check for an `admin` custom claim (`request.auth.token.admin == true`).

Client-side code cannot grant custom claims. You must grant the claim using the Firebase Admin SDK on a secure server or command-line environment.

## Step-by-Step Instructions

1. **Install Firebase Admin SDK**:
   ```bash
   npm install firebase-admin
   ```

2. **Download Service Account Key**:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Navigate to **Project Settings** > **Service accounts**.
   - Click **Generate new private key** and save the JSON file securely (e.g., `serviceAccountKey.json`).

3. **Run One-Time Admin Claim Script**:
   Create a file named `set-admin.js`:

   ```javascript
   const admin = require('firebase-admin');
   const serviceAccount = require('./serviceAccountKey.json');

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });

   async function setAdminClaim(uid) {
     await admin.auth().setCustomUserClaims(uid, { admin: true });
     console.log(`Successfully assigned admin claim to user ${uid}`);
     process.exit(0);
   }

   // Replace with the UID of the admin user from Firebase Auth
   const adminUid = 'USER_UID_HERE';
   setAdminClaim(adminUid).catch(console.error);
   ```

4. **Execute Script**:
   ```bash
   node set-admin.js
   ```

5. **Force Token Refresh**:
   The admin user must log out and log back in (or refresh their ID token) for the new `admin` custom claim to take effect in Firebase security rules.
