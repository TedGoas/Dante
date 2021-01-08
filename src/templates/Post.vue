<template>
  <Layout>
    <div class="article">
      <h1 class="article-title">{{$page.post.title}}</h1>
      <p class="article-date"> {{ $page.post.date}} · <i>{{$page.post.timeToRead}} min read</i></p>
      <article v-html="$page.post.content" />
    </div>
  </Layout>
</template>

<script>
import Header from "@/components/Header";
export default {
  components: {
    Header
  }
};
</script>


<page-query>
query Post ($path: String!) {
  metadata {
    siteName
    siteDescription
  }
   post: post (path: $path) {
    id
    title
    content
    date (format: "D MMMM YYYY")
    timeToRead
  }
}
</page-query>

<style>
  .article {
    margin-top: 15px;
  }

  .article-title {
    margin-bottom:0;
  }

  .article-date {
    color: var(--app-font-color);
    margin-top:0;
    font-size:.8em;
  }

  .article blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  .article table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
  }

  .article th {
    vertical-align: bottom;
    border-bottom: 2px solid #ddd;
  }

  .article td {
      border-top: 1px solid #ddd;
      padding: 8px;
      line-height: 1.42857143;
      vertical-align: top;
  }

  .article tr:nth-child(odd) td {
    background-color: #f9f9f9;
  }

  .article img {
    margin:auto;
    width:80%;
    display:block;
    margin:10px auto;
  }
</style>
