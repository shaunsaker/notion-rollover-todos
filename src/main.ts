import dayjs from 'dayjs'
import dotenv from 'dotenv'
import { createPage } from './services/notion/createPage'
import { deletePage } from './services/notion/deletePage'
import { getDatabase } from './services/notion/getDatabase'
import { queryDatabase } from './services/notion/queryDatabase'

dotenv.config()

const TODOS_DATABASE_ID = process.env.NOTION_TODOS_DATABASE_ID
const TODOS_ARCHIVE_DATABASE_ID = process.env.NOTION_TODOS_ARCHIVE_DATABASE_ID

async function main() {
  // get done items, i.e. all the pages in the database that have a property "Done" of true
  const doneItemsResponse = await queryDatabase(TODOS_DATABASE_ID, {
    filter: { or: [{ property: 'Done', checkbox: { equals: true } }] },
  })

  if (!doneItemsResponse) {
    return
  }

  // fetch the todos database
  const todosDatabase = await getDatabase(TODOS_DATABASE_ID)

  if (!todosDatabase) {
    return
  }

  // fetch the todos archive database
  const todosArchiveDatabase = await getDatabase(TODOS_ARCHIVE_DATABASE_ID)

  if (!todosArchiveDatabase) {
    return
  }

  // for each of the pages
  for await (const page of doneItemsResponse.results) {
    // recreate a page in the archive database
    await createPage(todosArchiveDatabase.id, {
      ...page,
      properties: {
        ...page.properties,
        'Completed On': {
          type: 'date',
          date: {
            // set the completed on date to yesterday
            start: dayjs().subtract(1, 'day').toISOString(),
          },
        },
      },
      // @ts-expect-error notion types incorrect - the external prop is missing intentionally
      icon: page.icon,
    })

    // delete the page from the original database
    await deletePage(page.id)
  }
}

main()
