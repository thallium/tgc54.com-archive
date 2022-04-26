---
published: true
date: 2020-04-21
title: 算法竞赛杂记
categories: [杂项]
tags:

layout: post
---
仅用做提醒自己，看不懂概不负责～
<!--more-->

## LIS 和 LNDS

```cpp
int LIS(vector<int>& a){
    vector<int> dp;
    int mx=0;
    for(auto it:a){
        auto pos=lower_bound(all(dp),it);
        if(pos==dp.end()) dp.pb(it);
        else *pos=it;
        mx=max(mx,(int)dp.size());
    }
    return mx;
}

int LNDS(vector<int>& a){
    vector<int> dp;
    int mx=0;
    for(auto it:a){
        auto pos=upper_bound(all(dp),it);
        if(pos==dp.end()) dp.pb(it);
        else *pos=it;
        mx=max(mx,(int)dp.size());
    }
    return mx;
}
```

## Maximum subarray sum

```cpp
int cur=0, max_sum=0;//max_sum=-1e8 if at least one element must be chosen
for(auto it:a){
    cur=max(cur+it,it);
    max_sum=max(max_sum,cur);
}
```
## 整数三分

以求函数最大值为例

```cpp
while(l<r-2){
    int m=(l+r)/2;
    if(cal(m)>cal(m+1)) r=m+1;
    else l=m;
}
int ans=max({cal(l),cal(l+1),cal(r)});
```

## 把n分成k组

`int sz=n/k`
有`n%k`组有`sz+1`个，`k-n%k`组有`sz`个。

## 快速范围判断

判断是否在[0, N)，常用于bfs/dfs边界判断

```cpp
if((unsigned)x<N)
```

判断是否在[l, r]内
```cpp
if((x-l|r-x)>=0)
```

## 根据两数之和和异或值反推两数

原理：`a+b==(a^b)+2*(a&b)`

如果$sum-xor$是奇数，那么无解。

否则$A=(sum-xor)/2$，根据A和xor的每一位填就行了，注意如果某一位两数都是1的话也是无解。

## 优先队列模板参数自动推断

可以少写一点代码，需要比较新的g++版本。
```cpp
priority_queue q(greater{}, vector<int>{});
```

## 精确计算$\lceil\log_2 x\rceil$

```cpp
x==1 ? 0 : __lg(x-1)+1;
```

## 用交换相邻元素的排序数组的最小操作次数

是数组中逆序对的数目

## a个0，b个1组成的01字符串字典序第k小

先预处理i个0,j个1的字符串个数，然后从高位到底位枚举
```cpp
vector dp(a+1, vector(b+1, 0LL));
dp[0][0]=1;
for (int i=0; i<=a; i++) {
    for (int j=0; j<=b; j++) {
        if (i>0) {
            dp[i][j]+=dp[i-1][j];
        }
        if (j) {
            dp[i][j]+=dp[i][j-1];
        }
    }
}
auto find_kth=[&](auto& find_kth, int A, int B, ll k) {
    if (A==0) return string(B, 'b');
    if (B==0) return string(A, 'a');
    if (k<=dp[A-1][B]) return "a"+find_kth(find_kth, A-1, B, k);
    return "b"+find_kth(find_kth, A, B-1, k-dp[A-1][B]);
};
```

## 位运算技巧

[可以看这](https://baobaobear.github.io/post/20191012-binary-skill/)

## 冒泡排序遍历的次数

创建一个复制数组b，其中$b[i]={a[i], i}$，然后排序b，排序后$b[i].second-i$的最大值就是答案，$b[i].second-i$本质上就是一个数向前移动的距离，不难想出每个会向前移动的数从第一轮遍历就会开始向前移动，直到到达排序后的位置，所以最大的向前移动距离就是遍历的轮数。
