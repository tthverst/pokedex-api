// expose our config directly to our application using module.exports
module.exports = {
    'googleAuth': {
        'clientID': '371747015946-rgve1eeqn6je6tk180h671n4sc40caj3.apps.googleusercontent.com',
        'clientSecret': 'cxUXqQlUM5uiAN0HsukRYt2x',
        'callbackURL': 'http://localhost:8080/auth/google/callback'
    },
    'githubAuth': {
        'clientID': 'd62dd187a4b9faed432f',
        'clientSecret': 'dfed418b3ff1943174a28dbee8ee4813797a1027',
        'callbackURL': 'http://localhost:8080/auth/github/callback'
    }
};