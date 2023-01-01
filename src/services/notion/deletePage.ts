import { UpdatePageResponse } from '@notionhq/client/build/src/api-endpoints'
import { notion } from '.'

export const deletePage = async (pageId: string): Promise<UpdatePageResponse | null> => {
  try {
    const response = await notion.pages.update({
      auth: process.env.NOTION_API_KEY,
      page_id: pageId,
      archived: true,
    })

    return response
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
    }
  }

  return null
}
