---
title: "DFS序/欧拉序的应用（持续更新）"
date: 2021-05-23T11:20:34-04:00
categories: [算法笔记]
tags: [DFS]
---

<!--more-->
## 子树相关的应用

由于子树的dfs序是连续的，所以很容易得到子树的信息。

### 树上启发式合并

用于删掉轻子树的信息

```cpp
vector<int> bch(n, -1);
int cur_big=-1;
auto get_big = [&](auto &dfs, int u, int p) -> int {
    int sz = 1, mx = 0;
    for (auto v : g[u]) {
        if (v == p) continue;
        int csz = dfs(dfs, v, u);
        if (csz > mx) mx = csz, bch[u] = v;
        sz += csz;
    }
    return sz;
};
auto add=[&](auto& slf, int u, int p, int x) -> void {
    // update info of u here
    for (auto v : g[u]) {
        if (v==p || v==cur_big) continue;
        slf(slf, v, u, x);
    }
};
auto dfs = [&](auto &dfs, int u, int pa, bool keep) -> void {
    int big = bch[u];
    for (auto v : g[u])
        if (v != pa && v != big)
            dfs(dfs, v, u, 0);
    if (big != -1) {
        dfs(dfs, big, u, 1);
        cur_big=big;
    }
    add(add, u, pa, 1);
    // now you get all the info of subtree of u, answer queries about u here.
    cur_big=-1;
    if (!keep) add(add, u, pa, -1);
};

```

### 利用二分查询子树信息

如果查询的信息是类似于子树中有多少个节点满足一定条件，比如：有多少个节点的颜色为x，此时我们可以为每个颜色开一个数组存，并且在dfs的时候将每个节点放入对应数组。由于子树的dfs序是连续的，在数组中的节点也是连续的，所以我们可以通过子树的根节点的进出时间戳，利用二分得到子树区间的长度。


练习题：

[ABC202 E](https://atcoder.jp/contests/abc202/tasks/abc202_e)
{{% collapse 代码 %}}
```cpp
//#pragma GCC target("avx,avx2,fma")
//#pragma GCC optimize("unroll-loops,Ofast")
#include <algorithm>
#include <bits/stdc++.h>

/*{{{*/
using namespace std;
#ifdef LOCAL
#include<pprint.hpp> // https://github.com/p-ranav/pprint
pprint::PrettyPrinter P(cerr);
#define de(...) P.compact(true);P.print(__VA_ARGS__)
#define de_nc(...) P.compact(false);P.print(__VA_ARGS__)
#else
#define de(...)
#define de_nc(...)
#endif
#define all(x) (x).begin(),(x).end()
using ll = long long;
using pii = pair<int, int>;

inline namespace Traits {
    // is iterable
    template<typename T, typename = void> struct is_iterable : false_type {};
    template<typename T>
    struct is_iterable<T, void_t<decltype(begin(declval<T>())), decltype(end(declval<T>()))>> : true_type {};
    template<typename T> constexpr bool is_iterable_v = is_iterable<T>::value;
    // is readable
    template<typename T, typename = void> struct is_readable : false_type {};
    template<typename T>
    struct is_readable<T, enable_if_t<is_same_v<decltype(cin >> declval<T&>()), istream&>>> : true_type {};
    template<typename T> constexpr bool is_readable_v = is_readable<T>::value;
    // is printable
    template<typename T, typename = void> struct is_printable : false_type {};
    template<typename T>
    struct is_printable<T, enable_if_t<is_same_v<decltype(cout << declval<T>()), ostream&>>> : true_type {};
    template<typename T> constexpr bool is_printable_v = is_printable<T>::value;
}
inline namespace Input {
    template<typename T> constexpr bool needs_input_v = !is_readable_v<T> && is_iterable_v<T>;
    template<typename T, typename U> void re(pair<T, U>& p);
    template<typename T> enable_if_t<is_readable_v<T>> re(T& x) { cin>>x; }
    template<typename T> enable_if_t<needs_input_v<T>> re(T& v) { for (auto& x : v) re(x); }
    template<typename... T> void re(T&... args) {(re(args), ...);}
    template<typename T, typename U> void re(pair<T, U>& p) { re(p.first, p.second); };
}
inline namespace Output {
    template<typename T> constexpr bool needs_output_v = !is_printable_v<T> && is_iterable_v<T>;
    template<int offset=0, typename... T> void wr(T... args);
    template<int offset=0,typename T> enable_if_t<is_printable_v<T> && is_integral_v<T>> _W(const T& x) { cout<<x+offset; }
    template<int offset=0,typename T> enable_if_t<is_printable_v<T> && !is_integral_v<T>> _W(const T& x) { cout<<x; }
    template<int offset=0,typename T, typename U> void _W(const pair<T, U>& p) { wr<offset>(p.first, p.second); }
    template<int offset=0,typename It> void _W(It f, const It& l) { for (;f!=l; ++f) { _W<offset>(*f); if (f!=l) cout<<' '; }}
    template<int offset=0,typename T> enable_if_t<needs_output_v<T>> _W(const T& x) { _W<offset>(begin(x), end(x)); }
    template<int offset, typename... T> void wr(T... args) { 
        int i=0; ((_W<offset>(args), ++i, cout<<(i==sizeof...(args) ? '\n' : ' ')), ...);
#ifdef LOCAL
        cout.flush();
#endif
    }
}
template<typename T> bool ckmin(T& a, const T& b) { return b < a ? a = b, 1 : 0; } // set a = min(a,b)
template<typename T> bool ckmax(T& a, const T& b) { return a < b ? a = b, 1 : 0; }/*}}}*/

void solve() {
    int n;
    re(n);
    vector<vector<int>> g(n);
    for (int i=1; i<n; i++) {
        int p;
        re(p);
        g[p-1].push_back(i);
    }
    int timer=0;
    vector<int> in(n), out(n), dep(n);
    vector<vector<int>> pos(n);
    auto dfs=[&](auto& dfs, int u) -> void {
        in[u]=timer++;
        pos[dep[u]].push_back(in[u]);
        for (auto v : g[u]) {
            dep[v]=dep[u]+1;
            dfs(dfs, v);
        }
        out[u]=timer;
    };
    dfs(dfs, 0);
    int q;
    re(q);
    while (q--) {
        int u, d;
        re(u, d);
        u--;
        auto& v=pos[d];
        wr(lower_bound(all(v), out[u])-lower_bound(all(v), in[u]));
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int tt=1;
    while (tt--) {
        solve();
    }
    return 0;
}
```  
{{% /collapse %}}

## 路径相关应用

如果信息是可逆的，比如说求和，我们可以结合欧拉序，第一次访问节点的时候在序列中放入正值，访问结束之后放入负值，这样不在dfs栈中的节点就会被抵消掉。总的来说，假设要求的路径是从u到v（v是u的祖先，如果不是就拆成`u->lca(u, v)`和`v->lca(u, v)`两条路径），那么路径和就是序列中`in[v]`到`in[u]`的和。
