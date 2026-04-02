import { StepData } from "../types";

export const step5Auth: StepData = {
  id: "authentication",
  stepNumber: 5,
  title: "Authentication",
  subtitle: "Enable login/signup and understand how user sessions work.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What Is Authentication?",
      blocks: [
        {
          type: "text",
          content:
            "Authentication is how your app knows WHO a user is. When someone signs up, they create an account. When they log in, the app verifies their identity and gives them a \"session\" — a temporary pass that says \"this person is logged in.\" This template uses Firebase Authentication for the accounts and JWT tokens for the sessions.",
        },
      ],
    },
    {
      title: "Step 1: Enable Email/Password Auth in Firebase",
      blocks: [
        {
          type: "text",
          content:
            "Firebase supports many ways to sign in (Google, Facebook, phone, etc.), but we'll start with the simplest: email and password.",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Go to your Firebase Console (console.firebase.google.com)",
            "Select your project",
            "Click \"Build\" in the left sidebar, then \"Authentication\"",
            "Click \"Get started\" (if this is your first time)",
            "Click on the \"Sign-in method\" tab",
            "Click \"Email/Password\"",
            "Toggle the first switch to \"Enable\"",
            "Leave the second switch (\"Email link\") disabled",
            "Click \"Save\"",
          ],
        },
        {
          type: "callout",
          variant: "success",
          content:
            "That's it! Firebase is now ready to handle user signups and logins for your app.",
        },
      ],
    },
    {
      title: "Step 2: Try Signing Up",
      blocks: [
        {
          type: "text",
          content:
            "Make sure your dev server is running (`npm run dev`), then click below to go to the signup page:",
        },
        {
          type: "link",
          content: "/auth?mode=signup",
          label: "Open Signup Page",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Enter any email address (it can be a real one or something like test@test.com)",
            "Enter a password (at least 6 characters)",
            "Confirm the password",
            "Click \"Create account\"",
          ],
        },
        {
          type: "text",
          content:
            "If everything is set up correctly, you'll be redirected to the dashboard. Congratulations — you just created your first user!",
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "Go to Firebase Console > Authentication > Users tab to see your new user listed there. You can also check Firestore Database to see the user document that was automatically created.",
        },
      ],
    },
    {
      title: "Step 3: Try Logging Out and Back In",
      blocks: [
        {
          type: "text",
          content:
            "Click \"Log out\" in the top-right corner of the header. Then click below to go to the login page and sign in with the same credentials:",
        },
        {
          type: "link",
          content: "/auth",
          label: "Open Login Page",
        },
        {
          type: "text",
          content:
            "Enter your email and password, click \"Sign in.\" You should be redirected back to the dashboard.",
        },
      ],
    },
    {
      title: "Step 4: See Protected Routes in Action",
      blocks: [
        {
          type: "text",
          content: "Log out again, then try to visit the dashboard directly:",
        },
        {
          type: "link",
          content: "/dashboard",
          label: "Try opening the Dashboard (while logged out)",
        },
        {
          type: "text",
          content:
            "You should be redirected to the login page automatically! This is because the dashboard is a \"protected route\" — the app checks if you're logged in before letting you in.",
        },
        {
          type: "callout",
          variant: "info",
          content:
            "This protection happens in a file called `middleware.ts`. It runs before every request and checks for a valid authentication cookie. If you want to protect more pages, you can tell your AI agent to add routes to the middleware matcher.",
        },
      ],
    },
    {
      title: "How It Works (The Big Picture)",
      blocks: [
        {
          type: "text",
          content: "Here's the full flow of what happens when you log in:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "You enter email + password on the login page",
            "The browser sends those to Firebase, which verifies them and returns an ID token",
            "Your app sends that ID token to your backend API (`/api/auth`)",
            "The backend verifies the token with Firebase Admin, then creates a JWT (a signed session token)",
            "The JWT is stored in a secure cookie (httpOnly — JavaScript can't read it, which prevents theft)",
            "On every page load, the middleware reads that cookie and checks if the JWT is valid",
            "If valid, you're in. If not, you get redirected to login.",
          ],
        },
        {
          type: "code",
          language: "text",
          label: "Tell your AI agent",
          content:
            "Authentication is fully working. Firebase Auth is enabled with Email/Password, I've tested signup and login, and protected routes are working via middleware.ts. The auth flow uses Firebase client SDK → JWT tokens → httpOnly cookies. You can use the useAuth() hook in any component to check if a user is logged in.",
        },
      ],
    },
  ],
};
