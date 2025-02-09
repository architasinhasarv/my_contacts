const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const { registerUser, loginUser, currentrUser } = require("../controller/userController");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and management
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user and returns a token.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Unauthorized - Invalid credentials
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/users/current:
 *   get:
 *     summary: Get current user
 *     description: Retrieves the currently authenticated user's information.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user details
 *       401:
 *         description: Unauthorized - No token provided
 */
router.get("/current", validateToken, currentrUser);

module.exports = router;
