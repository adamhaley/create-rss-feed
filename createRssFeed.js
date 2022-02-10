const fs = require('fs');
const xml = require('xml');
const ROOT_URL = 'https://marketinsights.citi.com/';


function buildFeed(
  posts
) {
  const sortedPosts = posts.sort(function (first, second) {
    return new Date(second.date).getTime() - new Date(first.date).getTime();
  });

  const feedItems = [];

  feedItems.push(
    ...sortedPosts.map(function (post) {
      const feedItem = {
        item: [
          { title: post.title },
          {
            pubDate: new Date(post.date).toUTCString(),
          },
          {
            guid: [
              { _attr: { isPermaLink: true } },
              `ROOT_URL/${post.slug}/`,
            ],
          },
          {
            description: {
              _cdata: post.content,
            },
          },
        ],
      };
      return feedItem;
    })
  );

  return feedItems;
}

(async function createFeed(){
 
    const posts = [
      {
        title: "Post Two",
        date: "1/2/2020",
        slug: "post-two",
        content: "This is some content for post two.",
      },
      {
        title: "Post Three",
        date: "1/3/2020",
        slug: "post-three",
        content: "This is some content for post three.",
      },
      {
        title: "Post Four",
        date: "1/4/2020",
        slug: "post-four",
        content: "This is some content for post four.",
      },
    ];

    console.log("create feed");
    const feedObject = {
        rss: [
          {
            _attr: {
              version: "2.0",
              "xmlns:atom": "http://www.w3.org/2005/Atom",
            },
          },
          {
            channel: [
              {
                "atom:link": {
                  _attr: {
                    href: "http://Marketinsights.citi.com/feed.rss",
                    rel: "self",
                    type: "application/rss+xml",
                  },
                },
              },
              {
                title: "Citi Personal Wealth Management",
              },
              {
                link: "http://Marketinsights.citi.com/",
              },
              { description: "Market Insights RSS Feed" },
              { language: "en-US" },
              ...buildFeed(posts),
            ],
          },
        ],

    };

    const feed = '<?xml version="1.0" encoding="UTF-8"?>' + xml(feedObject);

    await fs.writeFile("./feed.rss", feed, (err) => {
        if(err) throw err;
        console.log("the file has been saved.");
    });
})();
