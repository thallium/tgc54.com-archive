---
published: true
date: 2020-02-19
title: Finding the longest path on a DAG
categories: [Alg Notes]
tags: 
- Graph Theory
- DP
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
