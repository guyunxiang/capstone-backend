import { ComponentLoader } from 'adminjs'

const componentLoader = new ComponentLoader()

const Components = {
  MyImage: componentLoader.add('MyImage', './my-image.tsx'),
  // other custom components
}

export { componentLoader, Components }