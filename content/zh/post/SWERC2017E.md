---
published: true
date: 2020-03-14
title: SWERC2017 E - Ingredients 题解
categories: [题解]
tags: 
- 图论
- 最短路
- 拓扑排序
- 动态规划
- 背包问题
layout: post
math: true
---
竟然一次就过了
<!--more-->
[Link](https://open.kattis.com/problems/ingredients)

```cpp
ms(cost,INF);
queue<int> q;
for1(i,id.size()){
	if(deg[i]==0){
		q.push(i);
		cost[i]=0;
	}
}
while(!empty(q)){
	int now=q.front();
	q.pop();
	for(auto [dish,cost,prestige]:G[now]){
		if(cost[now]+cost<cost[dish]){//choose the smallest cost
			cost[dish]=cost[now]+cost;
			pre[
		}else if(cost[now]+cost==cost[dish]){//if the cost is same, choose the highest prestige
			pre[dish]=max(pre[dish],pre[now]+prestige);
		}
		deg[dish]--;
		if(deg[dish]==0) q.push(dish);
	}
}
```

The nest part is more familiar: using 0/1 knapsack algorithm to find the answer.

# 题解

这个题结合了最短路和0/1背包算法。

第一步是找到所有菜品的最小花费，也就是DAG上的最短路。这个可以用拓扑排序在$O(n)$的时间内解决，具体实现看上面的代码解释。

第二步就是非常标准的0/1背包了，没什么好说的。

# Code
```cpp
#include <bits/stdc++.h>

#define forn(i, n) for (int i = 0; i < int(n); ++i)
#define for1(i, n) for (int i = 1; i <= int(n); ++i)

#define pb push_back
#define eb emplace_back
#define ms(a, x) memset(a, x, sizeof(a))

using namespace std;

const int INF = 0x3f3f3f3f;


const int N=1e4+5;
vector<tuple<int,int,int>> G[N];
int cost[N],pre[N],deg[N],dp[N];
int main() {
	ios::sync_with_stdio(false);
	cin.tie(nullptr);
	int n,b;
	cin>>b>>n;
	unordered_map<string,int> id;
	auto getid=[&](string& st){
		if(id[st]) return id[st];
		else return id[st]=size(id);
	};
	forn(i,n){
		string s,t,tmp;
		int x,y;
		cin>>s>>t>>tmp>>x>>y;
		int ids=getid(s),idt=getid(t);
		G[idt].eb(ids,x,y);
		deg[ids]++;
	}
    //topo sort
	ms(cost,INF);
	queue<int> q;
	for1(i,id.size()){
		if(deg[i]==0){
			q.push(i);
			cost[i]=0;
		}
	}
	while(!empty(q)){
		int now=q.front();
		q.pop();
		for(auto [to0,to1,to2]:G[now]){
			if(cost[now]+to1<cost[to0]){
				cost[to0]=cost[now]+to1;
				pre[to0]=pre[now]+to2;
			}else if(cost[now]+to1==cost[to0]){
				pre[to0]=max(pre[to0],pre[now]+to2);
			}
			deg[to0]--;
			if(deg[to0]==0) q.push(to0);
		}
	}
    //knapsack
	for1(i,size(id)){
		for(int j=b;j>=cost[i];j--){
			dp[j]=max(dp[j],dp[j-cost[i]]+pre[i]);
		}
	}
	int ans1=0,ans2=0;
	for(int i=0;i<=b;i++){
		if(dp[i]>ans1){
			ans1=dp[i];
			ans2=i;
		}
	}
	cout<<ans1<<endl<<ans2;
	return 0;
}
```
