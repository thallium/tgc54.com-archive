---
title: "AtCoder Beginner Contest(ABC) 207E - Mod i题解"
date: 2021-07-08T11:04:35-04:00
categories: [题解]
tags: [动态规划]
---

<!--more-->

## 方法一

一种简单的dp是令$dp_{i, j}$为将前$i$个数分成$j$个子数组的分法的个数。次转移要遍历$i$前的每个位置$k$然后前缀前缀和判断$sum_i-sum_k$是否是$j$的倍数，如果是的话就加上$dp_{k, j-1}$，所以转移是 $O(n)$的，总的复杂度是$O(n^3)$，会TLE，于是我们想如何优化。考虑到$$((sum_i-sum_k) \bmod j =0)\iff (sum_i\equiv sum_k \mod j)$$ 也许我们不用遍历所有的$k$，只要记录对于每个位置$k$, $sum_k\bmod i=j$的$dp_{k, i-1}$的和就行了。于是我们的状态$dp_{i, j}$的定义就变成了在k位置结束的子数组,分成$i$个子数组并且$sum_k\bmod i=j$的分法的个数。（说实话不是很好理解）

{{% collapse 代码 %}}
```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
template <int MOD> struct ModInt {
    int val;
    // constructor
    ModInt(ll v = 0) : val(int(v % MOD)) {
        if (val < 0) val += MOD;
    };
    // unary operator
    ModInt operator+() const { return ModInt(val); }
    ModInt operator-() const { return ModInt(MOD - val); }
    ModInt inv() const { return this->pow(MOD - 2); }
    // arithmetic
    ModInt operator+(const ModInt &x) const { return ModInt(*this) += x; }
    ModInt operator-(const ModInt &x) const { return ModInt(*this) -= x; }
    ModInt operator*(const ModInt &x) const { return ModInt(*this) *= x; }
    ModInt operator/(const ModInt &x) const { return ModInt(*this) /= x; }
    ModInt pow(ll n) const {
        auto x = ModInt(1);
        auto b = *this;
        while (n > 0) {
            if (n & 1) x *= b;
            n >>= 1;
            b *= b;
        }
        return x;
    }
    // compound assignment
    ModInt &operator+=(const ModInt &x) {
        if ((val += x.val) >= MOD) val -= MOD;
        return *this;
    }
    ModInt &operator-=(const ModInt &x) {
        if ((val -= x.val) < 0) val += MOD;
        return *this;
    }
    ModInt &operator*=(const ModInt &x) {
        val = int(ll(val) * x.val % MOD);
        return *this;
    }
    ModInt &operator/=(const ModInt &x) { return *this *= x.inv(); }
    // compare
    bool operator==(const ModInt &b) const { return val == b.val; }
    bool operator!=(const ModInt &b) const { return val != b.val; }
    // I/O
    friend std::istream &operator>>(std::istream &is, ModInt &x) noexcept { return is >> x.val; }
    friend std::ostream &operator<<(std::ostream &os, const ModInt &x) noexcept { return os << x.val; }
};
using mint = ModInt<int(1e9 + 7)>;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<ll> a(n), sum(n + 1);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        sum[i + 1] = sum[i] + a[i];
    }
    vector dp(n + 2, vector<mint>(n + 2));
    dp[1][0] += 1;
    mint ans = 0;
    for (int i = 0; i < n; i++) {
        for (int j = n; j >= 1; j--) {
            dp[j + 1][sum[i + 1] % (j + 1)] += dp[j][sum[i + 1] % j];
            if (i == n - 1) ans += dp[j][sum[n] % j];
        }
    }
    cout << ans << '\n';
}
```
{{% /collapse %}}

## 方法二

这种方法和方法一的出发点一样，但转移的时候我们只考虑最大的k,这是因为两个和为$j$的的倍数的子数组拼起来和依然是$j$的倍数，所以我们保持一开始的dp状态定义，然后用$O(n^2)$的时间预处理出$pre_{i, j}$，即对于每个位置$i$，其左边第一个位置使得$sum_{pre_{i, j}}\equiv sum_{i}\mod j$，转移时考虑两种情况：pre的位置被分成了$j$或$j-1$个子数组。

{{% collapse 代码 %}}
```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

template <int MOD> struct ModInt {
    int val;
    // constructor
    ModInt(ll v = 0) : val(int(v % MOD)) {
        if (val < 0) val += MOD;
    };
    // unary operator
    ModInt operator+() const { return ModInt(val); }
    ModInt operator-() const { return ModInt(MOD - val); }
    ModInt inv() const { return this->pow(MOD - 2); }
    // arithmetic
    ModInt operator+(const ModInt &x) const { return ModInt(*this) += x; }
    ModInt operator-(const ModInt &x) const { return ModInt(*this) -= x; }
    ModInt operator*(const ModInt &x) const { return ModInt(*this) *= x; }
    ModInt operator/(const ModInt &x) const { return ModInt(*this) /= x; }
    ModInt pow(ll n) const {
        auto x = ModInt(1);
        auto b = *this;
        while (n > 0) {
            if (n & 1) x *= b;
            n >>= 1;
            b *= b;
        }
        return x;
    }
    // compound assignment
    ModInt &operator+=(const ModInt &x) {
        if ((val += x.val) >= MOD) val -= MOD;
        return *this;
    }
    ModInt &operator-=(const ModInt &x) {
        if ((val -= x.val) < 0) val += MOD;
        return *this;
    }
    ModInt &operator*=(const ModInt &x) {
        val = int(ll(val) * x.val % MOD);
        return *this;
    }
    ModInt &operator/=(const ModInt &x) { return *this *= x.inv(); }
    // compare
    bool operator==(const ModInt &b) const { return val == b.val; }
    bool operator!=(const ModInt &b) const { return val != b.val; }
    // I/O
    friend std::istream &operator>>(std::istream &is, ModInt &x) noexcept { return is >> x.val; }
    friend std::ostream &operator<<(std::ostream &os, const ModInt &x) noexcept { return os << x.val; }
};
using mint = ModInt<int(1e9 + 7)>;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<ll> a(n);
    for (auto &x : a)
        cin >> x;
    vector pre(n, vector(n + 1, -1));
    vector last(n + 1, vector(n, -1));
    ll sum = 0;
    for (int i = 0; i < n; i++) {
        sum += a[i];
        for (int j = 1; j <= n; j++) {
            pre[i][j] = last[j][sum % j];
            last[j][sum % j] = i;
        }
    }
    vector dp(n, vector<mint>(n + 1));
    dp[0][1] = 1;
    for (int i = 1; i < n; i++) {
        for (int j = 1; j <= n; j++) {
            int p = pre[i][j];
            if (p != -1) { dp[i][j] = dp[p][j] + dp[p][j - 1]; }
        }
    }
    cout << accumulate(dp[n - 1].begin(), dp[n - 1].end(), mint()) << '\n';
}
```
{{% /collapse %}}
