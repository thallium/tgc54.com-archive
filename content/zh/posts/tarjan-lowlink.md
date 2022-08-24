---
title: "关于Tarjan算法中的low link的另类定义与更新"
date: 2021-07-06T00:04:10-04:00
categories: [算法笔记]
tags: [强连通分量,割点,桥]
---

<!--more-->

Tarjan的论文中指出
> LOWLINK(v) is the smallest vertex which is in the same component as v and is reachable by traversing zero or more tree arcs followed by at most one [back edge] or [cross edge].

也就是说u的lowlink是在dfs树中u的子树中的节点经过**最多一条**返祖边（back edge,也叫反向边）能到达最低的dfs序。所以在dfs的时候对于已访问和未访问的节点要用不同的更新：对于未访问的节点v我们用`low[u]=min(low[u], low[v])`，对于访问过的节v点用`low[u]=min(low[u], order[v])`。但这样也许有一点麻烦，增加了记忆难度，一不小心也可能写错。

如果我们稍微修改一下定义，忽略返祖边的数量限制，得到的算法依然是对的！因为我们只关心lowlink是否是u的祖先，至于哪个祖先无所谓。所以这种定义在保证正确性的同时简化了代码，可以考虑使用。[代码见此](https://github.com/thallium/acm-algorithm-template/blob/master/code/Graph/tarjan_SCC.cpp)
