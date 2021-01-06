<template> 
    <header class="header" role="banner">
        <strong>
        <g-link to="/"><g-image src="~/assets/img/tg-sig-logo.svg" :alt="$static.metadata.siteName"/></g-link>
        </strong>
        <nav role="navigation" aria-label="Main Navigation">
        <g-link to="/work/">Works</g-link>
        <g-link to="/values/">Values</g-link>
        <g-link to="/bio/">Bio</g-link>
        <g-link to="/articles/">Articles</g-link>
        </nav>
        <g-image src="~/assets/img/tg-sig-email.svg" alt="ted at tedgoas dot com"/>
    </header>
</template>
<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style lang="scss">

</style>
