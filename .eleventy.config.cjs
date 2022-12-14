const {
  EleventyHtmlBasePlugin,
  EleventyRenderPlugin,
} = require("@11ty/eleventy");

const {
  DefaultFrontmatterPlugin,
  RemarkPlugin,
} = require("./lib/plugins/index.cjs");

const {
  capitalise,
  deslug,
  fileExists,
  filterBy,
  textLength,
  print,
} = require("./lib/filters.cjs");

const constants = require("./lib/constants.cjs");
const { BASE_HREF, GITHUB_REPOSITORY, GITHUB_REPOSITORY_NAME } = constants;

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin, {
    baseHref: BASE_HREF,
  });
  eleventyConfig.addPlugin(RemarkPlugin, {
    plugins: [
      "./lib/markdown/relative-links.js",
      "./lib/markdown/aria-current-links.js",
      "remark-breaks",
      "remark-emoji",
      "remark-footnotes",
      "remark-gfm",
      ["remark-github", { repository: GITHUB_REPOSITORY }],
      "remark-slug",
      "remark-smartypants",
      [
        "remark-wiki-link",
        {
          pageResolver: (name) => [name.replace(/ /g, "-")],
          hrefTemplate: (path) => `/${path}`,
        },
      ],
    ],
  });

  eleventyConfig.addPlugin(DefaultFrontmatterPlugin, {
    all: {
      constants,
      layout: "page.njk",
      siteTitle: GITHUB_REPOSITORY_NAME
        ? GITHUB_REPOSITORY_NAME
        : "website-from-github-wiki",
    },
    "Home.md": {
      permalink: "/",
    },
  });

  // Use HTML comments to define frontmatter to keep wiki content cleaner.
  eleventyConfig.setFrontMatterParsingOptions({
    delims: ["<!---", "--->"],
  });

  // Filters
  eleventyConfig.addFilter("capitalise", capitalise);
  eleventyConfig.addFilter("deslug", deslug);
  eleventyConfig.addFilter("fileExists", fileExists);
  eleventyConfig.addFilter("filterBy", filterBy);
  eleventyConfig.addFilter("textLength", textLength);
  eleventyConfig.addFilter("print", print);

  // Ensure our untracked _wiki input can be used as an input.
  eleventyConfig.setUseGitIgnore(false);

  return {
    dir: {
      includes: "../_includes",
      input: "_wiki",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
