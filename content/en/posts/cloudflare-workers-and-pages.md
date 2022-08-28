---
title: "Fast Static Website Deployment with Cloudflare Workers and Pages"
subtitle: ""
summary: "Cloudflare is the new contender in the hosting service."
tags: ["cloudflare"]
categories: ["Tutorial"]
date: 2022-05-21T09:15:41-04:00
lastmod: 2022-05-21T09:15:41-04:00
draft: false
profile: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

projects: []
---
If you are developing a simple static website like a blog or wiki, you probably don't really like to play with a hosting service involving a remote repository like GitHub pages. Pushing to the remote repo every time you make changes and waiting for the building process is not that pleasant. With Cloudflare Workers/Pages, you can upload your website directly using [Wrangler](https://developers.cloudflare.com/workers/wrangler/get-started/).

## Installation

Install Wrangler globally:

```sh
npm install -g wrangler
```

## Authentication

There are two ways of authentication:
1. If you are using it on your own computer, you can use OAuth in your browser to login by running `wrangler login`.
2. set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` environmental variables.
    - API token can be generated [here](https://dash.cloudflare.com/profile/api-tokens)
        - for workers, you can use the "Edit Cloudflare Workers" template.
        - for pages, follow the offical guice [here](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/#generate-an-api-token).
    - To find your account ID, log in to the Cloudflare dashboard > select your zone in Account Home > find your account ID in Overview under **API** on the right-side menu.

## Cloudflare Workers

Cloudflare Worker is flexible and powerful. You can do much more than hosting website. You websites are stored in the KV storage.

To deploy your website:
1. copy [wrangler.toml](https://github.com/cloudflare/worker-sites-template/blob/wrangler2/wrangler.toml) to your project directory.
    - change `bucket` to your website directory, e.g. `public` folder for a hugo website.
    - optionally, add `route = "your-domain.com/*"` to set custom domain/route for your website.
2. create `src` folder and copy [index.js](https://github.com/cloudflare/worker-sites-template/blob/wrangler2/src/index.js)
3. in the `src` folder, run `npm i @cloudflare/kv-asset-handler`
4. finally, back to the folder where you put `wrangler.toml`, run `wrangler publish` to deploy your website.

## Cloudflare Pages

Cloudflare Pages is meant to replace the website hosting functionality of Workers. It supports lots of front-end framework so you can deploy your front-end application very easily. You can still upload locally with `wrangler` but it doesn't work that well (it failed to upload my hugo blog).

The upload is pretty easy: simple run `wrangler pages publish <directory>` and follow the instruction.
