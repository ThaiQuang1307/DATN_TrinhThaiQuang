const ENV_MODE = 'local';
const URL_CONFIG = {
    production: {
        
    },
    staging: {
        api_url: '',
        port: 80,
        ssl: true,
        prefix_url: '',
        version: '1.0.0'
    },
    dev: {
        api_url: 'ecourses-cms.vnit.top/api/v1/cms',
        api_url_ai: 'ecourses-cms.vnit.top/api/v1/ai',
        port: 80,
        ssl: true,
        prefix_url: '',
        version: '1.0.0'
    },
    local: {
        api_url: 'localhost:3000/api/v1/cms',
        api_url_ai: 'localhost:8000/api/v1/ai',
        port: 80,
        ssl: false,
        prefix_url: '',
        version: '1.0.0'
    }
};

export default URL_CONFIG[ENV_MODE];