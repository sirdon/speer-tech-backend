const baseUrl = "http://localhost:3002";
const adminAPI = "/api/v1";
module.exports = {
    username: "amit",
    password: "12345678",
    host: { development: baseUrl },
    adminAPI,
    api: {
        auth: {
            login: adminAPI + "/auth/login",
            register: adminAPI + "/auth/register"
        },
        tweet: {
            create: adminAPI + "/tweet/create",
            get: adminAPI + "/tweet/get",
            getAll: adminAPI + "/tweet/get-all",
            update: adminAPI + "/tweet/update",
            delete: adminAPI + "/tweet/delete",
        }
    },
};
