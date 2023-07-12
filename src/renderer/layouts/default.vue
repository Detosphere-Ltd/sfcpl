<template>
  <main class="uk-inline uk-width-1-1" :class="colorMode">
    <div class="uk-flex app" v-if="$nuxt.isOnline">
      <navs-main-sidebar></navs-main-sidebar>
      <div class="uk-width-expand content uk-flex uk-flex-column" :key="$route.name">
        
        <div class="uk-width-1-1 background uk-flex uk-flex-column">
          <div class="uk-width-1-1" uk-sticky="position:top">
            <navs-top-nav class="uk-width-1-1"></navs-top-nav>
          </div>
          <nuxt/>
        </div>
      </div>
    </div>

    <partials-offline v-else></partials-offline>
  </main>
</template>
<script>
export default{
 middleware : ['auth', 'password', 'noperms', 'authorized', 'unlicensed'],
 head(){
  return{
    title : `${this.$appName}`
  }
}
};
</script>
