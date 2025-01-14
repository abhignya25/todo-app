const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDefinition = require('./swaggerDef');

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

// Save the generated spec to a file (optional)
const fs = require('fs');
fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));