---
published: true
date: 2021-02-07
title: 题解 2018 ICPC Asia Singapore Regional Contest
categories: [比赛题解]
tags: 
layout: post
---

[官方英文题解](https://www.comp.nus.edu.sg/~acmicpc/)

<!--more-->
## A. Bitwise

从高位往低位贪心，写一个函数判断能否至少得到`x`。

如何判断能否至少得到`x`？依然是贪心的思路，我们从某一位开始，记录当前的或值，如果大于`x`就开始新的一块。但如果从每个数都开始试一遍的话时间复杂度是$O(n^2)$。但是我们发现每个块的结束位置一定是某一位变成1的位置，所以说开始的位置其实并不重要，最多只会少算一个部分，所以如果我们遍历两圈，如果至少有$2k-1$个块的话就说明`x`是可行的。

```cpp
#include <bits/stdc++.h>

#define all(x) (x).begin(),(x).end()
#define sz(x) int(x.size())

using namespace std;
using ll = long long;
using pii = pair<int, int>;
template<typename... T> void rd(T&... args) {((cin>>args), ...);}
template<typename... T> void wr(T... args) {((cout<<args<<" "), ...); cout<<'\n';}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin>>n>>k;
    vector<int> a(n*2);
    for (int i=0; i<n; i++) {
        cin>>a[i];
        a[i+n]=a[i];
    }
    auto can=[&](int x) -> bool {
        int cnt=0, cur=0;
        for (int i=0; i<2*n; i++) {
            cur|=a[i];
            if ((cur&x)==x) {
                cnt++;
                cur=0;
            }
        }
        return cnt>=2*k-1;
    };
    int ans=0;
    for (int bit=31; bit>=0; bit--) {
        if (can(ans|(1<<bit))) ans|=(1<<bit);
    }
    cout<<ans;
    return 0;
}
```

## B. Conveyor Belts

我们可以把一个点拆成$K$个点，第$i$个点代表第$t\bmod K$时刻。原图中`a -> b`的边拆完之后就变成了`a`的第$i$时刻连到`b`的第$(i+1)\bmod K$时刻，容量为1。这样就保证了每时刻每条传送带上只有一个物品。然后添加一个超级源点，连到第$i$个producer的第$i$时刻，容量为1。最后从第$N$个点的每一个时刻连到一个超级汇点，容量为无穷大。然后跑个最大流就行了。

```cpp
#include <bits/stdc++.h>

#define all(x) (x).begin(),(x).end()
#define sz(x) int(x.size())

using namespace std;
using ll = long long;
using pii = pair<int, int>;
template<typename... T> void rd(T&... args) {((cin>>args), ...);}
template<typename... T> void wr(T... args) {((cout<<args<<" "), ...); cout<<'\n';}

// indexed from 0!
struct Flow {
    static constexpr int INF = 1e9;
    int n;
    struct Edge {
        int to, cap;
        Edge(int to, int cap) : to(to), cap(cap) {}
    };
    std::vector<Edge> e;
    std::vector<std::vector<int>> g;
    std::vector<int> cur, h;
    Flow(int n) : n(n), g(n) {}
    bool bfs(int s, int t) {
        h.assign(n, -1);
        std::queue<int> que;
        h[s] = 0;
        que.push(s);
        while (!que.empty()) {
            int u = que.front();
            que.pop();
            for (int i : g[u]) {
                auto [v, c] = e[i];
                if (c > 0 && h[v] == -1) {
                    h[v] = h[u] + 1;
                    if (v == t) return true;
                    que.push(v);
                }
            }
        }
        return false;
    }
    int dfs(int u, int t, int f) {
        if (u == t) return f;
        int r = f;
        for (int &i = cur[u]; i < int(g[u].size()); ++i) {
            int j = g[u][i];
            auto [v, c] = e[j];
            if (c > 0 && h[v] == h[u] + 1) {
                int a = dfs(v, t, std::min(r, c));
                e[j].cap -= a;
                e[j ^ 1].cap += a;
                r -= a;
                if (r == 0) return f;
            }
        }
        return f - r;
    }
    void addEdge(int u, int v, int c) {
        g[u].push_back(e.size());
        e.emplace_back(v, c);
        g[v].push_back(e.size());
        e.emplace_back(u, 0);
    }
    int maxFlow(int s, int t) {
        int ans = 0;
        while (bfs(s, t)) {
            cur.assign(n, 0);
            ans += dfs(s, t, INF);
        }
        return ans;
    }
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k, m;
    cin>>n>>k>>m;
    Flow mf(n*k+2);
    for (int i=0; i<m; i++) {
        int x, y;
        cin>>x>>y;
        x--, y--;
        for (int j=0; j<k; j++) {
            mf.addEdge(x*k+j, y*k+(j+1)%k, 1);
        }
    }
    for (int i=0; i<k; i++) mf.addEdge(n*k, i*k+i, 1);
    for (int i=0; i<k; i++) mf.addEdge((n-1)*k+i, n*k+1, 1e9);
    cout<<mf.maxFlow(n*k, n*k+1);
    return 0;
}
```

## C. Free Food

暴力标记每一天即可

## D. Hoppers

如果有长度为奇数的环的话并且整个网络连通就能传播到整个网络。所以只少检查每个连通分量是不是二分图并计算连通分量的个数就行了。

队友写的所以没有代码QAQ

## E. Largest Triangle

这题过于经典，网上应该有很多题解。

## G. Non-Prime Factors

先预处理答案，类似筛法的思路：如果不是质数就把它的倍数们的答案加1,质数就把它的倍数们标记成合数。$O(1)$输出询问即可。快读貌似不是很有必要。

```cpp
#include <bits/stdc++.h>

#define all(x) (x).begin(),(x).end()
#define sz(x) int(x.size())

using namespace std;
using ll = long long;
using pii = pair<int, int>;
template<typename... T> void rd(T&... args) {((cin>>args), ...);}
template<typename... T> void wr(T... args) {((cout<<args<<" "), ...); cout<<'\n';}

namespace IO {
const int MAXSIZE = 1 << 20;
char buf[MAXSIZE], *p1, *p2;
#define gc()                                                               \
  (p1 == p2 && (p2 = (p1 = buf) + fread(buf, 1, MAXSIZE, stdin), p1 == p2) \
       ? EOF                                                               \
       : *p1++)
inline int rd() {
  int x = 0, f = 1;
  char c = gc();
  while (!isdigit(c)) {
    if (c == '-') f = -1;
    c = gc();
  }
  while (isdigit(c)) x = x * 10 + (c ^ 48), c = gc();
  return x * f;
}
char pbuf[1 << 20], *pp = pbuf;
inline void push(const char &c) {
  if (pp - pbuf == 1 << 20) fwrite(pbuf, 1, 1 << 20, stdout), pp = pbuf;
  *pp++ = c;
}
inline void write(int x) {
  static int sta[35];
  int top = 0;
  do {
    sta[top++] = x % 10, x /= 10;
  } while (x);
  while (top) push(sta[--top] + '0');
}
}  //
const int N=2e6;
int ans[N+1];
bool not_prime[N+1];
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q=IO::rd();

    for (int i=2; i<=N; i++) {
        if (!not_prime[i]) {
            for (int j=i+i; j<=N; j+=i)
                not_prime[j]=1;
        } else {
            for (int j=i; j<=N; j+=i) {
                ans[j]++;
            }
        }
    }
    while (q--) {
        int x=IO::rd();
        printf("%d\n", ans[x]+1);
    }
    return 0;
}
```

## J. SG Coin

其实就是个取模下的减法。。。

## L. Wi Know

首先我们观察到：对于$i<j<k, S_i=S_j=S_k$，$(S_i, S_k)$一定不差于$(S_j, S_k)$。所以在$A, B, A, B$ 中第一个A我们一定选在$S$中第一次出现的A。同理，第二个B一定选$S$中最后一出现的B。

解法的大致思路就是固定B找最小的A。一种比较naive的思路是在$[i+1, last_i-1]$中查询最小值，但有两个问题：

1. 不知道最小值在$i$之前有没有出现过。
2. 最小值可能等于$S_i$。

所以我们不能一次把所有的数都放到线段树里，要按一定的顺序放。对于每个位置$i$，我们记录一个$nxt_i$为$S_i$的下一个出现位置。然后我们遍历$S$，首先查询$[i+1, last_i-1]$中的最小值min，然后用`{min, S[i]}`更新答案，最后在线段树中把$next_i$设为$S_i$。

这样为什么避免了上面的两个问题呢？首先，只有在$i$之前出现过的数才会被加进去，避免了问题1，然后我们是先查询再添加，而且一次只加一个，这样就避免问题2。总之这个解法还是很妙的，比官方题解简单不少。

```cpp
#include <bits/stdc++.h>

#define all(x) (x).begin(),(x).end()
#define sz(x) int(x.size())

using namespace std;
using ll = long long;
using pii = pair<int, int>;
template<typename... T> void rd(T&... args) {((cin>>args), ...);}
template<typename... T> void wr(T... args) {((cout<<args<<" "), ...); cout<<'\n';}

struct SegTree{
    int n;
    vector<int> t;
    SegTree(int n_):n(n_),t(4*n, 1e9){}
    void pushup(int node){
        t[node]=min(t[node<<1],t[node<<1|1]);
    }
    void update(int node,int i,int x,int l,int r){
        if(l==r){
            t[node]=x;
            return;
        }
        int mid=(l+r)/2;
        if(i<=mid) update(node<<1,i,x,l,mid);
        else update(node<<1|1,i,x,mid+1,r);
        pushup(node);
    }
    void update(int i, int x) {
        update(1, i, x, 0, n-1);
    }
    int query(int node,int ql,int qr,int l,int r){
        if (ql > r || qr < l) return 1e9;
        if(ql<=l&&qr>=r){
            return t[node];
        }
        int mid=(l+r)>>1;
        return min(query(node<<1,ql,qr,l,mid), query(node<<1|1,ql,qr,mid+1,r));
    }
    int query(int l, int r) {
        return query(1, l, r, 0, n-1);
    }
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    vector<int> a(n);
    vector<int> pos(n+1, -1), nxt(n, -1), last(n+1, -1);
    for (int i=0; i<n; i++) {
        cin>>a[i];
        last[a[i]]=i;
    }
    for (int i=n-1; i>=0; i--) {
        nxt[i]=pos[a[i]];
        pos[a[i]]=i;
    }
    pair<int, int> ans={n+1, n+1};
    SegTree st(n);
    for (int i=0; i<n; i++) {
        int x=st.query(i+1, last[a[i]] - 1);
        ans=min(ans, { x, a[i] });
        st.update(nxt[i], a[i]);
    }
    if (ans.first<=n) cout<<ans.first<<' '<<ans.second<<'\n';
    else cout << -1;
    return 0;
}
```
