---
title: 二项式反演
categories: [算法笔记]
tags: []
---
<!--more-->
感觉[这篇](https://www.cnblogs.com/GXZlegend/p/11407185.html)讲得不错。

目前就先记录公式，以后有更深的理解再补。

## 形式零

$$f(n)=\sum\limits_{i=0}^n(-1)^i{n\choose i}g(i)\iff g(n)=\sum\limits_{i=0}^n(-1)^i{n\choose i}f(i)$$

## 形式一

$$f(n)=\sum\limits_{i=0}^n{n\choose i}g(i)\iff g(n)=\sum\limits_{i=0}^n(-1)^{n-i}{n\choose i}f(i)$$

## 形式二

最常用的形式

$$f(n)=\sum\limits_{i=n}^m{i\choose n}g(i)\iff g(n)=\sum\limits_{i=n}^m(-1)^{i-n}{i\choose n}f(i)$$
