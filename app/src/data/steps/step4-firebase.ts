import { StepData } from "../types";

export const step4Firebase: StepData = {
  id: "firebase-database",
  stepNumber: 4,
  title: "Creating a Database",
  subtitle: "Set up Firebase and Firestore to store and retrieve data.",
  estimatedMinutes: 20,
  sections: [
    {
      title: "What Is Firebase?",
      blocks: [
        {
          type: "text",
          content:
            "Firebase is a platform by Google that provides a bunch of tools for building apps — including a database, user authentication, file storage, and hosting. We're going to use two of its services: Firestore (the database) and Firebase Authentication (login/signup).",
        },
        {
          type: "callout",
          variant: "info",
          content:
            "Firebase has a generous free tier (\"Spark plan\") that's more than enough for learning and small projects. You won't need to enter payment info.",
        },
      ],
    },
    {
      title: "Step 1: Create a Firebase Project",
      blocks: [
        {
          type: "text",
          content: "Go to the Firebase Console and create a new project:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Go to console.firebase.google.com and sign in with your Google account",
            "Click \"Add project\" (or \"Create a project\")",
            "Give it a name (anything you want — e.g., \"my-training-app\")",
            "You can disable Google Analytics when prompted (not needed for this)",
            "Click \"Create project\" and wait for it to finish",
          ],
        },
      ],
    },
    {
      title: "Step 2: Create a Firestore Database",
      blocks: [
        {
          type: "text",
          content:
            "Firestore is a NoSQL document database — instead of tables with rows and columns (like Excel), it stores \"documents\" inside \"collections.\" Think of it like folders (collections) containing files (documents).",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "In your Firebase project, click \"Build\" in the left sidebar, then \"Firestore Database\"",
            "Click \"Create database\"",
            "Choose \"Start in production mode\" — this locks the database down by default, which is the right habit to build from day one",
            "Select a location closest to you (e.g., us-central1 for US)",
            "Click \"Enable\"",
          ],
        },
        {
          type: "callout",
          variant: "info",
          content:
            "Production mode means the database rejects all direct browser reads/writes by default. That's exactly what we want — our app talks to the database through server-side API routes using the service account (admin access), so the security rules don't affect us. This is the secure pattern for real projects.",
        },
      ],
    },
    {
      title: "Step 3: Register a Web App",
      blocks: [
        {
          type: "text",
          content:
            "Now we need to tell Firebase about your web application so it gives you the config values for your `.env.local` file.",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Go to Project Settings (click the gear icon next to \"Project Overview\" in the sidebar)",
            "Scroll down to \"Your apps\" section",
            "Click the web icon (</>) to add a web app",
            "Give it a nickname (e.g., \"My Web App\")",
            "Don't check \"Firebase Hosting\" for now",
            "Click \"Register app\"",
          ],
        },
        {
          type: "text",
          content:
            "Firebase will show you a code snippet with your config values. You need these specific values:",
        },
        {
          type: "code",
          language: "javascript",
          label: "Firebase will show something like this",
          content: `const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};`,
        },
      ],
    },
    {
      title: "Step 4: Add Config to Your .env.local",
      blocks: [
        {
          type: "text",
          content:
            "Copy each value from the Firebase config into your `.env.local` file. Match them up like this:",
        },
        {
          type: "code",
          language: "env",
          label: ".env.local — fill in your Firebase values",
          content: `NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123`,
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "These NEXT_PUBLIC_ variables are safe to expose in the browser — they identify your project but don't grant admin access. The real security comes from Firebase Security Rules and your server-side service account.",
        },
      ],
    },
    {
      title: "Step 5: Download Your Service Account Key",
      blocks: [
        {
          type: "text",
          content:
            "Your server (the backend API routes) needs admin access to Firebase. This comes from a \"service account\" — a credentials file that gives your server permission to read/write data and verify user logins.",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Go to Project Settings (gear icon) > \"Service accounts\" tab",
            "Make sure \"Firebase Admin SDK\" is selected and language is \"Node.js\"",
            "Click \"Generate new private key\"",
            "Click \"Generate key\" in the confirmation dialog",
            "A JSON file will download — this is your service account key",
          ],
        },
        {
          type: "text",
          content:
            "Rename the downloaded file to `service-account.json` and move it to your project root (the `Base_Template/` folder, NOT inside `app/`):",
        },
        {
          type: "file-tree",
          content: `Base_Template/
├── service-account.json    <-- Put it here!
├── app/
├── scrapers/
└── ...`,
        },
        {
          type: "callout",
          variant: "warning",
          content:
            "This file is a MASTER KEY to your database. Never commit it to GitHub. It's already in the .gitignore so Git will ignore it, but double-check with `git status` to make sure it's not listed.",
        },
      ],
    },
    {
      title: "Step 6: Seed Your Database",
      blocks: [
        {
          type: "text",
          content:
            "Restart your dev server (`Ctrl+C` then `npm run dev`). Let's verify everything works by loading some sample data into your database. This project includes a CSV file with 200 sample products — drag it into the box below or click to load it automatically.",
        },
        {
          type: "text",
          content:
            "The CSV file is at `app/public/sample-products.csv` if you want to look at it first. It has product names, categories, prices, stock levels, and descriptions.",
        },
        {
          type: "component",
          content: "SeedDatabase",
        },
        {
          type: "text",
          content:
            "Once seeded, go to your Firebase Console > Firestore Database. You should see a `products` collection with 200 documents. This is the data we'll query through the API in a later step.",
        },
        {
          type: "callout",
          variant: "success",
          content:
            "Your database is live and loaded with data! You can browse, search, and filter these products in the Firebase Console.",
        },
        {
          type: "code",
          language: "text",
          label: "Tell your AI agent",
          content:
            "I've set up Firebase. My NEXT_PUBLIC_FIREBASE_* environment variables are configured in app/.env.local, my service-account.json is in the project root (Base_Template/), and the Firestore database is created in production mode with 200 sample products in a \"products\" collection. Firebase is fully ready.",
        },
      ],
    },
  ],
};
