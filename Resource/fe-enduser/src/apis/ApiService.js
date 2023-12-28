import axios from 'axios';
import CONFIG from '../core/configs/config';
import { getSavedInfo } from '../core/utils/browser';

const HTTP_METHODS = [ 'get', 'post', 'put', 'delete', 'patch' ];

class ApiService {

    constructor(url = null, headers = null, apiAI = false) {
        this.headers = headers;
        const http = CONFIG.ssl ? 'https' : 'http';
        this.url = `${http}://${!apiAI ? CONFIG.api_url : CONFIG.api_url_ai}${url != null ? `/${url}` : ''}`;
        HTTP_METHODS.forEach(method => {
            this[method] = (url, body, headers, responseType) => {
                return this.callApi(method, url, body, headers, responseType);
            }
        })
    }

    callApi(method, url = '', body = null, headers = null, responseType = null) {
        const token = getSavedInfo('token');
        return axios({
            url: `${this.url}/${url}`,
            method,
            headers: Object.assign(
                {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: token
                },
                this.headers,
                headers
            ),
            ...(
                method === 'get' ? 
                    {
                        params: body ?? {}
                    } 
                    :
                    {
                        data: body ?? {}
                    }
            ),
            responseType: responseType != null ? responseType : 'json'
        });
    }
}

export default ApiService;