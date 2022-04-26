---
title: "树和DAG的最小路径覆盖问题"
date: 2021-05-08T11:25:50-04:00
categories: [算法笔记]
tags: 
- 图论
---

路径覆盖是一个路径的集合使得每个顶点都只被一条路径覆盖。最小路径覆盖问题要求集合中路径的条数是最小的。

<!--more-->

## 树的最小路径覆盖

### 做法1：DP

$dp_{u, 0}$代表当u不为路径的端点的时候，u 的子树里最少的路径的数目，$dp_{u, 1}$代表当u为路径的端点的时候，u 的子树里最少的路径的数目。

设$v$为u的儿子，状态转移时u不为端点的情况可以是之前u不为端点的情况加上v不为端点的情况，即:
$$dp_{u, 0}\coloneqq dp_{u, 0}+dp_{v, 0}$$
也可以是以u为端点的路与以v为端点 的路连成一条路，即:
$$dp_{u, 0}\coloneqq dp_{u, 1}+dp_{v, 1}-1$$
u为端点的情况类似，可以是之前u为端点的情况加上v不为端点的情况，即：
$$dp_{u, 1}\coloneqq dp_{u, 1}+dp_{v, 0}$$
也可以是前面所有儿子的不以儿子为端点的路径加上以v为端点的路径,即：
$$dp_{u, 1}\coloneqq sum+dp_{v, 1}$$
综上所述：
$$\begin{align*}  dp_{u, 0}&\coloneqq \min(dp_{u, 0}+dp_{v, 0}, dp_{u, 1}+dp_{v, 1}-1)\\\ dp_{u, 1}&\coloneqq  \min(dp_{u, 1}+dp_{v, 0}, sum+dp_{v, 1})\end{align*}$$

如果要记录方案的话只先在dp的过程中记录经过u的路径往下走的儿子，然后再跑一遍dfs构建路径。

代码：
```cpp
vector dp(n, vector<int>(2));
vector nxt(n, vector(2, pair{-1, -1}));

auto dfs=[&](auto& dfs, int u, int p) -> void {
    dp[u][0]=dp[u][1]=1;
    int sum=0;
    for (auto v : g[u]) {
        if (v==p) continue;
        dfs(dfs, v, u);
        if (dp[u][0]+dp[v][0] > dp[u][1]+dp[v][1]-1) {
            nxt[u][0]={nxt[u][1].first, v};
        }
        dp[u][0]=min(dp[u][0]+dp[v][0], dp[u][1]+dp[v][1]-1);
        if (dp[u][1]+dp[v][0] > sum+dp[v][1]) {
            nxt[u][1]={v, v};
        }
        dp[u][1]=min(dp[u][1]+dp[v][0], sum+dp[v][1]);
        sum+=dp[v][0];
    }
};

vector<vector<int>> end_point(n); //路径的端点
vector<pii> remove; // 不在路径覆盖中的路径
int tot{};
auto dfs2=[&](auto& dfs2, int u, int p, int flag, int id) -> void { // id 为当前路径的编号
    for (auto v : g[u]) {
        if (v==p) continue;
        if (v==nxt[u][flag].first || v==nxt[u][flag].second) {
            dfs2(dfs2, v, u, 1, id);
        } else {
            remove.emplace_back(u, v);
            tot++;
            int nflag=dp[v][0]<dp[v][1] ? 0 : 1;
            if (nflag) end_point[tot].push_back(v);
            dfs2(dfs2, v, u, nflag, tot);
        }
    }
    if (nxt[u][flag]==pair{-1, -1}) end_point[id].push_back(u);
};
```

### 做法2：贪心

贪心做法更加简单，只用一个dfs就能实现。如果u有两个儿子是路径的端点那么就连接那两条路，否则就将u做为端点。

代码：
```cpp
vector<pii> end_points, remove;
auto dfs=[&](auto& dfs, int u, int p) -> int { // 返回-1代表u不是端点，否则返回以u为端点的路径的另一端。
    vector<int> next;
    for (auto v : g[u]) {
        if (v==p) continue;
        int end_v=dfs(dfs, v, u);
        if (end_v>=0) {
            if (next.size() <= 1) {
                next.push_back(end_v);
            } else {
                remove.emplace_back(u, v);
                end_points.emplace_back(end_v, v);
            }
        } else {
            remove.emplace_back(u, v);
        }
    }

    if (next.empty()) next.push_back(u);
    if (next.size()==1) {
        if (p!=-1) return next[0];
        end_points.emplace_back(next[0], u);
        return -1;
    } else {
        end_points.emplace_back(next[0], next[1]);
        return -1;
    }
};
```

### 练习题

[CF1521D - Nastia Plays with a Tree](https://codeforces.com/contest/1521/problem/D)

## DAG的最小路径覆盖

我们把原图上的每个点拆成两个点（对于点`x`，可以把从它拆出去的点记为`x+n`），其中一个点与源点相连，另一个与汇点相连。对于原DAG上的边`u -> v`，在新图中连接 `u -> v'`，所有边的容量均为1。跑一遍最大流（本质上是二分图匹配），得到的最大流（或者最大匹配）便是被覆盖的边数，由于路径上的点数等于边数+1，所以点数减被覆盖的边数便是路径的数目。也可以理解为最大流经过的每一条边对应原图中有一条向边的起点，所以路径的终点是没有对应的边的，所以点数减被覆盖的边数便是终点的数目也就是路径的数目。

如何记录路径？可以在增广途中记录每个点的下一个点。如何找起点？如果`x'`到汇点的剩余容量为1，说明没有点流向`x
`，也就说明`x`是起点。

模板题：

[洛谷P2764 最小路径覆盖问题](https://www.luogu.com.cn/problem/P2764)

代码：
```cpp
#include <bits/stdc++.h>
using namespace std;
struct Flow {
    static constexpr int INF = 1e9;
    int n;
    struct Edge {
        int to, cap;
        Edge(int to, int cap) : to(to), cap(cap) {}
    };
    std::vector<Edge> e;
    std::vector<std::vector<int>> g;
    std::vector<int> cur, h, nxt; 

    Flow(int n) : n(n), g(n), nxt(n) {}
    bool bfs(int s, int t) {
        h.assign(n, -1);
        std::queue<int> que;
        h[s] = 0;
        que.push(s);
        while (!que.empty()) {
            int u = que.front();
            que.pop();
            for (int i : g[u]) {
                auto [v, c] = e[i];
                if (c > 0 && h[v] == -1) {
                    h[v] = h[u] + 1;
                    if (v == t) return true;
                    que.push(v);
                }
            }
        }
        return false;
    }
    int dfs(int u, int t, int f) {
        if (u == t) return f;
        int r = f;
        for (int &i = cur[u]; i < int(g[u].size()); ++i) {
            int j = g[u][i];
            auto [v, c] = e[j];
            if (c > 0 && h[v] == h[u] + 1) {
                int a = dfs(v, t, std::min(r, c));
                e[j].cap -= a;
                e[j ^ 1].cap += a;
                r -= a;
                if (a) nxt[u] = v; // 增广成功便记录路径
                if (r == 0) return f;
            }
        }
        return f - r;
    }
    void addEdge(int u, int v, int c) {
        g[u].push_back((int)e.size());
        e.emplace_back(v, c);
        g[v].push_back((int)e.size());
        e.emplace_back(u, 0);
    }
    void maxFlow(int s, int t) {
        int ans = 0;
        while (bfs(s, t)) {
            cur.assign(n, 0);
            ans += dfs(s, t, INF);
        }
        n = (n - 2) / 2;
        for (int i = n + 1; i <= 2 * n; i++) {
            if (e[g[i].back()].cap == 1) {
                int u = i - n;
                while (u > 0) {
                    cout << u << ' ';
                    u = nxt[u] - n;
                }
                cout << '\n';
            }
        }
        cout << n - ans << '\n';
    }
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    Flow g(2 * n + 2);
    while (m--) {
        int u, v;
        cin >> u >> v;
        g.addEdge(u, v + n, 1);
    }
    for (int i = 1; i <= n; i++) {
        g.addEdge(0, i, 1);
        g.addEdge(i + n, 2 * n + 1, 1);
    }
    g.maxFlow(0, 2 * n + 1);
    return 0;
}
```

## 参考资料

https://zhuanlan.zhihu.com/p/125759333
