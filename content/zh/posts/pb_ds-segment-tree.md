---
title: "用PB_DS实现简单线段树"
date: 2022-01-08T21:48:55-05:00
categories: []
tags: []
---

用PB_DS实现一个只能单点修改的线段树，但又能动态插入和删除，现场赛的时候在对时间要求不大的情况下可以节约敲代码时间。
<!--more-->

## 原理

原理就是PB_DS里的tree的最后一个模板参数定义了节点如何更新，我们可以通过自定义类让节点维护额外的信息（子树大小之类的）。需要定义额外信息类为`metadata_type`，然后重载括号运算符来定义节点如何合并。通过树分裂实现区间查询，但有个问题就是分裂之后的树的大小是通过`std::distance()`来计算的，对于tree的迭代器来说时间复杂度是$O(n)$的，所以我们还要重载 $std::distance$

## 例子：RMQ

```cpp
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>

using namespace std;

struct Node {
    int size, min;
};
template<typename node_const_iterator, typename node_iterator, typename cmp_fn, typename _Alloc>
struct tree_max {
    typedef Node metadata_type;
 
    inline void operator() (node_iterator it, node_const_iterator null) const
    {
        auto& n = (Node&)it.get_metadata();
        n.size=1;
        n.min=(*it)->second;
        for (auto& c : {it.get_l_child(), it.get_r_child()}) {
            if (c != null) {
                n.size+=c.get_metadata().size;
                n.min=min(n.min, c.get_metadata().min);
            }
        }
    }
};

using Tree = __gnu_pbds::tree<int, int, std::less<int>, __gnu_pbds::splay_tree_tag, tree_max>;
using ti = Tree::iterator;
Tree *other;
namespace std {
    template<> iterator_traits<ti>::difference_type distance<ti>(ti a, ti b) {
        return other->node_begin().get_metadata().size; 
    }
}
void split(Tree& a, Tree& b, int x) {
    other = &b;
    a.split(x, b);
}
int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    Tree tr;
    for (int i=0; i<n; i++) {
        int x;
        cin >> x;
        tr.insert({i, x});
    }
    while (q--) {
        int l, r;
        cin >> l >> r;
        Tree B, C;
        split(tr, C, r-1);
        split(tr, B, l-1);
        cout << B.node_begin().get_metadata().min<<'\n';
        tr.join(B);
        tr.join(C);
    }
}
```

## 非分裂做法

对于可逆的信息（如区间和）我们可以通过在树上行走获得前缀信息，然后通过前个前缀信息得到区间信息。目前先贴个[别人的链接](https://www.cnblogs.com/Yuhuger/p/14071366.html)，还没研究如何写的短点。
