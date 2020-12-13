declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string,
    SECRET: string,
    DATABASE_URL: string,
  }
}