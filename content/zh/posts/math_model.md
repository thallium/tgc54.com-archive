---
title: "一些数学模型"
date: 2021-05-05T22:34:22-04:00
categories: [算法笔记]
tags:
- 数学
---
总结一些常见的数学模型。
<!--more-->
## 将直线上多个点移动到一个点的最小距离

移动到最中间的那个点距离最小，或者说是移动到一点使得两侧的点一样多。

## 将直线上多个点移动到连续的位置

假设起点为$a$, 也就是说最小化$\sum_i|x_i-(a+i)|=\sum_i|(x_i+i)-a|$, 于是问题又转化成了将坐标为$x_i-i$的点移动到一点的问题，取中间的坐标即可。

## Chicken McNugget Theorem

假设$n, m$互质，最大的不能被表示为$an+bm, a, b\ge 0$的数是$nm-m-n$.

[source](https://artofproblemsolving.com/wiki/index.php/Chicken_McNugget_Theorem)

## 最小化一点到其他点距离的平方的和

由于$dis^2=x^2+y^2$，而x和y可以独立改变，所以可以分别最小化两个坐标轴的距离，也就是坐标的平均数。
