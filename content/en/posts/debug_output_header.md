---
title: "Use Custom Header File to Facilitate Local Debugging"
date: 2021-05-21T20:22:27-04:00
categories: [Tricks]
tags: ['C++']
---
Printing out information is probably the fastest way to debug in competitive programming, but you have to commenting out these lines before submitting, which is time-consuming and error-prone. Printing to stderr is better but it can slow your program down. We can solve this by using pre-written printing functions combining with `#ifdef` to differentiate local and judge environment.

For printing function I'm using [pretty printer](https://github.com/p-ranav/pprint) which does a really nice job. Then add the line below to your code and you can use `de()` to print things and don't have to worry about messing up your output.

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

Note that you need to add the directory where your `pprint.hpp` is to the `CPLUS_INCLUDE_PATH` environmental variable, or use the `-I` flag while compiling, or just put `pprint.hpp` inside your  system include directory.

If you think the above code is too long, you can put this part:
```cpp
#ifdef LOCAL
#include<pprint.hpp> // https://github.com/p-ranav/pprint
pprint::PrettyPrinter _printer(std::cerr);
#define de(...) _printer.compact(true).print('[', #__VA_ARGS__,"] =", __VA_ARGS__)
#define de2(...) _printer.compact(false).print('[', #__VA_ARGS__,"] =", __VA_ARGS__)
#endif
```
in your `stdc++.h`, and only leave this part in your code:
```cpp
#ifndef LOCAL
#define de(...)
#define de2(...)
#endif
```

Use `-DLOCAL` flag while compiling to define `LOCAL`, you can use other word but make sure it's not defined in the judge.
