---
title: "Bundle C++ Code with Clang"
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
As a competitive programmer, I always want to find a solution to avoid copy-and-pasting my algorithm library so I can write more complex code lol.

<!--more-->
Inspired by [Egor](https://codeforces.com/profile/Egor)'s rust bundler, I wondered is there something similar for C++? I remembered that I read [this](https://codeforces.com/blog/entry/77139) long time ago then I spent some time finding that blog but it's not a bundler and looks quite complicated. In the comment someone mentioned using the `cpp` command which does the preprocessing work. As you may know, `#include` is basically copy-and-paste so this actually sounds right, but the problem is that it also copies and pastes the standard library which is over 200k+ lines of code. So I dug a bit further to see if it's possible to skip system header and found [this](https://stackoverflow.com/a/20889599), but it only works for clang which what I'm using so I didn't look for a solution for gcc.

The command is:
```bash
clang++ -I/your/path/to/library/ -E -P -nostdinc++ -nobuiltininc main.cpp > bundled.cpp
```

Explanation:

- `-E` Only run the preprocessor
- `-P` Disable linemarker output in -E mode
- `-nostdinc++` Disable standard #include directories for the C++ standard library
- `-nobuiltininc` Disable builtin #include directories (may not be needed)

As `#include` of system header isn't preserved, you can add the system headers using another command and I made a shell function to do that:

```bash
expand_cpp () {
	clang++ -I/your/path/to/library/ -E -P -nostdinc++ -nobuiltininc $1 > bundled.cpp
	gsed -i "1s/^/#include <bits\/stdc++.h>\n/" bundled.cpp
}
```
