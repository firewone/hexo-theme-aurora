/**
 * ObsidiaNext API generator
 * @author TriDiamond <code.tridiamond@gmail.com>
 *
 * - Added the photos fields.
 * - Added the `features` post data.
 * - Added truncate for filtering html tags.
 * - Added statistics.
 * - Added post unique ID property used for gitalk.
 * - Added previous and next post.
 * - Enhanced performance by reducing the number of unnecessary iterations.
 * - Added multi-author support.
 * - Enhanced the performance of the post list script.
 */

const SiteGenerator = require('./site')
const CategoryGenerator = require('./category')
const TagGenerator = require('./tag')
const PostGenerator = require('./post')
const PageGenerator = require('./page')
const StatisticGenerator = require('./statistic')
const SearchGenerator = require('./search')
const chalk = require('chalk')

module.exports = function (hexo) {
  let apiData = []

  // Remove hexo default generators
  // ;['post', 'page', 'archive', 'category', 'tag'].forEach(
  //   (name) => delete hexo.extend.generator.store[name]
  // )
  ;['page', 'archive', 'category', 'tag'].forEach(
    (name) => delete hexo.extend.generator.store[name]
  )

  hexo.extend.generator.register('obsidianext-page', function (site) {
    const pageData = []

    site.pages.forEach(function (page) {
      pageData.push({
        path: `page/${page.path}`,
        data: {},
        layout: ['index']
      })
    })

    pageData.push({
      path: 'tags/search/index.html',
      data: {},
      layout: ['index']
    })

    return pageData
  })

  hexo.extend.generator.register('obsidianext-api', function (site) {
    return generator(
      Object.assign({}, hexo.config, {
        theme_config: hexo.theme.config
      }),
      site
    )
  })

  function generator(configs, site) {
    const siteG = new SiteGenerator(configs)
    apiData = siteG.addSiteConfig(apiData)

    const posts = new PostGenerator(site.posts, configs)
    apiData = posts.addPaginationPost(apiData)
    apiData = posts.addArticles(apiData)
    apiData = posts.addFeatures(apiData)

    const categories = new CategoryGenerator(
      site.categories,
      site.posts,
      configs
    )
    apiData = categories.addCategories(apiData)

    const tags = new TagGenerator(site.tags, site.posts, configs)
    apiData = tags.addTags(apiData)

    const pages = new PageGenerator(site.pages)
    apiData = pages.addPages(apiData)

    const statistic = new StatisticGenerator(
      {
        posts: posts.count(),
        categories: categories.count(),
        tags: tags.count()
      },
      posts.data
    )
    apiData = statistic.addStatistics(apiData)

    const search = new SearchGenerator(posts.data)
    apiData = search.addSearchIndex(apiData)

    console.log(
      chalk.green('INFO ') +
        chalk.red('API') +
        chalk.green(' data') +
        chalk.yellow(' generated') +
        chalk.blue(' by') +
        chalk.magenta(' Aurora.')
    )

    return apiData
  }
}
