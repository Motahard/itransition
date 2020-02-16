const Company = require('../models/Company');
const User = require('../models/User');
const { validationResult } = require("express-validator");

module.exports.getUserCompanies = async function(req, res) {
    const queryId = req.user._id;
    try {
        const companies = await Company.find({
            owner: queryId
        });
        res.send(companies);
    } catch (error) {
        res.status(400).send({
            message: 'get user companies error'
        });
    }
};

module.exports.deleteUserCompany = async function(req, res) {
    const queryId = req.user._id;
    try {
        const company = await Company.findById(req.query.id);
        if(company.owner === queryId) {
            await company.delete();
            const companies = await Company.find({
                owner: queryId
            });
            res.send(companies);
        }
    } catch (error) {
        res.status(400).send({
            message: 'delete user companies error'
        });
    }
}

module.exports.updateUserData = async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const user = await User.findById(req.user._id);
        return res.status(200).send(user);
    }

    const queryId = req.user._id;
    try {
        const user = await User.findByIdAndUpdate(queryId, req.body, {new: true});
        if(!user) {
            res.status(400).send(null);
        }
        const updatedUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            likes: user.likes,
            permission: user.permission,
            rates: user.rates
        }
        res.send(updatedUser);
    } catch (error) {
        res.status(400).send({
            message: 'update user error'
        })
    }
};

module.exports.addUserLike = async function(req, res) {
    const queryId = req.user._id;
    const companyId = req.body.companyId;
    const commentId = req.body.commentId;
    try {
        const user = await User.findById(queryId);
        const company = await Company.findById(companyId);
        let consistCommentId = false;
        user.likes.forEach(like => {
            if (like == commentId) {
                consistCommentId = true;
            }
        });


        if(!consistCommentId) {
            user.likes.push(commentId);
            company.comments.forEach(comment => {
                if(comment._id == commentId) {
                    comment.likes = comment.likes + 1;
                }
            });
            const savedU = await user.save();
            const savedUser = {
                id: savedU._id,
                name: savedU.name,
                email: savedU.email,
                permission: savedU.permission,
                likes: savedU.likes,
                rates: savedU.rates
            };
            const savedCompany = await company.save();
            const savedCompanyMessages = savedCompany.comments;
            res.send({
                savedUser,
                savedCompanyMessages
            });
        } else {
            user.likes.pull(commentId);
            company.comments.forEach(comment => {
                if(comment._id == commentId) {
                    comment.likes = comment.likes - 1;
                }
            })
            const savedUser = await user.save();
            const savedCompany = await company.save();
            const savedCompanyMessages = savedCompany.comments;
            res.send({
                savedUser,
                savedCompanyMessages
            });
        }
    } catch (error) {
        res.status(400).send({
            message: 'add like user error'
        })
    }
};
