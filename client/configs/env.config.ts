class EnvConfig {
  public NEXT_PUBLIC_API_BASE_URL: string;
  public NEXT_PUBLIC_NODE_ENV: string;
  public NEXT_PUBLIC_SECRET_KEY: string;
  public NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
  public NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN: string;
  public NEXT_PUBLIC_DOMAIN_URL: string;
  public SENTRY_AUTH_TOKEN: string;

  constructor() {
    this.NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    this.NEXT_PUBLIC_NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV || "";
    this.NEXT_PUBLIC_SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "";
    this.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    this.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN =
      process.env.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN || "";
    this.NEXT_PUBLIC_DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN_URL || "";
    this.SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || "";
  }

  public validateConfig(): void {
    const missing = Object.entries(this).filter(([, value]) => !value);
    if (missing.length > 0) {
      const missingKeys = missing.map(([key]) => key).join(", ");
      throw new Error(`Missing public environment variables: ${missingKeys}`);
    }
  }
}

export const envConfig: EnvConfig = new EnvConfig();
