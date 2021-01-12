<template>
  <div class="post-list">
    <h2>{{year}}</h2>
    <PostItem :key="post.node.id" v-for="post in this.postsByYear" :post="post.node" />
  </div>
</template>

<script>
import PostItem from './PostItem';

export default {
  props: ["year"],
  components: {
    PostItem
  },
  computed: {
    postsByYear() {
      const posts = this.$page.allPost.edges;
      return posts.filter((post) => {
        return post.node.date.includes(this.year);
      })
    }
  }
};
</script>

<style scoped="true">
</style>
