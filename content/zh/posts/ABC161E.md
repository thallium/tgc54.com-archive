---
published: true
date: 2020-04-05
title: AtCoder Beginner Contest 161E - Yutori 题解
categories: [题解]
tags:
- 贪心
layout: post
math: true
---
妙啊！
<!--more-->

## 题解

我们可以构造一个数组$L$使得第$x$个工作日不早于第$L_x$天，通过从前往后尽可能早的选择工作日。同样地，我们可以构造$R$数组使得第$x$个工作日不晚于$R_x$天，通过从后往前选择。他必须在第$i$天工作当且仅当存在$x$使得$L_x=R_x=i$。可以在$O(N)$的时间内解决。

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

using namespace std;
typedef long long ll;
typedef pair<int, int> pii;
const int INF = 0x3f3f3f3f;
mt19937 gen(chrono::high_resolution_clock::now().time_since_epoch().count());

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
	int n,k,c;
    cin>>n>>k>>c;
    string s;
    cin>>s;
    vector<int> a,b;
    forn(i,n){
        if(s[i]=='o'){
            a.pb(i);
            i+=c;
        }
    }
    ford(i,n){
        if(s[i]=='o'){
            b.pb(i);
            i-=c;
        }
    }
    forn(i,k){
        if(a[i]==b[k-i-1]) cout<<a[i]+1<<endl;
    }

    return 0;
}
```
