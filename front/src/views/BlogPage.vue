<template>
  <div class="blog">
    <BlogComponent />
  </div>
</template>
<script>

import BlogComponent from "@/components/BlogComponent.vue";

export default {
  name: "BlogPage",
  components: {
    BlogComponent
},
};
</script>