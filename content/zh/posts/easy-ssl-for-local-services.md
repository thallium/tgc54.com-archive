---
title: "让你的家庭服务器里的本地服务也用上 SSL 证书"
date: 2023-08-31T22:53:01-04:00
summary: ""
keywords: []
tags: ["Home Server", "SSL", "Nginx Proxy Manager"]
categories: ["Home Server"]
---
这个方法来自于 [视频](https://www.youtube.com/watch?v=qlcVx-k-02E) ，由 Walfgang 的频道提供。这篇帖子仅为有经验的人提供对那个视频的笔记。
<!--more-->

关键点在于，你可以创建一个 DNS 记录，将其指向你的本地 IP 地址。

先决条件：一个域名，一个反向代理（我在这里使用的是 Nginx Proxy Manager），用于域名的 SSL 证书。

步骤 1：创建一个 A 类型的 DNS 记录，将其指向你服务器的本地 IP 地址，例如 `server.tgc54.com -> 192.168.1.23`。

步骤 2：在你的反向代理中，将域名代理到你的本地服务，并可以使用你的 SSL 证书。

就是这么简单！
