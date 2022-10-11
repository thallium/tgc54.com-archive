---
title: "用Clang打包C++代码"
subtitle: ""
summary: ""
tags: ["Tricks"]
categories: []
date: 2022-07-22T09:51:55-04:00
lastmod: 2022-07-22T09:51:55-04:00
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
作为一名算法竞赛选手，我一直在寻找避免复制粘贴板子的方法，这样我就的板子库就能更加复杂。

受[Egor](https://codeforces.com/profile/Egor)的rust bundler启发，我不禁想C++也有没有相似的东西? 于是想起来很久之前看过[这个博客](https://codeforces.com/blog/entry/77139)然后我就话了点时间又找到了那篇博文，但并不是bundler而且看起来很复杂。评论区里有人提到用`cpp`这个预处理命令。也许你知道，`#include`基本就是复制粘贴所以看起来好像有戏，但问题是预处理也会复制粘贴标准库，大概有20多万行。所以我继续搜寻能不能跳过系统头文件，然后就找到了[这个](https://stackoverflow.com/a/20889599)，但只有clang才能用，因为我自己也用clang所以就没再找gcc的解决办法。

命令如下
```sh
clang++ -I/your/path/to/library/ -E -P -nostdinc++ -nobuiltininc main.cpp
```

解释：

- `-E` 只进行预处理
- `-P` 关闭在预处理中生成行标记
- `-nostdinc++` 关闭C++标准库
- `-nobuiltininc` 关闭内置的#include目录（不太知道什么意思，可能没用）

因为系统头文件不会被保留，所以需要另一条命令把体统头文件加上，然后我就写了一个shell函数一起做这两件事：

```sh
expand_cpp () {
    clang++ -I/your/path/to/library/ -E -P -nostdinc++ -nobuiltininc $1 | gsed "1s/^/#include <bits\/stdc++.h>\n/" | pbcopy
}
```

其中`pbcopy`是macOS上复制到剪切板的命令，其他平台用相应的命令代替即可。
