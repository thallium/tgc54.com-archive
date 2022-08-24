---
published: true
date: 2021-01-24
title: 题解 2019 ICPC East Central North American(ECNA) Regional Contest K - Where Have You Bin
categories: [题解]
tags: 
- 动态规划
layout: post
---

感觉挺套路的，但当时太菜了不会做，是道不错的题

<!--more-->
## Solution

For brevity, let's use $0,1,2,3,4$ denote A, E, I, O, U.

Let $\textit {EndCost}_{i, j}$ be the cost to put all the bins of type $i$ consecutively to where ends at $j$.

For the 5 types of bins, there's are $5!$ combinations of relative order. Let $\textit {BestCost}_{i, j}$  be the best cost to put $i$ types of bins such that the last type of bins ends at $j$. Obviously, $\textit{BestCost}\_{1}$ can be one of of $\textit{EndCost}\_i, i=0,\dots,4$. 

For $i=2,\dots, 5$, $\textit{BestCost}\_{i, j}$ can be calculated from $\textit{BestCost}\_{i-1, j}$:

$$\textit{BestCost} _{i,jj}=\min _{j\le jj-cnt_k}\textit{BestCost} _{i-1, j}+\textit{EndCost} _{k, j},~~\text{for each type } k=0,\dots,5$$


Time complexity: $O(5^5\cdot n^2)$ (correct me if I'm wrong).

## 题解

首先先算出把每一种箱子放到结尾为$j$的位置的花费，然后遍历 $5!$ 种相对位置顺序，然后记录把前$i$种箱子放到结尾为$j$的位置的花费。 具体转移公式看上面吧，懒得复制了QAQ.

## Code

```cpp
#include <bits/stdc++.h>

#define all(x) (x).begin(),(x).end()
#define sz(x) int(x.size())

using namespace std;
using ll = long long;
using pii = pair<int, int>;
template<typename... T> void rd(T&... args) {((cin>>args), ...);}
template<typename... T> void wr(T... args) {((cout<<args<<" "), ...);cout<<endl;}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    cin>>s;
    int n=(int)s.size();
    vector<int> a(n), bins(n);
    for (auto& i : a) cin>>i;
    map<char, int> mp{{'A', 0}, {'E', 1}, {'I', 2}, {'O', 3}, {'U', 4}};
    int cnt[5]{}, totalCost[5]{};
    int d;
    cin>>d;
    while (d--) {
        int x;
        cin>>x;
        x--;
        a[x]=0;
        s[x]='X';
    }
    for (int i=0; i<n; i++) {
        auto c=s[i];
        if (c!='X') {
            cnt[mp[c]]++;
            totalCost[mp[c]]+=a[i];
            bins[i]=mp[c];
        } else bins[i]=-1;
    }
    string t;
    cin>>t;
    if (t!="X") for (auto c : t) cnt[mp[c]]++;
    constexpr int INF=1e9;
    vector endCost(5, vector(n, INF));
    auto bestCost=endCost;
    for (int bin=0; bin<5; bin++) {
        for (int i=0; i<n; i++) {
            if (i>=cnt[bin]-1) {
                endCost[bin][i]=totalCost[bin];
                for (int j=0; j<cnt[bin]; j++) {
                    if (bins[i-j]==bin) endCost[bin][i]-=a[i-j];
                }
            }
        }
    }
    int ans=1e9;
    vector<bool> available(5, true);
    auto solve=[&](auto& solve, int level) -> void{
        if (level==0) {
            for (int o=0; o<5; o++) {
                available[o]=false;
                bestCost[0]=endCost[o];
                solve(solve, 1);
                available[o]=true;
            }
        } else if (level==5) {
            ans=min(ans, *min_element(bestCost[4].begin(), bestCost[4].end()));
        } else {
            for (int o=0; o<5; o++) {
                if (available[o]) {
                    available[o]=false;
                    int spaceNeeded=0;
                    for (int o2=0; o2<5; o2++) {
                        if (!available[o2]) spaceNeeded+=cnt[o2];
                    }
                    for (int i=0; i<n; i++) {
                        bestCost[level][i]=INF;
                        if (i>=spaceNeeded-1) {
                            for (int j=0; j<i-cnt[o]+1; j++) {
                                bestCost[level][i]=min(bestCost[level][i], bestCost[level-1][j]+endCost[o][i]);
                            }
                        }
                    }
                    solve(solve, level+1);
                    available[o]=true;
                }
            }
        }

    };
    solve(solve, 0);
    cout<<ans;
    return 0;
}
```
