import {
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { notion } from '.'

export const queryDatabase = async (
  databaseId: string,
  params?: Partial<QueryDatabaseParameters>,
): Promise<QueryDatabaseResponse | null> => {
  try {
    const response = await notion.databases.query({
      auth: process.env.NOTION_API_KEY,
      ...params,
      database_id: databaseId,
    })

    return response
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
    }
  }

  return null
}
