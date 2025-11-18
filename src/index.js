require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const {Pool , Client } = require('pg');
const os = require('os');
// init app
const app = express();
const port = process.env.PORT;

// connect to redis
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const redisClient = redis.createClient({
  url: `redis://${redisHost}:${redisPort}`
});
redisClient.on('connect', () => {
  console.log('Connected to Redis...');
});
redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
});
redisClient.connect();
// connect databse mongo
const userName = process.env.MONGO_INITDB_ROOT_USERNAME ;
const password = process.env.MONGO_INITDB_ROOT_PASSWORD ;
const db_Port = process.env.DB_PORT;
const db_Host = process.env.DB_HOST;

const URI = `mongodb://${userName}:${encodeURIComponent(password)}@${db_Host}:${db_Port}`;


mongoose.connect(URI)
.then(()=> console.log('connect to db...'))
.catch(err => console.log(err));
app.get('/', (req, res) => { 
  redisClient.set('products','Meow Product')
  redisClient.set('food', 'Meow food');
  console.log(`Traffic from ${os.hostname()}`); // OS is a module provides information about the computer's operating system
  res.send(`<h1>Hello, Meow!</h1>`)
});
app.get('/products', async (req, res) => { 
  const products = await redisClient.get('products');
  const food = await redisClient.get('food');
  console.log('Fetched products from Redis:', products);
  res.send(`<h1>Products: ${products}</h1><h1>Food: ${food}</h1>`);
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// connect to postgres
const posgresURI = `postgres://${process.env.POSTGRES_USER}:${encodeURIComponent(process.env.POSTGRES_PASSWORD)}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}`;
const client = new Client({
  connectionString: posgresURI
});
client.connect()
.then(() => {
  console.log('Connected to PostgreSQL...');
})
.catch(err => {
  console.error('PostgreSQL connection error:', err);
});