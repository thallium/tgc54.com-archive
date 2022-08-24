---
title: "ICPC WF Moscow Invitational Contest L - Labyrinth 题解"
date: 2021-10-01T19:32:08-06:00
categories: [题解]
tags: [图论,最大生成树,贪心]
---

<!--more-->

[题目链接](https://codeforces.com/contest/1578/problem/L)

## 题解

首先，以下两点不难想到：
- 我们只会在最大生成树的边上走，这样我们就把图变成了树。
- 对于所有边，最优策略永远是先吃树上一边的所有点然后再吃另一边。


由于宽度小的边会最先不满足条件，因此要优先考虑宽度小的边，但边两侧的连通块的情况还不知道，所以我们要先继续处理两侧的信息再确定吃的方向，而每侧的连通块中最窄的边又会把连通块一分为二……这样一直递归下去直到每个连通块只剩一个点。合并的顺序就是从宽边到窄边，这正好也是求最大生成树的顺序，于是可以在求最大生成树的同时维护答案。对于每个连通块，我们维护进入这个连通块时人的最大宽度$mx$。假设待合并的两个连通块为$u,v$，每个块的$c$值的和为$sum_u, sum_v$，$u,v$之间的边的宽度为$w$，从$u$到$v$要满足$mx_u+sum_u\le mx_v$和$mx_u+sum_u\le w$，变形一下就是$mx_u=\min(mx_v, w)-sum_u$，也就是说如果先吃$u$再吃 $v$的话，进入合并之后的连通块时最大的宽度为 $\min(mx_v, w)-sum_u$，先吃$v$再吃$u$的情况类似，取两种情况中宽度更大的情况。

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define all(x) (x).begin(), (x).end()
using ll = long long;

constexpr ll INF = 1e18;
struct UF {
    vector<int> fa, sz;
    vector<ll> mx, sum;
    UF(int n) : fa(n), sz(n, 1), mx(n, INF), sum(n) {
        iota(all(fa), 0);
    }

    int find(int x) { return fa[x] == x ? x : fa[x] = find(fa[x]); }

    void join(int u, int v, ll w) {
        u = find(u), v = find(v);
        if (u == v) return;
        if (sz[u] > sz[v]) swap(u, v);
        ll fromV = -INF, fromU = -INF;
        if (sum[v] <= mx[u]) fromV = min(mx[u], w) - sum[v];
        if (sum[u] <= mx[v]) fromU = min(mx[v], w) - sum[u];
        mx[v] = max(fromU, fromV);
        sum[v] += sum[u];
        fa[u] = v;
        sz[v] += sz[u];
        return;
    }
    auto check() { return mx[find(0)]; }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<array<int, 3>> edges(m);
    UF uf(n);
    for (int i = 0; i < n; i++)
        cin >> uf.sum[i];
    for (auto &[u, v, c] : edges)
        cin >> u >> v >> c, u--, v--;
    sort(begin(edges), end(edges), [&](auto& i, auto& j) { return i[2] > j[2]; });
    for (auto &[u, v, c] : edges)
        uf.join(u, v, c);
    if (auto mx = uf.check(); mx < 1) cout << "-1\n";
    else
        cout << mx << endl;
}
```
