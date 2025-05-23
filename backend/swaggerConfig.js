import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Бібліотечна інформаційна система',
      version: '1.0.0',
      description: 'Документація REST API для курсового проєкту',
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Локальний сервер',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;

