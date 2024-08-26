require('../models')
const request = require("supertest")
const app = require('../app')
const Category = require("../models/Category")
const Product = require("../models/Product")
const Cart = require("../models/Cart")

let TOKEN
let product
let category
let cart
let purchase


const BASE_URL = '/api/v1/purchase'
const BASE_URL_LOGIN = '/api/v1/users/login'

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
  

  cart = await Cart.create( {
    userId: res.body.user.id,
    productId: product.id,
    quantity: 1
  })
  // console.log(res.body)
  purchase = {
    userId: res.body.user.id,
    productId: product.id,
    quantity:1
  }

})

afterAll((async () => {
  await category.destroy()
  await product.destroy()
  await cart.destroy()
}))

//ENDPOINT POST 
test("POST -> BASE_URL, should return statusCode 201, and res.body[0].quantity === cart.quantity", async () => {

  const res = await request(app)
    .post(BASE_URL)
    // .send(purchase)
    .set('Authorization', `Bearer ${TOKEN}`)
    
  // console.log(res.body)
  
  expect(res.statusCode).toBe(201)
  expect(res.body).toBeDefined()
  expect(res.body[0].quantity).toBe(cart.quantity)
})

test("GET -> BASE_URL, should return statusCode 200, and res.body.length === 1", async () => {

  const res = await request(app)
    .get(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)
    
  // console.log(res.body)
  
  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)
})