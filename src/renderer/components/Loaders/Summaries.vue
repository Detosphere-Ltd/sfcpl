<template>
  <content-loader viewBox="0 0 340 50" :speed="2" primaryColor="#e9e8e8" secondaryColor="#d9d9d9" height="60">
    <rect x="9" y="4" rx="0" ry="0" width="320" height="22" /> 
    <rect x="18" y="14" rx="0" ry="0" width="303" height="6" /> 
    <rect x="10" y="34" rx="0" ry="0" width="108" height="12" /> 
    <rect x="129" y="33" rx="0" ry="0" width="60" height="13" /> 
    <rect x="196" y="33" rx="0" ry="0" width="60" height="13" />
  </content-loader>
</template>
<script>
import { ContentLoader } from "vue-content-loader"

export default {
  components: { ContentLoader }
};
</script>
