require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

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

  const allPages = await fetchPages(apiKey, {
    pageSize: 1000,
    sort: '-publishedAt',
  })

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

  const posts = allPages.filter((page) => page.type === 'blog')
  const popularPosts = allPages.filter(
    (page) => page.type === 'blog' && page.tags?.includes('popular')
  )
  const pages = allPages.filter(
    (page) => page.type !== 'blog' && page.slug !== 'home'
  )

  createPage({
    path: `/`,
    component: require.resolve('./src/templates/index.tsx'),
    context: { posts, tags },
  })

  createPage({
    path: `/blog/thumbnails`,
    component: require.resolve('./src/templates/blog-list-thumbnails.tsx'),
    context: { posts },
  })

  tags.forEach((tag) => {
    const pagesByTag = posts.filter((page) => page.tags?.includes(tag))

    createPage({
      path: `/tag/${tag}`,
      component: require.resolve('./src/templates/tag.tsx'),
      context: { posts: pagesByTag, filterTag: tag, popularPosts, tags },
    })
  })

  for (const { slug } of pages) {
    const page = await fetchPage(slug, apiKey)
    createPage({
      path: `/${page.slug}/`,
      component: require.resolve('./src/templates/page.tsx'),
      context: { page },
    })
  }

  for (const { slug } of posts) {
    const page = await fetchPage(slug, apiKey)
    createPage({
      path: `/posts/${page.slug}/`,
      component: require.resolve('./src/templates/page.tsx'),
      context: { page },
    })
  }
}
