const config = require("../config");
const { runTest } = require("../testConfig");
const request = require("supertest")(config.host[process.env.ENV || "development"]);
const common = require("../common-function");
const headers = common.headers;
const itif = (itCond) => (runTest.all ? it : itCond ? it : it.skip);
const test = runTest.tweet;
const { data, tweet } = require("./tweetConfig");
const authData = require("../authTestCases/authConfig").data
describe("tweet api tests", () => {
    let currentTweet
    itif(test)("test 1 - user should be able to login with valid credentials", async () => {
        // register a new user
        await request
            .post(config.api.auth.register)
            .send(data)
            .set(headers)
            .expect(200)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "status": true,
                    "message": "User created successfully"
                });
            })
        // login with valid credentials test
        await request
            .get(config.api.auth.login)
            .send({ password: data.password, username: data.username })
            .set(headers)
            .expect(200)
            .expect((res) => {
                expect(res.body.user.username).toBe(data.username)
            })
            .expect((res) => {
                expect(res.body.token).toBeDefined()
                if (res.body.token) {
                    headers.token = res.body.token
                    data.token = res.body.token
                }
            })

        // should not create tweet with invalid token
        await request
            .post(config.api.tweet.create)
            .send(tweet)
            .set(Object.assign({}, headers, { token: data.expiredToken }))
            .expect(401)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "status": false,
                    "message": "jwt expired"
                });
            })
        // should not create tweet with no content
        await request
            .post(config.api.tweet.create)
            .send({ content: "" })
            .set(headers)
            .expect(422)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "success": false,
                    "message": "tweet content is required"
                });
            })
        // should create tweet with content
        await request
            .post(config.api.tweet.create)
            .send(tweet)
            .set(headers)
            .expect(200)
            .expect((res) => {
                expect(res.body.tweet.content).toBe(tweet.content)
                expect(res.body.status).toBe("success")
                if (res.body.tweet._id) tweet._id = res.body.tweet._id
            })
    });

    itif(test)("test 2 - should test get tweet api", async () => {
        // should get tweet with valid tweet id
        await request
            .get(config.api.tweet.get + `/${tweet._id}`)
            .set(headers)
            .expect(200)
            .expect((res) => {
                expect(res.body.tweet.content).toBe(tweet.content)
                expect(res.body.status).toBe("success")
                if (res.body.tweet._id) {
                    tweet._id = res.body.tweet._id
                    tweet.userId = res.body.tweet.userId
                    currentTweet = res.body.tweet
                }
            })
        // should not get tweet with invalid  tweet id
        await request
            .get(config.api.tweet.get + `/${tweet.userId}`)
            .set(headers)
            .expect(400)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "status": false,
                    "message": "Tweet not found"
                });
            })
    });

    itif(test)("test 3 - should test get all tweet api", async () => {
        // should get all tweets for a user
        await request
            .get(config.api.tweet.getAll)
            .set(headers)
            .expect(200)
            .expect((res) => {
                expect(res.body.status).toBe("success")
            })
    });

    itif(test)("test 4 - should test update tweet api", async () => {
        // should update tweet content
        await request
            .put(config.api.tweet.update + `/${tweet._id}`)
            .send({ content: tweet.content + "abc" })
            .set(headers)
            .expect(200)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "message": "tweet updated",
                    "status": "success"
                });
            })

        // should update tweet's like
        await request
            .put(config.api.tweet.update + `/${tweet._id}`)
            .send({ like: true })
            .set(headers)
            .expect(200)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "message": "tweet updated",
                    "status": "success"
                });
            })
        // should varify the like's count after like
        await request
            .get(config.api.tweet.get + `/${currentTweet._id}`)
            .set(headers)
            .expect(200)
            .expect((res) => {
                expect(res.body.tweet.like).toBe(currentTweet.like + 1)
                expect(res.body.status).toBe("success")
            })
        // should update tweet's unlike
        await request
            .put(config.api.tweet.update + `/${tweet._id}`)
            .send({ like: false })
            .set(headers)
            .expect(200)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "message": "tweet updated",
                    "status": "success"
                });
            })
        // should varify the like after unlike
        await request
            .get(config.api.tweet.get + `/${currentTweet._id}`)
            .set(headers)
            .expect(200)
            .expect((res) => {
                expect(res.body.tweet.like).toBe(currentTweet.like)
                expect(res.body.status).toBe("success")
            })
        // should test update api with no content
        await request
            .put(config.api.tweet.update + `/${tweet._id}`)
            .send()
            .set(headers)
            .expect(400)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "message": "required parameter missing",
                    "status": false
                });
            })
        // should test update api with no content
        await request
            .put(config.api.tweet.update + `/${tweet.userId}`)
            .send()
            .set(headers)
            .expect(400)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "message": "Tweet not found",
                    "status": false
                });
            })
    });

    itif(test)("test 4 - should test delete tweet api", async () => {
        // should not delete tweet with invalid tweet id
        await request
            .delete(config.api.tweet.delete + `/${tweet.userId}`)
            .send(data)
            .set(headers)
            .expect(400)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "status": false,
                    "message": "Tweet not exist"
                });
            })

        // should varify the presence of tweet
        await request
            .get(config.api.tweet.get + `/${currentTweet._id}`)
            .set(headers)
            .expect(200)
            .expect((res) => {
                expect(res.body.tweet.like).toBe(currentTweet.like)
                expect(res.body.status).toBe("success")
            })

        // should delete tweet with valid tweet id
        await request
            .delete(config.api.tweet.delete + `/${tweet._id}`)
            .send(data)
            .set(headers)
            .expect(200)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "status": true,
                    "message": "Tweets deleted successfully"
                });
            })
        // should varify the presence of tweet
        await request
            .get(config.api.tweet.get + `/${currentTweet._id}`)
            .set(headers)
            .expect(400)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "status": false,
                    "message": "Tweet not found"
                });
            })

        // should not redelete the tweet
        await request
            .delete(config.api.tweet.delete + `/${tweet._id}`)
            .send(data)
            .set(headers)
            .expect(400)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "status": false,
                    "message": "Tweet already deleted"
                });
            })
    });
});
