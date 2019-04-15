import express = require('express');
import bodyParser = require('body-parser');
import { apiController } from './controllers/apiController';

const port = process.env.PORT || 3000;


export const appLogic = () => {
    const app = express();
    const router = express.Router();
    app.use(bodyParser.json());

    app.use('/api', apiController(router));

    return app.listen(port);
}
