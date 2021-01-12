export default [
  {
    path: "/blog/:title/",
    component: () => import(/* webpackChunkName: "page--src--templates--post-vue" */ "/Users/tedgoas/Documents/GitHub/Dante/src/templates/Post.vue")
  },
  {
    path: "/blog/",
    component: () => import(/* webpackChunkName: "page--src--pages--blog-vue" */ "/Users/tedgoas/Documents/GitHub/Dante/src/pages/Blog.vue")
  },
  {
    name: "404",
    path: "/404/",
    component: () => import(/* webpackChunkName: "page--node-modules--gridsome--app--pages--404-vue" */ "/Users/tedgoas/Documents/GitHub/Dante/node_modules/gridsome/app/pages/404.vue")
  },
  {
    name: "home",
    path: "/",
    component: () => import(/* webpackChunkName: "page--src--pages--index-vue" */ "/Users/tedgoas/Documents/GitHub/Dante/src/pages/Index.vue")
  },
  {
    name: "*",
    path: "*",
    component: () => import(/* webpackChunkName: "page--node-modules--gridsome--app--pages--404-vue" */ "/Users/tedgoas/Documents/GitHub/Dante/node_modules/gridsome/app/pages/404.vue")
  }
]

