---
title: "AtCoder Beginner Contest 274 G - Security Camera 3"
date: 2022-11-20T22:31:28-05:00
summary: ""
keywords: []
tags: ["AtCoder", "图论", "图的匹配", "二分图"]
categories: ["题解"]
---
<!--more-->
不难发现对于一行或一列中连续的方块，我们只需要最多一个摄像头，不妨让摄像头放置在一行的最左边或者一列的最上面。对于每一个方块，它要被以下至少一个位置的摄像头监控到：
1. 这个方块上面最后一个非障碍的方块
2. 这个方块左边最后一个非障碍的方块

如果我们把可能的摄像头的位置看成点（每一个方块被看成两个点，向右看的摄像头和向下看的摄像头），每一个方块看成一条边（连接上面提到的两个位置的摄像头），那么这个问题就变成了二分图的最小点覆盖问题，也就等价于最大匹配问题。

代码：
```cpp
#include <bits/stdc++.h>
struct aug_path {
    std::vector<std::vector<int>> g;
    std::vector<int> L, R, vis;
    aug_path(int n, int m) : g(n), L(n, -1), R(m, -1), vis(n) {}
    void add_edge(int a, int b) { g[a].push_back(b); }
    bool match(int u) {
        if (vis[u]) return false;
        vis[u] = true;
        for (auto v : g[u]) {
            if (R[v] == -1) {
                L[u] = v;
                R[v] = u;
                return true;
            }
        }
        for (auto vec : g[u]) {
            if (match(R[vec])) {
                L[u] = vec;
                R[vec] = u;
                return true;
            }
        }
        return false;
    }
    template<bool to_shuffle = false>
    int solve() {
        std::vector<int> order;
        if constexpr (to_shuffle) {
            std::mt19937 rng(1);
            for (auto& v : g)
                shuffle(v.begin(), v.end(), rng);
            order.resize(L.size());
            iota(order.begin(), order.end(), 0);
            shuffle(order.begin(), order.end(), rng);
        }
        bool ok = true;
        while (ok) {
            ok = false;
            fill(vis.begin(), vis.end(), 0);
            if constexpr (to_shuffle) {
                for (auto i : order) {
                    if (L[i] == -1) ok |= match(i);
                }
            } else {
                for (int i = 0; i < (int)L.size(); ++i) {
                    if (L[i] == -1) ok |= match(i);
                }
            }
        }
        int ret = 0;
        for (size_t i = 0; i < L.size(); ++i)
            ret += (L[i] != -1);
        return ret;
    }
};
using namespace std;
using ll = long long;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<string> a(n);
    for (auto& s : a) {
        cin >> s;
    }
    vector top(n, vector(m, 0));
    auto left(top);
    aug_path g(n * m, n * m);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (a[i][j] == '#') continue;
            if (i == 0 || a[i - 1][j] == '#') {
                top[i][j] = i;
            } else {
                top[i][j] = top[i - 1][j];
            }
            if (j == 0 || a[i][j - 1] == '#') {
                left[i][j] = j;
            } else {
                left[i][j] = left[i][j - 1];
            }
            g.add_edge(top[i][j] * m + j, i * m + left[i][j]);
        }
    }
    cout << g.solve() << '\n';
    return 0;
}
```
