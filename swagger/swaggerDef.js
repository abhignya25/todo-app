module.exports = {
    openapi: '3.0.0',
    info: {
      title: 'Todo app',
      version: '1.0.0',
      description: 'This is the API documentation for My API.',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
  };