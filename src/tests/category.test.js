const request = require("supertest")
const app = require("../app")


beforeAll(async () => {

  BASE_URL_LOGIN = '/api/v1/users'
  const user = {
    email: "juan@gmail.com",
    password: "juan1234",
  }
  const res = await request(app)
    .post(`${BASE_URL_LOGIN}/login`)
    .send(user)
  
  TOKEN = res.body.token
  // console.log(TOKEN)
})

let categoryId

const category =  {
    name: "Technology"
}
  
const BASE_URL = '/api/v1/categories'

test("POST -> BASE_URL, should return statusCode 201, and res.body.name === category.name", async () => {

  const res = await request(app)
    .post(BASE_URL)
    .send(category)
    .set('Authorization', `Bearer ${TOKEN}`)
  
  categoryId = res.body.id

  expect(res.statusCode).toBe(201)
  expect(res.body).toBeDefined()
  expect(res.body.name).toBe(category.name)
})

test("GET -> BASE_URL, should return statusCode 200, and res.body.length === 1", async () => {

  const res = await request(app)
    .get(BASE_URL)
  
  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)
})