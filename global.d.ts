declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
      STRIPE_PRIVATE_KEY: string;
    }
  }
}

// Convert it into a module by adding an empty export statement.
export {};
