---
published: true
date: 2020-05-02
title: Solution for AtCoder beginner contest 165F - LIS on Tree
categories: [Solutions]
tags:
- DFS
- DP
layout: post
math: true
---
Very interesting problem.
<!--more-->

## Solution

The problem is not hard if you know to find the LIS in $O(n\log n)$ time. Combining LIS and tree problem is quite interesting.

The key part of this problem is how to backtrack. I used `vector` so the backtrack part is a little bit more cumbersome than regular array's since you have to record whether you add a new element or replace a element. My approach is that if we add a new element, set `flag` to -1 otherwise set `flag` to the old number.

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
mt19937 gen(chrono::steady_clock::now().time_since_epoch().count());
template<typename... Args> void rd(Args&... args) {((cin >> args), ...);}
template<typename... Args> void write(Args... args) { ((cout << args << " "), ...); cout<<endl;}

vector<int> a,ans;
const int N=2e5+5;
vector<int> G[N];
void dfs(int u,int fa,vector<int>& lis){
    int flag;
    int pos=lower_bound(all(lis),a[u])-lis.begin();
    if(pos==lis.size()) lis.push_back(a[u]),flag=-1;
    else flag=lis[pos],lis[pos]=a[u];
    ans[u]=lis.size();
    for(auto it:G[u]){
        if(it==fa) continue;
        dfs(it,u,lis);
    }
    if(flag==-1) lis.pop_back();
    else lis[pos]=flag;
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    a=ans=vector<int>(n+1);
    for1(i,n) cin>>a[i];
    forn(i,n-1){
        int x,y;
        cin>>x>>y;
        G[x].push_back(y);
        G[y].push_back(x);
    }
    vector<int> v{};
    dfs(1,-1,v);
    for1(i,n) cout<<ans[i]<<endl;
    return 0;
}
```
