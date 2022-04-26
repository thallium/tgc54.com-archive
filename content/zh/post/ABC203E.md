---
title: "AtCoder Beginner Contest (ABC) 203E 题解"
date: 2021-06-05T12:12:09-04:00
categories: [题解]
tags: []
---
有点不知如何下手的题
<!--more-->

本文基本是照着[这个](https://atcoder.jp/contests/abc203/editorial/1998)翻译的。Pawn是国际象棋里的兵。

由于只能往下走，我们从上到下一行一行的处理，维护本层能够到达 的位置。根据规则，有两种情况会使到达性发生改变：
1. 如果能到达上一行的i位置而本行的i位置有一个兵，那么本行的i位置就是不可达的。
2. 如果上一行的i-1或i+1能到达的话而本行的i位置有一个兵，本行的i位置就是可达的。

由于第二种情况可以覆盖掉第一种情况（即如果i同时符合两种情况那他也是可达的），所以在我们记录不可达和可达的变化之后，先处理不可达的变化，再处理可达的变化。

代码：

```cpp
#include <bits/stdc++.h>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<pair<int, int>> p(m);
    for (auto &[x, y] : p) {
        cin >> x >> y;
    }
    sort(p.begin(), p.end());
    set<int> s{n};
    for (int l = 0, r = 0; l < m; l = r) {
        while (r < m && p[l].first == p[r].first) r++;
        vector<int> rem, ins;
        for (int i = l; i < r; i++) {
            int y = p[i].second;
            rem.push_back(y);
            if (s.count(y - 1) || s.count(y + 1)) ins.push_back(y);
        }
        for (auto x : rem) s.erase(x);
        for (auto x : ins) s.insert(x);
    }
    cout << s.size();
    return 0;
}
```
