---
title: "使用自定义头文件在算法竞赛中辅助本地调试"
date: 2021-05-21T20:22:27-04:00
categories: [小技巧]
tags: 
---

算法竞赛中主要有两种调试方式：调试器(debugger)和直接输出。调试器适合查看少量或者特定位置的信息，但可能比较费时间并且如果错过了某些信息就要重新运行,而且必须要吐槽gdb输出二维数组全挤在一行根本没法看；而直接输出适合跟踪大量的信息，并且可以方便的查看之前的信息，缺点就是需要在代码中添加额外的语句（可能会很多）并且要在提交之前删掉（即便是输出到标准错误流也会影响性能）。一种解决办法就是使用提前写好的代码/头文件，并结合`#ifdef`宏和命令行define参数实现区分本地和评测环境，让调试代码在环境中失效。

输出我直接用的现成的[pretty printer](https://github.com/p-ranav/pprint)，然后在代码中加入如下语句：

```cpp
#ifdef LOCAL
#include<pprint.hpp> // https://github.com/p-ranav/pprint
pprint::PrettyPrinter _printer(std::cerr);
#define de(...) _printer.compact(true).print('[', #__VA_ARGS__,"] =", __VA_ARGS__)
#define de2(...) _printer.compact(false).print('[', #__VA_ARGS__,"] =", __VA_ARGS__)
#else
#define de(...)
#define de2(...)
#endif
```
注意这样做需要把`pprint.hpp`所在的目录加到`CPLUS_INCLUDE_PATH`环境变量里，或者编译时使用`-I`标记，或者将`pprint.hpp`放到系统include目录里。

如果你嫌太长的话，可以将此部分
```cpp
#ifdef LOCAL
#include<pprint.hpp> // https://github.com/p-ranav/pprint
pprint::PrettyPrinter _printer(std::cerr);
#define de(...) _printer.compact(true).print('[', #__VA_ARGS__,"] =", __VA_ARGS__)
#define de2(...) _printer.compact(false).print('[', #__VA_ARGS__,"] =", __VA_ARGS__)
#endif
```
放入`stdc++.h`里，只在代码中留下
```cpp
#ifndef LOCAL
#define de(...)
#define de2(...)
#endif
```

编译时加上`-DLOCAL`标记以定义`LOCAL`，可以换成其他的词，只要保证oj里没有定义这个就行。
