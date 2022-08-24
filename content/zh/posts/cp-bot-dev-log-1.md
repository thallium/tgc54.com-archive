---
title: "全新的开始 - 算法竞赛机器人开发日志1"
subtitle: ""
summary: ""
tags: []
categories: [cp-bot]
date: 2022-08-15T21:46:28-04:00
lastmod: 2022-08-15T21:46:28-04:00
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
我的机器人，明明只有两个功能，却已重写了两次了，第一次从C++搬到Python，现在又从Python搬到Nonebot框架上（虽说还是Python)，以后应该不会再动了。这次搬迁起源于周六在给上一版本写readme，准备发布到GitHub上，当时我在特点里写下了

> 不使用框架（可能是个错误的决定）

然后我就不禁思考这到底是不是个错误的决定：当初不用框架的原因也很简单，就是不想学框架的那一套，然后又觉得自己造点轮子也挺好玩的，但后来发现自己需要造的轮子越来越大时就不那么好玩了，目前有几个大轮子要造：
- 命令与参数系统，如果将来命令增多的话一堆if else加字符串匹配又麻烦又丑
- 定时命令，比赛提醒是我接下来想做的一大特性，因为我老是忘AtCoder的比赛
- 配置系统，要是将来别人要用的话一定要做好配置系统

于是我又看了看Nonebot的文档，发现好像也没那么麻烦，而且自带命令与定时系统，又想到框架难道不就是为了让开发者专注于编写业务逻辑吗？于是就想先试试看，然后第二天早上加中午吃完饭一点时间就基本搬过去了，又看到非常fancy的log界面就决定完全转到Nonebot上了。

那又为什么要写开发日志捏？因为机器人其实好久没再继续开发了，自从前两周发现了APScheduler之后就开始研究加缓存与比赛提醒的功能，然后就萌生了写日志的想法，这次搬迁又差不多算是“从头开始”所以就每周写一篇开发日志记录本周工作以及接下来要做的任务，顺便起到督促自己的作用。

第一篇（这篇）本来应该周日写的来着，结果周日出去玩由于突发情况回来的很晚，基本上接着就上床睡觉了。以后日志争取在周末写，这次由于背景介绍所以稍长，以后应该就简单记录一下。

上周工作：
- 基本完成搬运，两个命令已可用，但缓存还没搞定
- 一些重构：重命名，添加type hint
- 变成包之后import语句要变成类似`from . import xxx`，把所有import都修了（还挺多的）

TODO：
- 参数系统，查比赛命令挺需要的
    - 画图功能也很需要
- 看看内置的scheduler能不能用数据库的job store，如果能的话：
    - 尽快能把缓存弄好
    - 比赛提醒
- 根据配置开关某些功能，比如是否使用缓存
- 重构一些抄的TLE的代码，感觉不是很喜欢TLE的一些设计
- 搬一些TLE其他的有趣的功能
