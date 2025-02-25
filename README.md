# Online Quiz System

This project is an online quiz system built with a FastAPI backend and a Next.js frontend. It features user authentication, quiz management, and result visualization.

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8+
- Node.js 14+
- MongoDB
- nextjs 14

## Backend Setup
1. **Create and activate a virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

2. **Install the required dependencies:**

   ```bash
   pip install -r requirements.txt 
   ```

3. **Set up environment variables:**

   Create a `.env` file in the backend directory with the following content:

   ```env
   DATABASE_URL="give your db Url"
   SECRET_KEY=your_secret_key
   ```

4. **Apply database migrations:**

   ```bash
   alembic upgrade head
   ```

5. **Start the FastAPI server:**

   ```bash
   uvicorn main:app --reload
   ```

   The backend server should now be running at `http://localhost:8000`.

## Frontend Setup


1. **Install the required dependencies:**

   ```bash
   npm install
   ```


2. **Start the Next.js development server:**

   ```bash
   npm run dev
   ```

   The frontend application should now be running at `http://localhost:3000`.

## Running Tests

To run the backend tests:

```bash
pytest or  uvicorn main:app --reload
```

To run the frontend tests:

```bash
npm test or npm run dev
```

## Deployment

For deployment, consider using services like Vercel for the Next.js frontend and platforms like Heroku or AWS for the FastAPI backend. Ensure that environment variables are properly set in the deployment environment.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
