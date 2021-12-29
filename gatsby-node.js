require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

const bluebird = require('bluebird')
const fetchPages = require('react-bricks/frontend').fetchPages
const fetchPage = require('react-bricks/frontend').fetchPage
const fetchTags = require('react-bricks/frontend').fetchTags

exports.createPages = async ({ actions: { createPage }, ...rest }) => {
  const appId = process.env.GATSBY_APP_ID
  const apiKey = process.env.API_KEY

  if (!appId || !apiKey) {
    console.error(
      'App credentials not found. Please, set your GATSBY_APP_ID and API_KEY in your .env.development or .env.production file.'
    )
    createPage({
      path: `/`,
      component: require.resolve('./src/templates/index.tsx'),
      context: { page: null, error: 'NOKEYS' },
    })
    return
  }

  const { items: tags } = await fetchTags(apiKey)
  tags.sort()
  const posts = await fetchPages(apiKey, { type: 'blog', pageSize: 100 })
  const popularPosts = await fetchPages(apiKey, {
    type: 'blog',
    tag: 'popular',
  })

  if (apiKey) {
    createPage({
      path: `/`,
      component: require.resolve('./src/templates/index.tsx'),
      context: { posts, tags },
    })
    createPage({
      path: `/blog-list-thumbnails`,
      component: require.resolve('./src/templates/blog-list-thumbnails.tsx'),
      context: { posts },
    })

    await bluebird.map(
      tags,
      async (tag) => {
        const pagesByTag = await fetchPages(apiKey, {
          tag: tag,
          type: 'blog',
          pageSize: 100,
        })
        createPage({
          path: `/tag/${tag}`,
          component: require.resolve('./src/templates/tag.tsx'),
          context: { posts: pagesByTag, filterTag: tag, popularPosts, tags },
        })
      },
      {
        concurrency: 10,
      }
    )
  }

  const allPages = await fetchPages(apiKey)

  if (!allPages || allPages.length === 0) {
    console.error(
      'No published page was found. Please, create at least one page from the /admin interface.'
    )
    createPage({
      path: `/`,
      component: require.resolve('./src/templates/page.tsx'),
      context: { page: null, error: 'NOPAGE' },
    })
    return
  }

  const allPagesWithContent = await bluebird.map(
    allPages,
    (page) => {
      return fetchPage(page.slug, apiKey)
    },
    { concurrency: 2 }
  )

  // Other pages
  allPagesWithContent
    .filter((page) => page.slug !== 'home')
    .forEach((page) => {
      createPage({
        path: `/${page.slug}/`,
        component: require.resolve('./src/templates/page.tsx'),
        context: { page },
      })
    })
}
