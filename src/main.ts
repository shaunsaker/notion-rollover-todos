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
  console.log('Fetching the done items...')

  const doneItemsResponse = await queryDatabase(TODOS_DATABASE_ID, {
    filter: { or: [{ property: 'Done', checkbox: { equals: true } }] },
  })

  console.log(`Fetched ${doneItemsResponse?.results.length} done items!`)

  if (!doneItemsResponse) {
    console.error('No done items response!')

    return
  }

  if (!doneItemsResponse.results.length) {
    console.log('No done items, bailing!')

    return
  }

  // fetch the todos database
  console.log('Fetching the TODOs database...')

  const todosDatabase = await getDatabase(TODOS_DATABASE_ID)

  if (!todosDatabase) {
    console.error('No TODOs database response!')

    return
  }

  console.log('Fetched the TODOs database!')

  // fetch the todos archive database
  console.log('Fetching the TODOs archive database...')

  const todosArchiveDatabase = await getDatabase(TODOS_ARCHIVE_DATABASE_ID)

  if (!todosArchiveDatabase) {
    console.error('No TODOs archive database response!')

    return
  }

  console.log('Fetched the TODOs archive database!')

  // for each of the pages
  for await (const page of doneItemsResponse.results) {
    // recreate a page in the archive database
    console.log(`Creating a new page in the TODOs archive database...`)

    const createArchivedTodoResponse = await createPage(todosArchiveDatabase.id, {
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

    // if there's an error in creating the archived TODO, break (otherwise it's deleted below)
    if (!createArchivedTodoResponse) {
      break
    }

    console.log(`Created a new page in the TODOs archive database!`)

    // delete the page from the original database
    console.log(`Deleting the done page in the TODOs database...`)

    await deletePage(page.id)

    console.log(`Deleted the done page in the TODOs database!`)

    console.log(`All done 😎`)
  }
}

main()
