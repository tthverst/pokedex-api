var _ = require('underscore');

var init = function (mongoose) {
    var userSchema = mongoose.Schema({
        role: String,
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
        pokemons: [Number]
    });

    userSchema.methods.hasAnyRole = function (roles) {
        if (!Array.isArray(roles)) {
            roles = [roles];
        }

        var lowerCaseRoles = _.map(this.roles, function (role) { return role.toLowerCase(); });
        for (var index in roles) {
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