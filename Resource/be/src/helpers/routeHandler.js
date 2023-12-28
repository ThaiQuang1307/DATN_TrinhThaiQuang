const asyncMiddleware = ({ object, method, typeSystem }) => (req, res, next) =>
    Promise.resolve(object[method](req, res, next, typeSystem)).catch(next);

export const pickerHandler = (handlerDef, typeSystem = null) => {
    const [handlerFile, handlerRole , handlerMethod] = handlerDef.split('@');
    const classHandler = require(`../controllers/${handlerRole}/${handlerFile}`).default;
    const object = new classHandler();
    return asyncMiddleware({ object, method: handlerMethod, typeSystem });
};