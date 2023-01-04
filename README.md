# Notion Rollover TODOs

## What is it?

A script that stores and archives your done TODOs from a [Notion](https://www.notion.so/) database. It runs on a daily schedule thanks to [Netlify Scheduled Functions](https://docs.netlify.com/functions/scheduled-functions/).

## Why?

I want to keep track of done TODOs over time. I might also want to see some stats in the future 🤓.

## Caveats

- If you add any new properties to your TODOs database, you need to also add it to the TODOs archive database.
- If a done TODO has children pages, these won't be copied to the archive database. If there's interest in this I can make it happen in the future but for now, I don't need it.

## Setup

### A. Notion

My current TODOs format is a Notion inline table (database). This is a nice setup since it allows you to add various properties to each TODO and even children pages if you like.

The gist of the Notion setup is that you want to create two of these inline tables (databases), one for your TODOs and onoe for your TODOs archive. Once that is done, we need to set up an integration and connect it to your databases ✅

1. Create a new Notion page with any icon, cover and title. I'd suggest simply using "TODOs" as the title.
2. Add a new "Database - Inline" with any title to this page.
3. Add a few properties to the database. **At a minimum, the script needs a `Done` checkbox property.** You can use any other properties, my current setup is: `Name` text, `Priority` select, `Resume On` date, `Due Date` date, `Done` checkbox. Note your [database_id](https://developers.notion.com/docs/create-a-notion-integration#step-3-save-the-database-id). You'll add this in step B.4 as `NOTION_TODOS_DATABASE_ID`.
4. Now [create an integration](https://developers.notion.com/docs/create-a-notion-integration) and connect it to your new TODOs database. Note your "Internal Integration Token". You'll add this in step B.4 as `NOTION_API_KEY`. Now you have a working TODOs database 😄
5. Let's create the TODOs archive database. To do this, simply [duplicate](https://www.notion.so/help/duplicate-public-pages) the TODOs page and name it anything else, e.g. "TODOs Archive". Note your [database_id](https://developers.notion.com/docs/create-a-notion-integration#step-3-save-the-database-id). You'll add this in step B.4 as `NOTION_TODOS_ARCHIVE_DATABASE_ID`.
6. [Connect your integration](https://developers.notion.com/docs/create-a-notion-integration#step-2-share-a-database-with-your-integration) created in step A.4 to the duplicated TODOs archive.

### B. Netlify

Basically you want to create a fork of this repo, connect it to Netlify and add the relevant environmental variables ✅

1. Create a fork of https://github.com/shaunsaker/notion-rollover-todos.
2. [Connect](https://docs.netlify.com/configure-builds/repo-permissions-linking/) the forked Github repo to Netlify.
3. Add a [build hook](https://docs.netlify.com/configure-builds/build-hooks/) to your Netlify site. Note this url as you'll add it in step B.4 as the `NETLIFY_BUILD_HOOK_URL`.
4. Add the following environmental variables to the build settings:

```
NODE_VERSION=18.12.1
NETLIFY_BUILD_HOOK_URL=?
NOTION_API_KEY=?
NOTION_TODOS_DATABASE_ID=?
NOTION_TODOS_ARCHIVE_DATABASE_ID=?
```

5. Crack a beer, your're done 🍻

## Modifying the code

Feel free to modify the code as you see fit. The script itself can be found in `./src/main.ts` and the netlify scheduled function handler can be found in `./netlify/functions/notion-rollover-todos.ts`. Simply push the new changes to `master` for the new build to take affect 🙂
