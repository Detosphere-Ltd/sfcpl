<template>
 <main class="uk-width-1-1" :class="colorMode">
   <nuxt />
 </main>
</template>
<script>
export default{
  middleware : ['auth', 'unlicensed' , 'authorized']
};
</script>
