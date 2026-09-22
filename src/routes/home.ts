import { Hono } from 'hono'
import { homeHTML } from '../templates/home'

export const homePage = new Hono()

homePage.get('/', (c) => {
  return c.html(homeHTML())
})
