const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 6;

const projectSchema = Schema({
    name: String,
    img: String,
    description: String,
    github: String,
    technologies: [String],
    deployed: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const userSchema = Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    pic: {
        type: String,
        default: "https://static.thenounproject.com/png/5034901-200.png"
    },
    bio: {
        type: String,
        default: ''
    },
    github: {
        type: String,
        default: ''
    },
    instagram: {
        type: String,
        default: ''
    },
    portfolio: {
        type: String,
        default: ''
    },
    projects: [projectSchema]
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
          delete ret.password;
          return ret;
        }
    }
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    return next();
});


module.exports = mongoose.model('User', userSchema)