import { Handler, schedule } from '@netlify/functions'
import dotenv from 'dotenv'

dotenv.config()

const mainHandler: Handler = async () => {
  const response = await fetch(process.env.NETLIFY_BUILD_HOOK_URL, { method: 'POST' })

  return {
    statusCode: response.status,
  }
}

export const handler = schedule('@daily', mainHandler)
