<template>
  <header class="header">
    <g-link to="/"><g-image src="~/assets/img/tg-sig-logo.svg" alt="$static.metadata.siteName"/></g-link>
    <nav role="navigation" aria-label="Main Navigation">
      <g-link to="/work/">Works</g-link>
      <g-link to="/values/">Values</g-link>
      <g-link to="/bio/">Bio</g-link>
      <g-link to="/blog/">Blog</g-link>
    </nav>
    <div>
      <g-image src="~/assets/img/tg-sig-email.svg" alt="ted at tedgoas dot com"/>
      <ClientOnly>
        <ThemeToggle />
      </ClientOnly>
    </div>
  </header>
</template>

<script>
export default {
  props: ["siteName"],
  components: {
    ThemeToggle: () => import('@/components/ThemeToggle')
  }
};
</script>

<style lang="scss">

</style>
