const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

//Look into adding validation for the bookData object to secure sql injection attemtps.
//const Joi = require('joi');
//
//const bookDataSchema = Joi.object({
//  title: Joi.string().required(),
//  authors: Joi.array().items(Joi.string()).required(),
//  description: Joi.string().required(),
//  bookId: Joi.string().required(),
//  image: Joi.string().uri().required(),
//  link: Joi.string().uri().required(),
//});


const resolvers = {
    Query: {
        me: async (parent, ars, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user._id}).select("-__v -password").populate('savedBooks');
                return userData;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect Uername or Password');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect Username or Password');
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { BookData }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $addToSet: { savedBooks: BookData } },
                    { new: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('Not logged in');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('Not logged in');
        },
    },
};

module.exports = resolvers;