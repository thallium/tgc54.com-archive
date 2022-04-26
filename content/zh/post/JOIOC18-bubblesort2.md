---
title: "JOI '18 Open P1 - Bubble Sort 2 题解"
date: 2021-07-24T21:41:35-03:00
categories: [题解]
tags: [数据结构,平衡树,treap]
---

<!--more-->
[题目链接](https://dmoj.ca/problem/joi18op1)

首先我们要知道对于固定的数组如何求遍历轮数： 创建一个复制数组b，其中`b[i]={a[i], i}`，然后排序b，排序后`b[i].second-i`的最大值就是答案，`b[i].second-i`本质上就是一个数向前移动的距离，不难想出每个会向前移动的数从第一轮遍历就会开始向前移动，直到到达排序后的位置，所以最大的向前移动距离就是遍历的轮数。

现在考虑修改原数组后，数组`b`以及`b[i].second-i`的值会有什么改变，不难发现其实就是删掉了`{a[x], x}`，然后再插入`{v,  x}`（x与v的含义与题目相同），b数组中在老位置与新位置中间的元素会移动一位，所以他们的`b[i].second-i`会+1或者-1（由新老位置的关系而定），所以我们需要一个可以插入删除又能区间加的数据结构，并且支持查询全局最大值，那只能是平衡树了。

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

auto seed=chrono::high_resolution_clock::now().time_since_epoch().count();
mt19937 gen(seed);
template <typename T> struct Treap {
    struct node {
        int ch[2], sz;
        unsigned k;
        pair<int, int> d;
        T mx, lazy, dif;
        node(pair<int, int> d_, int dd, int z = 1) : sz(z), k((unsigned)gen()), d(d_), mx(dd), lazy(), dif(dd) {
            ch[0] = ch[1] = 0;
        }
    };
    vector<node> nodes;
    int root=0, recyc=0;
    Treap(int size = 2e5) {
        nodes.reserve(size);
        nodes.emplace_back(pair{0, 0}, -1e9, 0);
    }
    inline int &ch(int rt, int r) { return nodes[rt].ch[r]; }
    int new_node(const pair<int, int> &d, int dd) {
        nodes.emplace_back(d, dd);
        return nodes.size()-1;
    }
    int pull(int rt) {
        node &n = nodes[rt];
        n.sz = 1 + nodes[n.ch[0]].sz + nodes[n.ch[1]].sz;
        n.mx = max({n.dif, nodes[n.ch[0]].mx, nodes[n.ch[1]].mx});
        return rt;
    }
    void add(int rt, const T &d) {
        node &n = nodes[rt];
        n.lazy += d;
        n.mx += d;
        n.dif+=d;
    }
    void pushdown(int rt) {
        node &n = nodes[rt];
        if (n.lazy) {
            add(n.ch[0], n.lazy);
            add(n.ch[1], n.lazy);
            n.lazy = T();
        }
    }
    int merge(int tl, int tr) {
        if (!tl) return tr;
        if (!tr) return tl;
        if (nodes[tl].k < nodes[tr].k) {
            pushdown(tl);
            ch(tl, 1) = merge(ch(tl, 1), tr);
            return pull(tl);
        } else {
            pushdown(tr);
            ch(tr, 0) = merge(tl, ch(tr, 0));
            return pull(tr);
        }
    }
    void split(int rt, pair<int, int> k, int &x, int &y) { // split out element less than or equal to k
        if (!rt) {
            x = y = 0;
            return;
        }
        pushdown(rt);
        if (k < nodes[rt].d) {
            y = rt;
            split(ch(rt, 0), k, x, ch(rt, 0));
        } else {
            x = rt;
            split(ch(rt, 1), k, ch(rt, 1), y);
        }
        pull(rt);
    }
    // interface
    void insert(pair<int, int> v, int d) {
        int rt = new_node(v, d);
        root = merge(root, rt);
    }
    void move_right(int old, int ne, int idx) {
        int a, b, c, d;
        split(root, {ne, idx}, c, d);
        split(c, {old, idx}, b, c);
        split(b, {old, idx-1}, a, b);
        if (c) add(c, 1);
        nodes[b]=node({ne, idx}, idx-(nodes[a].sz+nodes[c].sz));
        root = merge(merge(merge(a, c), b), d);
    }
    void move_left(int old, int ne, int idx) {
        int a, b, c, d;
        split(root, {old, idx}, c, d);
        split(c, {old, idx-1}, b, c);
        split(b, {ne, idx}, a, b);
        if (b) add(b, -1);
        nodes[c]=node({ne, idx}, idx-(nodes[a].sz));
        root=merge(merge(merge(a, c), b), d);
    }
    int query() {
        return nodes[root].mx;
    }
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin>>n>>q;
    vector<int> a(n);
    for (auto& x  : a) cin>>x;
    vector<pair<int, int>> b(n);
    for (int i=0; i<n; i++) {
        b[i]={a[i], i};
    }
    sort(b.begin(), b.end());
    Treap<int> tr;
    for (int i=0; i<n; i++) {
        tr.insert(b[i], b[i].second-i);
    }
    while (q--) {
        int x, v;
        cin>>x>>v;
        if (a[x]<v) {  // move right
            tr.move_right(a[x], v, x);
        } else { // move left
            tr.move_left(a[x], v, x);
        }
        a[x]=v;
        cout<<tr.query()<<'\n';
    }
}
```
