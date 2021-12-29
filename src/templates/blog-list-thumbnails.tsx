import React from 'react'
import { types } from 'react-bricks/frontend'
import Layout from '../components/layout'
import Seo from '../components/seo'
import PostThumbnail from '../components/PostThumbnail'
import ErrorNoKeys from '../components/errorNoKeys'
import dayjs from 'dayjs'

interface BlogListThumbnailsProps {
  pageContext: { error: string; posts: types.Page[] }
}

const BlogListThumbnails: React.FC<BlogListThumbnailsProps> = ({
  pageContext: { posts, error },
}) => {
  return (
    <Layout>
      <Seo
        title="Blog List Thumbnails"
        description="React Bricks blog starter"
        lang="en"
      />

      <div className="container max-w-5xl mx-auto py-16 px-6">
        <h1 className="text-center text-4xl sm:text-6xl lg:text-7xl leading-none font-black tracking-tight text-gray-900 pb-4 mt-10 sm:mt-12 mb-4">
          Blog
        </h1>
        <div className="py-10 flex flex-wrap">
          {posts?.map((post) => (
            <PostThumbnail
              key={post.id}
              href={post.slug}
              title={post.name}
              description={post.meta.description}
              date={dayjs(post.publishedAt).format('DD/MM/YYYY')}
              image={
                post.meta.featuredImage ||
                'https://images.reactbricks.com/original/8b1974a0-91a8-4ab4-b014-83f60192f9b5.svg'
              }
            />
          ))}
        </div>
      </div>

      {error === 'NOKEYS' && <ErrorNoKeys />}
    </Layout>
  )
}

export default BlogListThumbnails
