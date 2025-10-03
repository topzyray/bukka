class EnvConfig {
  public NEXT_PUBLIC_API_BASE_URL: string;
  public NEXT_PUBLIC_NODE_ENV: string;
  public NEXT_PUBLIC_SECRET_KEY: string;
  public NEXT_PUBLIC_SCHOOL_NAME_FULL: string;
  public NEXT_PUBLIC_SCHOOL_NAME_SHORT: string;
  public NEXT_PUBLIC_SCHOOL_EMAIL: string;
  public NEXT_PUBLIC_SCHOOL_PHONE: string;
  public NEXT_PUBLIC_SCHOOL_ADDRESS: string;
  public NEXT_PUBLIC_SCHOOL_CITY: string;
  public NEXT_PUBLIC_SCHOOL_COUNTRY: string;
  public NEXT_PUBLIC_SCHOOL_MOTTO: string;
  public NEXT_PUBLIC_SCHOOL_DOMAIN: string;

  constructor() {
    this.NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    this.NEXT_PUBLIC_NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV || "";
    this.NEXT_PUBLIC_SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "";
    this.NEXT_PUBLIC_SCHOOL_NAME_FULL = process.env.NEXT_PUBLIC_SCHOOL_NAME_FULL || "";
    this.NEXT_PUBLIC_SCHOOL_NAME_SHORT = process.env.NEXT_PUBLIC_SCHOOL_NAME_SHORT || "";
    this.NEXT_PUBLIC_SCHOOL_EMAIL = process.env.NEXT_PUBLIC_SCHOOL_EMAIL || "";
    this.NEXT_PUBLIC_SCHOOL_PHONE = process.env.NEXT_PUBLIC_SCHOOL_PHONE || "";
    this.NEXT_PUBLIC_SCHOOL_ADDRESS = process.env.NEXT_PUBLIC_SCHOOL_ADDRESS || "";
    this.NEXT_PUBLIC_SCHOOL_CITY = process.env.NEXT_PUBLIC_SCHOOL_CITY || "";
    this.NEXT_PUBLIC_SCHOOL_COUNTRY = process.env.NEXT_PUBLIC_SCHOOL_COUNTRY || "";
    this.NEXT_PUBLIC_SCHOOL_MOTTO = process.env.NEXT_PUBLIC_SCHOOL_MOTTO || "";
    this.NEXT_PUBLIC_SCHOOL_DOMAIN = process.env.NEXT_PUBLIC_SCHOOL_DOMAIN || "";
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
