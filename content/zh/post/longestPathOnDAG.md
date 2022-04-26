---
published: true
date: 2020-02-19
title: DAG上最长路
categories: [算法笔记]
tags: 
- 图论
- 动态规划
- DFS
layout: post
---
```cpp
vector<int> G[N];
int dp[N];

int get(int u){
	if(dp[u]) return dp[u];
	for(auto it:G[u]){
		dp[u]=max(dp[u],get(it)+1);
	}
	return dp[u];
}
```
