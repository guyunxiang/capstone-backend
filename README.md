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
    DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password
    DB_HOST=your_db_host
    DB_NAME=your_db_name
    COOKIE_SECRET=your_cookie_secret
    NODE_ENV=development
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
- User Routes: [`src/routes/admin/users.ts`](src/routes/admin/users.ts)
- API Routes: [`src/routes/index.js`](src/routes/index.js)

### Components

Custom components for AdminJS are defined in [`src/components/components.ts`](src/components/components.ts) and [`src/components/my-image.tsx`](src/components/my-image.tsx).

### AdminJS Configuration

AdminJS is configured in [`src/admin/options.ts`](src/admin/options.ts). The authentication provider is defined in [`src/admin/auth-provider.ts`](src/admin/auth-provider.ts).

## License

This project is licensed under the MIT License.