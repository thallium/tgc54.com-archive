---
published: true
date: 2019-09-26
title: York University programming contest 2 题解
categories: [比赛题解, 题解]
tags: 
layout: post
---
还算顺利的一场
<!--more-->
[题目链接](https://open.kattis.com/contests/s4m8pb/problems)
# A - 3D Printed Statues

**题意：** 你有1个3D打印机，打印机每天可以打印出1个打印机或者1个雕塑，你需要打印出n个雕塑，问最少需要几天。

**思路：** 不难想出，只用一天打印雕塑就够了，因为如果要需要更多的天数，不如先打印打印机然后再打印雕塑，所以思路就是一开始疯狂打印打印机直到打印个数大于等于n，然后天数加一。

# B - Digital display

**题意：** 给出一个时间，用7段显示的方式输出（格式看题目就行）

**思路：** 当时写麻烦了，其实可以把端点和中间的线合起来写成一个函数的，这样就只用写画横着和竖着的线的函数，用二维数组存整个图案，根据数字和第几位数确定横线和竖线的起点坐标，调用对应的画线函数就行了。最坑的是这个oj没有格式错误，当时少了一个空行却以为是别的错，wa了好几发……这个题耽误了贼长时间。

# C - Eight Queens

**题意：** 给出一个棋盘，判断是不是合法的八皇后放法。

**思路：** 遍历棋盘，碰到皇后就进行判断其4个方向上有没有别的皇后。但是题目里有一点没说就是皇后的数量可能不为8，还好wa了一次就想到这个了，不然可能要自闭……

# D - Eko

**题意：** 给出$N$棵树的高度，你可以选择某一个高度，然后把所有在此高度之上的木头都砍掉，对于给出的$M$单位的树木，找出至少能获得这些数量的最高高度。

**思路：** 因为随着高度从低到高，砍掉的树木的数量单调递增，所以可以用二分搜索。推荐一种[二分的写法](https://www.cnblogs.com/luoxn28/p/5767571.html)，很好记，可以对付各种类型的二分。

代码

```cpp
#include<bits/stdc++.h>
#define forn(i,n) for(int i=0;i<int(n);++i)
#define for1(i,n) for(int i=1;i<=int(n);++i)
#define fore(i,a,b) for(int i=int(a);i<=b;++i)
#define ms(a,x) memset(a,x,sizeof(a));
typedef long long ll;
using namespace std;
const int N=1e6+5;
ll a[N];
int main(){
    ios::sync_with_stdio(false);
    cin.tie(0);
    ll n,m;
    cin>>n>>m;
    ll r=0;
    forn(i,n) {
        cin>>a[i];
        r=max(a[i],r);
    }
    ll l=0;
    while(l<=r){
        ll tot=0;
        ll mid=(l+r)/2;
        forn(i,n){
            if(a[i]>mid) tot+=a[i]-mid;
        }
        if(tot>=m) l=mid+1;
        else r=mid-1;
    }
    cout<<r;
    return 0;
}
```
# E - Election

**题意：** 有$N$个人投票，已经知道第一个人有$V_1$票，第二个人有$V_2$票，已知每个人投票都是随机的，判断是以下哪三种情况：1、第一个人的胜出的概率超过$W\%$, 2、第一个人必输，3、剩下的情况。

**思路：** 排列组合的问题，一直被卡到结束，到第二天才发现是算组合数的时候爆了因为用了最为弱智的算法。算$C_m^n$时应乘一个除一个，分子的部分应从$m-n+1$开始乘，分母的部分应从$1$开始除，如果最终结果在long long之内的话这样算就不会爆。还好最多只有50个人投票，最多只有$2^{50}$种情况。

代码

```cpp
#include <iostream>
typedef long long ll;

ll calc(int a, int b) {
  if (a - b < b) b = a - b;
  ll ans = 1;
  for(int i=1,i<=b;i++) 
    ans = ans*(a -b+ i)/i;
  return ans;
}

using namespace std;
int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int n, v1, v2, w;
  int T;
  cin >> T;
  while (T--) {
    cin >> n >> v1 >> v2 >> w;
    if (n - v2 <= v2)
      cout << "RECOUNT!\n";
    else {
      ll ans = 0;
      int lef = n - v1 - v2;
      for (int i = 0; i <= lef; i++) {
        if (v1 + i > v2 + lef - i) {
          ans += calc(lef, i);
        }
      }
      if (ans * 100.0 / (1ll << lef) > w)
        cout << "GET A CRATE OF CHAMPAGNE FROM THE BASEMENT!\n";
      else
        cout << "PATIENCE, EVERYONE!\n";
    }
  }
  return 0;
```
