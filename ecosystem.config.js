// ecosystem.config.js

module.exports = {
    apps: [
        {
            name: 'zoi-app',
            script: 'build/src/main.js',
            watch: ['dist', 'assets'],
            watch_delay: 500,
            ignore_watch: ['node_modules', 'logs'],
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};