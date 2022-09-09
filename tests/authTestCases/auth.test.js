const config = require("../config");
const { runTest } = require("../testConfig");
const request = require("supertest")(config.host[process.env.ENV || "development"]);
const common = require("../common-function");
const headers = common.headers;
const itif = (itCond) => (runTest.all ? it : itCond ? it : it.skip);
const test = runTest.auth;
const { data } = require("./authConfig");
describe("auth api test", () => {
    itif(test)("test 1 - should test register user api", async () => {
        // should show test missing username
        await request
            .post(config.api.auth.register)
            .send({ password: data.password })
            .set(headers)
            .expect(422)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "success": false,
                    "message": "Username is required"
                });
            })
        // should show error if password missing
        await request
        .post(config.api.auth.register)
        .send({ username: data.username })
        .set(headers)
        .expect(422)
        .expect((res) => {
            expect(res.body).toMatchObject({
                "success": false,
                "message": "Passwords must be at least 6 characters long"
            });
        })
        // should register a user with username and password
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
        // should not register again with same username
        await request
            .post(config.api.auth.register)
            .send(data)
            .set(headers)
            .expect(400)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "status": false,
                    "message": "User already exists with this username"
                });
            })
        // 
    });



    itif(test)("test 2 - should test login api", async () => {
        // should show error if username missing while login
        await request
            .get(config.api.auth.login)
            .send({ password: data.password })
            .set(headers)
            .expect(422)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "success": false,
                    "message": "Username is required"
                });
            })
        // should show error if password missing while login
        await request
            .get(config.api.auth.login)
            .send({ username: data.username })
            .set(headers)
            .expect(422)
            .expect((res) => {
                expect(res.body).toMatchObject({
                    "success": false,
                    "message": "Passwords must be at least 6 characters long"
                });
            })
        // user should be able to login with username and password
        await request
        .get(config.api.auth.login)
        .send(data)
        .set(headers)
        .expect(200)
        .expect((res) => {
            expect(res.body.user.username).toBe(data.username)
        })
        .expect((res) => {
            expect(res.body.token).toBeDefined()
            if(runTest.all && res.body.token) data.token = res.body.token
        })

    });   
});
