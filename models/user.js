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
        roles: { type: [String], default: ["player"], required: true },
        pokemons: [Number]
    });

    userSchema.methods.generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    userSchema.methods.validPassword = function (password) {
        return bcrypt.compareSync(password, this.local.password);
    };

    userSchema.methods.hasAnyRole = function (roles) {
        if (!Array.isArray(roles)) {
            roles = [roles];
        }

        var lowerCaseRoles = _.map(this.roles, function (role) { return role.toLowerCase(); });
        for (var index in roles) {
            console.log(index);
            if (_.contains(lowerCaseRoles, roles[index].toLowerCase())) {
                // If any role matches, it's allright, we can return true;
                return true;
            }
        };

        return false;
    };

    userSchema.methods.hasAllRoles = function (roles) {
        if (!Array.isArray(roles)) {
            roles = [roles];
        }

        var lowerCaseRoles = _.map(this.roles, function (role) { return role.toLowerCase(); });
        for (var index in roles) {
            if (!_.contains(lowerCaseRoles, roles[index].toLowerCase())) {
                // If any role doesn't match, we can return false.
                return false;
            }
        };

        return true;
    };

    return mongoose.model('User', userSchema);
};

module.exports = init;