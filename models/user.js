var _ = require('underscore');
var bcrypt = require('bcrypt-nodejs');

var init = function (mongoose) {
    var userSchema = mongoose.Schema({
        local: {
            username: { type: String, unique: true, lowercase: true, required: true },
            password: { type: String, required: true }
        },
        google: {
            id: String,
            token: String,
            email: String,
            name: String,
        },
        github: {
            id: String,
            token: String,
            username: String,
            name: String
        },
        role: { type: String, default: "player", required: true },
        pokemons: [{ type: Number, ref: 'Pokemon' }]
    });

    userSchema.methods.generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    userSchema.methods.validPassword = function (password) {
        return bcrypt.compareSync(password, this.local.password);
    };

    return mongoose.model('User', userSchema);
};

module.exports = init;