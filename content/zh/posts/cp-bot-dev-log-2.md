---
title: "算法竞赛机器人开发日志2"
subtitle: ""
summary: "干了些小事"
tags: []
categories: [cp-bot]
date: 2022-08-21T21:41:46-04:00
lastmod: 2022-08-21T21:41:46-04:00
draft: false
profile: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

projects: [cp-bot]
---

这周没做什么大功能，做了下几件小事：

### 参数

原来 `on_shell_command` 就是专门负责这个的，可以传入一个 argument parser，那这样就很简单了，于是给查比赛加了 `-n x` 和 `--all` 以显示前 x 条或者全部比赛。

### 数据库相关

最近了解到 ORM（我真是孤陋寡闻现在才知道这个东西），于是决定放弃 MongoDB 还是用关系型数据库，但 APScheduler 的 `SQLAlchemyJobStore` 好像没完全支持 SQLAlchemy 2所以比赛提醒暂时就没法做可持久化了，但一想可持久化也没有太大的用，每次更新缓存的时候重新添加一遍提醒应该就够了。。。缓存的话到是弄完了但是没法测试，因为今天cf的API一直都是挂了的。说到ORM就不得不提重构的事：

### 重构

现在 `Contest` 类不再用 `NamedTuple` 了，因为可以和ORM（用的SQLModel）的Model共用一个类，而且SQLModel的model也是Pydantic model所以可以直接用`parse_obj`，比之前`NamedTuple`优雅多了。不得不说SQLModel的理念真的很有想法。

### LaTex插件

受群友的提示写了个渲染LaTex的插件，试了Matplotlib和SymPy的latex功能都不太满意，最后基于SymPy的`preview`函数自己写了个插件。

### TODO
- 缓存和提醒
- 继续研究TLE的代码看看有没有好玩的功能
- 把代码整理好开源到github上
