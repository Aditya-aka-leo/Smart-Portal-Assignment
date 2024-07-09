const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Role description',
      version: '1.0.0',
      description: 'Your API description',
    },
    components: {
      securitySchemes: {
        apiKeyAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'JWT token without Bearer prefix',
        },
      },
    },
    security: [
      {
        apiKeyAuth: [],
      },
    ],
  },
  apis: ['./src/doc/*.js'], // Path to the API routes files
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
