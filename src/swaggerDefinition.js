const fs = require('fs');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'API Documentation for Your Application',
  },
  basePath: '/',
  components: {
    securitySchemes: {
      googleAuth: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
            tokenUrl: 'https://oauth2.googleapis.com/token',
            scopes: {
              profile: 'Access your basic profile information',
              email: 'Access your email address',
            },
          },
        },
      },
    },
  },
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Path to the API docs
  apis: ['./src/routes/*.js'], // Replace with the path to your route files
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

// Write swaggerSpec to swagger.json file
fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));

module.exports = swaggerSpec;
