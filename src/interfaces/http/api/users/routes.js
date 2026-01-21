import express from 'express';

const routes = (controller) => {
    const router = express.Router();

    router.post('/', controller.PostUser);

    return router;
};

export default routes;