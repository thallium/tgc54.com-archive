---
title: "NAIPC2014 F - Gold Bandits 题解"
date: 2021-06-23T20:28:27-04:00
categories: [题解]
tags: [BFS, 最短路, 图论]
---
很考验思维的一道题
<!--more-->

此题为North American Invitational Programming Contest (NAIPC) 2014 F题，[题目链接](https://open.kattis.com/problems/goldbandits)。

## 题意

给出一张图，每个顶点有$a_i$的金子，你要从顶点1沿最短路到顶点2，再沿任意路径返回。对于路径上的每个顶点，你可以选择抢劫他们的金子，但如果你抢了金子，返回的时候就不能经过这个顶点，问最多能抢多少金子。

## 题解

由于n很小，可以考虑暴力枚举每一条最短路。我们不妨换个角度思考：去的时候先把路径上的金子都抢了，回来的时候再把经过的顶点的金子还回去。这样回去的路径就可以看作是最短路：如果经过在来的路径上的点花费就是$a_i$没，否则花费就是0.

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<int> a(n);
    for (int i = 2; i < n; i++)
        cin >> a[i];
    vector<vector<int>> g(n);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        u--, v--;
        g[u].push_back(v);
        g[v].push_back(u);
    }
    queue<int> q;
    q.push(0);
    vector<int> dep(n, -1);
    dep[0] = 0;
    while (!q.empty()) {
        auto u = q.front();
        q.pop();
        for (auto v : g[u]) {
            if (dep[v] == -1) {
                dep[v] = dep[u] + 1;
                q.push(v);
            }
        }
    }
    int ans = 0;
    vector<bool> vis(n);
    auto dijkstra = [&]() {
        vector<int> dis(n, -1);
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> q;
        dis[0] = 0;
        q.emplace(0, 0);
        while (!q.empty()) {
            auto [d, u] = q.top();
            q.pop();
            if (d != dis[u]) continue;
            for (auto v : g[u]) {
                int nd = d + (vis[v] ? a[v] : 0);
                if (dis[v] == -1 || nd < dis[v]) {
                    dis[v] = nd;
                    q.emplace(nd, v);
                }
            }
        }
        int sum = 0;
        for (int i = 0; i < n; i++) {
            if (vis[i]) sum += a[i];
        }
        ans = max(ans, sum - dis[1]);
    };
    auto dfs = [&](auto &me, int u) -> void {
        vis[u] = true;
        for (auto v : g[u]) {
            if (v == 1) dijkstra();
            else if (dep[v] == dep[u] + 1 && dep[v] < dep[1])
                me(me, v);
        }
        vis[u] = false;
    };
    dfs(dfs, 0);
    cout << ans << '\n';
    return 0;
}
```
