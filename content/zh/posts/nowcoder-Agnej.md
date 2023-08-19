---
title: "2023牛客多校10 D - Agnej 题解"
date: 2023-08-18T23:16:52-04:00
summary: ""
keywords: []
tags: ["博弈论"]
categories: ["题解"]
---
<!--more-->

考虑每一层的 SG 函数，最终结果由每一层的 SG 函数的异或和决定。

如果 $m$ 为偶数，设左右各有 $l, r$ 个积木，显然 $SG(l, r) = (l + r) \bmod 2$。

如果 $m$ 为奇数，设最中间的位置左右各有 $l, r$ 个积木，SG 函数记作 $SG(l, 0/1, r)$：
- 如果最中间没有积木：等价于 $m$ 为偶数的情况
- 否则，如果 $l = 0$ 或 $r = 0$，只能从一边取，$SG(0, 1, x) = x \bmod 2$
- 否则，如果 $l = 1$ 或 $r = 1$，不妨记作 $(1, 1, x)$，我们可以到达 $(0, 1, x), (1, 0, x), (1, 1, x - 1)$ 三种状态。注意到 $(0, 1, x)$ 和 $(1, 0, x)$ 的 SG 函数必然一个为 $0$ 一个为 $1$。但 $(1, 1, x - 1)$ 的 SG 函数不容易看出规律，我们观察一下 $x$ 比较小的情况：$SG(1, 1, 1) = 2, SG(1, 1, 2) = 3, SG(1, 1, 3) = 2$，可以发现 $SG(1, 1, x) = 2 + (x + 1) \bmod 2$
- 否则，观察到 $SG(2, 1, 2) = 1$，通过数学归纳法可以推出 $SG(l, 1, r) = (l + r + 1) \bmod 2$

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;

    int ans = 0;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        int mid = 0, l = 0, r = 0;
        if (m % 2) {
            mid = s[m / 2] - '0';
        }

        for (int j = 0; j < m / 2; j++) {
            l += s[j] - '0';
        }

        for (int j = (m + 1) / 2; j < m; j++) {
            r += s[j] - '0';
        }

        int sg = 0;
        if (mid == 0) {
            sg = (l + r) % 2;
        } else {
            if (l == 0 || r == 0) {
                sg = (l + r) % 2;
            } else if (l == 1 || r == 1) {
                sg = 2 + (l + r) % 2;
            } else {
                sg = (l + r + 1) % 2;
            }
        }

        ans ^= sg;
    }

    cout << (ans ? "Alice" : "Bob") << endl;
    return 0;
}
```
