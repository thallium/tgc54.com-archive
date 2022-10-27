---
title: 软件杂项
date: 2022-05-20
categories: [小技巧]
tags: []
---
## 用cue文件分割flac并标记

```sh
shnsplit -f <cuefile> -t %n-%t -o flac <flacfile>
cuetag <cuefile> *.flac
```
