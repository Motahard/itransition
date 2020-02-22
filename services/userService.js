const Company = require('../models/Company');
const User = require('../models/User');
const { validationResult } = require("express-validator");

module.exports.getUserCompanies = async function(req, res) {
    const queryId = req.query.id;
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
            await company.delete();
            const companies = await Company.find({
                owner: queryId
            });
            res.send(companies);
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

    const queryId = req.query.id;
    try {
        const user = await User.findByIdAndUpdate(queryId, req.body, {new: true});
        if(!user) {
            res.status(400).send(null);
        }
        const response = {
            id: user._id,
            name: user.name,
            email: user.email,
            likes: user.likes,
            permission: user.permission,
            rates: user.rates,
            bonuses: user.bonuses,
            donates: user.donates,
            blocked: user.blocked
        };
        res.send(response);
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
            const response = {
                id: savedU._id,
                name: savedU.name,
                email: savedU.email,
                likes: savedU.likes,
                permission: savedU.permission,
                rates: savedU.rates,
                bonuses: savedU.bonuses,
                donates: savedU.donates,
                blocked: savedU.blocked
            };
            const savedCompany = await company.save();
            const savedCompanyMessages = savedCompany.comments;
            res.send({
                response,
                savedCompanyMessages
            });
        } else {
            user.likes.pull(commentId);
            company.comments.forEach(comment => {
                if(comment._id == commentId) {
                    comment.likes = comment.likes - 1;
                }
            })
            const savedU = await user.save();
            const response = {
                id: savedU._id,
                name: savedU.name,
                email: savedU.email,
                likes: savedU.likes,
                permission: savedU.permission,
                rates: savedU.rates,
                bonuses: savedU.bonuses,
                donates: savedU.donates,
                blocked: savedU.blocked
            };
            const savedCompany = await company.save();
            const savedCompanyMessages = savedCompany.comments;
            res.send({
                response,
                savedCompanyMessages
            });
        }
    } catch (error) {
        res.status(400).send({
            message: 'add like user error'
        })
    }
};

module.exports.addUserDonate = async function(req, res) {
    const { id } = req.query;
    const { _id } = req.user;
    const { sum } = req.body;
    try {
        const user = await User.findById(_id);
        let existCompany = false;
        user.donates.forEach(donate => {
            if(donate.idCompany === id) {
                existCompany = true;
                donate.count += +sum;
            }
        })
        if(!existCompany) {
            user.donates.push({
                idCompany: id,
                count: sum.toFixed()
            });
        }
        const savedUser = await user.save();
        const response = {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            likes: savedUser.likes,
            permission: savedUser.permission,
            rates: savedUser.rates,
            bonuses: savedUser.bonuses,
            donates: savedUser.donates,
            blocked: savedUser.blocked
        };
        res.send(response);
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports.addUserBonuse = async function(req, res) {
    const { idBonuse, idCompany } = req.body;
    const { _id } = req.user;
    try {
        const user = await User.findById(_id);
        let existBonuse = false;
        user.bonuses.forEach(bonuse => {
            if(bonuse.idBonuse === idBonuse) {
                bonuse.count += 1;
                existBonuse = true;
            }
        });
        if(!existBonuse) {
            user.bonuses.push({
                idBonuse: idBonuse,
                count: 1,
                idCompany: idCompany
            })
        }
        const savedUser = await user.save();
        const response = {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            likes: savedUser.likes,
            permission: savedUser.permission,
            rates: savedUser.rates,
            bonuses: savedUser.bonuses,
            donates: savedUser.donates,
            blocked: savedUser.blocked
        };
        res.send(response);
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports.getUserBonuse = async function(req, res) {
    const bonusesArr = req.body;
    const response = [];
    try {
        for(let i = 0; i < bonusesArr.length; i++) {
            const { idBonuse, idCompany } = bonusesArr[i];
            const company = await Company.findById(idCompany);
            if(company) {
                company.bonuses.forEach(bonuseItem => {
                    if(bonuseItem._id.toString() === idBonuse) {
                        response.push(bonuseItem);
                    }
                });
            }
        }
        res.send(response);
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports.getUsers = async function(req, res) {
    try {
        const users = await User.find({});
        const responseArr = [];
        users.forEach(user => {
            const response = {
                id: user._id,
                name: user.name,
                email: user.email,
                likes: user.likes,
                permission: user.permission,
                rates: user.rates,
                bonuses: user.bonuses,
                donates: user.donates,
                blocked: user.blocked
            }
            responseArr.push(response);
        });
        res.send(responseArr);
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports.changePermission = async function(req, res) {
    const { permission, id } = req.body;
    try {
        const user = await User.findById(id);
        user.permission = permission;
        const savedUser = await user.save();
        const response = {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            likes: savedUser.likes,
            permission: savedUser.permission,
            rates: savedUser.rates,
            bonuses: savedUser.bonuses,
            donates: savedUser.donates,
            blocked: savedUser.blocked
        };
        res.send(response);
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports.deleteUser = async function(req, res) {
  const { id } = req.query;
    try {
        const user = await User.findByIdAndDelete(id);
        const response = {
            id: id
        };
        res.send(response);
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports.blockUser = async function(req, res) {
    const { id, blocked } = req.body;
    try {
        const user = await User.findById(id);
        user.blocked = !blocked;
        const savedUser = await user.save();
        const response = {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            likes: savedUser.likes,
            permission: savedUser.permission,
            rates: savedUser.rates,
            bonuses: savedUser.bonuses,
            donates: savedUser.donates,
            blocked: savedUser.blocked
        };
        res.send(response);
    } catch (error) {
        res.status(400).send(error);
    }
};
