---
title: "Easy SSL Certificates for Local Services in Your Home Lab"
date: 2023-08-31T22:53:01-04:00
summary: ""
keywords: []
tags: ["Nginx Proxy Manager", "SSL"]
categories: ["Home Server"]
---
The method comes form a [video](https://www.youtube.com/watch?v=qlcVx-k-02E) of Walfgang's Channel. This post is just a note of that video for experienced people.
<!--more-->

The key point is that you can create a DNS record that points to your local IP address.

Prerequisite: a domain name, a reverse proxy (I'm using Nginx Proxy Manager here), a SSL certificate of the domain that you'll be using.

Step 1: create a A DNS record that points to the local IP address of your server, e.g. `server.tgc54.com -> 192.168.1.23`.

Step 2: in your reverse proxy, proxy the domain to your local service and you can use your SSL certificate.

It's just this easy!
