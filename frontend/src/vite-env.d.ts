/// <reference types="vite/client" />

/**
 * Type-safe Vite environment variables for CivicGuide AI.
 * All VITE_* variables must be declared here to avoid TS2339 errors.
 */
interface ImportMetaEnv {
  /** Backend FastAPI base URL */
  readonly VITE_API_BASE_URL: string;

  // Firebase
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
