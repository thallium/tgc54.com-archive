---
title: File Browser (filebrowser)
---

File Browser是一个网页端文件管理/浏览器，它很轻量但同时拥有丰富的功能。在GitHub上有1.7万的星星。

<!--more-->

## 为什么不用Nextcloud?

Nextcloud功能很强大，但很多人只把他当作云存储用所以就显得比较臃肿。而且它的网页端用起来感觉有点慢而且播放器经常出bug。IOS端也卡卡的（可能也与我手机比较老有关），网页端在手机上更不好用。最重要的一点：文件单独存放在一个地方而且是以www-data用户管理，所以如果你要在服务器上导入、导出、下载文件的话来回切换用户很不方便。所以我就一直在找一个替代Nextcloud的方案，尝试了各种方案之后，File Browser也许是最符合我需求的。（主要痛点就是视频封面，其实File Browser也没有，但有别人的fork加上了，然后我又完善了一下并传到了docker hub上）

## 安装
```yaml
version: '3'
services:
  app:
    container_name: filebrowser
    #image: filebrowser/filebrowser
    image: thallium54/filebrowser

    restart: unless-stopped
    user: 1000:1000
    ports:
    - "8335:80"
    volumes:
      - /path/to/manage:/srv
      - /path/to/database/filebrowser.db:/database.db
      - /path/to/cache:/cache
```

镜像可以用我的或者官方的。volume根据你的情况修改，第一个是你要管理的目录，比如我直接把home目录挂上去了。第二个是数据库的位置，**一定要自己创建**`filebrowser.db`这个文件，不然docker会把这个当成目录然后创建一个叫`filebrowser.db`的目录。第三个是视频和图片预览的缓存目录，官方镜像没有开缓存所以如果用官方镜像的话就删掉这一行就行。

## 如何自己构建

以我自己的版本举例：
1. `git clone https://github.com/thallium/filebrowser.git`
2. `git checkout videopreview`（切换到有视频预览的branch)
3. `make build`（编译可执行文件，如果你不打算用docker的话编译出来的就直接可以用了，具体用法见`filebrowser -h`）
4. `docker build . -t thallium54/filebrowser:latest`（构建docker镜像）
5. `docker push thallium54/filebrowser:latest`（如果在本地用的话可以不push）

