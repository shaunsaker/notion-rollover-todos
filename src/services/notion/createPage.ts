import { CreatePageParameters, CreatePageResponse } from '@notionhq/client/build/src/api-endpoints'
import { notion } from '.'

export const createPage = async (
  databaseId: string,
  params: Omit<CreatePageParameters, 'parent'>,
): Promise<CreatePageResponse | null> => {
  // @ts-expect-error notion types incorrect - page_id is not needed here since we are using database_id as parent
  const createPageParams: CreatePageParameters = {
    ...params,
    parent: {
      type: 'database_id',
      database_id: databaseId,
    },
  }

  try {
    const response = await notion.pages.create({
      auth: process.env.NOTION_API_KEY,
      ...createPageParams,
    })

    return response
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
    }
  }

  return null
}
