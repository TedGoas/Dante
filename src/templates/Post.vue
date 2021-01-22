<template>
  <Layout>
    <article role="main">
      <header>
        <h1>{{$page.post.title}}</h1>
        <p>
          <time>{{$page.post.date}}</time> · <i>{{$page.post.timeToRead}} min read</i>
        </p>
      </header>
      <div v-html="$page.post.content" />
      <footer></footer>
    </article>
  </Layout>
</template>

<script>
</script>


<page-query>
query Post ($path: String!) {
   post: post (path: $path) {
    id
    title
    content
    date (format: "MMMM D, YYYY")
    timeToRead
  }
}
</page-query>

<style>
</style>
