import express from "express";
import users from "../../interfaces/http/api/users/index.js";
import DomainErrorTranslator from '../../commons/exceptions/domainErrorTranslator.js';
import ClientError from '../../commons/exceptions/clientError.js';

const createServer = async (container) => {
  const app = express();

  app.use(express.json());

  app.use("/users", users(container));

  app.get('/', (req, res) => {
    res.status(200).json({ data: 'Hello world!' });
  });
  
  app.use((req, res) => {
    res.status(404).json({
      status: "fail",
      message: "resource not found",
    });
  });

  app.use((err, req, res, next) => {
    // eslint-disable-line no-unused-vars
    const translatedError = DomainErrorTranslator.translate(err);

    if (translatedError instanceof ClientError) {
      res.status(translatedError.statusCode).json({
        status: "fail",
        message: translatedError.message,
      });
      return;
    }

    res.status(500).json({
      status: "error",
      message: "terjadi kegagalan pada server kami",
    });
  });

  return app;
};

export default createServer;
