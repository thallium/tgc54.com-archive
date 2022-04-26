---
published: true
date: 2019-09-15
title: York Univeristy programming contest 第一场题解
categories: [比赛题解, 题解]
tags:
layout: post
math: true
---

这是一场关于身残志坚的比赛。那天晚上切菜时切着手了，去了医院，没想到挂个急诊还要等这么久，心想晚上的比赛肯定泡汤了，等待之余想起自己包里还有iPad和蓝牙键盘，虽然比赛已经开始半小时了，而且自己只有9根指头能用，就当玩玩吧，于是我连上键盘，打开koder，在iPad上打起了比赛，没想到最后出了三个题，排名第三，手指和比赛都保住了……
<!--more-->
***
[题目链接](https://open.kattis.com/contests/beqggh/problems)

# A. Cold-puter Science

**题意：** 给出$n$个数问有几个数小于0。

**思路：** 这就不用说了吧，基本上是我见过的最水的签到题了。

---

# B. Are You Listening?

**题意：** 给出自己的坐标$cx,cy$以及$n$个敌放监听点的坐标和监听半径$x,y,r$，对方最少需要3个点探测到你才能确定你的位置，问自己广播的最大半径是多少（答案可能是0，向下取整）。

**思路：** 设监听点的与你的距离是$d$，半径是$r$，那么$d-r$就是不被检测到的最大广播半径。于是每读入一组监听点的数据就计算出$d-r$并存入数组中，最后对数组排序，如果第三个数小于0就输出0否则输出向下取整后的数。

---

# C. Chewbacca
**题意：** 给出一棵有$N$个节点的满树，每个节点最多有$K$个子节点，节点的需要从上往下、从左往右排列，给出$Q$个询问，问树上两个点的最短路径的长度。

**思路：** 当时想到是求LCA了，但因为没学过而且排到我了就没做，其实这题很简单，因为题目很特殊：是一棵满树并且父亲与儿子之间的距离是1，所以可能采用比较暴力的算法，经过实验可以发现：如果一个节点的序号是$n$，那么$(n+K-2)/K$就是其父节点的坐标，由此我们就可以通过不断除得到两个节点的深度(其实好像也可以直接求$\lceil \log_Kn \rceil$)，先使深度比较大的节点跳转到深度比较小的节点的深度，然后令两个点同时向上跳转直到重合。

---

# D. Bike Gears

**题意：** 给出自行车所有前变速轮和后变速轮的齿数，定义一组齿轮组合的gear值为前齿轮数除以后齿轮数，要求按照gear值从小到大输出所有齿轮的组合。

**思路：** 由于齿轮数可大至$10^9$，即使是用long double来存gear值也会出现精度问题。所以只能存gear的最简分数，在排序的时候用通分来比较，注意虽然单个齿轮的值没有超过int但通分的时候相乘就可能爆，所以要用long long来存储。还有一点比较坑的就是题目里没说如果两组齿轮的gear相同怎么办，只能从样例里来推断是先输出小的。
**solution:** As the number of sprockets can be as large as $10^9$, even long double is not precise enough to store the number of gear. Therefore, the only way to do it is to store the simplified fraction of the gear and the numerator and denominator should be stored in long long variable in case the product exceed the int-max. Another thing to be noticed is that the sequence of two sets of sprockets with the same gear is not mentioned in the question, but as the sample suggested the sets with smaller front and back sprockets should be output first.
