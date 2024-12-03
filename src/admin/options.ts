import { AdminJSOptions } from 'adminjs';

import { Components, componentLoader } from '../components/components.js';

import Book from '../models/book.js';
import Genre from '../models/genre.js';
import User from '../models/user.js';
import Review from '../models/review.js';
import Bookmark from '../models/bookmark.js';
import ReadingProgress from '../models/readingProgress.js';

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  dashboard: {
    component: Components.Dashboard
  },
  branding: {
    logo: '/images/logo.png',
    favicon: '/images/logo.jpeg',
    companyName: 'Bookstore Admin',
    withMadeWithLove: false,
  },
  locale: {
    language: 'en',
    availableLanguages: ['en'],
    translations: {
      en: {
        components: {
          Login: {
            welcomeHeader: "Welcome",
            welcomeMessage: "Welcome to eText Reader and Manager System - Your ultimate tool for managing, reading, and organizing e-texts efficiently. "
          }
        }
      }
    },
  },
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
        navigation: { name: 'Books Management', icon: 'Book' },
        listProperties: ['name', 'description', 'created_at'],
        properties: {
          _id: { isVisible: { list: false, show: false, edit: false } },
          created_at: { isVisible: { list: true, show: true, edit: false } },
          updated_at: { isVisible: { list: false, show: true, edit: false } },
        },
      }
    },
    {
      resource: Review,
      options: {
        navigation: { name: 'Books Management', icon: 'Review' },
        listProperties: ['rating', 'comment', 'book_id', 'user_id', 'created_at'],
        properties: {
          updated_at: { isVisible: { list: false, show: true, edit: false } },
          book_id: {
            isVisible: { list: true },
          },
          user_id: {
            isVisible: { list: true },
          },
        }
      }
    },
    {
      resource: Bookmark,
      options: {
        navigation: { name: 'Books Management', icon: 'Bookmark' },
        listProperties: ['book_id', 'user_id', 'page_number', 'note', 'created_at'],
      }
    },
    {
      resource: ReadingProgress,
      options: {
        navigation: { name: 'Books Management', icon: 'ReadingProgress' },
        listProperties: ['book_id', 'user_id', 'progress', 'created_at'],
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
        actions: {
          list: {
            after: async (response: any) => {
              // Modify the list data to mask email
              response.records = response.records.map((record: any) => {
                if (record.params.email) {
                  record.params.email = record.params.email.replace(
                    /(.{2}).+(@.+)/,
                    '$1***$2'
                  );
                }
                return record;
              });
              return response;
            },
          },
          show: {
            after: async (response: any) => {
              // Modify the show data to mask email
              if (response.record.params.email) {
                response.record.params.email = response.record.params.email.replace(
                  /(.{2}).+(@.+)/,
                  '$1***$2'
                );
              }
              return response;
            },
          },
        },
      }
    }
  ],
  databases: [],
};

export default options;
