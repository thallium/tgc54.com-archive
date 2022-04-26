---
published: true
date: 2020-06-23
title: 题解 Atcoder Beginner Contest 171F - Strivore
categories: [题解]
tags:
- 组合学
layout: post
math: true
---
思考的角度很妙
<!--more-->

## 题解

答案的个数等于有多少个长度为$\|S\|+K$的字符串$T$使得$S$是他的一个子序列。

设$S_i$在$T$中的下标为$a_1,a_2,\dots,a_{\|S\|}$。 为了避免重复，我们在所有可能的$a+i$中取最小的。不难看出，$a_i$和$a_{i+1}$之间的字符有25种选择，$a_{\|S\|}$之后的有26种可能。

所以我们可以枚举$a_{\|S\|}$之后的字符的个数，这样在字符选择方面我们有$25^{K-x}\cdot 26^x$种可能。然后再考虑如何分配$K-x$个字符，根据插板模型，我们有${\|S\|-1+k-x \choose \|S\|-1}$种方式，所以对于每个x，答案增加$25^{K-x}\cdot 26^x\cdot {\|S\|-1+k-x \choose \|S\|-1}$。

## Code
```cpp
#include <bits/stdc++.h>

#define forn(i, n) for (int i = 0; i < int(n); ++i)
#define for1(i, n) for (int i = 1; i <= int(n); ++i)
#define ms(a, x) memset(a, x, sizeof(a))
#define F first
#define S second
#define all(x) (x).begin(),(x).end()
#define sz(x) int(x.size())
#define pb push_back

using namespace std;
using ll=long long;
using pii= pair<int, int>;
mt19937 gen(chrono::steady_clock::now().time_since_epoch().count());
template<typename... T> void rd(T&... args) {((cin>>args), ...);}
template<typename... T> void wr(T... args) {((cout<<args<<" "), ...);cout<<endl;}

template <int MOD>
struct ModInt {
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
    ModInt operator+(const ModInt& x) const { return ModInt(*this) += x; }
    ModInt operator-(const ModInt& x) const { return ModInt(*this) -= x; }
    ModInt operator*(const ModInt& x) const { return ModInt(*this) *= x; }
    ModInt operator/(const ModInt& x) const { return ModInt(*this) /= x; }
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
    ModInt& operator+=(const ModInt& x) {
        if ((val += x.val) >= MOD) val -= MOD;
        return *this;
    }
    ModInt& operator-=(const ModInt& x) {
        if ((val -= x.val) < 0) val += MOD;
        return *this;
    }
    ModInt& operator*=(const ModInt& x) {
        val = int(ll(val) * x.val % MOD);
        return *this;
    }
    ModInt& operator/=(const ModInt& x) { return *this *= x.inv(); }
    // compare
    bool operator==(const ModInt& b) const { return val == b.val; }
    bool operator!=(const ModInt& b) const { return val != b.val; }
    // I/O
    friend std::istream& operator>>(std::istream& is, ModInt& x) noexcept { return is >> x.val; }
    friend std::ostream& operator<<(std::ostream& os, const ModInt& x) noexcept { return os << x.val; }
};
using mint=ModInt<int(1e9+7)>;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int k;
    string s;
    cin>>k>>s;
    int n=sz(s);
    vector<mint> fac(2e6+5);
    fac[0]=1;
    for(int i=1;i<=2e6;i++) fac[i]=fac[i-1]*i;
    mint ans=0;
    auto C=[&](int n,int r)->mint{
        if(r>n) return 0;
        return fac[n]/fac[r]/fac[n-r];
    };
    for(int i=0;i<=k;i++){
        ans+=mint(25).pow(k-i)*mint(26).pow(i)*C(n-1+k-i,n-1);
    }
    cout<<ans;
    return 0;
}
```
