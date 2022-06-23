const CracoAntDesignPlugin = require('craco-antd');

module.exports = {
    configure: {
        resolve: {
            fallback: {
                buffer: require.resolve('buffer/'),
            }
        }
    },
    plugins: [
        {
            plugin: CracoAntDesignPlugin
        }
    ],
    eslint: {
        enable: false,
    },
    jest: {
        configure: jestConfig => {
            jestConfig.transformIgnorePatterns = [];
            return jestConfig;
        }
    }
};