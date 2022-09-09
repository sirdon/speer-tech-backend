const Users = require("../models/User")
const Tweets = require("../models/Tweet")
module.exports = {
    async createTweet(req, res) {
        try {
            const { content } = req.body;
            let tweet = await new Tweets({
                content: content,
                userId: req.user._id,
            }).save()

            return res.status(200).json({ tweet, status: 'success' });

        } catch (error) {
            res.status(400).send({
                message: error.message, status: false
            })
        }
    },
    getTweet(req, res) {
        try {
            const { tweetId } =  req.params || req.body
            Tweets.findOne({ _id: tweetId, isActive:true }).exec((err, tweet) => {
                if (err || !tweet) {
                    return res.status(400).json({
                        message: "Tweet not found", status: false
                    });
                } else {
                    return res.status(200).json({ tweet, status: 'success' });
                }
            })
        } catch (error) {
            res.status(400).send({
                message: error.message, status: false
            })
        }
    },
    getAllTweet(req, res) {
        try {
            Tweets.find({ userId: req.user._id, isActive:true }).exec((err, tweets) => {
                if (err || !tweets) {
                    return res.status(400).json({
                        message: "Tweets not found", status: false
                    });
                } else {
                    return res.status(200).json({ tweets, status: 'success' });
                }
            })
        } catch (error) {
            res.status(400).send({
                message: error.message, status: false
            })
        }
    },
    updateTweet(req, res) {
        try {
            const { tweetId } = req.params || req.body
            const { content, like } = req.body
            Tweets.findOne({ _id: tweetId,isActive:true }).exec((err, tweet) => {
                if (err || !tweet) {
                    return res.status(400).json({
                        message: "Tweet not found", status: false
                    });
                } else {
                    if (content) {
                        tweet.content = content;
                    } else if (like === true) {
                        tweet.like = tweet.like + 1;
                    } else if (like === false) {
                        tweet.like = tweet.like - 1;
                    } else {
                        return res.status(400).send({
                            status: false,
                            message: "required parameter missing"
                        })
                    }
                    tweet.save()
                    return res.status(200).json({ message:"tweet updated", status: 'success' });
                }
            })
        } catch (error) {
            return res.status(400).send({
                status: false,
                message: error.message
            })
        }
    },
    removeTweet(req, res) {
        try {
            const { tweetId } = req.params || req.body
            Tweets.findOne({ _id: tweetId }).exec((err, tweet) => {
                if (err || !tweet) {
                    return res.status(400).json({
                        status: false,
                        message: "Tweet not exist",
                    });
                } else {
                    if (tweet.isActive === false) {
                        return res.status(400).send({
                            status: false,
                            message: "Tweet already deleted",
                        })
                    } else {
                        tweet.isActive = false;
                        tweet.save()
                        return res.status(200).json({ message: "Tweets deleted successfully", status: true });
                    }
                }
            })
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }
    },
    retweet(req, res) {
        try {
            const { tweetId } = req.params || req.body
            Tweets.findOne({ _id: tweetId, isActive:true }).exec((err, tweet) => {
                if (err || !tweet) {
                    return res.status(400).json({
                        error: "Tweet not exist with id " + tweetId,
                    });
                } else {
                    if (tweet.isActive === false) {
                        return res.status(400).send({
                            status: true,
                            message: "Tweet already deleted",
                        })
                    } else {
                        tweet.isActive = false;
                        tweet.save()
                        return res.status(200).json({ message: "Tweets deleted successfully" });
                    }
                }
            })
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }
    },


}
