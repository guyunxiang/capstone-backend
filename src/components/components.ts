import { ComponentLoader } from 'adminjs'

const componentLoader = new ComponentLoader()

const Components = {
  MyImage: componentLoader.add('MyImage', './my-image.tsx'),
  Dashboard: componentLoader.add('Dashboard', './Dashboard.tsx'),
  // other custom components
}

export { componentLoader, Components }