import { CreatePageParameters, CreatePageResponse } from '@notionhq/client/build/src/api-endpoints'
import { notion } from '.'

export const createPage = async (
  params: CreatePageParameters,
): Promise<CreatePageResponse | null> => {
  try {
    const response = await notion.pages.create({
      auth: process.env.NOTION_API_KEY,
      ...params,
    })

    return response
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
    }
  }

  return null
}
