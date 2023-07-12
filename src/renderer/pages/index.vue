<template>
  <div class="uk-height-viewport uk-flex uk-flex-column uk-flex-center uk-flex-middle">
    <template v-if="checking">
      <partials-app-logo></partials-app-logo>
      <p class="uk-margin-top uk-margin-small-bottom uk-h4 uk-text-center">
        Loading our Storefront..
      </p>
      <p class="uk-text-center uk-margin-bottom uk-margin-remove-top">
        {{message}}
      </p>
      <loaders-spinner></loaders-spinner>
    </template>
    <template v-else-if="!checking && !licensed">
      <div class="uk-width-large">
       <h4>Your copy of {{$appName}} is Unlicensed</h4>
       <p>
        Enter the 19-Digit License Key that was sent to you to continue.
      </p>

      <div class="uk-margin">
        <input type="text" class="uk-input uk-form-large" @focus="cleanup" v-model="license" placeholder="Enter Your License Key">
        <span class="text-small uk-text-danger" v-if="errors && errors.license">
         {{errors.license[0]}}
       </span>
     </div>

     <div class="uk-margin">
      <button class="uk-button uk-button-primary uk-width-1-1 uk-button-large" @click="validateLicense" :disabled="loading || !license || license.length !== 19" :class="{loading : loading}">
        License My Store
      </button>
    </div>

    <div class="border-top uk-margin"></div>
    <p>
      A license key was sent along with your credentials during the creation of your account. If you did not receive this email please contact your organization's system administrator or contact our support team for assistance.
    </p>
  </div>
</template>

<template v-else-if="failed">
 <div class="uk-width-large uk-flex uk-flex-middle uk-flex-column">
  <h2>
   Something went wrong.
 </h2>
 <p>
   We ran into an issue trying to load your Storefront. Please retry
 </p>

 <a href="/" class="uk-button uk-button-primary">
   Retry
 </a>
</div>
</template>  
</div>
</template>
<script>
const {ipcRenderer} = require("electron");
export default{
  layout : 'blank',
  middleware : ['licensed'],
  head(){
    return {
      title : `${this.$appName} | Control Panel License Validation`
    }
  },
  data(){
    return {
      loading : false,
      license : null,
      checking : true,
      licensed : null,
      failed : false,
      message : 'Step 1/2 : Checking for license'
    }
  },

  computed : {
    theLicense(){
      return this.licensed ? this.licensed : this.license
    }
  },

  methods : {
    async licenseCheck(){
      this.message = 'Step 1/2 : Checking for license'
      this.licensed = await ipcRenderer.invoke("license:check")
      if (this.licensed) {
        await this.validateLicense()
      }
      this.checking = false
    },

    async saveLicense(payload){
      return await ipcRenderer.invoke("license:save", payload)
    },  

    async validateLicense(){
      this.loading = true
      this.failed = false
      this.$message.destroy()
      this.message = 'Step 2/2 : Validating License'
      await this.$api.$post('/license/verify', { license : this.theLicense})
      .then( async res =>{
        if (!res.data.verified) {
         ipcRenderer.invoke("license:clear")
         this.$store.dispatch('keychain/setLicense', null)
         return
       }
       await this.saveLicense({license : this.theLicense, domain : `${res.data.store.sub_domain}`})
       .then(async() =>{
        await this.$axios.setBaseURL(`${this.$config.ROOT}/${res.data.store.sub_domain}`)
        await this.$store.dispatch('keychain/setLicense', this.theLicense)
        if (this.$auth.loggedIn) {
          this.$router.push({name: 'home'})
          return
        }
        this.$router.push({name: 'login'})
      })
       .catch(()=>{
        ipcRenderer.invoke("license:clear")
        this.$store.dispatch('keychain/setLicense', null)
        this.$message.error(`Something went wrong. Please try again`, 5)
        this.failed = true
      })
     })
      .catch(err =>{
        ipcRenderer.invoke("license:clear")
        this.licensed = null
        this.$message.error(`Invalid License Detected. ${err.response && err.response.data.message !== undefined ? err.response.data.message : ''}`, 5)
        this.$store.dispatch('keychain/setLicense', null)
        this.message = 'License Validation Failed'
      })
      .finally(()=>{
        this.loading = false
      })
    }
  },

  mounted(){
    this.licenseCheck()
  }

};
</script>
