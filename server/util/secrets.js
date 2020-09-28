import dotenv from 'dotenv'
import fs from 'fs'

 if(fs.existsSync('.env')) {
    console.debug('Using .env file to supply config environment variables')
    dotenv.config({ path: '.env' })
 }

export const SENDGRID_API_KEY = process.env['SENDGRID_API_KEY']
export const FROM_MAIL = process.env['FROM_MAIL']

export const JWT_SECRET = process.env['JWT_SECRET']
export const MONGODB_URI = process.env['MONGODB_URI']

