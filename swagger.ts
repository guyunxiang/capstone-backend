import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { Application } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Books Manager API for Client",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
    },
  },
  apis: ["./src/routes/client/*.ts", "./src/routes/client/pages/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default (app: Application) => {
  app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));
};
