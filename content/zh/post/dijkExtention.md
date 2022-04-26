---
published: true
date: 2019-11-10
title: Dijkstra的一些扩展
categories: [算法笔记]
tags: 
- 最短路
- 图论
layout: post
---

<!--more-->
# 路径记录

我们开一个`vector<int> pre[N]`用来记录某个点的前一个点，在更新距离的时候，如果当前距离更短就舍弃掉之前的记录，将当前点作为被更新点的前一个点；如果当前距离和最短距离相等就在数组里加上这个点。

```cpp
for(pii it:E[u]){
    ll v=it.S,cost=it.F;
    if(!vis[v]&&dis[v]>dis[u]+cost){
        dis[v]=dis[u]+cost;
        pre[v].clear();
        pre[v].pb({cost,u});
        q.push({dis[v],v});
    }else if(dis[v]==dis[u]+cost)
        pre[v].pb({cost,u});
}
```

# 最短路径的数量

和路径记录类似，如果更短就让数目等于1,如果一样就加1。

```cpp
if(!vis[v]&&dis[u]+cost<dis[v]){
    cnt[v]=1;
    dis[v]=dis[u]+cost;
}else if(dis[u]+cost==dis[v]){
    cnt[v]++;
}
```
