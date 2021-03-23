const pagination = require('hexo-pagination')
const { tagMapper, tagPageMapper, postMapper } = require('../helpers/mapper')

class TagGenerator {
  data = []
  posts = []
  configs = {}

  constructor(tags, posts, configs) {
    this.data = tags
    this.posts = posts
    this.configs = configs
    this.reduceTags()
  }

  reduceTags() {
    const tags = this.data
    const posts = this.posts
    const configs = this.configs

    this.data = tags.reduce(function (result, item) {
      if (!item.length) return result

      return result.concat(
        pagination(item.path, posts, {
          perPage: 0,
          data: {
            name: item.name,
            slug: item.slug,
            count: item.posts.length,
            path: 'api/tags/' + item.slug + '.json',
            postlist: item.posts.map((post) => {
              return postMapper(post, configs)
            })
          }
        })
      )
    }, [])
  }

  addTags(data) {
    if (this.count <= 0) return data
    data.push({
      path: 'api/tags.json',
      data: JSON.stringify(this.data.map(tagMapper))
    })
    data = data.concat(this.data.map(tagPageMapper))
    return data
  }

  count() {
    return this.data.length
  }
}

module.exports = TagGenerator