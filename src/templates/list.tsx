import { Link } from 'gatsby'
import React from 'react'
import { types } from 'react-bricks/frontend'
import PostListItem from '../components/PostListItem'
import ErrorNoKeys from '../components/errorNoKeys'
import Layout from '../components/layout'
import Seo from '../components/seo'

interface ReactBricksPageProps {
  pageContext: {
    tags: string[]
    posts: types.Page[]
    error: string
  }
}

const Page: React.FC<ReactBricksPageProps> = ({
  pageContext: { posts, error, tags },
}) => {
  return (
    <Layout>
      <Seo
        title="Blog List"
        description="React Bricks blog starter"
        lang="en"
      />

      <h1 className="text-center text-4xl sm:text-6xl lg:text-7xl leading-none font-black tracking-tight text-gray-900 pb-4 mt-10 sm:mt-12 mb-4">
        Blog
      </h1>
      <div className="max-w-6xl mx-auto px-8 py-16 flex space-x-24">
        <section className="flex-[2] space-y-8">
          <h2 className="text-pink-500 uppercase mb-8 tracking-widest font-bold">
            Recently published
          </h2>
          {posts?.map((post) => (
            <PostListItem
              key={post.id}
              title={post.name}
              href={post.slug}
              content={post.meta.description}
            />
          ))}
        </section>
        <section className="flex-1 space-y-16">
          <div>
            <h2 className="text-pink-500 uppercase mb-8 tracking-widest font-bold">
              Tags
            </h2>
            <div className="flex flex-wrap items-center">
              {/* T A G  */}
              {tags
                ?.filter((tag) => tag !== 'popular')
                .map((tag) => (
                  <Link
                    to={`/blog/tag/${tag}`}
                    key={tag}
                    className="inline-block text-sm font-bold mr-2 mb-2 transform duration-200 text-cyan-800 bg-cyan-100 hover:bg-cyan-200 hover:text-cyan-900 rounded-md px-2 py-1"
                  >
                    <div className="" style={{ zIndex: -1 }} />
                    {tag}
                  </Link>
                ))}
              {/*  */}
            </div>
          </div>
          <div>
            <h2 className="text-pink-500 uppercase mb-8 tracking-widest font-bold">
              Most Popular
            </h2>
            <ul>
              {posts
                ?.filter((post) => post.tags.find((tag) => tag === 'popular'))
                .map((post) => (
                  <li key={post.id}>
                    <Link
                      to={`/blog/posts/${post.slug}`}
                      className="text-gray-900 hover:text-cyan-600 font-bold text-lg leading-10 transition-colors"
                    >
                      {post.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      </div>
      {error === 'NOKEYS' && <ErrorNoKeys />}
    </Layout>
  )
}

export default Page
