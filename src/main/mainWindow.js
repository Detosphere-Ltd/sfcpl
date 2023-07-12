import BrowserWinHandler from './BrowserWinHandler'

const mainWindow = new BrowserWinHandler({
  minWidth: 1400,
  minHeight : 900,
  height : 900,
  width : 1450,
  menuBarVisible : false,
  autoHideMenuBar : true,
  // fullscreen : true
})

mainWindow.onCreated(_browserWindow => {
  mainWindow.loadPage('/')
})

export default mainWindow
