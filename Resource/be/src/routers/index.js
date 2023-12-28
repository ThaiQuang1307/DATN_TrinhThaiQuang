import CMSRouter from './cms.router';
import EndUserRouter from './enduser.router';

const versionApi = '/api/v1';

export const routers = (app) => {
    
    app.use(`${versionApi}/cms`, CMSRouter);
    app.use(`${versionApi}/eu`, EndUserRouter);
}
