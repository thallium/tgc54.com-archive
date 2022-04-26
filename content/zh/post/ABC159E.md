---
published: true
date: 2020-03-25
title: AtCoder Beginner Contest 159E - Dividing Chocolate 题解
categories: [题解]
tags: 
- 动态规划
layout: post
math: true
---
看了一上午才看明白大佬的代码
<!--more-->

## 题解

`dp[i][j]`表示前i个数里面序列和是j的答案，也就是说把题目要求改成前i个数，和是j时的答案。

当我们处理新的数的时候，假设这个数是x，当前在第i位。很明显前面的序列可以重复使用。现在我们再考虑新的数对答案的贡献：

首先，新数自己就可以作为一个序列，所以我们有`dp[i][x]=i`。其次，新的数还可以和前面的序列形成新的序列，所以对于所有$j\ge x$，我们有`dp[i][j]+=dp[i-1][j-x]`。

## Code

```cpp
#include <bits/stdc++.h>

#define forn(i, n) for (int i = 0; i < int(n); ++i)
#define for1(i, n) for (int i = 1; i <= int(n); ++i)
#define fore(i, l, r) for (int i = int(l); i <= int(r); ++i)
#define ford(i, n) for (int i = int(n)-1; i >= 0; --i)
#define pb push_back
#define eb emplace_back
#define ms(a, x) memset(a, x, sizeof(a))
#define F first
#define S second
#define endl '\n'
#define all(x) (x).begin(),(x).end()
#define de(x) cout<<#x<<" = "<<(x)<<endl
#define de2(x,y) cout<<#x<<" = "<<(x) <<' '<< #y<<" = "<<y<<endl;

using namespace std;

typedef long long ll;
typedef pair<int, int> pii;
const int INF = 0x3f3f3f3f;
mt19937 gen(chrono::high_resolution_clock::now().time_since_epoch().count());
ll nxt(){ll x;cin>>x;return x;}

const int N=3e3+5;
int dp[N][N];
const int mod=998244353;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n,s;
    cin>>n>>s;
    ll ans=0;
    for1(i,n){
        int x;
        cin>>x;
        dp[i][x]=i;//self sequence
        for(int j=0;j<=s;j++){
            (dp[i][j]+=dp[i-1][j])%=mod;//reuse the previous answer
            if(j-x>=0) (dp[i][j]+=dp[i-1][j-x])%=mod;//with previous sequences
        }
        ans=(ans+dp[i][s])%mod;
    }
    cout<<ans;
    return 0;
}
```
