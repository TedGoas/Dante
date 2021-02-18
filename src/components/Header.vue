<template>
  <header class="header">
    <div class="logo">
      <g-link to="/" aria-label="$static.metadata.siteName"></g-link>
    </div>
    <nav role="navigation" aria-label="Main Navigation">
      <g-link to="/work/">Work</g-link>
      <g-link to="/values/">Values</g-link>
      <g-link to="/bio/">Bio</g-link>
      <g-link to="/blog/">Blog</g-link>
    </nav>
    <aside>
      <div class="email" aria-label="ted at tedgoas dot com"></div>
      <ClientOnly>
        <ThemeToggle />
      </ClientOnly>
    </aside>
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
:root {
  --site-logo: url(~@/assets/img/tg-sig-logo.svg);
  --site-email: url(~@/assets/img/tg-sig-email.svg);
  --nav-link-color: #fff;
}
[theme="light"] {
  --site-logo: url(~@/assets/img/tg-sig-logo--light.svg);
  --site-email: url(~@/assets/img/tg-sig-email--light.svg);
  --nav-link-color: #000;
}

.header {
  display: flex;
  align-items: center;
  padding: var(--spacing24) 0;
  margin-bottom: var(--spacing24);

  .logo,
  aside {
    width: 50%;
  }
  .logo a {
    height: 56px;
    width: 119px;
    display: block;
    background-image: var(--site-logo);
    background-repeat: no-repeat;
    background-position: center center;
  }

  nav {
    text-align: center;

    a,
    a:visited {
      margin: 0 var(--spacing4);
      padding: var(--spacing4) var(--spacing8);
      color: var(--nav-link-color);
      text-decoration: none;

      &.active {
        background: url(~@/assets/img/nav-active.svg) center center no-repeat;
        background-size: cover;
        color: var(--site-background-color);
      }
    }
  }

  > aside {
    display: flex;
    flex-direction: columns;
    align-items: center;
    justify-content: flex-end;

    .email {
      margin-right: var(--spacing8);
      display: block;
      height: 36px;
      width: 143px;
      background-image: var(--site-email);
      background-repeat: no-repeat;
      background-position: center center;
    }
  }
}

@media (max-width: 700px) {
    .header {
      display: block;
      position: relative;

    .logo,
    aside {
      width: auto;
    }

      nav {
        text-align: left;
        display: inline-flex;
        overflow-y: auto;
        margin-left: var(--spacingn8);
      }
      > aside {
        position: absolute;
        top: 25%;
        right: 0;

        .email  {
        }
      }
    }
}
</style>
