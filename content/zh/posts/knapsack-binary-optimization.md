---
title: 二进制分组优化背包
date: 2022-05-11
categories: [算法笔记]
tags: []
---
<!--more-->
## 关于名字

名字看不懂无所谓，我看有一篇博客这么叫感觉有点道理就也这么叫了，dls管这个叫数位背包，但那样叫就感觉有点自成一派，其实就是一种特殊的01背包。

## 引入

直接看一个例题：[[HNOI2007]梦幻岛宝珠](https://www.luogu.com.cn/problem/P3188)，题意就是一个容量很大的01背包问题，但$w$能写成 $a\times 2^b, a\le 10, b\le 30$的形式。

这个特殊限制就开始暗示我们从二进制的角度考虑，我们要做的是将物品按$b$分组，从大到小，每次考虑一个分组里我物品。当对分组$i$进行dp时，设当前剩余的容量为$k\times 2^i$，由于分组里物品重量都能写成$a\times 2^i$的形式，所以只有容量的系数$k$会变化，所以我们可以只用系数来代表当前剩余容量。

其实最重要的限制是 $a\le 10$，因为任何数都能写成 $a\times 2^b$ 的形式，只不过 $a$ 很大罢了。 $a$很小这个限制就确保了整个组里所有物品的重量之和不超过 $100\times 10 \times 2^b$（100来自于题目中最多有100个物品的限制）。再结合上一段中用系数表示容量的方法，这样重量的状态就从标准01背包做法的$10^9$缩小到了1000！这就是本题的核心思想。

接下来我们说状态转移，令$dp_{i, j}$为考虑完$i$及以上的组之后，背包剩余容量为$j\times 2^i$时能得到的最高价值（$j$的上限为1000，因为再多了后面的物品也用不完）。在一个分组内dp时就是常规的01背包，重点在于从$i$转移到$i-1$：当前剩余容量$j\times 2^i$ 变成 $2 \times j \times 2^{i-1} + s_{i-1} \times 2^{i-1} = (2\times j + s_{i-1})2^{i-1}$，其中$s_{i-1}$代表背包总容量二进制表示的第$i-1$位，现在加上$s_{i-1}\times 2^{i-1}$是因为之前这部分容量太小了用不上，在考虑$i-1$组的时候就能用上了。用代码表示一下转移的话就是
```cpp
dp[i - 1][j * 2 + s[i - 1]] = max(dp[i - 1][j * 2 + s[i - 1]], dp[i][j]);
```

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m) {
        if (n == -1 && m == -1) break;

        const int N = 31;
        vector<int> s(N), weight(n), value(n);
        vector<vector<int>> items(N);
        vector dp(N, vector<int>(1001, -1e9));

        for (int i = 0; i < N; i++) {
            s[i] = m >> i & 1;
        }
        for (int i = 0; i < n; i++) {
            cin >> weight[i] >> value[i];
            int b = 0;
            while (weight[i] % 2 == 0) {
                weight[i] /= 2;
                b++;
            }
            items[b].push_back(i);
        }

        auto cmax = [](auto &x, auto y) { x = max(x, y); };

        for (int i = N - 1; i >= 0; i--) {
            cmax(dp[i][s[i]], 0);
            for (auto item : items[i]) { // 组内dp
                for (int j = 0; j + weight[item] <= 1000; j++) {
                    cmax(dp[i][j], dp[i][j + weight[item]] + value[item]);
                }
            }
            if (i) { // 转移到下一组
                for (int j = 0; j <= 1000; j++) {
                    cmax(dp[i - 1][min(j * 2 + s[i - 1], 1000)], dp[i][j]);
                }
            }
        }
        cout << *max_element(begin(dp[0]), end(dp[0])) << endl;
    }
}
{{< /code >}}

## 另一道题

接下来看一道不是很“背包”的题[CF1670F. Jee, You See?](https://codeforces.com/contest/1670/problem/F)，核心思路不变。变了的地方及对应的解决方法：
- 最大重量变成了方法数
    - max变成+
- 物品变成了数组中第$i$位1的个数，可以选从0到n个
    - 相当于上面的题中的$a$从0到$n$各一个，遍历即可
- 异或的限制
    - 如果当前位是$1$，那就选$1,3,5,\dots$个，如果是$0$就选$0,2,4,\dots$个

{{< code language="cpp" title="代码（参考了jiangly的写法，他是从i+1往i转移的）" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

template <int MOD>
struct ModInt {
    int val;
    ModInt(int v = 0) : val(v % MOD) { if (val < 0) val += MOD; };
    ModInt operator+() const { return ModInt(val); }
    ModInt operator-() const { return ModInt(MOD - val); }
    ModInt inv() const {
        auto a = val, m = MOD, u = 0, v = 1;
        while (a != 0) { auto t = m / a; m -= t * a; swap(a, m); u -= t * v; swap(u, v); }
        assert(m == 1);
        return u;
    }
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
    friend ModInt operator+ (ModInt lhs, const ModInt& rhs) { return lhs += rhs; }
    friend ModInt operator- (ModInt lhs, const ModInt& rhs) { return lhs -= rhs; }
    friend ModInt operator* (ModInt lhs, const ModInt& rhs) { return lhs *= rhs; }
    friend ModInt operator/ (ModInt lhs, const ModInt& rhs) { return lhs /= rhs; }
    ModInt& operator+=(const ModInt& x) { if ((val += x.val) >= MOD) val -= MOD; return *this; }
    ModInt& operator-=(const ModInt& x) { if ((val -= x.val) < 0) val += MOD; return *this; }
    ModInt& operator*=(const ModInt& x) { val = int64_t(val) * x.val % MOD; return *this; }
    ModInt& operator/=(const ModInt& x) { return *this *= x.inv(); }
    bool operator==(const ModInt& b) const { return val == b.val; }
    bool operator!=(const ModInt& b) const { return val != b.val; }
    friend std::istream& operator>>(std::istream& is, ModInt& x) noexcept { return is >> x.val; }
    friend std::ostream& operator<<(std::ostream& os, const ModInt& x) noexcept { return os << x.val; }
};
using mint = ModInt<1'000'000'007>;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    ll l, r, z;
    cin >> n >> l >> r >> z;

    vector<mint> choose(n + 1);
    choose[0] = 1;
    for (int i = 1; i <= n; i++) {
        choose[i] = choose[i-1] * (n - i + 1) / i;
    }

    auto solve = [&](ll r) {
        vector<mint> dp(n + 1);
        dp[0] = 1;
        for (int i = 59; i >= 0; i--) {
            int s = r >> i & 1;
            vector<mint> ndp(n + 1);
            for (int j = 0; j <= n; j++) {
                int k = j * 2 + s;
                for (int x = z >> i & 1; x <= n && x <= k; x += 2) {
                    ndp[min(n, k - x)] += dp[j] * choose[x];
                }
            }
            swap(dp, ndp);
        }
        return accumulate(begin(dp), end(dp), mint{});
    };

    cout << solve(r) - solve(l - 1) << endl;
}
{{< /code >}}
