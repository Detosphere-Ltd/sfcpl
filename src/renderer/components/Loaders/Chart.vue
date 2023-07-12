<template>
 <content-loader
 <content-loader
 viewBox="0 0 160 120"
 :speed="2"
 primaryColor="#e9e8e8"
 secondaryColor="#d9d9d9"
 >
 <rect x="12" y="91" rx="0" ry="0" width="25" height="40" /> 
 <rect x="42" y="76" rx="0" ry="0" width="25" height="55" /> 
 <rect x="72" y="57" rx="0" ry="0" width="25" height="74" /> 
 <rect x="102" y="11" rx="0" ry="0" width="25" height="120" /> 
 <rect x="132" y="73" rx="0" ry="0" width="25" height="58" />
</content-loader>
</template>
</template>

<script>
import { ContentLoader } from "vue-content-loader"

export default {
  components: { ContentLoader }
};
</script>
