# speer-tech-backend

# API documentation
## Routes
Here is the API address: https://speer-tech.herokuapp.com.
Postman collection link:- https://www.getpostman.com/collections/dd50c787caa388648d16
## Task 1
### Auth Api
* POST - https://speer-tech.herokuapp.com/api/v1/auth/login: to login with username and password. You'll need to send a JSON in the request body:
{
    "password":"12345678",
    "username":"usename"
}
* POST - https://speer-tech.herokuapp.com/api/v1/auth/logout: to logout from current login
* POST - https://speer-tech.herokuapp.com/api/v1/auth/register: to register with username and password. You'll need to send a JSON in the request body:
{
    "password":"12345678",
    "username":"usename"
}



### Tweet Api
* POST - https://speer-tech.herokuapp.com/api/v1/tweet/create: to register with username and password. You'll need to send a JSON in the request body:
{
    "content":"test tweet 3"
}
and token in headers:
token : your login token

* GET - https://speer-tech.herokuapp.com/api/v1/tweet/get/tweetId: to get a tweet with tweetId
* GET - https://speer-tech.herokuapp.com/api/v1/tweet/get-all: to get all tweets of logged in user
* PUT - https://speer-tech.herokuapp.com/api/v1/tweet/update/tweetId: to update tweet with tweetId. You'll need to send a JSON in the request body:
{
   "content":"edit content"
}
or  to increment the tweet's like
{
   "like":true
}
or  to decrease the tweet's like
{
   "like":false
}
* DELETE - https://speer-tech.herokuapp.com/api/v1/tweet/delete/tweetId: to delete tweet with tweetId.

## To run test cases: npm run test

## Task 2

### Stock Api

* PUT - https://speer-tech.herokuapp.com/api/v1/stock/add-balance: to add balance to user's wallet. You'll need to send a JSON in the request body:
{
    "balance":200000
}
* GET - https://speer-tech.herokuapp.com/api/v1/stock/get-user: to get user's data
* POST - https://speer-tech.herokuapp.com/api/v1/stock/buy-stock: to buy stock at current market price. You'll need to send a JSON in the request body:
{
    "quantity":1,
    "symbol":"TCS"
}
* POST - https://speer-tech.herokuapp.com/api/v1/stock/sell-stock: to sell stock at current market price. You'll need to send a JSON in the request body:
{
    "quantity":1,
    "symbol":"TCS"
}
* GET - https://speer-tech.herokuapp.com/api/v1/stock/get-protfolio: to get user's portfolio
* POST - https://speer-tech.herokuapp.com/api/v1/stock/live-subscription: to start live data subscription.
* Get - https://speer-tech.herokuapp.com/api/v1/stock/get-live-data: to live data from symbol. You'll need to send a JSON in the request body:
{
    "symbol":"TCS"
}

