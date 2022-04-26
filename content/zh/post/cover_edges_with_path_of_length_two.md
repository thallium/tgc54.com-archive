---
title: "用长为2的路径覆盖所有边"
date: 2021-05-05T23:20:52-04:00
categories: [算法笔记]
tags:
- DFS
- 图论
---
貌似还挺经典的一个问题
<!--more-->
显然我们要单独考虑每个连通块，结论是答案为$\lfloor \frac{m}{2} \rfloor$，其中m为边数。寻找答案的算法如下：

跑一遍dfs得到dfs生成树，然后从下往上处理边：将与当前节点相连的边两两配对，如果边数是奇数就留下与父亲节点相连的那条边给父亲节点。这样就可以保证所有边都被覆盖了。

代码：
```cpp
#include <bits/stdc++.h>

using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin>>n>>m;
    vector<vector<int>> g(n);
    for (int i=0; i<m; i++) {
        int u, v;
        cin>>u>>v;
        u--, v--;
        g[u].push_back(v);
        g[v].push_back(u);
    }
    vector<int> vis(n);
    vector<tuple<int, int, int>> res;
    auto dfs=[&](auto& dfs, int u, int p) -> bool {
        vis[u]=1;
        vector<int> w;
        if (p!=-1) w.push_back(p);
        for (auto v : g[u]) {
            if (v==p) continue;
            if (!vis[v]) {
                if (dfs(dfs, v, u)) w.push_back(v);
            } else if (vis[v]==1) w.push_back(v);
        }

        while (w.size() >= 2) {
            res.emplace_back(*(w.rbegin()+1), u, w.back());
            w.pop_back();
            w.pop_back();
        }
        vis[u]=2;
        return !w.empty();
    };
    for (int i=0; i<n; i++) {
        if (!vis[i]) dfs(dfs, i, -1);
    }
    cout<<res.size()<<'\n';
    for (auto& [x, y, z] : res) cout<<x+1<<' '<<y+1<<' '<<z+1<<'\n';
    return 0;
}
```

练习题：

[CF1159E - Off by One](https://codeforces.com/contest/1519/problem/E)

[gym102001K - Boomerangs](https://codeforces.com/gym/102001/problem/K)

[CF858E - Wizard's Tour](https://codeforces.com/contest/858/problem/F)
