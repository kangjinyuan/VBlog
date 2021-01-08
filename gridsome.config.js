// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Gridsome',
  plugins: [
    {
      use: '@gridsome/source-strapi',
      options: {
        apiURL: process.env.GRIDSOME_API_URL,
        queryLimit: 1000, // Defaults to 100
        contentTypes: ['blog', 'social', 'project'],
        // singleTypes: [],
        // Possibility to login with a Strapi user,
        // when content types are not publicly available (optional).
        // loginData: {
        //   identifier: '',
        //   password: ''
        // }
      }
    }
  ],
  templates: {
    StrapiBlog: [
      {
        name: 'blogDetailds',
        path: '/blog/details/:id',
        component: './src/templates/blog/Details.vue'
      },
      {
        name: 'editBlog',
        path: '/blog/edit/:id',
        component: './src/templates/blog/Edit.vue'
      }
    ],
    StrapiProject: [
      {
        name: 'projectDetailds',
        path: '/project/details/:id',
        component: './src/templates/project/Details.vue'
      }
    ],
    StrapiSocial: [
      {
        name: 'socialDetailds',
        path: '/social/details/:id',
        component: './src/templates/social/Details.vue'
      }
    ]
  }
}
