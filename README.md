# Backend Admin

This project is a backend administration system built with Node.js, Express, and AdminJS. It provides an interface for managing users, books, genres, bookmarks, reading progress, and reviews.

## Project Structure
  
## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-repo/backend-admin.git
    cd backend-admin
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```env
    NODE_ENV=development

    DB_USERNAME=
    DB_PASSWORD=
    DB_HOST=cluster0.hylyq.mongodb.net
    DB_NAME=ebooks_reader_and_manager

    COOKIE_SECRET=
    JWT_SECRET=
    PORT=4000
    ```

## Running the Project

### Development

To run the project in development mode with hot-reloading:

```sh
npm run dev
```

### Production

To build and run the project in production mode:

```sh
npm run build
npm start
```

## Project Details

### Start

[http://localhost:4000/admin/login](http://localhost:4000/admin/login)

### Database

The project uses MongoDB as the database. The connection is initialized in [`src/db/index.ts`](src/db/index.ts).

### Models

- Book: [`src/models/book.js`](src/models/book.js)
- Bookmark: [`src/models/bookmark.js`](src/models/bookmark.js)
- Genre: [`src/models/genre.js`](src/models/genre.js)
- Reading Progress: [`src/models/readingProgress.js`](src/models/readingProgress.js)
- Review: [`src/models/review.js`](src/models/review.js)
- User: [`src/models/user.js`](src/models/user.js)

### Routes

- Admin Routes: [`src/routes/admin/index.ts`](src/routes/admin/index.ts)
- User Routes: [`src/routes/client/index.ts`](src/routes/client/index.ts)
- API Routes: [`src/routes/index.js`](src/routes/index.js)

### Components

Custom components for AdminJS are defined in [`src/components/components.ts`](src/components/components.ts) and [`src/components/my-image.tsx`](src/components/my-image.tsx).

### AdminJS Configuration

AdminJS is configured in [`src/admin/options.ts`](src/admin/options.ts). The authentication provider is defined in [`src/admin/auth-provider.ts`](src/admin/auth-provider.ts).

## License

This project is licensed under the MIT License.