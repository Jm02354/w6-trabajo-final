const request = require("supertest")
const app = require("../app");
const User = require("../models/User");
// require('../models')

let TOKEN
let TOKEN2 

beforeAll(async () => {
  const user = {
    email: "juan@gmail.com",
    password: "juan1234",
  }
  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(user)
  
  TOKEN = res.body.token
  // console.log(TOKEN)
})

let userId 

const user = {
    firstName: "Raul",
    lastName: "Jimenez",
    email: "rjimenez@gmail.com",
    password: "raul123",
    phone:"985698521"
};

const BASE_URL = '/api/v1/users'

//Endpoint POST 
test("POST -> BASE_URL, should return statusCode 201, and res.body.firstName === user.firstName", async () => {
  
  const columns = ['firstName', 'lastName', 'email', 'password', 'phone']
  const res = await request(app)
    .post(BASE_URL) //URL
    .send(user) //BODY
  
  userId = res.body.id
  
  expect(res.statusCode).toBe(201)
  expect(res.body).toBeDefined()
  columns.forEach((column) => {
    expect(res.body.column).toBe(user.column)
  })
  // expect(res.body.firstName).toBe(user.firstName)
})

// //Endpoint GET
test("GET -> BASE_URL, should return statusCode 200, and res.body.length === 2", async () => {

  const res = await request(app)
    .get(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)
  
  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(2)
})

//LOGIN
test("POST -> 'BASE_URL/LOGIN', should return statusCode 200, and res.body.user.email === user.email", async () => {
  const hits = {
    email: "rjimenez@gmail.com",
    password: "raul123"
  }

  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(hits)
  
  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.user).toBeDefined()
  expect(res.body.token).toBeDefined()
  expect(res.body.user.email).toBe(hits.email)
})

//TEST ERROR
test("POST -> 'BASE_URL/LOGIN', should return statusCode 401", async () => {
  const hits = {
    email: "rjimenez@gmail.com",
    password: "invalidPassword"
  }
  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(hits)
  
  expect(res.statusCode).toBe(401)
})



//Endpoint PUT
test("PUT -> BASE_URL/userId, should return statusCode 200, and res.body.firstName === userUpdate.firstName", async () => {

  const userUpdate = {
    firstName: "Santiago"
  }

  const res = await request(app)
    .put(`${BASE_URL}/${userId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(userUpdate)
    
  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.firstName).toBe(userUpdate.firstName)
})

//Endpoint DELETE
test("DELETE -> BASE_URL/userId, should return statusCode 204, and res.body.firstName === user.firstName", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${userId}`)
    .set('Authorization', `Bearer ${TOKEN}`)  
  
  expect(res.statusCode).toBe(204)
})