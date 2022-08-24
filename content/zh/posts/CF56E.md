---
published: true
date: 2020-07-05
title: 题解 Codeforces 56E - Domino Principle
categories: [题解]
tags:
- 数据结构
- 单调栈
layout: post
---
单调栈好题，非常独特的视角。
<!--more-->
## 题解

栈中的每一个元素`{x,i}`代表的是一组连续的多米诺，使得如果我们如果推倒x处的多米诺，从第i个开始一直到下一组的多米诺都会被推掉。所以我们处理新的多米诺的时候，要先把当前多米诺够得到的多米诺组弹出，最后栈顶的元素就是最近的够不着的多米诺，也就是当前多米诺的答案。

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
