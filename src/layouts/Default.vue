<template>
  <main class="layout" role="main">
    <Header />
    <slot/>
    <Footer />
  </main>
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style lang="scss">
:root {
    --app-background-color: #FFFFFF;
    --app-font-color: black;
    --link-color: #00835c;
    --footer-link-color: #686868;
}

[theme="dark"] {
    --app-background-color: #091A28;
    --app-font-color: white;
    --link-color: #20c997;
    --footer-link-color: #ADADAD;
}

body {
  background-color: var(--app-background-color);
  color: var(--app-font-color);
}
a {
  color: pink;

  &:visited {
    color: magenta;
  }
}
</style>
