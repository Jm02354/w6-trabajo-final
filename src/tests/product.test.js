const request = require('supertest')
const app = require('../app')

let TOKEN

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

let productId

const product = {
  title: "Apple Iphone 15",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  //categoryId
  price: 1000
}

const BASE_URL = '/api/v1/products'

//ENDPOINT POST
test("POST -> BASE_URL, should return statusCode 201, and res.body.title === product.title", async () => {
  
  const res = await request(app)
    .post(BASE_URL)
    .send(product)
    .set('Authorization', `Bearer ${TOKEN}`)
  
  productId = res.body.id

  expect(res.statusCode).toBe(201)
  expect(res.body).toBeDefined()
  expect(res.body.title).toBe(product.title)
})

//ENDPOINT GET
test("GET -> BASE_URL, should return statusCode 200, and res.body.length === 1", async () => {
  
  const res = await request(app)
    .get(BASE_URL)
  
  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)
})

//ENDPOINT GETONE
test("GET -> BASE_URL/productId, should return statusCode 200, and res.body.title === product.title", async () => {
  
  const res = await request(app)
    .get(`${BASE_URL}/${productId}`)
  
  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.title).toBe(product.title)
})

//ENDPOINT PUT
test("PUT -> BASE_URL/productId, should return statusCode 200, and res.body.title === productUpdate.title", async () => {

  const productUpdate = {
    title: "Toys"
  }

  const res = await request(app)
    .put(`${BASE_URL}/${productId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(productUpdate)
    
  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.title).toBe(productUpdate.title)
})

//ENDPOINT SET CATEGORIES


//ENDPOINT DELETE
test("DELETE -> BASE_URL/productId, should return statusCode 204, and res.body.title === product.title", async () => {

  const res = await request(app)
    .delete(`${BASE_URL}/${productId}`)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.statusCode).toBe(204)
})

