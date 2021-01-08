<template>
  <Layout>
    <section class="posts">
      <PostList v-for="year in years" :key="year" :year="year" />
    </section>
  </Layout>
</template>

<script>
import PostList from "@/components/PostList";
export default {
  components: {
    PostList,
  },
  metaInfo: {
    title: "A simple blog"
  },
  computed: {
    years() {
      const years = {};
      const posts = this.$page.allPost.edges;
      posts.map((post) => {
        const year = post.node.date.split(" ")[2];
        years[year] = "";
      });
      return Object.keys(years).sort((a, b) => {
        return b - a;
      });
    }
  }
};
</script>

<page-query>
query {
  metadata {
    siteName
    siteDescription
  }
  allPost(filter: { date: { gte: "2020" }}) {
    totalCount
    edges {
      node {
        id
        title
        timeToRead
        description
        date (format: "MMM D YYYY")
        path
      }
    }

  }
}
</page-query>

<style>
</style>
