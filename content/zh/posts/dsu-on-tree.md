---
title: "树上启发式合并（DSU on Tree）总结"
date: 2022-11-30T21:28:44-05:00
summary: ""
keywords: ["树上启发式合并"]
tags: ["树", "图论"]
categories: ["算法笔记"]
---
树上启发式合并可以用 $O(n\cdot \log(n))$ 的时间（假设添加和删除节点都是 $O(1)$）解决对于每个子树的统计问题（比如统计子树中有多少种颜色的节点）。
<!--more-->

## 算法概述

对于一个节点 $u$，我们按以下的步骤进行遍历：

1. 先遍历 $u$ 的轻（非重）儿子，并计算答案，但**不保留**遍历后它对统计的影响
2. 遍历它的重儿子，保留它对统计的影响
3. 再次遍历 $u$ 的轻儿子的子树结点，加入这些结点的贡献，以得到 $u$ 的答案

## 模板
```cpp
vector<int> sz(n, 1), big(n, -1); // sz: 子树大小，big：重儿子
auto cal_size = [&](auto& slf, int u, int p) -> void {
    for (auto v : g[u]) {
        if (v == p) continue;
        slf(slf, v, u);
        sz[u] += sz[v];
        if (big[u] == -1 || sz[v] > sz[big[u]]) {
            big[u] = v;
        }
    }
};
cal_size(cal_size, 0, 0);

auto add = [&](auto& slf, int u, int p) -> void {
    // 在此将 u 添加进统计结果
    for (auto v : g[u]) {
        if (v == p) continue;
        slf(slf, v, u);
    }
};

auto remove = [&](auto& slf, int u, int p) -> void {
    // 在此将 u 从统计结果中移除
    for (auto v : g[u]) {
        if (v == p) continue;
        slf(slf, v, u);
    }
};

auto dfs = [&](auto& slf, int u, int p) -> void {
    for (auto v : g[u]) {
        if (v == p || v == big[u]) continue;
        slf(slf, v, u); // 遍历轻儿子
        remove(remove, v, u); // 移除轻儿子
    }
    if (big[u] != -1) {
        slf(slf, big[u], u); // 遍历重儿子
    }

    for (auto v : g[u]) {
        if (v == p || v == big[u]) continue;
        add(add, v, u); // 再次添加轻儿子
    }
    // 在此将 u 添加进统计结果
    // 此处的统计结果即为 u 子树的答案
};
dfs(dfs, 0, 0);
```

## 时间复杂度证明

如果一个节点为其父节点的轻儿子，那么我们称其为轻节点。所有轻节点会在清除统计时遍历一遍其子树，所以每个节点被遍历的次数为其到根节点路径上的轻节点的数量加一（加一是因为 dfs 本身会遍历一遍）。由于轻节点的子树大小至多为其父节点的的一半，所以任意节点到根节点的路径上的轻节点数量最多为 $\log n$，所以每个点被遍历的次数为 $O(\log n)$，所以总体的时间复杂度为 $O(n\log n)$。

多说一嘴为什么这个算法没有任何合并操作却被叫做“启发式合并”，因为他和真正的“启发式合并”有着类似的过程：如果我们先遍历重儿子，那么合并时永远是从轻儿子合并到重儿子上，所以我们合并时就相当于遍历了一遍轻儿子的子树（类比于清除轻儿子统计），所以“启发式合并”的时间复杂度也是 $O(n \log n)$。
