---
title: "家庭服务器折腾记录"
date: 2022-02-22T15:55:42-05:00
categories: ["科技"]
tags: ["科技"]
---
简单记录自己服务器的配置过程，方便需要时查看以及但愿对你有所帮助。
<!--more-->

## 服务器配置

|||
|---|---|
|整机|Intel NUC|
|CPU|i7-10710U|
|内存|16G|
|硬盘|500G西数蓝盘+1TB希捷机械|
|OS| Ubuntu 20.04.4 LTS|

## 通用

[远程访问：端口转发，DDNS...](https://www.youtube.com/watch?v=wCJjiHp0d0w)

SSL证书：

https://www.youtube.com/watch?v=c1t_OrIia1U

https://certbot.eff.org/instructions?ws=apache&os=ubuntufocal

## 软件

### Nextcloud

[安装教程](https://www.youtube.com/watch?v=ZM1fL6ze4X8)

[反向代理](https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/reverse_proxy_configuration.html)

### Pi-hole

安装：使用[官方安装脚本](https://github.com/pi-hole/pi-hole#one-step-automated-install)即可。注意：脚本有个bug，即使你已经装了其他web server（比如Apache）也要选择装lighttdp，否则重启服务的时候脚本会崩溃。。。（当你看到此的时候也许已经修复了）

[配置Apache以访问web UI](https://gist.github.com/GAS85/62b8e4851923e5ecec29cbc9b374ab18)

一些黑名单：
- https://github.com/blocklistproject/Lists
- https://anti-ad.net/domains.txt

### Photoprism

[安装](https://docs.photoprism.app/getting-started/docker-compose/)

[反向代理](https://docs.photoprism.app/getting-started/proxies/apache-2/)，把http中的photoprism换成localhost

### RSSHub

[docker compose部署](https://docs.rsshub.app/en/install/#docker-compose-deployment)

### Miniflux

[docker compose部署](https://miniflux.app/docs/installation.html#docker)

### Navidrome

[docker-compose](https://www.navidrome.org/docs/installation/docker/)

### qBittorrent(-nox)

在服务器由于没有xorg所以装的是nox版本

[安装教程](https://github.com/qbittorrent/qBittorrent/wiki/Running-qBittorrent-without-X-server-(WebUI-only,-systemd-service-set-up,-Ubuntu-15.04-or-newer)

不知道为啥用局域网也访问不到，一种解决办法是利用ssh建立通道（[教程](https://rawsec.ml/en/archlinux-install-qbittorrent-nox-setup-webui/))，或者apache[反向代理](https://qbforums.shiki.hu/viewtopic.php?t=90)。

