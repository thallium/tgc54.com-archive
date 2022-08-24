---
published: true
date: 2020-07-05
title: Tutorial for Codeforces 56E - Domino Principle
categories: [Solutions]
tags:
- Data Structure
- Monotonic Stack
layout: post
math: true
---
<!--more-->
## Solution

Each element `{x,i}`in the stack represents a consecutive group of dominos such that if one domino can reach `x`, all the dominos starting from the i-th position until the next group will fall. So when we move to a new domino, we should firstly pop out all the domino that within the reach of the current domino. Then the top domino would be the closest domino that won't fall if we pull of the current domino, i.e. the answer for the current domino.

## Code
```cpp
#include <bits/stdc++.h>

#define forn(i, n) for (int i = 0; i < int(n); ++i)
#define F first
#define S second
#define all(x) (x).begin(),(x).end()

using namespace std;
using pii= pair<int, int>;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    vector<int> x(n),h(n),id(n);
    iota(all(id),0);
    forn(i,n){
        cin>>x[i]>>h[i];
    }
    sort(all(id),[&](int a,int b){return x[a]<x[b];});
    vector<int> ans(n);
    stack<pii> stk;
    stk.push({1e9,n});
    for(int i=n-1;i>=0;i--){
        int ii=id[i];
        while(!stk.empty()&&x[ii]+h[ii]>stk.top().F) stk.pop();
        ans[ii]=(stk.empty()?1:stk.top().S-i);
        stk.push({x[ii],i});
    }
    for(auto it:ans) cout<<it<<' ';
    return 0;
}
```
