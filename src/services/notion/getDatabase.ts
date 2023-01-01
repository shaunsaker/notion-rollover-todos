import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { notion } from '.'

export const getDatabase = async (databaseId: string): Promise<DatabaseObjectResponse | null> => {
  try {
    const response = (await notion.databases.retrieve({
      auth: process.env.NOTION_API_KEY,
      database_id: databaseId,
    })) as DatabaseObjectResponse

    return response
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
    }
  }

  return null
}
