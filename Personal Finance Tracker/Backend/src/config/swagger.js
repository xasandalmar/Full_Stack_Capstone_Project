import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Personal Finance Tracker API',
    version: '1.0.0',
    description:
      'Production-ready MERN Stack Personal Finance Tracker API with JWT Auth, Transactions CRUD, Monthly Summaries, Category Management, Image Uploads to Cloudinary, and Admin Panel Analytics.',
    contact: {
      name: 'API Support',
      email: 'support@financetracker.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer <token>',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '65c8f12a3b4c5d6e7f8a9b0c' },
          username: { type: 'string', example: 'maxamed' },
          email: { type: 'string', example: 'maxamed@example.com' },
          profilePicture: { type: 'string', example: 'https://res.cloudinary.com/demo/image/upload/v1/profile.jpg' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '65c8f12a3b4c5d6e7f8a9b0d' },
          userId: { type: 'string', example: '65c8f12a3b4c5d6e7f8a9b0c' },
          title: { type: 'string', example: 'Monthly Grocery Shopping' },
          amount: { type: 'number', example: 125.50 },
          type: { type: 'string', enum: ['income', 'expense'], example: 'expense' },
          category: { type: 'string', example: 'Food & Dining' },
          date: { type: 'string', format: 'date-time', example: '2026-09-03T09:00:00.000Z' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Invalid credentials or request format' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Authentication and User Management' },
    { name: 'Transactions', description: 'Income and Expense Transaction Operations' },
    { name: 'Categories', description: 'Predefined Expense and Income Categories' },
    { name: 'Upload', description: 'Cloudinary Image & Profile Picture Uploads' },
    { name: 'Admin', description: 'Platform Overview Metrics & Admin Panel Controls' },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'email', 'password'],
                properties: {
                  username: { type: 'string', example: 'maxamed' },
                  email: { type: 'string', example: 'maxamed@example.com' },
                  password: { type: 'string', example: 'password123' },
                  role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Validation error or email exists' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user and receive JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'maxamed@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful, returns JWT token' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/profile': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User profile details' },
          401: { description: 'Not authorized' },
        },
      },
    },
    '/api/transactions': {
      get: {
        tags: ['Transactions'],
        summary: 'List user transactions with optional filters',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['income', 'expense'] } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'List of transactions and financial totals' },
          401: { description: 'Not authorized' },
        },
      },
      post: {
        tags: ['Transactions'],
        summary: 'Create a new transaction',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'amount', 'type', 'category'],
                properties: {
                  title: { type: 'string', example: 'Salary Payment' },
                  amount: { type: 'number', example: 3500.00 },
                  type: { type: 'string', enum: ['income', 'expense'], example: 'income' },
                  category: { type: 'string', example: 'Salary & Wage' },
                  date: { type: 'string', format: 'date-time', example: '2026-09-01T10:00:00Z' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Transaction created successfully' },
          400: { description: 'Validation error' },
          401: { description: 'Not authorized' },
        },
      },
    },
    '/api/transactions/monthly-summary': {
      get: {
        tags: ['Transactions'],
        summary: 'Get category-wise and monthly breakdown summaries',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Aggregated category and monthly totals' },
          401: { description: 'Not authorized' },
        },
      },
    },
    '/api/transactions/{id}': {
      put: {
        tags: ['Transactions'],
        summary: 'Update an existing transaction',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  amount: { type: 'number' },
                  type: { type: 'string', enum: ['income', 'expense'] },
                  category: { type: 'string' },
                  date: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Transaction updated successfully' },
          403: { description: 'Not authorized to edit this transaction' },
          404: { description: 'Transaction not found' },
        },
      },
      delete: {
        tags: ['Transactions'],
        summary: 'Delete a transaction',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Transaction deleted successfully' },
          403: { description: 'Not authorized to delete this transaction' },
          404: { description: 'Transaction not found' },
        },
      },
    },
    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get list of predefined transaction categories',
        responses: {
          200: { description: 'List of categories with icons and types' },
        },
      },
    },
    '/api/upload/profile-picture': {
      post: {
        tags: ['Upload'],
        summary: 'Upload profile image to Cloudinary',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Profile picture uploaded and user record updated' },
          400: { description: 'No file provided or invalid file type' },
          401: { description: 'Not authorized' },
        },
      },
    },
    '/api/admin/overview': {
      get: {
        tags: ['Admin'],
        summary: 'Get platform overview statistics (Admin restricted)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Aggregated platform metrics and user analytics' },
          403: { description: 'Forbidden: Admin access required' },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [], // Defined inline in definition object for maximum reliability
};

export const swaggerSpec = swaggerJSDoc(options);
