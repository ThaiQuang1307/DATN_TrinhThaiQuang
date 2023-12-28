import Dotenv from 'dotenv-webpack';

export default {
    plugins: [new Dotenv()],
    node: {
        fs: 'empty'
    }
};
