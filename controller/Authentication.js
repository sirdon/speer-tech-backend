const Users = require("../models/User")
const jwt = require("jsonwebtoken")
module.exports = {
    async register(req, res) {
        try {
            const { username, password } = req.body;
            const userData = { username, password };
            // existing user check
            const existingUser = await Users.findOne({ username });
            if (existingUser) throw new Error("User already exists with this username")

            const user = await new Users(userData).save()
            if (user) {
                res.status(200).send({
                    status: true,
                    message: "User created successfully"
                })
            } else {
                res.status(400).send({
                    status: false,
                    message: "Something went wrong while creating user"
                })
            }
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }
    },
    login(req, res) {
        try {
            const { username, password } = req.body;
            Users.findOne({ username }).exec((err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        status: false,
                        error: `User with ${username} does not exist. Please register`,
                    });
                }

                // authenticate user
                if (!user.authenticate(password)) {
                    return res.status(400).json({
                        status: false,
                        error: "username and password not matched",
                    });
                }
                // generate a token and send to client
                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: "1d",
                });
                res.cookie("token", token, {
                    expiresIn: "1d",
                });
                user.token = token;
                user.save();
                const { _id, username } = user;
                return res.json({ user: { _id, username }, token });
            })

        } catch (error) {
            res.status(400).send({
                status: false,
                error: error.message
            })
        }
    },
    logout(req, res) {
        try {
            res.clearCookie("token");
            res.status(200).json({
                status: true,
                message: "Logout successful",
            });

        } catch (error) {
            return res.status(400).json({
                status: false,
                error: "Error while logging out",
            });
        }
    },
    validateToken(req, res, next) {
        try {

            const token = req.headers.token || req.body.token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            Users.findOne({ _id: decoded._id }).exec((err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        status: false,
                        error: "Please re-login",
                    });
                } else {
                    req.user = decoded;
                    next();
                }

            })
        } catch (err) {
            return res.status(401).json({
                status: false,
                message: err.message,
            });
        }
    }

}
