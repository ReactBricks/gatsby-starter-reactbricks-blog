import { Link } from 'gatsby'
import React from 'react'

const Header: React.FC = () => (
  <header className="bg-white sm:h-20 py-5 border-b sm:sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-6">
      <div className="w-full flex flex-col sm:flex-row justify-center sm:justify-between items-center">
        <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
          <a href="/">
            <img
              src="/react-bricks-logo.svg"
              className="w-48"
              alt="React Bricks"
            />
          </a>
          <div className="sm:ml-8 flex space-x-5 text-center">
            <Link to="/blog/list">
              <div className="text-gray-500 hover:text-pink-700">Post List</div>
            </Link>
            <Link to="/blog/thumbnails">
              <div className="text-gray-500 hover:text-pink-700">
                Blog Thumbnails
              </div>
            </Link>
          </div>
        </div>

        <a
          href="/admin"
          className="py-2 px-5 rounded text-white font-medium bg-cyan-500 hover:bg-cyan-600 hover:shadow-lg transition duration-200"
        >
          Edit content
        </a>
      </div>
    </div>
  </header>
)

export default Header
