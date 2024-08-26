const request = require('supertest')
const app = require('../app')
const Category = require('../models/Category')
require('../models')

let productId
let TOKEN
let category

const BASE_URL = '/api/v1/products'
const BASE_URL_LOGIN = '/api/v1/users/login'

let product

beforeAll(async () => {

  const user = {
    email: "juan@gmail.com",
    password: "juan1234",
  }
  const res = await request(app)
    .post(BASE_URL_LOGIN)
    .send(user)
  
  TOKEN = res.body.token
  // console.log(TOKEN)

  category = await Category.create({name:'Technology'})

  product = {
    title: "Apple Iphone 15",
    description: "Lorem ipsum dolor sit amet.",
    price: 1000,
    categoryId: category.id
  }
})

afterAll((async () => {
  await category.destroy()
}))

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
  
  // console.log(res.body)
  
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

  expect(res.body.category.id).toBeDefined()
  expect(res.body.category.id).toBe(category.id)
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

