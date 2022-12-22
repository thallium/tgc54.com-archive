---
title: "点覆盖，独立集，以及团的关系"
date: 2022-12-21T22:57:03-05:00
summary: ""
keywords: ["点覆盖","独立集", "团"]
tags: ["图论"]
categories: ["算法笔记"]
---
<!--more-->
点覆盖的补集是独立集，因为在点覆盖中，任意一条边都被至少选了一个顶点，所以对于其点集的补集，任意一条边都被至多选了一个顶点，所以不存在边连接两个点集中的点。所以最小点覆盖是最大独立集点补集。

独立集是补图中的一个团，这个显而易见。所以最大独立集是补图中的最大团。

下面介绍一种在 $O(2 ^ \frac{n}{2})$ 时间求最大团的做法。考虑如下暴力做法：设 $\operatorname{solve}(s)$ 返回点集 $s$ 能构成点最大团，我们找到 $s$ 中标号最小的点 $v$，有两种情况：
1. $v$ 不在最大团里，此时我们把 $v$ 从 $s$ 中除去，调用 $\operatorname{solve}(s\backslash\\{v\\})$
2. $v$ 在最大团里，接下来我们只需考虑和 $v$ 相邻的点，调用 $\operatorname{solve}(s\cap g_v)$，其中 $g_v$ 是与 $v$ 相邻的点的集合。

$\operatorname{solve}(s)$ 即返回以上两种情况的最大值。

以上暴力做法显然是 $O(2 ^ n)$ 的，但如果我们加入记忆化，以上做法就会神奇的变成 $O(2 ^ \frac{n}{2})$。为什么呢？考虑递归树以及所有不包含前 $\frac{n}{2}$ 个顶点的集合，因为每一次递归调用的集合大小至少减一，所以递归树会在至多 $\frac{n}{2}$ 层计算这些集合，第一次计算这些集合总共用的时间为 $O(2^\frac{n}{2})$，之后会直接返回，而递归树前 $\frac{n}{2}$ 层有 $O(2^\frac{n}{2})$ 个节点，所以两部分加起来时间依然是 $O(2^\frac{n}{2})$。

代码：
```cpp
static long long max_clique(const std::vector<long long>& g, const std::vector<int>& cost) {
    int n = (int)size(g);

    std::map<long long, long long> memo{{0, 0}};
    auto solve = [&](auto& slf, long long mask) {
        if (memo.count(mask)) {
            return memo[mask];
        }
        int first = __builtin_ctzll(mask);
        return memo[mask] = std::max(slf(slf, mask ^ (1LL << first)), 
                g[first] >> first & 1 ? slf(slf, (mask & g[first]) ^ 1LL << first) + cost[first] : 0);
    };
    return solve(solve, (1LL << n) - 1);
}
```

注意：在这个实现里我们强制每个团中的每个顶点都包含自环，这样我们就可以正确求解含自环的图的最小点覆盖/最大独立集问题。

例题：
- [CF1105E. Helping Hiasat](https://codeforces.com/contest/1105/problem/E) （最大独立集）
- [CF1767E. Algebra Flash](https://codeforces.com/contest/1767/problem/E) （最小权点覆盖）
