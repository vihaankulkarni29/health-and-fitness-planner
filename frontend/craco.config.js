module.exports = {
    style: {
        postcss: {
            mode: 'file',
        },
    },
    jest: {
        configure: {
            transformIgnorePatterns: [
                "node_modules/(?!(axios|axios-mock-adapter|react-router-dom|framer-motion|lucide-react)/)"
            ]
        }
    }
};
