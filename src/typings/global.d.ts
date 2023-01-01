declare namespace NodeJS {
  export interface ProcessEnv {
    NOTION_API_KEY: string
    NOTION_TODOS_DATABASE_ID: string
    NOTION_TODOS_ARCHIVE_DATABASE_ID: string
  }
}
