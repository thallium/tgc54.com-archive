---
title: "Solution for Google Code Jam 2021 R2 Matrygons"
date: 2021-05-15T16:39:16-04:00
categories: [Solutions]
tags:
- DP
---

Went the wrong direction during the contest. :disappointed:
<!--more-->
## Solution

Let the number of edges of the polygons be $e1, e2, \dots, e_n$. It's easy to find that $e_i$ has to be a multiple of $e_{i-1}$, thus we can rewrite $e$ as $e_1\cdot 1, e_1\cdot k_2, \dots, e_1\cdot k_n$. Hence if we know the number of edges of the first polygon, all we left if to find the longest sequence $$k_1=1, k_2, k_3, \dots, k_n$$ such that  $k_i$ is a multiple if $k_{i-1}$ and $\sum_i k_i=K$.

Note that $k_2, k_3,\dots, k_n$ are all multiple of $k_2$, so if we divide them by $k_2$ we get a sequence starting with $1$ again! This means we get a smaller subproblem and we can use dynamic programming to solve it: let $dp_i$ be the length of the longest such sequence described above which sums to $i$. Since we can get a longer sequence by multiplying a shorter one by a constant and prepending a $1$, so the transition is:
$$dp_{k\cdot i+1}\coloneqq \max(dp_{k\cdot i+1}, dp_i+1), k=2,3,\dots$$

## Code

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
