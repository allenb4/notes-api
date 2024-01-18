```markdown
# Node.js Express TypeScript CRUD API

This is a simple CRUD (Create, Read, Update, Delete) API built using Node.js, Express, and TypeScript. It allows you to manage notes with title and body.

## Prerequisites

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- npm (Node Package Manager): Included with Node.js installation
- Postman: [Download and Install Postman](https://www.postman.com/)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/allenb4/notes-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd notes-api
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the application:

   ```bash
   npm run start
   ```

   The API will be available at [http://localhost:3000](http://localhost:3000).

## Using Postman

You can use Postman to interact with the API endpoints. Here's how:

### 1. Retrieve All Notes (GET /notes)

- **Method:** GET
- **Endpoint:** [http://localhost:3000/notes](http://localhost:3000/notes)

### 2. Retrieve a Specific Note by ID (GET /notes/:id)

- **Method:** GET
- **Endpoint:** [http://localhost:3000/notes/:id](http://localhost:3000/notes/:id)

### 3. Create a New Note (POST /notes)

- **Method:** POST
- **Endpoint:** [http://localhost:3000/notes](http://localhost:3000/notes)
- **Body:** JSON format
  ```json
  {
    "title": "Your Note Title",
    "body": "Your Note Body"
  }
  ```

### 4. Update a Note by ID (PUT /notes/:id)

- **Method:** PUT
- **Endpoint:** [http://localhost:3000/notes/:id](http://localhost:3000/notes/:id)
- **Body:** JSON format
  ```json
  {
    "title": "Updated Title",
    "body": "Updated Body"
  }
  ```

### 5. Delete a Note by ID (DELETE /notes/:id)

- **Method:** DELETE
- **Endpoint:** [http://localhost:3000/notes/:id](http://localhost:3000/notes/:id)

Remember to replace `:id` with the actual note ID when making requests.
