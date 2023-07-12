<template>
  <content-loader :width="450" :height="255" :speed="2" primaryColor="grey" secondaryColor="#9e9e9e">
    <rect x="12" y="222" rx="4" ry="4" width="271" height="9" /> 
    <rect x="13" y="239" rx="3" ry="3" width="119" height="9" /> 
    <rect x="8" y="0" rx="10" ry="10" width="440" height="217" />
  </content-loader>
</template>

<script>
import { ContentLoader } from "vue-content-loader"

export default {
  components: { ContentLoader }
};
</script>
