---
title: "AtCoder Regular Contest (ARC) 076F - Exhausted? 题解"
date: 2021-07-28T13:23:29-03:00
categories: [题解]
tags: [数据结构,线段树]
---

<!--more-->

## 前置知识：霍尔定理（Hall's Theorem)

也叫霍尔结婚定理(Hall's marriage theorem)。在二分图中，令两部分点集分别为$X, Y$, 则存在$X-$完美匹配（$X$中的点集全部被匹配）的充分必要条件是:对于$X$的任意子集$W$,$|W|\le|\Gamma(W)|$，其中$\Gamma(W)$为与$W$直接相连的点的集合。

## 题解

本题是让我们求最大匹配数，但直接跑匹配算法肯定不合适，此时我们考虑霍尔定理：假设所有人的集合为$X$,我们至少还需要$\max_{W\subseteq X}|W|-|\Gamma(W)|$。但是$X$的子集的个数是指数级的所以不能直接考虑子集。

但是我们发现$\Gamma(X)$总是所有椅子的一个前缀加一个后缀，也就是$\\{i|i\le l\lor i\ge r, l<r\\}$。于是我们可以考虑枚举$l, r$，那么椅子的集合所对应的人的集合$W$为$\\{i|l_i\le l\land r_i\ge r\\}$,此时$|W|-|\Gamma(W)|=|W| -(l+m-r+1)$。但很显然$(l, r)$的个数是$O(N^2)$的，还是太慢，不过这已经是一个很大的进步了。

我们再想进一步优化，从小到大枚举$l$，通过某些数据结构直接求得所有$r$中的最大值：我们可以用线段树维护对于每一个$r$,$|W|-(m-r+1)$的最大值。对于每一个人的限制条件$L_i, R_i$，当我们枚举到$l\ge L_i$时，如果选择的$r\le R_i$的话，那么对应的人的集合就会包含$i$，反映到维护的值上去的话就是把区间$[l+1, R_i]$里的值+1。然后用$[l+1, m+1]$中的最大值减当前的$l$来更新答案。

注意几点：
1. 按l从小到大的顺序可以保证前面的$L_i$都是符合条件的，只要考虑$r$的取值即可。
2. 维护的值是把$l$除去的，因为我们只考虑 $r$的取值。
3. 每个位置的$m-r+1$都是固定的，所以建树的时候就可以加进去。
4. 特殊情况当$\Gamma(X)$为整个椅子的集合时，$|X|-\Gamma(X)=n-m$

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

template <typename T> struct SegTree {
    int n, M;
    vector<T> t;
    SegTree(int n_, int _m) : n(n_), M(_m), t(4 * n) {
        build(1, 0, n - 1);
    }
    void pull(int node) { t[node] = t[node * 2] + t[node * 2 + 1]; }
    void build(int node, int l, int r) {
        if (l == r) { return t[node].apply(l, r, -M + r - 1); }
        int mid = (l + r) / 2;
        build(node * 2, l, mid);
        build(node * 2 + 1, mid + 1, r);
        pull(node);
    }
    void push(int p, int l, int r) {
        if (t[p].lazy) {
            int m = (l + r) / 2;
            t[p * 2].apply(l, m, t[p].lazy);
            t[p * 2 + 1].apply(m + 1, r, t[p].lazy);
            t[p].lazy = 0;
        }
    }
    void add(int node, int ql, int qr, int l, int r, int x) {
        if (r < ql || l > qr) return;
        if (ql <= l && qr >= r) return t[node].apply(l, r, x);
        push(node, l, r);
        int mid = (l + r) / 2;
        add(node * 2, ql, qr, l, mid, x);
        add(node * 2 + 1, ql, qr, mid + 1, r, x);
        pull(node);
    }
    T get(int node, int ql, int qr, int l, int r) {
        if (ql <= l && qr >= r) return t[node];
        push(node, l, r);
        int mid = (l + r) / 2;
        if (qr <= mid) return get(node << 1, ql, qr, l, mid);
        if (ql > mid) return get(node << 1 | 1, ql, qr, mid + 1, r);
        return get(node << 1, ql, qr, l, mid) +
               get(node << 1 | 1, ql, qr, mid + 1, r);
    }
    // wrapper
    void add(int l, int r, int x) {
        assert(l >= 0 && l <= r && r < n);
        add(1, l, r, 0, n - 1, x);
    }
    T get(int l, int r) {
        assert(l >= 0 && l <= r && r < n);
        return get(1, l, r, 0, n - 1);
    }
};
struct node {
    int v = 0; // don't forget to set default value (used for leaves),
               // not necessarily zero element
    int lazy = 0;
    void apply(int l, int r, int x) {
        lazy += x;
        v += x;
    }
    node operator+(const node &b) const {
        node res;
        res.v = max(v, b.v);
        return res;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    const int M = 200000;
    vector<vector<int>> rs(M + 1);
    for (int i = 0; i < n; i++) {
        int l, r;
        cin >> l >> r;
        rs[l].push_back(r);
    }
    SegTree<node> tr(m + 2, m);
    int ans = n - m;
    for (int l = 0; l <= M && l <= m - 1; l++) {
        for (auto r : rs[l]) {
            tr.add(l + 1, r, 1);
        }
        ans = max(ans, tr.get(l + 1, m + 1).v - l);
    }
    cout << ans << '\n';
}
```
