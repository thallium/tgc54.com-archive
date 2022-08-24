---
published: true
date: 2020-04-24
title: Atcoder beginner contest 162F -  Select Half Select Half 题解
categories: [题解]
tags:
- 动态规划
layout: post
math: true
---
yysy这种题想出来真的爽。
<!--more-->

## 题解

这道题有很多不同的dp方法。这里我将描述一下我认为比较标准的方法。当然有更短的做法但是也看不懂啊QAQ。

首先定义一下dp状态，设$dp_{i,j}$为前i个数的答案并且最后一个选的数的下标是$i-j$。

通过观察不难发现如果$i$是奇数，那么j最大是2，否则j最大是1。这点可以通过取$1,3,5,\dots$的数来验证。

现在我们可以考虑状态转移了。如果$i$是奇数，那么选的数的个数和$i-1$是一样的。所以$dp_{i,j}$应该等于$dp_{i-1,j-1}$除了$dp_{i,0}$，因为$a_i$在计算$dp_{i-1,j}$的时候并没有被考虑到，所以$dp_{i,0}$应该从$dp_{i-2,j}$转移过来。以下是状态转移方程:

$$ \begin{align*}dp_{i,0}&=\max(dp_{i-2,0},dp_{i-2,1},dp_{i-2,2})+a_i \\\ dp_{i,1}&=dp_{i-1,0}\\\ dp_{i,2}&=dp_{i-1,1}\end{align*} $$

当$i$为偶数，要比$i-1$多选一个数，想法基本类似。状态转移如下：

\\[ \begin{align*}dp_{i,0}&=\max(dp_{i-1,i},dp_{i-1,2})+a_i \\\ dp_{i,1}&=dp_{i-1,2}+a_i\end{align*} \\]


## Code

```cpp
#include <bits/stdc++.h>

#define forn(i, n) for (int i = 0; i < int(n); ++i)
#define for1(i, n) for (int i = 1; i <= int(n); ++i)
#define ms(a, x) memset(a, x, sizeof(a))
#define F first
#define S second
#define all(x) (x).begin(),(x).end()

using namespace std;
typedef long long ll;
typedef pair<int, int> pii;
const int INF = 0x3f3f3f3f;
mt19937 gen(random_device{}());
template<typename... Args> void write(Args... args) { ((cout << args << " "), ...); cout<<endl;}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    vector<int> a(n+1);
    for(int i=1;i<=n;++i) cin>>a[i];
    vector<vector<ll>> dp(n+1,vector<ll>(3,-1e18));
    dp[1]={0,0,0};
    for(int i=2;i<=n;++i){
        if(i&1){
            dp[i][0]=max({dp[i-2][0],dp[i-2][1],dp[i-2][2]})+a[i];
            dp[i][1]=dp[i-1][0];
            dp[i][2]=dp[i-1][1];
        }else{
            dp[i][0]=max({dp[i-1][1]+a[i],dp[i-1][2]+a[i]});
            dp[i][1]=dp[i-1][2]+a[i-1];
        }
    }
    cout<<*max_element(all(dp[n]));
    return 0;
}
```
