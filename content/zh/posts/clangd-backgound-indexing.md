---
title: "以算法竞赛写题为例的 clangd 后台索引(backgound indexing)使用指南"
date: 2023-04-23T23:39:14-04:00
summary: ""
keywords: []
tags: []
categories: []
---
我也不知道标题在说什么
<!--more-->

## 问题

虽然目前我的板子大部分都进行了封装，include就能直接用，但依然有两个痛点：
1. 需要手动 include，每次要跳到最上面include之后再回来不免有些麻烦
2. 由于目前是靠 compile_flags.txt 配置的 clangd，所以并不会有后台索引，也就是说include之后并不能获得该文件的补全信息，而我经常记不得类或者函数的名字所以不得不跳转过去看一眼，而对于有些非常长的名字，也还是要跳转打开文件一次这样clangd才能索引该文件。

如果有后台索引的话这两个问题都能完美解决！

## 步骤

首先在放代码的目录里写一个非常简单的 `CMakeLists.txt`:

```cmake
cmake_minimum_required(VERSION 3.1...3.26)

project(
    competitive programming
  VERSION 1.0
  LANGUAGES CXX)

set (CMAKE_CXX_STANDARD 20)

add_executable(include-all include-all.cpp)

include_directories(板子的目录)
```

我们还要新建一个 include-all.cpp 并在里面 include 我们所有的板子文件（后面会提到他的所用）。

然后执行 `cmake . -DCMAKE_EXPORT_COMPILE_COMMANDS=1` 这样就能得到 `compile_commands.json` 文件，clangd就是根据这个文件来进行索引的。
然而你发现 `compile_commands.json` 里面其实并没有头文件的信息。这是因为头文件并不是一个 translation unit 所以 cmake 就不会为其生成编译信息。那怎么办呢？我们可以借助 [compdb](https://github.com/Sarcasm/compdb) 这个工具为我们加入头文件的信息，这就是 CMakeLists.txt 里 include-all.cpp 的作用。然后我们执行:

```sh
compdb -p . list > new.json # 这里不能直接重定向到compile_commands.json，好奇的话可以自己试一下
mv new.json compile_commands.json # 把原来的覆盖掉
```

当你以为大功告成的时候你会发现好像还是不行，这是因为 clangd 默认不会索引当前目录之外的东西（大概是这么个意思），要给 clangd 加上 `--compile-commands-dir=代码目录` 参数。

最后的最后，要保证你的板子第一行要有 `#pragma once`，不然不能自动 include。

以上便是我从下午三点到晚上十点的研究成果（为什么我总是花大把时间研究一些没什么用的功能）
