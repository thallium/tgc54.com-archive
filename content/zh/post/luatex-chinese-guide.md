---
title: "在LuaTex/LuaLaTex使用中文，附Font KaitiSC not found.解决方法"
date: 2022-03-05T19:39:39-05:00
categories: [LaTex]
tags: [LaTex]
profile: false
---

<!--more-->

如果是中文文档的话可以用ctex包：

```latex
\usepackage{ctex}
\setCJKmainfont{Source Han Sans SC} % 设置默认中文字体
\setCJKfamilyfont{songti}{FZShuSong-Z01S} % 设置默认宋体字体
% 上面的songti也可以换成别的，默认定义了songti、heiti、fangsong

\begin{document}
使用默认字体
{\heiti 使用特定字体}
\end{document}
```


如果只加入少量中文的话可以直接调用中文字体：

```latex
\usepackage{fontspec}
\newfontfamily{\han}{Source Han Sans SC}

\begin{document}
{\han 中文}
\end{document}
```

附：macOS下“The font "KaitiSC" cannot be found.”解决方案

详细情况请看[原文](https://zhuanlan.zhihu.com/p/42434849), Monterey下执行
```sh
sudo tlmgr conf texmf OSFONTDIR /System/Library/AssetsV2/com_apple_MobileAsset_Font7
```
