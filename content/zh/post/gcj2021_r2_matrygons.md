---
title: "Google Code Jam 2021 R2 Matrygons题解"
date: 2021-05-15T16:39:16-04:00
categories: [题解]
tags:
- 动态规划
---
比赛的时候想错方向了:disappointed:
<!--more-->
## Solution

设从里向外多边形的边数为$e1, e2, \dots, e_n$。不难发现$e_i$必须是$e_{i-1}$的倍
数，因此我们可以把$e$写成$e_1\cdot 1, e_1\cdot k_2, \dots, e_1\cdot k_n$。所以
如果我们知道最里面的多边形的边数，那么剩下的事情就是找到最长的序列$$k_1=1, k_2,
k_3, \dots, k_n$$ 使得$k_i$是$k_{i-1}$的倍数并且$\sum_i k_i=K$。

注意$k_2, k_3,\dots, k_n$都是$k_2$的倍数，所以如果我们把它们都除以$k_2$就又得到
了一个以$1$开头的序列！也就是说我们得到了一个更小的子问题，所以我们可以用动态规
划来解决：设$dp_i$为和为$i$的上述序列的最大长度。因为我们可以把一个短的序列乘上
一个数并在最前面放一个$1$，从而得到一个更长的序列，所以状态转移就是：
$$dp_{k\cdot i+1}\coloneqq \max(dp_{k\cdot i+1}, dp_i+1), k=2,3,\dots$$

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int tt = 1;
    cin >> tt;
    constexpr int N = 1e6;
    vector<int> dp(N + 1, 1);
    for (int i = 1; i <= N; i++) {
        for (int j = 2 * i + 1; j <= N; j += i) {
            dp[j] = max(dp[j], dp[i] + 1);
        }
    }
    for (int cas = 1; cas <= tt; cas++) {
        int x;
        cin >> x;
        int ans = 1;
        cout << "Case #" << cas << ": ";
        for (int f = 3; f <= x; f++) {
            if (x % f == 0)  ans = max(ans, dp[x / f]);
        }
        cout << ans << '\n';
    }
    return 0;
}
```
