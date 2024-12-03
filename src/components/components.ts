import { ComponentLoader } from 'adminjs'

const componentLoader = new ComponentLoader()

const Components = {
  MyImage: componentLoader.add('MyImage', './my-image'),
  Dashboard: componentLoader.add('Dashboard', './Dashboard'),
  // other custom components
}

export { componentLoader, Components }