---
published: true
date: 2020-07-01
title: 部分题解 Atcoder Educational DP Contest 
categories: [题解]
tags:
- 动态规划
layout: post
math: true
---
非常好的学习dp的比赛。
<!--more-->

## M - Candies

### Solution

Let $dp_{i,j}$ be the number of ways to distribute $j$ candies to the first $i$ kids. If we give $k$ candies to the $i$-th kid, we should add $dp_{i-1,j-k}$ to $dp_{i,j}$. Since $k$ takes all the values from $0$ to $a_i$, so $dp_{i,j}=\sum_{k=0}^{a_i}dp_{i-1,j-k}$. Note that we take a segment of $dp_{i-1}$, so we can use prefix sum.

There's one optimization: the first dimension of $dp$ is useless, we only need to store the latest $dp$ array.

### Code

```cpp
#include <bits/stdc++.h>

#define forn(i, n) for (int i = 0; i < int(n); ++i)
#define for1(i, n) for (int i = 1; i <= int(n); ++i)
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


const int mod=1e9+7;
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
using mint=ModInt<mod>;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n,k;
    cin>>n>>k;
    vector<int> a(n);
    for(auto& it:a) cin>>it;
    vector<mint> dp(k+1);
    dp[0]=1;
    for(int i=0;i<n;i++){
        vector<mint> sum(k+2),ndp(k+1);
        partial_sum(all(dp),sum.begin()+1);
        for(int j=0;j<=k;j++){
            ndp[j]+=sum[j+1];
            if(j>=a[i]) ndp[j]-=sum[j-a[i]];
        }
        dp=ndp;
    }
    cout<<dp[k];
    return 0;
}
```

## O - Matching

### Solution

$dp_{mask}$ means the number of way to pair all the girls with 1-bit in the mask with the first $popcount(mask)$ boys.

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const int mod=1e9+7;
    int n;
    cin>>n;
    vector a(n,vector(n,0));
    for(auto& v:a) for(auto& it:v) cin>>it;
    vector<int> dp(1<<n);
    dp[0]=1;
    for(int mask=1;mask<(1<<n);mask++){
        int ones=__builtin_popcount(mask);
        for(int bit=0;bit<n;bit++){
            if(mask>>bit&1 && a[ones-1][bit]){
                (dp[mask]+=dp[mask^(1<<bit)])%=mod;
            }
        }
    }
    cout<<dp[(1<<n)-1];
    return 0;
}
```

## S - Digit Sum

### Solution

Very basic digit dp problem, we will write it in a recursive way with memoization. $dp_{i,j,k}$ means how many ways we can choose a number for the first $i$ digits, with $sum\bmod D=j$ and the $i$-th digit can take value from 0-9 if $j=0$ and $0-s_i$ if $j=1$.

### Code

```cpp
#include <bits/stdc++.h>
#define sz(x) int(x.size())

using namespace std;
using ll=long long;

string s;
int D;
const int N=1e5+5,mod=1e9+7;
ll dp[N][105][2];

ll dfs(int i,int sum,bool strict){
    if(i==sz(s)) return sum==0;
    if(dp[i][sum][strict]!=-1) return dp[i][sum][strict];
    ll ret=0;
    int mx=9;
    if(strict) mx=s[i]-'0';
    for(int j=0;j<=mx;j++){
        (ret+=dfs(i+1,(sum+j)%D,j==mx&&strict))%=mod;
    }
    return dp[i][sum][strict]=ret;
}
    
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>s>>D;
    memset(dp,-1,sizeof(dp));
    cout<<(dfs(0,0,1)-1+mod)%mod;
    return 0;
}
```

## T - Permutation

### Solution

Let $dp_{i,j}$ denotes the number of permutations of $0, 1, \dots , i - 1$ such that the last element is j and all the first i - 1 inequalities are fulfilled. 

Transition is:

`if(s[i]=='>')` $dp_{i,j}=\sum_{t=j}^{i-1}dp_{i-1,t}$

`else` $dp_{i,j}=\sum_{t=0}^{j-1}dp_{i-1,t}$

This can be calculated in $O(1)$ using prefix sum.

One way to interpret the transition is that we add $j$ to the end of the previous permutation and increase all the values greater or equal than $j$ by 1. What a trick!

### Code

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const int mod=1e9+7;
    int n;
    string s;
    cin>>n>>s;
    vector dp(n,vector(n,0));
    dp[0][0]=1;
    for(int i=1;i<n;i++){
        vector<int> sum(n+1);
        for(int j=1;j<=n;j++) sum[j]=(sum[j-1]+dp[i-1][j-1])%mod;
        for(int j=0;j<=i;j++){
            if(s[i-1]=='<') dp[i][j]=(sum.back()-sum[j]+mod)%mod;
            else dp[i][j]=sum[j];
        }
    }
    int ans=0;
    for(auto it:dp[n-1]) (ans+=it)%=mod;
    cout<<ans;
    return 0;
}
```

## U - Grouping


### 题解

$dp_i$表示只考虑$i$的二进制表示中是1的位置的兔子的答案。一开始假设所有兔子都在同一个组里。然后用`for(int j=i;j;j=(j-1)&i)`遍历$i$的所有子集然后更新答案。

### Code

```cpp
#include <bits/stdc++.h>
#define forn(i, n) for (int i = 0; i < int(n); ++i)

using namespace std;
using ll=long long;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    int a[n][n];
    forn(i,n) forn(j,n) cin>>a[i][j];
    vector<ll> dp(1<<n);
    forn(i,1<<n) forn(j,n) if(i>>j&1) forn(k,j) if(i>>k&1)
        dp[i]+=a[j][k];
    forn(i,1<<n){
        for(int j=i;j;j=(j-1)&i){
            dp[i]=max(dp[i],dp[j]+dp[j^i]);
        }
    }
    cout<<dp[(1<<n)-1];
    return 0;
}
```
