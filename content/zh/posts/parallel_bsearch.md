---
title: "整体二分学习笔记"
date: 2021-06-05T12:36:59-04:00
categories: [算法笔记]
tags: [整体二分,离线技巧,二分]
---

整体二分在国外称为 parallel binary search，是一种用于解决多个二分搜索的**离线算法**，其核心思想是将一个状态用于多个询问中。
<!--more-->

## 适用的问题/核心思想

一般的二分套路为：二分一个“指标”，对于当前要检查的指标，应用所有符合指标的操作，每个操作会产生一些贡献，最后判断贡献是否符合条件。如果我们要处理很多个二分问题而且应用操作的时间开销很大，每一个二分问题单独计算就会很慢。但经常应用完操作后的状态可以用于多个二分问题的条件检查，这就是整体二分的核心思想。

## 思路

对于如何重复利用操作之后的状态，一般有两种思路：一种最常见的思路是根据当前二分的指标从小到大进行检查，这样可以在之前操作之后状态上继续应用新的操作然后再进行检查。

如果因为一些因素使得无法应用第一种思路，但操作的贡献满足可加性的话，那么我们可以考虑第二种思路：记录下当前的状态的贡献，这样下一轮二分的时候我们可以在记录下的贡献上加上新的贡献。

这样说可能有点抽象，下面我们结合一个例子来说明具体的实现是怎样的。

## 例题

### 静态数组区间第k小

[题目链接](https://www.luogu.com.cn/problem/P3834)

这个题二分的指标就是第 k 大的大小，即我们要检查：这个区间 $[l, r]$ 的第 k 大是否至少为 $x$，这可以通过判断 $[l, r]$ 内小于等于 $x$ 的元素的个数来实现。我们可以用一个权值数组 $b$ 记录所有所有小于等于 $x$ 的位置，即 $b_i = 1 \iff a_i \leq x$，那么符合指标的操作就是将权值数组中的某个位置加一。显然对于大的指标我们可以在小指标操作的基础上加入新的操作，所以我们可以应用第一种思路。

对于第一种思路，一种比较简单的写法是用两个数组 $l, r$ 记录当前每个询问的答案所处的范围，在每一轮二分中根据 $x = \frac {(l + r)}{2}$ 从小到大遍历每个询问

{{< code language="cpp" title="代码（思路一）" isCollapsed="true" >}}
// 树状数组代码省略已省略，见 https://github.com/thallium/acm-algorithm-template/blob/master/src/data_structure/fenwick.hpp
#include <bits/stdc++.h>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;

    vector<int> a(n);
    for (auto &x : a)
        cin >> x;

    vector<int> compress{a};
    sort(begin(compress), end(compress));
    compress.erase(unique(begin(compress), end(compress)), end(compress));
    const int N = (int)size(compress);

    vector<vector<int>> pos(N);
    for (int i = 0; i < n; i++) {
        int idx = int(lower_bound(begin(compress), end(compress), a[i]) - begin(compress));
        pos[idx].push_back(i);
    }

    vector<array<int, 3>> query(m);
    for (auto &[l, r, k] : query) {
        cin >> l >> r >> k;
        l--;
    }

    vector<int> l(m, 0), r(m, N - 1);
    while (true) {
        vector<vector<int>> s(N);
        int empty = 1;
        for (int i = 0; i < m; i++) {
            if (l[i] <= r[i]) {
                int mid = (l[i] + r[i]) / 2;
                s[mid].push_back(i);
                empty = 0;
            }
        }

        if (empty) {
            break;
        }

        Fenwick<int> tr(n);
        for (int i = 0; i < N; i++) {
            for (auto j : pos[i]) {
                tr.add(j, 1);
            }

            for (auto j : s[i]) {
                auto [ql, qr, k] = query[j];
                if (tr.get(ql, qr) >= k) {
                    r[j] = i - 1;
                } else {
                    l[j] = i + 1;
                }
            }
        }
    }

    for (auto i : l) {
        cout << compress[i] << '\n';
    }
    return 0;
}
{{< /code >}}


我们再次也将介绍第二种思路的写法，这样有助于理解下面动态区间第 k 小的做法。假设一个询问的答案在 $[l, r]$ 中，指标为 $x$，询问的区间中有 $n$ 个小于等于 $x$ 的数，$n$ 即为当前所有操作的总贡献，如果 $n < k$，说明答案在 $[x + 1, r]$ 中。如果我们记录下当前的贡献，下次二分的指标为 $y = \frac {x + 1 + r} 2$，我们只要知道询问的区间里大小在 $[x + 1, y]$ 中的元素的个数，再加上之前记录的贡献，这样就相当于知道了小于等于 $y$ 的元素的个数。所以说在下一轮二分的时候我们只需要影响 $[x + 1, y]$ 中的元素个数的操作，$n \ge k$ 的情况类似。所以我们每次二分之后要将操作分成左右两组给下一轮二分用。

{{< code language="cpp" title="代码（思路二）" isCollapsed="true" >}}
#include <bits/stdc++.h>
#include "data_structure/fenwick.hpp"
using namespace std;

struct modify {
    int val, pos;
};

struct query {
    int l, r, k, i;
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;

    vector<int> a(n);
    for (auto &x : a)
        cin >> x;

    // 离散化
    vector<int> compress{a};
    sort(begin(compress), end(compress));
    compress.erase(unique(begin(compress), end(compress)), end(compress));
    const int N = (int)size(compress);

    using op = variant<modify, query>;
    vector<op> ops; // 为了方便实现我们把询问和修改放到一起

    for (int i = 0; i < n; i++) {
        int val = int(lower_bound(begin(compress), end(compress), a[i]) - begin(compress));
        ops.push_back(modify{val, i});
    }

    for (int i = 0; i < m; i++) {
        int l, r, k;
        cin >> l >> r >> k;
        l--;
        ops.push_back(query{l, r, k, i});
    }

    vector<int> ans(m);

    Fenwick<int> tr(n);
    auto solve = [&](auto& slf, int l, int r, vector<op>& ops) -> void {
        if (l == r) { // 二分结束，答案确定
            for (const auto& o : ops) {
                if (holds_alternative<query>(o)) { // 如果是询问的话
                    ans[get<query>(o).i] = compress[l];
                }
            }
            return;
        }

        int x = (l + r) / 2;

        vector<op> left, right;
        for (auto o : ops) {
            if (holds_alternative<query>(o)) { // 询问
                auto& [ql, qr, k, i] = get<query>(o);
                int c = tr.get(ql, qr); // 贡献
                if (c >= k) { // 根据贡献判断询问的答案该如何改变
                    left.push_back(o);
                } else {
                    k -= c; // 在目标上减掉贡献和记录贡献是一样的
                    right.push_back(o);
                }
            } else { // 修改
                auto [val, pos] = get<modify>(o);
                if (val <= x) {
                    tr.add(pos, 1);
                    left.push_back(o);
                } else {
                    right.push_back(o);
                }
            }
        }

        for (auto o : left) {
            if (holds_alternative<modify>(o)) { // 还原树状数组到初始状态
                tr.add(get<modify>(o).pos, -1);
            }
        }

        vector<op>{}.swap(ops); // 释放空间

        slf(slf, l, x, left);
        slf(slf, x + 1, r, right);
    };

    solve(solve, 0, N - 1, ops);

    for (auto x : ans) cout << x << '\n';
    return 0;
}
{{< /code >}}

可以看出第一种思路的实现往往比较好写，其实大部分整体二分的题目都是用第一种思路解决的。

### 动态区间第k小

[题目链接](https://www.luogu.com.cn/problem/P2617)

因为询问和修改有先后顺序，所以不能用第一种思路。其实如果你理解了上一题的第二种思路的话，修改无非就是把原来的数删掉（在辅助数组中减1），再加上修改之后的数。

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
#include "data_structure/fenwick.hpp"

using namespace std;

struct modify {
    int val, pos, add;
};

struct query {
    int l, r, k, i;
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;

    using op = variant<modify, query>;
    vector<op> ops; // 为了方便实现我们把询问和修改放到一起

    vector<int> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        ops.push_back(modify{a[i], i, 1});
    }

    // 离散化
    vector<int> comp{a};

    int qcnt = 0;
    for (int i = 0; i < m; i++) {
        char ch;
        cin >> ch;
        if (ch == 'Q') {
            int l, r, k;
            cin >> l >> r >> k;
            l--;
            ops.push_back(query{l, r, k, qcnt});
            qcnt++;
        } else {
            int x, y;
            cin >> x >> y;
            x--;
            ops.push_back(modify{a[x], x, -1});
            comp.push_back(y);
            a[x] = y;
            ops.push_back(modify{a[x], x, 1});
        }
    }

    sort(begin(comp), end(comp));
    comp.erase(unique(begin(comp), end(comp)), end(comp));
    const int N = (int)size(comp);

    for (auto& o : ops) {
        if (holds_alternative<modify>(o)) {
            auto& v = get<modify>(o).val;
            v = int(lower_bound(begin(comp), end(comp), v) -  begin(comp));
        }
    }

    vector<int> ans(qcnt);

    Fenwick<int> tr(n);
    auto solve = [&](auto& slf, int l, int r, vector<op>& ops) -> void {
        if (l == r) { // 二分结束，答案确定
            for (const auto& o : ops) {
                if (holds_alternative<query>(o)) { // 如果是询问的话
                    ans[get<query>(o).i] = comp[l];
                }
            }
            return;
        }

        int x = (l + r) / 2;

        vector<op> left, right;
        for (auto o : ops) {
            if (holds_alternative<query>(o)) { // 询问
                auto& [ql, qr, k, i] = get<query>(o);
                int c = tr.get(ql, qr); // 贡献
                if (c >= k) { // 根据贡献判断询问的答案该如何改变
                    left.push_back(o);
                } else {
                    k -= c; // 在目标上减掉贡献和记录贡献是一样的
                    right.push_back(o);
                }
            } else { // 修改
                auto [val, pos, add] = get<modify>(o);
                if (val <= x) {
                    tr.add(pos, add);
                    left.push_back(o);
                } else {
                    right.push_back(o);
                }
            }
        }

        for (auto o : left) {
            if (holds_alternative<modify>(o)) { // 还原树状数组到初始状态
                auto [val, pos, add] = get<modify>(o);
                tr.add(pos, -add);
            }
        }

        vector<op>{}.swap(ops); // 释放空间

        slf(slf, l, x, left);
        slf(slf, x + 1, r, right);
    };

    solve(solve, 0, N - 1, ops);

    for (auto x : ans) cout << x << '\n';
    return 0;
}
{{< /code >}}

### [ZJOI2013]K大数查询

[题目链接](https://www.luogu.com.cn/problem/P3332)

此题同样因为有先后顺序所以也不能用第一种思路，但思路和上题类似。 $[l, r]$ 中每个集合加入一个数就相当于在辅助数组中 $[l, r]$ 的位置上加1，所以我们需要一个可以区间加的数据结构，最简单的就是树状数组啦。实现细节详见代码。

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
#include "data_structure/fenwick_range_update.hpp"
using namespace std;

struct modify {
    int val, l, r;
};

struct query {
    int l, r;
    int64_t k;
    int i;
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;

    using op = variant<modify, query>;
    vector<op> ops; // 为了方便实现我们把询问和修改放到一起

    int qcnt = 0;

    for (int i = 0; i < m; i++) {
        int op, l, r, c;
        cin >> op >> l >> r >> c;
        l--;
        if (op == 1) {
            ops.push_back(modify{c, l, r});
        } else {
            ops.push_back(query{l, r, c, qcnt++});
        }
    }

    vector<int> ans(qcnt);

    fenwick_rg tr(n);
    auto solve = [&](auto& slf, int l, int r, vector<op>& ops) -> void {
        if (l == r || ops.empty()) { // 二分结束，答案确定
            for (const auto& o : ops) {
                if (holds_alternative<query>(o)) { // 如果是询问的话
                    ans[get<query>(o).i] = l;
                }
            }
            return;
        }

        int x = (l + r) / 2;

        vector<op> left, right;
        for (auto o : ops) {
            if (holds_alternative<query>(o)) { // 询问
                auto& [ql, qr, k, i] = get<query>(o);
                int64_t c = tr.get(ql, qr); // 贡献
                if (c >= k) { // 根据贡献判断询问的答案该如何改变
                    right.push_back(o);
                } else {
                    k -= c; // 在目标上减掉贡献和记录贡献是一样的
                    left.push_back(o);
                }
            } else { // 修改
                auto [val, ql, qr] = get<modify>(o);
                if (val > x) {
                    tr.add(ql, qr, 1);
                    right.push_back(o);
                } else {
                    left.push_back(o);
                }
            }
        }

        for (auto o : right) {
            if (holds_alternative<modify>(o)) { // 还原树状数组到初始状态
                auto [val, ql, qr] = get<modify>(o);
                tr.add(ql, qr, -1);
            }
        }

        vector<op>{}.swap(ops); // 释放空间

        slf(slf, l, x, left);
        slf(slf, x + 1, r, right);
    };

    solve(solve, 0, n, ops);

    for (auto x : ans) cout << x << '\n';
    return 0;
}
{{< /code >}}

### Meteors

[题目链接](https://loj.ac/p/2169)

此题的修改操作为区间加，而且修改和询问没有前后顺序，所以可以用第一种思路。

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
#include "data_structure/fenwick.hpp"
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;

    vector<vector<int>> pos(n);
    for (int i = 0; i < m; i++) {
        int x;
        cin >> x;
        pos[x - 1].push_back(i);
    }

    vector<int> target(n);
    for (auto& x : target) {
        cin >> x;
    }

    int k;
    cin >> k;
    vector<array<int, 3>> meteors(k);
    for (auto& [l, r, x] : meteors) {
        cin >> l >> r >> x;
        l--, r--;
    }

    vector<int> l(n, 0), r(n, k - 1);


    while (true) {
        vector<vector<int>> to_check(k);
        bool done = 1;
        for (int i = 0; i < n; i++) {
            if (l[i] <= r[i]) {
                int mid = (l[i] + r[i]) / 2;
                to_check[mid].push_back(i);
                done = false;
            }
        }

        if (done) {
            break;
        }

        Fenwick<int64_t> tr(m + 1);
        auto range_add = [&](int l, int r, int x) {
            tr.add(l, x);
            tr.add(r, -x);
        };
        auto apply_meteor = [&](int i) {
            auto [l, r, x] = meteors[i];
            if (l <= r) {
                range_add(l, r + 1, x);
            } else {
                range_add(l, m, x);
                range_add(0, r + 1, x);
            }
        };
        for (int i = 0; i < k; i++) {
            apply_meteor(i);
            for (auto j : to_check[i]) {
                uint64_t sum = 0;
                for (auto p : pos[j]) {
                    sum += tr.get(p + 1);
                }
                if (sum >= target[j]) {
                    r[j] = i - 1;
                } else {
                    l[j] = i + 1;
                }
            }
        }
    }

    for (auto x : l) {
        if (x == k) cout << "NIE\n";
        else cout << x + 1 << '\n';
    }
    return 0;
}
{{< /code >}}


### AGC002D Stamp Rally

[题目链接](https://atcoder.jp/contests/agc002/tasks/agc002_d)

这题思路其实不难，修改就是在并查集里连边，贡献就是连通块的大小，用第一种思路解决。

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
#include "data_structure/union_find.hpp"
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;

    vector<array<int, 2>> edges(m);
    for (auto& [u, v] : edges) {
        cin >> u >> v;
        u--, v--;
    }

    int q;
    cin >> q;
    vector<array<int, 3>> query(q);
    for (auto& [l, r, x] : query) {
        cin >> l >> r >> x;
        l--, r--;
    }

    vector<int> l(q, 0), r(q, m - 1);

    while (true) {
        vector<vector<int>> to_check(q);
        bool done = 1;
        for (int i = 0; i < q; i++) {
            if (l[i] <= r[i]) {
                int mid = (l[i] + r[i]) / 2;
                to_check[mid].push_back(i);
                done = false;
            }
        }

        if (done) {
            break;
        }

        UF uf(n);
        for (int i = 0; i < m; i++) {
            uf.join(edges[i][0], edges[i][1]);

            for (auto j : to_check[i]) {
                auto [u, v, z] = query[j];
                int sz = uf.size_of(u);
                if (!uf.same(u, v)) {
                    sz += uf.size_of(v);
                }
                if (sz >= z) {
                    r[j] = i - 1;
                } else {
                    l[j] = i + 1;
                }
            }
        }
    }

    for (auto x : l) {
        cout << x + 1 << '\n';
    }
    return 0;
}
{{< /code >}}
