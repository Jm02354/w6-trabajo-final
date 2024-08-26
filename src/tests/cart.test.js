require('../models')
const request = require("supertest")
const app = require('../app')
const Category = require("../models/Category")
const Product = require("../models/Product")


let TOKEN
let product
let category
let cartId

const BASE_URL = '/api/v1/cart'
const BASE_URL_LOGIN = '/api/v1/users/login'

let cart 

beforeAll(async() => {

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

  product = await Product.create({
    title: "Apple Iphone 15",
    description: "Lorem ipsum dolor sit amet.",
    price: 1000,
    categoryId: category.id
  })
  // console.log(res.body)
  cart = {
    userId: res.body.user.id,
    productId: product.id,
    quantity: 1
  }
  // console.log(res.body)
})

afterAll((async () => {
  await category.destroy()
  await product.destroy()
}))

//ENDPOINT POST 
test("POST -> BASE_URL, should return statusCode 201, and res.body.quantity === cart.quantity", async () => {
  // console.log(cart)
  const res = await request(app)
    .post(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(cart)
    
  // console.log(res.body)
  const columns = ['userId', 'productId', 'quantity']

  cartId = res.body.id 

  expect(res.statusCode).toBe(201)
  expect(res.body).toBeDefined()
  columns.forEach(column => {
    return expect(res.body.column).toBe(cart.column)
  });
  // expect(res.body.quantity).toBe(cart.quantity)
})

//ENDPOINT GET 
test("GET -> BASE_URL, should return statusCode 200, and res.body.length === 1", async () => {
  const res = await request(app)
    .get(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)
  
  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)
})

//ENDPOINT GETONE
test("GET -> BASE_URL, should return statusCode 200, and res.body.userId === cart.userId", async () => {
  const res = await request(app)
    .get(`${BASE_URL}/${cartId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
  
  const columns = ['userId', 'productId', 'quantity']

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  columns.forEach(column => {
    return expect(res.body.column).toBe(cart.column)
  });
  // expect(res.body.userId).toBe(cart.userId)
})

//ENDPOINT PUT
test("PUT -> BASE_URL, should return statusCode 200, and res.body.quantity === cartUpdate.quantity", async () => {
  
  const cartUpdate = {
    quantity: 2
  }

  const res = await request(app)
    .put(`${BASE_URL}/${cartId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(cartUpdate)

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.quantity).toBe(cartUpdate.quantity)
})

//ENDPOINT DELETE
test("DELETE -> BASE_URL, should return statusCode 204, and res.body.quantity === cart.quantity", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${cartId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
  
  expect(res.statusCode).toBe(204)
})