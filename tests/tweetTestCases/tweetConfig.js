const data = {
    username: "user" + new Date().getTime(),
    password: "12345678",
    expiredToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzA5ZmFkZDU3YjMwOGZmNjc5ZDkwMDciLCJpYXQiOjE2NjE1OTk1MDcsImV4cCI6MTY2MTY4NTkwN30.giLru1nnG80H_Q87wm04ChyNtmcfud0jvQS4wAOq9WE",
    token: ""
};

const tweet = {
    content: "test dummy content"
}

module.exports.data = data;
module.exports.tweet = tweet;
