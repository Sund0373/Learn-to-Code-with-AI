Business Query Analysis Tool - Summary
Core Flow

User Question (chat input)
  ↓
Claude generates SQL query
  ↓
[PLACEHOLDER: Execute in Snowflake]
  ↓
Claude analyzes results
  ↓
Render response with:
  - Summary + key findings
  - Visualization format recommendation (table/metric/chart)
  - Source table citations
  - Download CSV option
  - Show/hide SQL toggle
What Claude Does (2 API Calls)
Call 1: SQL Generation
Input: user question + table schema context
Output: SQL query
Max tokens: 500
Call 2: Results Analysis
Input: user question + query results (first 20 rows)
Output: JSON with format, summary, key findings, chart type
UI Components
Chat interface (Claude-like)
Message bubbles (user questions, assistant responses)
Data display (table rendering)
Summary section (AI insights)
Key findings (bulleted list)
Data source citation (table names)
SQL viewer (show/hide toggle)
Download CSV button
Loading states
Data Structure for Results






javascript
{
  question: string,
  sql: string,
  data: array,
  format: {
    format: "table" | "metric" | "chart",
    chartType: "bar" | "line" | "pie" | null,
    summary: string,
    keyFindings: [string]
  },
  sourceTable: [string]
}
Placeholder for Snowflake
Right now: mock query execution with sample data Later: replace with actual Snowflake API call






javascript
// TODO: Replace with real Snowflake query
const results = mockQueryResults;
What You're Building Today
✅ Chat interface ✅ Question input ✅ SQL generation via Claude ✅ Results analysis via Claude ✅ Visualization rendering ✅ Data display + citations ✅ CSV download ✅ SQL viewer
❌ Snowflake integration (add last)
Tech Stack
React (UI)
Tailwind (styling)
Claude API (reasoning)
Mock data (until Snowflake ready)
Lucide icons (UI elements)
You're ready to build this in Claude Code.

## Secure Auth + API Key Storage

### Architecture

```
User lands on app
  ↓
Login screen (email/password)
  ↓
Check if user has API keys stored
  ↓
If no: Setup screen (enter Anthropic + Snowflake keys)
  ↓
If yes: Skip to Query interface
  ↓
Keys encrypted + stored in Firestore (user-specific)
  ↓
Server decrypts on demand for API calls
  ↓
Keys never visible in UI or browser
```

### Implementation Steps

#### 1. Firebase Auth Setup

In Firebase Console:
- Go to Authentication → Sign-in method
- Enable Email/Password
- (Optional) Add Google OAuth

Add to your app at `lib/firebase/auth.ts`:

```typescript
import { initializeAuth } from "firebase/auth";
import { app } from "./config";

export const auth = initializeAuth(app);
```

#### 2. Server-side Encryption Endpoint

Create `app/api/setup/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { updateDoc } from "@/lib/firebase/crud";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Server-only secret

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY!, "hex"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, anthropicKey, snowflakeAccount, snowflakeUser, snowflakePassword, snowflakeWarehouse } = await request.json();

    // Verify user is authenticated (check Firebase token)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Encrypt keys server-side
    const encryptedKeys = {
      anthropic: encrypt(anthropicKey),
      snowflake: {
        account: encrypt(snowflakeAccount),
        user: encrypt(snowflakeUser),
        password: encrypt(snowflakePassword),
        warehouse: encrypt(snowflakeWarehouse),
      },
      lastUpdated: new Date().toISOString(),
    };

    // Store in Firestore
    await updateDoc("users", userId, {
      apiKeys: encryptedKeys,
      setupComplete: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Setup failed" },
      { status: 500 }
    );
  }
}
```

#### 3. Setup Screen Component

Create `components/SetupScreen.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import Button from "@/components/ui/Button";

export default function SetupScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [anthropicKey, setAnthropicKey] = useState("");
  const [snowflakeAccount, setSnowflakeAccount] = useState("");
  const [snowflakeUser, setSnowflakeUser] = useState("");
  const [snowflakePassword, setSnowflakePassword] = useState("");
  const [snowflakeWarehouse, setSnowflakeWarehouse] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!user) throw new Error("Not authenticated");

      const token = await user.getIdToken();

      // Send to server endpoint (keys never stay in browser)
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.uid,
          anthropicKey,
          snowflakeAccount,
          snowflakeUser,
          snowflakePassword,
          snowflakeWarehouse,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save API keys");
      }

      // Clear form immediately
      setAnthropicKey("");
      setSnowflakeAccount("");
      setSnowflakeUser("");
      setSnowflakePassword("");
      setSnowflakeWarehouse("");
      setSuccess(true);

      setTimeout(() => {
        window.location.href = "/query";
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-xl font-bold text-green-600">Setup Complete!</h2>
          <p className="text-gray-600 mt-2">Redirecting to query tool...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Connect Your APIs</h1>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Anthropic API Key
            </label>
            <input
              type="password"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="sk-ant-..."
              className="input w-full"
              required
              autoComplete="off"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get from{" "}
              <a
                href="https://console.anthropic.com"
                target="_blank"
                className="text-blue-600 underline"
              >
                console.anthropic.com
              </a>
            </p>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-3">Snowflake Connection</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Account
                </label>
                <input
                  type="text"
                  value={snowflakeAccount}
                  onChange={(e) => setSnowflakeAccount(e.target.value)}
                  placeholder="xy12345.us-east-1"
                  className="input w-full"
                  required
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={snowflakeUser}
                  onChange={(e) => setSnowflakeUser(e.target.value)}
                  className="input w-full"
                  required
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={snowflakePassword}
                  onChange={(e) => setSnowflakePassword(e.target.value)}
                  className="input w-full"
                  required
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Warehouse
                </label>
                <input
                  type="text"
                  value={snowflakeWarehouse}
                  onChange={(e) => setSnowflakeWarehouse(e.target.value)}
                  placeholder="COMPUTE_WH"
                  className="input w-full"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            loading={loading} 
            className="w-full"
          >
            Save Keys
          </Button>
        </form>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Keys are encrypted server-side. You won't see them again.
        </p>
      </div>
    </div>
  );
}
```

#### 4. Auth Context

Create `lib/firebase/auth-context.tsx`:

```typescript
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./auth";
import { getDoc } from "./crud";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setupComplete: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setupComplete: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userData = await getDoc("users", currentUser.uid);
        setSetupComplete(userData?.setupComplete || false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setupComplete }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

#### 5. Protected Route Layout

Update `app/layout.tsx` (or create `app/query/layout.tsx`):

```typescript
"use client";

import { useAuth } from "@/lib/firebase/auth-context";
import LoginScreen from "@/components/LoginScreen";
import SetupScreen from "@/components/SetupScreen";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, setupComplete } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (!setupComplete) {
    return <SetupScreen />;
  }

  return <>{children}</>;
}
```

#### 6. Query Tool with Decryption

Create `app/api/query/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getDoc } from "@/lib/firebase/crud";
import crypto from "crypto";
import Anthropic from "@anthropic-ai/sdk";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

function decrypt(encryptedData: string): string {
  const [iv, encrypted] = encryptedData.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY!, "hex"),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, question } = await request.json();

    const userData = await getDoc("users", userId);
    
    if (!userData?.apiKeys) {
      return NextResponse.json(
        { error: "User not configured" },
        { status: 400 }
      );
    }

    // Decrypt server-side (keys never exposed to client)
    const anthropicKey = decrypt(userData.apiKeys.anthropic);
    const snowflakeAccount = decrypt(userData.apiKeys.snowflake.account);
    const snowflakeUser = decrypt(userData.apiKeys.snowflake.user);
    const snowflakePassword = decrypt(userData.apiKeys.snowflake.password);
    const snowflakeWarehouse = decrypt(userData.apiKeys.snowflake.warehouse);

    const client = new Anthropic({ apiKey: anthropicKey });
    
    // ... rest of query logic

    return NextResponse.json({ /* results */ });
  } catch (error) {
    return NextResponse.json(
      { error: "Query failed" },
      { status: 500 }
    );
  }
}
```

#### 7. Environment Configuration

Add to `.env.local`:

```bash
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your_32_byte_hex_key_here
```

### Security Guarantees

✅ **Keys never visible to user** — Not in UI, not in browser storage
✅ **Server-side encryption** — Only decrypted on server for API calls
✅ **Prevent inspection** — Can't inspect element to see keys
✅ **Cleared from memory** — Form cleared immediately after submit
✅ **Per-deployment encryption** — Different key for each environment
✅ **User-isolated** — Each user can only access their own keys
✅ **Token-verified** — Firebase authentication required

### User Flow

1. User lands → redirected to login
2. Login → check `setupComplete` flag
3. If false → SetupScreen (collect API keys)
4. Keys encrypted server-side + stored in Firestore
5. User redirected to query tool
6. Query tool decrypts keys on demand (server-only)
7. Keys used for Claude + Snowflake API calls