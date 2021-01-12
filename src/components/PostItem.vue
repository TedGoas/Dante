<template>
  <div>
    <span>{{date}}</span>
    <g-link :to="post.path">{{post.title}}</g-link>
    <span><i>{{post.timeToRead}} min read</i></span>
  </div>
</template>

<script>
export default {
  props: ["post"],
  computed: {
    date() {
      return this.post.date.substring(0, this.post.date.length - 4);
    }
  }
};
</script>

<style>
</style>
