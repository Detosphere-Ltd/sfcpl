const ICONS_DIR = 'build/icons/'

const windowsOS = {
  win: {
    icon: ICONS_DIR + 'icon.png',
    publisherName: 'Detosphere Limited',
    target: 'nsis'
  },

  nsis: {
    differentialPackage: true
  }
}

const linuxOS = {
  linux: {
    icon: ICONS_DIR,
    target: 'deb'
  }
}

const macOS = {
  mac: {
    target: ['dmg', 'zip'],
    icon: ICONS_DIR + 'icon.png'
  },
  dmg: {
    contents: [
    {
      x: 410,
      y: 150,
      type: 'link',
      path: '/Applications'
    },
    {
      x: 130,
      y: 150,
      type: 'file'
    }
    ]
  }
}

module.exports = {
  productName: 'Smartup Storefront Control Panel',
  appId: 'com.detospherelimited.smartupretailstorefront-control',
  artifactName: 'Smartup-Storefront-Control-Panel-${version}.${ext}',
  directories: {
    output: 'build'
  },
  files: [
    'package.json',
    {
      from: 'dist/main/',
      to: 'dist/main/'
    },
    {
      from: 'dist/renderer',
      to: 'dist/renderer/'
    }
    ],
  extraResources: [
  {
    from: 'src/extraResources/',
    to: ''
  }
  ],
  ...windowsOS,
  ...linuxOS,
  ...macOS
}
