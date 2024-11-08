import { AdminJSOptions, ComponentLoader } from 'adminjs';

import Book from '../models/book.js';
import Genre from '../models/genre.js';
import User from '../models/user.js';

// import componentLoader from './component-loader.js';

import { Components, componentLoader } from '../components/components.js';


const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  resources: [
    {
      resource: Book,
      options: {
        navigation: { name: 'Books Management', icon: 'Book' },
        listProperties: ['cover_image', 'title', 'author', 'publish_date', 'publisher', 'file_format', 'created_at'],
        properties: {
          cover_image: {
            type: 'string',
            components: {
              list: Components.MyImage,
              show: Components.MyImage,
            },
          },
        },
      }
    },
    {
      resource: Genre,
      options: {
        navigation: { name: 'Genres Management', icon: 'Book' },
        listProperties: ['name', 'description', 'created_at'],
        properties: {
          _id: { isVisible: { list: false, show: false, edit: false } },
          created_at: { isVisible: { list: true, show: true, edit: false } },
          updated_at: { isVisible: { list: false, show: true, edit: false } },
        },
      }
    },
    {
      resource: User,
      options: {
        navigation: { name: 'Users Management', icon: 'User' },
        listProperties: ['username', 'email', 'role', 'created_at'],
        properties: {
          password: { isVisible: false },
          _id: { isVisible: { list: false, show: false, edit: false } },
          created_at: { isVisible: { list: true, show: true, edit: false } },
          updated_at: { isVisible: { list: false, show: true, edit: false } },
          role: { isVisible: { list: true, show: true, edit: true } },
        },
      },
    }
  ],
  databases: [],
};

export default options;
