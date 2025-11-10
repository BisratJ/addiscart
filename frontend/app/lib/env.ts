/**
 * Environment configuration and validation
 * Ensures all required environment variables are present
 */

interface EnvConfig {
  // API
  API_URL: string;
  
  // Auth
  NEXTAUTH_URL?: string;
  NEXTAUTH_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  
  // Stripe
  STRIPE_PUBLIC_KEY?: string;
  
  // Feature Flags
  ENABLE_GOOGLE_AUTH: boolean;
  ENABLE_STRIPE: boolean;
  ENABLE_ANALYTICS: boolean;
  ENABLE_PWA: boolean;
  
  // Environment
  NODE_ENV: 'development' | 'production' | 'test';
  IS_PRODUCTION: boolean;
  IS_DEVELOPMENT: boolean;
}

/**
 * Get and validate environment variables
 */
function getEnvConfig(): EnvConfig {
  const nodeEnv = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
  
  return {
    // API
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
    
    // Auth
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    
    // Stripe
    STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    
    // Feature Flags
    ENABLE_GOOGLE_AUTH: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === 'true',
    ENABLE_STRIPE: process.env.NEXT_PUBLIC_ENABLE_STRIPE === 'true',
    ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    ENABLE_PWA: process.env.NEXT_PUBLIC_ENABLE_PWA === 'true',
    
    // Environment
    NODE_ENV: nodeEnv,
    IS_PRODUCTION: nodeEnv === 'production',
    IS_DEVELOPMENT: nodeEnv === 'development',
  };
}

/**
 * Validate required environment variables
 */
function validateEnv(config: EnvConfig): void {
  const errors: string[] = [];
  
  // Required variables
  if (!config.API_URL) {
    errors.push('NEXT_PUBLIC_API_URL is required');
  }
  
  // Conditional requirements
  if (config.ENABLE_GOOGLE_AUTH) {
    if (!config.GOOGLE_CLIENT_ID) {
      errors.push('GOOGLE_CLIENT_ID is required when Google Auth is enabled');
    }
    if (!config.GOOGLE_CLIENT_SECRET) {
      errors.push('GOOGLE_CLIENT_SECRET is required when Google Auth is enabled');
    }
  }
  
  if (config.ENABLE_STRIPE && !config.STRIPE_PUBLIC_KEY) {
    errors.push('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is required when Stripe is enabled');
  }
  
  if (config.IS_PRODUCTION) {
    if (!config.NEXTAUTH_SECRET) {
      errors.push('NEXTAUTH_SECRET is required in production');
    }
    if (!config.NEXTAUTH_URL) {
      errors.push('NEXTAUTH_URL is required in production');
    }
  }
  
  if (errors.length > 0) {
    console.error('❌ Environment configuration errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    
    if (config.IS_PRODUCTION) {
      throw new Error('Invalid environment configuration');
    }
  }
}

// Export validated config
export const env = getEnvConfig();

// Validate on import (only in production)
if (env.IS_PRODUCTION) {
  validateEnv(env);
}

// Helper to check if feature is enabled
export function isFeatureEnabled(feature: keyof Pick<EnvConfig, 'ENABLE_GOOGLE_AUTH' | 'ENABLE_STRIPE' | 'ENABLE_ANALYTICS' | 'ENABLE_PWA'>): boolean {
  return env[feature];
}

export default env;
