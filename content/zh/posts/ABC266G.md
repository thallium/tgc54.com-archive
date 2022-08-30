---
title: "AtCoder Beginner Contest 266 G 题解"
date: 2022-08-29T21:16:32-04:00
summary: "学了二项式反演"
tags: [AtCoder,数学,组合数学,二项式反演]
categories: [题解]
---
直接利用组合数求解的做法比较简单，这里就不再赘述，着重讲利用二项式反演的做法。

首先不难想到用 $i$ 个 RG，$r - i$个R，$g-i$个G，$b$个B排，得到看似是“至少有$i$的RG”的字符串数量。但是这样计数会有重复，比如`RG B R G`和`R G B RG`其实是一样的串但计数的时候算了两次，准确地说，含$j$个RG的串被重复记了$j\choose i$次，用数学语言表示就是：设$f(x)$为恰好含$x$个RG的字符串的数量，有
$$\frac{(i + r - i + g - i + b)!}{i!(r - i)!(g - i)!b!} = \sum_{j = i}^{\min(r, g)}{j \choose i}f(i)$$

这恰好是二项式反演的[形式二](https://wiki.tgc54.com/competitive-programming/binomial-inversion.html#%E5%BD%A2%E5%BC%8F%E4%BA%8C)，那么答案$f(k)$为
$$f(k) = \sum_{i = k}^{\min(r, g)}(-1)^{i - k}{i \choose k}\frac{(i + r - i + g - i + b)!}{i!(r - i)!(g - i)!b!}$$

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;
#define all(x) begin(x),end(x) //{{{
#ifndef LOCAL // https://github.com/p-ranav/pprint
#define de(...)
#define de2(...)
#endif
using ll = long long; //}}}

template <typename mint> struct Factorial {
    std::vector<mint> fac, invfac;
    Factorial(int n) : fac(n + 1), invfac(n + 1) {
        fac[0] = 1;
        for (int i = 1; i <= n; i++) {
            fac[i] = fac[i - 1] * i;
        }
        invfac[n] = fac[n].inv();
        for (int i = n - 1; i >= 0; i--) {
            invfac[i] = invfac[i + 1] * (i + 1);
        }
    }
    mint C(int n, int k) { // n choose m
        if (k < 0 || k > n) return 0;
        assert((int)size(fac) > n);
        return fac[n] * invfac[n - k] * invfac[k];
    }
    mint P(int n, int m) { // n choose m with permutation
        assert(!fac.empty());
        return fac[n] * invfac[n - m];
    }

    // evaluate expressions consists of multiplication and division
    // if the number is multiplied, pass the number as argument
    // if divided, pass its negation
    // Example: a! * b! / c! => eval(a, b, -c);
    template<typename... Args>
    constexpr mint eval(Args... args) {
        return ((args > 0 ? fac[args] : invfac[-args]) * ...);
    }
};
template <int MOD>
struct ModInt {
    int val;
    ModInt(ll v = 0) : val(v % MOD) { if (val < 0) val += MOD; };
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
using mint = ModInt<998244353>;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int r, g, b, k;
    cin >> r >> g >> b >> k;
    int n = r + g + b;
    Factorial<mint> fac(n);
    mint ans = 0;
    for (int i = k; i <= min(r, g); i++) {
        ans += ((i - k) % 2 ? -1 : 1) * fac.C(i, k) * fac.eval(i + r - i + g - i + b, -i, -(r - i), -(g - i), -b);
    }
    cout << ans << endl;
}
{{< /code >}}
