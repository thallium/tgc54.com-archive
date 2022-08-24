---
title: "Solution to NAIPC2014 F - Gold Bandits"
date: 2021-06-23T20:28:27-04:00
categories: [Solutions]
tags: [BFS, Shortest Path, Graph Theory]
---

<!--more-->

This problem is North American Invitational Programming Contest (NAIPC) 2014 F，[link to the problem](https://open.kattis.com/problems/goldbandits)。

## Solution

As n is small, we can consider brute force each shortest path. Then let's rephrase the problem: we first take the gold from all the village on the path to the castle, then we return it if we go through a village that we steal before when returning to home. Then finding the returning path becomes a shortest path problem: the cost of the vertex $i$ is $a_i$ if we steal it before, is 0 otherwise.
## Code

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
