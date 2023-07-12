import { app, ipcMain, ipcRenderer, Menu} from 'electron'
const AppStorage = require("electron-store")
const fs = require("fs");


const mainWindow = require('./mainWindow')
const isDev = process.env.NODE_ENV !== 'production'


// Bootstrap
const store = new AppStorage();
const menuTemplate = [
{
  label : 'File',
  submenu : [
    {role : 'undo'}, 
    {role : 'redo'}, 
    {role : 'cut'}, 
    {role : 'copy'}, 
    {role : 'paste'},
    {role : 'selectAll'}
    ]
}
]

// Add Reload & Developer Tools Menu in Dev Mode
if (isDev) {
  menuTemplate.push(
  {
    label : 'Developer',
    submenu : [
      {role : 'reload'},
      {role : 'quit'},
      {role : 'toggleDevTools'},
      ]
  }
  )
}

else{
  menuTemplate.push(
  {
    label : "Options",
    submenu : [
      {role : 'reload'},
      {role : 'quit'},
      ]
  },
  )
}


async function writeToConfig(url) {

 let path = './.env'
 fs.readFile(path, 'utf8', function (err,data) {
  if (err) {
    return false 
  }

  if (data.includes('___temp___')) {
   var result = data.replace(/___temp___/g, url);

   fs.writeFile(path, result, 'utf8', function (err) {
     if (err){
      return false 
    }
  })
 }

 return true

})

}


app.on('ready', ()=>{
  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)
})
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('license:check', ()=>{
  let license = store.get('control__panel__license')
  return license
})

ipcMain.handle('license:clear', ()=>{
  store.delete('control__panel__license')
})

ipcMain.handle('license:save', (event, payload)=>{
  store.set('control__panel__license', payload.license)
  return writeToConfig(payload.domain)

})
