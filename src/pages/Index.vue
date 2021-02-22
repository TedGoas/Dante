<template>
  <Layout>
    <div role="main">
      <section class="intro" aria-labelledby="heading">
        <h1>I’m a reliable product designer and front-end developer working on websites, apps, 
  HTML emails, and design systems.</h1>
        <p>I believe design is about taking the complex and chaotic and making it <strong class="highlight-yellow">accessible</strong> to people, <strong class="highlight-yellow">responsive</strong>, and as <strong class="highlight-yellow">fast</strong> as possible.</p>
        <p>My goal is to create work that’s cool enough to show <span class="tooltip">my friends</span> and honest enough to show <span class="tooltip">my parents</span>.</p>
      </section>
      <WorkList />
    </div>
  </Layout>
</template>

<script>
import WorkList from "@/components/WorkList";

export default {
  components: {
    WorkList
  }
}
</script>

<style lang="scss">
.intro {
  text-align: center;
  margin: auto;
  max-width: var(--width7);

  h1 {
    margin-bottom: var(--spacing32);
  }
  p {
    font-size: var(--fs-lg);
    line-height: 1.3;
    max-width: var(--width6);
    margin: auto;

    &:not(:last-child) {
      margin-bottom: var(--spacing16);
    }
  }
}
</style>
