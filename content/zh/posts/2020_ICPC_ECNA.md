---
title: 2020 ICPC East Central NA Regional Contest 总结与题解
date: 2021-03-10
categories: [题解]
tags: [Contests]
layout: post
math: true
---

算是有所进步但还是稍有遗憾，差一题就能进division championships. 

更新：所有7题队都以wildcard的身份晋级<abbr title="North America Division Championships">NADC</abbr>了，而且如果本学校只有wildcard队的话，会被分到最弱的central division，然后我们又莫名其妙的拿了个第6，晋级<abbr title="North America Championships">NAC</abbr>了:joy:


<!--more-->

## 比赛过程

两个队友一个简称T，一个简称J。

开场我从前往后读，A比较长就直接跳过了，读了B感觉有点想法但又不是很确定就接着读，C很明显是个找最大环，一开始还觉得比较麻烦，但想想不是环就是链所以直接dfs就行了。同时队友J读到E发现就是个矩阵乘法于是开始写，我又跟榜做了G。之后不久队友J的E也过了。另一个队友T读了H是贪心但不会写，我此时在写B的暴力（但其实稍微想想暴力肯定超时但不知道为啥还是写完了）。B暴力写完才发现会超时，此时H还没做出来，我看了一眼也没想法，就扔给队友J了。然后发现B好像可以dp，然后就一边想一边写，虽然有点恶心但挺直接的，最后一遍过。写B的过程中队友J过了H，算是签完到了。此时才一个半小时，感觉非常好，比去年顺利多了。

然后我在做K，感觉是dp，有点思路但不会写，队友J在做J，过了样例但是WA，队友T直接开I了（其实是最难的题orz）。于是三个人都卡题了，不知不觉过了一个半小时我终于放弃了，此时J题过了一大堆，于是我就跟队友J换了一下题，由于队友J用的python而我又懒的看所以就准备重写，然后没想到是个超级恶心模拟题，而且写了一堆bug，离结束还有半小时和队友J几乎同时过了J和K。然后仔细一看A发现很简单但输出格式很恶心，最后虽然勉强写完但没时间debug，以7题收场。

## 反思

卡题太久没有及时放弃，哪怕去读读别的题。题没有都读一遍，队友J其实读了A但感觉很麻烦，但我感觉比J好做多了（可能我J写的太烂了）。L到最后也没人读，其实也不难，就是个二分图匹配的板子 题。所以说也不能一味的跟榜，毕竟每个人的知识点覆盖不一样。但K卡半天没做出来也不应该。

## 题解

### A

数据很小，找lca直接暴力网上跳也可以。输出格式比较恶心，要多看几遍，注意不要把`11th, 12th, 13th`输出成 `11st, 12nd, 13rd`。

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
    int n, T;
    cin>>n>>T;
    vector<vector<string>> a(n);
    vector<string> name(n);
    unordered_map<string, int> id;
    for (int i=0; i<n; i++) {
        cin>>name[i];
        id.try_emplace(name[i], id.size());
        int x;
        cin>>x;
        a[i].resize(x);
        for (auto& s : a[i]) {
            cin>>s;
            id.try_emplace(s, id.size());
        }
    }
    vector<vector<int>> g(id.size());
    vector<int> ind(id.size());
    for (int i=0; i<n; i++) {
        int u=id[name[i]];
        for (auto& s : a[i]) {
            g[u].push_back(id[s]);
            ind[id[s]]++;
        }
    }
    vector<int> pa(id.size());
    vector<int> dep(id.size());
    auto dfs=[&](auto& dfs, int u, int p) -> void {
        pa[u] = p;
        for (auto v : g[u]) {
            if (v == p) continue;
            dep[v]=dep[u]+1;
            dfs(dfs, v, u);
        }
    };

    auto lca=[&](int x, int y) {
        while (x!=y) {
            if (dep[x]<dep[y]) swap(x, y);
            x=pa[x];
        }
        return x;
    };

    for (int i=0; i<id.size(); i++) {
        if (ind[i]==0) {
            dfs(dfs, i, i);
            break;
        }
    }
    auto ordinal=[](int x) {
        auto s=to_string(x);
        if (x>=11 && x<=13) return s+"th";
        if (x%10==1) return s+"st";
        if (x%10==2) return s+"nd";
        if (x%10==3) return s+"rd";
        return s+"th";
    };
    while (T--) {
        string s, t;
        cin>>s>>t;
        int l=lca(id[s], id[t]);
        int m=dep[id[s]]-dep[l];
        int n=dep[id[t]]-dep[l];
        int swaped=0;
        if (m>n) {
            swap(m, n);
            swaped=1;
            swap(s, t);
        }
        if (m==0) {
            swap(s, t);
            if (n==1) {
                cout<<s<<" is the child of "<<t<<'\n';
            } else {
                n-=2;
                cout<<s<<" is the ";
                for (int i=0; i<n; i++) cout<<"great ";
                cout<<"grandchild of "<<t<<'\n';
            }
        } else if (m==n && m>0) {
            if (swaped) swap(s, t);
            if (n==1) cout<<s<<" and "<<t<<" are siblings\n";
            else {
                n--;
                cout<<s<<" and "<<t<<" are "<<ordinal(n)<<" cousins\n";
            }
        } else if (n>m && m>0) {
            if (swaped) swap(s, t);
            if (n-m==1)
                cout<<s<<" and "<<t<<" are "<< ordinal(m-1)<<" cousins, 1 time removed\n";
            else 
                cout<<s<<" and "<<t<<" are "<<ordinal(m-1)<<" cousins, "<<n-m<<" times removed\n";
        }
    }
        return 0;
}
```

### B

`dp[x][y][i][used][d]` 代表是否存在以坐标 $(x, y)$ 的字符结尾，覆盖目标字符串的前`i`个字符，转向`used`次，结束时的方向是`d`的走法。注意长度为$i$的字符串最多转$i-1$次，虽然第一个字符是没有方向的，但为了转移方便就变成了所有方向，所以枚举转向次数的话要限制一下，不然会出现长度为2转两次的走法。

```cpp
#include <bits/stdc++.h>

#define all(x) (x).begin(),(x).end()
#define sz(x) int(x.size())

using namespace std;
using ll = long long;
using pii = pair<int, int>;
template<typename... T> void rd(T&... args) {((cin>>args), ...);}
template<typename... T> void wr(T... args) {((cout<<args<<" "), ...); cout<<'\n';}

int dp[10][10][105][105][8];
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin>>n>>m;
    vector a(n, vector<char>(m));
    for (int i=0; i<n; i++) {
        for (int j=0; j<m; j++) {
            cin>>a[i][j];
        }
    }
    int limit;
    string s;
    cin>>limit>>s;
    limit=min(limit, int(s.size()));
    const vector<pair<int, int>> dirs{{1, 0}, {-1, 0}, {0,1}, {0, -1}, {1, 1}, {1, -1}, {-1, 1}, {-1, -1}};
    for (int i=0; i<n; i++) {
        for (int j=0; j<m; j++) {
            if (a[i][j]==s[0]) {
                for (int d=0; d<8; d++) 
                    dp[i][j][0][0][d]=1;
            }
        }
    }
    for (int i=1; i<s.size(); i++) {
        for (int x=0; x<n; x++) {
            for (int y=0; y<m; y++) {
                if (a[x][y]!=s[i]) continue;
                for (int used=0; used<=min(limit, i-1); used++) {
                    for (int d=0; d<8; d++) {
                        for (int pd=0; pd<8; pd++) {
                            auto [dx, dy]=dirs[d];
                            unsigned nx=x+dx, ny=y+dy;
                            int pused=used-(d!=pd);
                            // if (i==1) pused=0;
                            if (nx<n && ny<m && pused>=0 && dp[nx][ny][i-1][pused][pd]) {
                                dp[x][y][i][used][d]=1;
                            }
                        }
                    }
                }
            }
        }
    }
    for (int i=0; i<n; i++) {
        for (int j=0; j<m; j++) {
            for (int d=0; d<8; d++)
                if (dp[i][j][s.size()-1][limit][d]) 
                    return cout<<"Yes", 0;
        }
    }
    cout<<"No";
    return 0;
}
```

### C

由于每个物品最多只有一个人要，所以每个点的出度最多为1，所以每个连通分量要么是环要么是链。直接dfs即可。

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
    int n;
    cin>>n;
    vector<vector<int>> g(n);
    struct node {
        string name, has, wants;
    };
    vector<node> a(n);
    unordered_map<string, int> names, toys;
    unordered_map<string, string> wanted_by;
    for (auto& [name, has, wants] : a) {
        cin>>name>>has>>wants;
        names.try_emplace(name, names.size());
        toys.try_emplace(has, toys.size());
        toys.try_emplace(wants, toys.size());
        wanted_by[wants]=name;
    }
    for (int i=0; i<n; i++) {
        if (wanted_by.count(a[i].has))
            g[i].push_back(names[wanted_by[a[i].has]]);
    }
    vector<int> vis(n);
    int ans=0;
    auto dfs=[&](auto& dfs, int u, int dep) -> void{
        vis[u]=1;
        for (auto v : g[u]) {
            if (vis[v]==1) {
                ans=max(ans, dep+1);
            } else {
                dfs(dfs, v, dep+1);
            }
        }
        vis[u]=2;
    };
    for (int i=0; i<n; i++) {
        if (!vis[i]) {
            dfs(dfs, i, 0);
        }
    }
    if (ans) cout<<ans;
    else cout<<"No trades possible";
    return 0;
}
```

### D

还没来得及补

### E

非常简单的矩阵乘法，队友写的，没要代码。。。

### F

矩阵求逆，模运算下的高斯消元。队友赛后补的

```cpp
using namespace std;
#include <bits/stdc++.h>
#include <string>
#define ll long long
#define all(x) (x).begin(),(x).end()
#define sz(x) int(x.size())
#define rep(i, a, b) for(int i = a; i < (b); ++i)
#define FOR(i,n) for(int (i)=0;(i)<(n);++(i))
#define PRE(i,m,n,in) for(int (i)=(m);(i)<(n);i+=in)
#define RPRE(i,m,n,in) for(int (i)=(m);(i)>=(n);i-=in)
#define srt(v) sort(v.begin(),v.end())
#define printv(a) printa(a,0,a.size())
#define debug(x) cout<<#x" = "<<(x)<<endl
#define printa(a,L,R) for(int i=L;i<R;i++) cout<<a[i]<<(i==R-1?"\n":" ")
#define printv(a) printa(a,0,a.size())
#define print2d(a,r,c) for(int i=0;i<r;i++) for(int j=0;j<c;j++) cout<<a[i][j]<<(j==c-1?"\n":" ")
typedef vector<string>VS;
typedef pair<int,int>pii;
typedef pair<ll,ll>pll;
typedef vector<ll>VL;
typedef vector<int>VI;
typedef vector<VI>VVI;
typedef vector<VL>VVL;
typedef vector<pii>VII;

const int MOD = 37;
const int INF = 2; 

int gauss (vector < vector<int> > &a, vector<int> & ans, const vector<ll>&inv) {
  int n = (int) a.size(); int m = (int) a[0].size() - 1;
  vector<int> where (m, -1);
  for (int col=0, row=0; col<m && row<n; ++col) {
    int sel = row;
    for (int i=row; i<n; ++i)
      if ( a[i][col] > a[sel][col]) sel = i;
    if (a[sel][col] == 0) continue;
    for (int i=col; i<=m; ++i)
      swap (a[sel][i], a[row][i]);
    where[col] = row;
    for (int i=0; i<n; ++i) 
      if (i != row) {
        int c = (a[i][col] * inv[a[row][col]]) % MOD;
        for (int j=col; j<=m; ++j)
          a[i][j] = (a[i][j] - (a[row][j]*c % MOD) + MOD) % MOD;
      }
    ++row;
  }

  ans.assign (m, 0);
  for (int i=0; i<m; ++i)
    if (where[i] != -1)
      ans[i] = (a[where[i]][m] * inv[a[where[i]][i]]) % MOD;
  for (int i=0; i<n; ++i) {
    int sum = 0;
    for (int j=0; j<m; ++j)
      sum = (MOD + sum + (ans[j] * a[i][j]) % MOD) % MOD;
    if (abs (sum - a[i][m]) != 0)
      return 0;
  }
  for (int i=0; i<m; ++i)
    if (where[i] == -1) return INF;
  return 1;
}


int main() {
  ios_base::sync_with_stdio(false);
  cin.tie(NULL);
  string ns; getline(cin, ns); int n = stoi(ns);
  string s1; getline(cin, s1); 
  string s2; getline(cin, s2);
  vector<ll> inv(MOD);
  inv[1]=1;
  for(int i = 2; i < MOD; ++i) inv[i] = MOD - (MOD/i) * inv[MOD % i] % MOD;
  vector< vector <int> > v1( n , vector <int> ()); 
  vector< vector <int> > v2( n , vector <int> ()); 
  for(int i = 0; i < s1.size(); i++) {
    int num;
    if(s1[i] >= 'A' && s1[i] <= 'Z') {
      num = int(s1[i]) - 65;
    }
    else if(s1[i] == ' ') num = 36;
    else num = (s1[i] - '0') + 26;
    v1[i % n].push_back(num);
  }  
  for(int i = 0; i < s2.size(); i++) {
    int num;
    if(s2[i] >= 'A' && s2[i] <= 'Z') {
      num = int(s2[i]) - 65;
    }
    else if(s2[i] == ' ') num = 36;
    else num = (s2[i] - '0') + 26;
    v2[i % n].push_back(num);
  }
  int consistent = 0;
  int many = 0;
  int no = 0;
  vector <vector <int> > sol;
  for(int i = 0; i < n; i++) {
    vector<vector<int>>a(v1[0].size(), vector<int>(n + 1));
    vector<int>b(n);
    for(int j = 0; j < v1[0].size(); j++) {
      for(int k = 0; k < n; k++) {
        a[j][k] = v1[k][j];
      }
      a[j][n] = v2[i][j]; 
    }
    vector<int>ans;
    int num = gauss(a, ans, inv);
    if(num == 0) no++;
    else if(num == 1) {
      consistent++;
      sol.push_back(ans);
    }
    else many++;
  }
  if(consistent == n) print2d(sol, n, n);
  else if(no >= 1)cout << "No solution" << endl;
  else if(many >= 1) cout << "Too many solutions" << endl;
  return 0;
}
```

### G

直接模拟即可

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
    int n, m;
    cin>>n>>m;
    vector<int> a(n), rank(n);
    iota(all(a), 0);
    iota(all(rank), 0);
    while (m--) {
        char c;
        int u, v;
        cin>>c>>u>>c>>v;
        u--, v--;
        if (rank[u]>rank[v]) {
            for (int i=rank[v]; i<rank[u]; i++) {
                a[i]=a[i+1];
                rank[a[i]]=i;
            }
            a[rank[u]+1]=v;
            rank[v]=rank[u]+1;
        }
    }
    for (auto i : a) cout<<"T"<<i+1<<' ';
    return 0;
}
```

### H

根据deadline排序，然后维护有多少槽位可供不需要纸的和需要纸的人用（代码里的`have`数组）,不需要纸的人也可以用需要纸的人的槽位。然后根据人数相应的更新数组。

队友的赛时的源代码

```python
from collections import *
from functools import *
from math import *
import sys

input = sys.stdin.readline
sys.setrecursionlimit(2147483647)
ml = lambda: map(int, input().split())

s, n = ml()
people = defaultdict(lambda: [0, 0])
for _ in range(n):
    deadline, need = input().split()
    deadline = int(deadline)
    people[deadline][need[0] == "y"] += 1

have = [0, 0]
prev = 0
for deadline in sorted(people.keys()):
    have[1] += deadline - prev
    have[0] += (deadline - prev) * (s - 1)
    prev = deadline

    dont, need = people[deadline]

    do = min(dont, have[0])
    dont -= do
    have[0] -= do

    if dont + need > have[1]:
        print("No")
        break
    have[1] -= dont + need
else:
    print("Yes")
```

我用C++又写了一遍:

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
    int s, n;
    cin>>s>>n;
    map<int, array<int, 2>> people;
    for (int i=0; i<n; i++) {
        int deadline;
        char need;
        cin>>deadline>>need;
        people[deadline][need=='y']++;
    }
    ll have[2]{};
    int prev=0;
    for (auto& [deadline, v] : people) {
        have[1]+=deadline-prev;
        have[0]+=ll(deadline-prev)*(s-1);
        prev=deadline;

        auto [dont, need]=v;

        int Do=min<ll>(dont, have[0]);
        dont-=Do;
        have[0]-=Do;
        if (dont+need>have[1]) {
            return cout<<"No\n", 0;
        }
        have[1]-=dont+need;
    }
    cout<<"Yes\n";
    return 0;
}
```
### I

还没补

### J

根据题意模拟即可

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
    vector a(9, vector(9, 0));
    for (auto& v: a) for (auto& i : v) cin>>i;
    auto check_row=[&](int row, auto& cnt, int x) {
        for (int i=0; i<9; i++) {
            cnt[row][i][x]=0;
        }
    };
    auto check_col=[&](int col, auto& cnt, int x) {
        for (int i=0; i<9; i++) {
            cnt[i][col][x]=0;
        }
    };
    auto check_grid=[&](int r, int c, auto& cnt, int x) {
        int num=r/3*3+c/3;
        r=num/3*3, c=num%3*3;
        for (int i=r; i<r+3; i++) {
            for (int j=c; j<c+3; j++) {
                cnt[i][j][x]=0;
            }
        }
    };
    auto count_row=[&](int row, auto& cnt, int x) {
        int c=0;
        for (int i=0; i<9; i++) {
            if (a[row][i]) continue;
            c+=cnt[row][i][x];
        }
        return c;
    };
    auto count_col=[&](int col, auto& cnt, int x) {
        int c=0;
        for (int i=0; i<9; i++) {
            if (a[i][col]) continue;
            c+=cnt[i][col][x];
        }
        return c;
    };
    auto count_grid=[&](int r, int c, auto& cnt, int x) {
        int num=r/3*3+c/3;
        r=num/3*3, c=num%3*3;
        int cc=0;
        for (int i=r; i<r+3; i++) {
            for (int j=c; j<c+3; j++) {
                if (a[i][j]) continue;
                cc+=cnt[i][j][x];
            }
        }
        return cc;
    };
    while (true) {
        int found=0;
        vector cnt(9, vector(9, vector(10, 1)));
        for (int i=0; i<9; i++) {
            for (int j=0; j<9; j++) {
                cnt[i][j][0]=0;
                if (a[i][j]!=0) {
                    check_col(j, cnt, a[i][j]);
                    check_row(i, cnt, a[i][j]);
                    check_grid(i, j, cnt, a[i][j]);
                }
            }
        }
        for (int i=0; i<9; i++) {
            for (int j=0; j<9; j++) {
                if (a[i][j]==0) {
                    if (count(all(cnt[i][j]), 1)==1) {
                        found=1;
                        auto it=find(all(cnt[i][j]), 1);
                        a[i][j]=it-cnt[i][j].begin();
                        goto next;
                    }
                    for (int v=1; v<=9; v++) {
                        if ((count_col(j, cnt, v)==1 || count_row(i, cnt, v)==1 || count_grid(i, j, cnt, v)==1) && cnt[i][j][v]) {
                            found=1;
                            a[i][j]=v;
                            goto next;
                        }
                    }
                }
            }
        }
next:
        if (found==0) break;
    }
    int cc=0;
    for (auto& v : a) for (auto i : v) cc+=i==0;
    if (cc) {
        cout<<"Not easy\n";
        for (auto& v : a) {
            for (auto& i : v) {
                if (i==0) cout<<'.';
                else cout<<i;
                cout<<' ';
            }
            cout<<'\n';
        }
    } else {
        cout<<"Easy\n";
        for (auto& v : a) {
            for (auto i : v) cout<<i<<' ';
            cout<<'\n';
        }
    }
    return 0;
}
```

### K

我们可以用一次实验把当前问题变成两个更小的子问题，假设当前的最大高度是`h`, 还剩`n`个pallet，如果我们用`x`个箱子试一次，如果pallet坏了的话那么问题就变成了：最大高度为`h-1`, 还剩`n-1`个pallet；如果没坏的话问题就变成了高度为`h-x`，还剩`x`个pallet。所以我们可以用dp。求范围的过程与dp类似。

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
    int n, m;
    cin>>n>>m;
    vector need(n+1, vector(m+1, 0));
    for (int i=0; i<=n; i++) need[i][1]=i;

    for (int i=1; i<=n; i++) {
        for (int pallet=2; pallet<=m; pallet++) {
            int mn=n+1;
            for (int j=1; j<=i; j++) {
                int v1=need[j-1][pallet-1], v2=need[i-j][pallet];
                mn=min(mn, max(v1, v2));
            }
            need[i][pallet]=mn+1;
        }
    }
    int l=n, r=0;
    int ans=need[n][m];
    for (int i=1; i<=n; i++) {
        if (max(need[i-1][m-1], need[n-i][m])+1==ans){
            l=min(l, i);
            r=max(r, i);
        }
    }
    cout<<ans<<' ';
    if (l==r) cout<<l;
    else cout<<l<<'-'<<r;
    return 0;
}
```

队友的二分做法：（和扔鸡蛋问题类似）

```python
from collections import *
from functools import *
from math import *
import sys

input = sys.stdin.readline
sys.setrecursionlimit(2147483647)
ml = lambda: map(int, input().split())

def binomialCoeff(x, n, k):
    sum = 0
    term = 1
    i = 1
    while (i <= n and sum < k):
        term *= x - i + 1
        term /= i
        sum += term
        i += 1
    return sum

def minTrials(eggs, floors):
    if eggs == 0:
        return floors and inf
    low = 1
    high = floors

    while low < high:
        mid = low + high >> 1
        if binomialCoeff(mid, eggs, floors) < floors:
            low = mid + 1
        else:
            high = mid

    return low

def findX(eggs, floors):
    low = 1
    high = floors

    while low < high:
        mid = low + high >> 1
        if minTrials(eggs, floors - mid) <= ans - 1:
            high = mid
        else:
            low = mid + 1

    return low


def findY(eggs, floors):
    low = 1
    high = floors

    while low < high:
        mid = low + high + 1 >> 1
        if minTrials(eggs - 1, mid - 1) <= ans - 1:
            low = mid
        else:
            high = mid - 1

    return low

# range: x to y
floors, eggs = ml()
n = floors
m = eggs
# worst case: doesn't break on x and breaks on y
# find smallest x s.t. minTrials(floors - x, eggs) <= ans - 1
# find biggest y s.t. minTrials(y - 1, eggs - 1) <= ans - 1

ans = minTrials(eggs, floors)
x = findX(eggs, floors)
y = findY(eggs, floors)

if x == y:
    print(ans, x)
else:
    print(ans, str(x) + "-" + str(y))
```

### L

可以观察到一定是上面的几个门用A通道，剩下下面的用B通道，所以可以枚举A和B分界的位置，然后剩下的问题就是公寓匹配门、门匹配工作站了，跑两次二分图最大权匹配即可。之前做过匹配的题的话这题应该是很简单的，可以当时没人读到，但队友读了也不一定能反应过来是匹配问题233。

```cpp
#include <bits/stdc++.h>

#define all(x) (x).begin(),(x).end()
#define sz(x) int(x.size())

using namespace std;
using ll = long long;
using pii = pair<int, int>;
template<typename... T> void rd(T&... args) {((cin>>args), ...);}
template<typename... T> void wr(T... args) {((cout<<args<<" "), ...); cout<<'\n';}

template<typename T>
class Hungarian {
public:
    int n, m;
    vector< vector<T> > a;
    vector<T> u, v;
    vector<int> pa, pb, way;
    vector<T> minv;
    vector<bool> used;
    T inf;
    Hungarian(int _n, int _m) : n(_n), m(_m), a(n, vector<T>(m)), u(n+1), v(m+1), pa(n+1, -1), pb(m+1, -1), way(m, -1), minv(m), used(m+1) {
        assert(n <= m);
        inf = numeric_limits<T>::max();
    }
    inline void add_row(int i) {
        fill(minv.begin(), minv.end(), inf);
        fill(used.begin(), used.end(), false);
        pb[m] = i;
        pa[i] = m;
        int j0 = m;
        do {
            used[j0] = true;
            int i0 = pb[j0];
            T delta = inf;
            int j1 = -1;
            for (int j = 0; j < m; j++) {
                if (!used[j]) {
                    T cur = a[i0][j] - u[i0] - v[j];
                    if (cur < minv[j]) {
                        minv[j] = cur;
                        way[j] = j0;
                    }
                    if (minv[j] < delta) {
                        delta = minv[j];
                        j1 = j;
                    }
                }
            }
            for (int j = 0; j <= m; j++) {
                if (used[j]) {
                    u[pb[j]] += delta;
                    v[j] -= delta;
                } else {
                    minv[j] -= delta;
                }
            }
            j0 = j1;
        } while (pb[j0] != -1);
        do {
            int j1 = way[j0];
            pb[j0] = pb[j1];
            pa[pb[j0]] = j0;
            j0 = j1;
        } while (j0 != m);
    }
    inline T current_score() {
        return -v[m];
    }
    inline T solve() {
        for (int i = 0; i < n; i++) {
            add_row(i);
        }
        return current_score();
    }
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    vector g1(n, vector(2*n, 0));
    auto g2=g1;
    for (auto& v : g1)
        for (auto& i : v) cin>>i;
    for (auto& v : g2)
        for (auto& i : v) cin>>i;
    int mn_cost=1e9;
    vector<array<int, 3>> ans(n);
    for (int i=-1; i<n; i++) {
        vector ng1(n, vector(n, 0));
        auto ng2=ng1;
        for (int j=0; j<n; j++) {
            for (int u=0; u<n; u++) {
                ng1[u][j]=g1[u][j*2+(j>i)];
                ng2[u][j]=g2[u][j*2+(j>i)];
            }
        }
        Hungarian<int> h1(n, n), h2(n, n);
        h1.a=ng1, h2.a=ng2;
        if (int cur=h1.solve() + h2.solve(); cur <mn_cost) {
            mn_cost=cur;
            for (int j=0; j<n; j++) {
                ans[j]={j, h1.pa[j]*2+(h1.pa[j]>i),h2.pb[h1.pa[j]]};
            }
        }
    }
    cout<<mn_cost<<'\n';
    for (auto [x, y , z] : ans) {
        cout<<x+1<<' '<<y/2+1<<char('A'+y%2)<<' '<<z+1<<'\n';
    }
    return 0;
}
```
