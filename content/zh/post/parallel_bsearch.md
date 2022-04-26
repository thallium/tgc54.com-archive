---
title: "整体二分学习笔记"
date: 2021-06-05T12:36:59-04:00
categories: [算法笔记]
tags: [整体二分,离线技巧,二分]
---

整体二分在国外称为parallel binary search，是一种用于同时解决大量二分搜索的**离线算法**。 
<!--more-->

## 适用问题的描述

一种常见的类型是：给出多个修改与询问，每个询问有一个目标，问多少个修改之后目标可以达到。修改和询问需要满足以下性质：

- 询问的答案可以二分（废话）
- 修改对目标的贡献互相独立
- 修改对目标的贡献与目标无关

当然不是所有问题都要严格符合这种形式，整体二分的本质就是将询问归类，一起处理归类在一起询问。

## 思路

1. 假设当前有一些询问的答案在某个区间中，我们将区间一分为二
2. 应用某一些修改，这些修改是可以帮助我们判断答案在在哪一半区间的修改
3. 判断这些询问是否达到目标，将询问分为达到目标和没达到目标两个集合，同时可能会修改没达到目标的询问的目标（这一步要具体问题具体分析）
4. 撤销步骤2中的修改
5. 分别递归左右两个区间

## 例题

### 多次询问数组第k小

正常的思路是对于每个询问二分一次。但我们也可以所有询问一起二分，根据左半部分的数的个数判断每个询问应该分到哪个集合中。

核心代码如下(简洁起见没用离散化, `query[i]`是第i个询问的k值，`sum(l, r)`是在[l, r]区间中的数的个数)

```cpp
void solve(int l, int r, vector<int> id) {
    if (l==r || id.empty()) {
        for (auto i : id) ans[i]=l;
        return;
    }
    vector<int> less, more;
    int mid=(l+r)/2;
    for (auto i : id) {
        if (query[i]<=sum(l, mid)) less.push_back(i);
        else {
            query[i]-=sum(l, mid);
            more.push_back(i);
        }
    }
    solve(l, mid, less);
    solve(mid+1, r, more);
}
```

### 静态数组区间第k小

[题目链接](https://www.luogu.com.cn/problem/P3834)

这题的一般做法是在可持久化线段树（主席树）上二分，并且可以在线回答询问。整体二分思路有相似也有不同，假设目前询问的区间是$[ql, qr]$,答案在$[l, r]$中，令$mid=(l+r)/2$，此时我们新建一个和原数组一样长的辅助数组，将整个数组中在$[l, mid]$中的数在辅助数组中各自的位置上+1，然后查询位置在$[ql, qr]$中的数的个数（也就是辅助数组中$[ql, qr]$的区间和），与k做比较并由此判断再往哪个区间继续二分。

这里要注意要是每次构建辅助数组的时候都扫过整个数组，时间会爆炸，所以我们可以像划分询问那样划分数组，这样添加的数都是在$[l, r]$中的数。

**关于划分的写法：**

常见的写法是用两个数组存左边和右边的询问，但其实可以直接利用`std::partition`或者`std::stable_partition`直接在原数组上划分，内存和时间上都更优（时间少10%左右，内存少30%左右），而且个人感觉写起来更简洁一些？后面所有题都有partition的写法，部分有数组的写法，选择自己喜欢的即可。

{{% collapse "代码" %}}
```cpp
#include <bits/stdc++.h>

using namespace std;

#define all(x) (x).begin(),(x).end()

constexpr int M=3e5;
namespace fenwick {
  int n;
  int t[M];

    using T=int;
  void update(int i, T x) {
    while (i < n) {
      t[i] += x;
      i |= (i + 1);
    }
  }


  template <typename U> U query(int i) {
    U res{};
    for (; i >= 0; i = (i & (i + 1)) - 1)
      res += t[i];
    return res;
  }

  template <typename U>
  U query(int l, int r) { return query<U>(r) - (l ? query<U>(l - 1) : U{}); }
};
struct Num{
    int x, i;
};

struct Query {
    int l, r, k, id;
};
int main() {
    cin.tie(nullptr)->sync_with_stdio(false);
    int n, q;
    cin>>n>>q;
    vector<Num> a(n);
    vector<int> comp(n), aa(n);
    for (int i=0; i<n; i++) {
        cin>>aa[i];
        comp[i]=aa[i];
    }
    sort(all(comp));
    comp.erase(unique(all(comp)), comp.end()); 
    for (int i=0; i<n; i++) a[i]={static_cast<int>(lower_bound(all(comp), aa[i])-comp.begin()), i}; // 离散化
    vector<Query> Q(q);
    for (int i=0; i<q; i++) {
        auto& [l, r, k, id]=Q[i];
        cin>>l>>r>>k;
        id=i;
        l--, r--;
    }
    fenwick::n=n;
    vector<int> ans(q);
    // abegin 和 aend 是原数组中值在[l, r]中的数的区间， qbegin 和 qend是答案在[l, r]中的询问的区间
    auto solve=[&](auto& solve, int l, int r, auto abegin, auto aend, auto qbegin, auto qend) {
        if (l==r || qbegin==qend) {
            for (auto it=qbegin; it!=qend; ++it) ans[it->id]=l;
            return;
        }
        int mid=(l+r)/2;
        auto amid=partition(abegin, aend, [&](Num& x){ // 划分原数组，并更新树状数组
            if (x.x<=mid) {
                fenwick::update(x.i, 1);
                return true;
            }
            return false;
        });
        auto qmid=partition(qbegin, qend, [&](Query& q) { // 划分询问
            int t=fenwick::query<int>(q.l, q.r);
            if (q.k<=t) return true;
            else {
                q.k-=t;
                return false;
            }
        });
        for (auto it=abegin; it!=amid; ++it) fenwick::update(it->i, -1); // 撤销之前的操作以清空树状数组
        solve(solve, l, mid, abegin, amid, qbegin, qmid);
        solve(solve, mid+1, r, amid, aend, qmid, qend);
    };
    solve(solve, 0, (int)comp.size(), a.begin(), a.end(), Q.begin(), Q.end());
    for (auto x : ans) cout<<comp[x]<<'\n';
}
```
{{% /collapse %}}

### 动态区间第k小

[题目链接](https://www.luogu.com.cn/problem/P2617)

修改无非就是把原来的数删掉（在辅助数组中减1），再加上修改之后的数，和上一题大同小异。区别是由于有了时间顺序，不能像上一题先修改再询问了，要把修改和询问放在一个数组（其实上一题也能放在一个数组里，只是为了方便理解分成了两个数组），而且要用`std::stable_partition`以保证相对时间顺序不变。

{{% collapse "代码1（partition）" %}}
```cpp
#include <algorithm>
#include <bits/stdc++.h>

using namespace std;

#define all(x) (x).begin(), (x).end()

constexpr int M = 3e5;
int N;
int t[M];

using T = int;
void update(int i, T x) {
    while (i < N) {
        t[i] += x;
        i |= (i + 1);
    }
}

template <typename U> U query(int i) {
    U res{};
    for (; i >= 0; i = (i & (i + 1)) - 1)
        res += t[i];
    return res;
}

template <typename U> U query(int l, int r) {
    return query<U>(r) - (l ? query<U>(l - 1) : U{});
}

struct op {
    int type;
    // if type==0, add j to position i, a[i]=k
    // if type==1, query k-th smallest element in [i, j], id is the index of the query
    int i, j, k, id;
};
int main() {
    cin.tie(nullptr)->sync_with_stdio(false);
    int n, q;
    cin >> n >> q;
    vector<op> ops;
    vector<int> comp, a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        comp.push_back(a[i]);
        ops.push_back({0, i, 1, a[i], -1});
    }
    int qcnt = 0;
    for (int i = 0; i < q; i++) {
        char ch;
        cin >> ch;
        if (ch == 'Q') {
            int l, r, k;
            cin >> l >> r >> k;
            ops.push_back({1, l - 1, r - 1, k, qcnt++});
        } else {
            int x, y;
            cin >> x >> y;
            x--;
            ops.push_back({0, x, -1, a[x], -1});
            comp.push_back(y);
            a[x] = y;
            ops.push_back({0, x, 1, y, -1});
        }
    }
    // 离散化
    sort(all(comp));
    comp.erase(unique(all(comp)), comp.end());
    for (auto &[type, i, j, k, id] : ops) {
        if (type == 0) k = lower_bound(all(comp), k) - comp.begin();
    }
    N = n;
    vector<int> ans(qcnt);
    auto solve = [&](auto &solve, int l, int r, auto begin, auto end) {
        if (l == r || begin == end) {
            for (auto it = begin; it != end; ++it)
                if (it->type == 1) ans[it->id] = l;
            return;
        }
        int mid = (l + r) / 2;
        // 因为要保证相对顺序不变所以要用stable_partition
        auto qmid = stable_partition(begin, end, [&](op &q) {
            auto &[type, i, j, k, id] = q;
            if (type == 1) {
                int cnt = query<int>(i, j);
                if (cnt >= k) return true;
                else {
                    k -= cnt;
                    return false;
                }
            } else {
                if (k <= mid) {
                    update(i, j);
                    return true;
                } else
                    return false;
            }
        });
        for (auto it = begin; it != qmid; ++it)
            if (it->type == 0) update(it->i, -it->j);
        solve(solve, l, mid, begin, qmid);
        solve(solve, mid + 1, r, qmid, end);
    };
    solve(solve, 0, (int)comp.size(), ops.begin(), ops.end());
    for (auto x : ans)
        cout << comp[x] << '\n';
}
```
{{% /collapse %}}

{{% collapse "代码2（数组）" %}}
```cpp
#include <bits/stdc++.h>

using namespace std;
#define all(x) (x).begin(), (x).end()

constexpr int M = 3e5;
int N;
int t[M];

using T = int;
void update(int i, T x) {
    while (i < N) {
        t[i] += x;
        i |= (i + 1);
    }
}

template <typename U> U query(int i) {
    U res{};
    for (; i >= 0; i = (i & (i + 1)) - 1)
        res += t[i];
    return res;
}

template <typename U> U query(int l, int r) {
    return query<U>(r) - (l ? query<U>(l - 1) : U{});
}

struct op {
    int type;
    // if type==0, add j to position i, a[i]=k
    // if type==1, query k-th smallest element in [i, j], id is the index
    int i, j, k, id;
};
int main() {
    cin.tie(nullptr)->sync_with_stdio(false);
    int n, q;
    cin >> n >> q;
    vector<op> ops;
    vector<int> comp, a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        comp.push_back(a[i]);
        ops.push_back({0, i, 1, a[i], -1});
    }
    int qcnt = 0;
    for (int i = 0; i < q; i++) {
        char ch;
        cin >> ch;
        if (ch == 'Q') {
            int l, r, k;
            cin >> l >> r >> k;
            ops.push_back({1, l - 1, r - 1, k, qcnt++});
        } else {
            int x, y;
            cin >> x >> y;
            x--;
            ops.push_back({0, x, -1, a[x], -1});
            comp.push_back(y);
            a[x] = y;
            ops.push_back({0, x, 1, y, -1});
        }
    }
    sort(all(comp));
    comp.erase(unique(all(comp)), comp.end());
    for (auto &[type, i, j, k, id] : ops) {
        if (type == 0) k = lower_bound(all(comp), k) - comp.begin();
    }
    N = n;
    vector<int> ans(qcnt);
    auto solve = [&](auto &solve, int l, int r, vector<op> &ops) {
        if (l == r || ops.empty()) {
            for (auto &q : ops) {
                if (q.type == 1) ans[q.id] = l;
            }
            return;
        }
        int mid = (l + r) / 2;
        vector<op> left, right;
        for (auto &q : ops) {
            auto &[type, i, j, k, id] = q;
            if (type == 1) {
                int cnt = query<int>(i, j);
                if (cnt >= k) left.push_back(q);
                else {
                    k -= cnt;
                    right.push_back(q);
                }
            } else {
                if (k <= mid) {
                    update(i, j);
                    left.push_back(q);
                } else
                    right.push_back(q);
            }
        }
        for (auto &q : left)
            if (q.type == 0) update(q.i, -q.j);
        vector<op>().swap(ops);
        solve(solve, l, mid, left);
        solve(solve, mid + 1, r, right);
    };
    solve(solve, 0, (int)comp.size(), ops);
    for (auto x : ans)
        cout << comp[x] << '\n';
}
```
{{% /collapse %}}

### [ZJOI2013]K大数查询

[题目链接](https://www.luogu.com.cn/problem/P3332)

$[l, r]$中每个集合加入一个数就相当于在辅助数组中$[l, r]$的位置上加1,所以我们需要一个可以区间加的数据结构，最简单的就是树状数组啦。其他和上一题没区别。

{{% collapse "代码" %}}
```cpp
#include <bits/stdc++.h>

using namespace std;
#define all(x) (x).begin(), (x).end()

template <typename T> struct fenwick_rg {
    int n;
    vector<T> sum1, sum2;
    fenwick_rg(int n_) : n(n_), sum1(n+1), sum2(n+1) {}

    void update(int p, T x) {
        p++;
        for (int i = p; i <= n; i += i & -i)
            sum1[i] += x, sum2[i] += x * p;
    }
    void update(int l, int r, T x) { update(l, x), update(r + 1, -x); }

    T query(int p) {
        p++;
        T res{};
        for (int i = p; i; i -= i & -i)
            res += (p + 1) * sum1[i] - sum2[i];
        return res;
    }

    T query(int l, int r) { return query(r) - query(l - 1); }
};

struct op {
    int type;
    // if type==0, add k to [l, r]
    // if type==1, query k-th smallest element in [l, r], id is the index
    int l, r;
    long long k;
    int id;
    op(int t, int _l, int _r, long long _k, int _id)
        : type(t), l(_l), r(_r), k(_k), id(_id) {}
};
int main() {
    cin.tie(nullptr)->sync_with_stdio(false);
    int n, q;
    cin >> n >> q;
    vector<op> ops;
    vector<int> comp;
    int qcnt = 0;
    for (int i = 0; i < q; i++) {
        int op;
        int l, r, k;
        cin >> op>>l>>r>>k;;
        if (op == 2) {
            ops.push_back({1, l - 1, r - 1, k, qcnt++});
        } else {
            ops.push_back({0, l-1, r-1, k, -1});
            comp.push_back(k);
        }
    }
    sort(all(comp));
    comp.erase(unique(all(comp)), comp.end());
    for (auto &[type, i, j, k, id] : ops) {
        if (type == 0) k = lower_bound(all(comp), k) - comp.begin();
    }
    fenwick_rg<long long> tr(n);
    vector<int> ans(qcnt);
    auto solve = [&](auto &solve, int l, int r, auto ql, auto qr) {
        if (l == r || ql == qr) {
            for (auto it = ql; it != qr; ++it)
                if (it->type == 1) ans[it->id] = l;
            return;
        }
        int mid = (l + r) / 2;
        auto qmid = stable_partition(ql, qr, [&](op &q) {
            auto &[type, l, r, k, id] = q;
            if (type == 1) {
                long long cnt = tr.query(l, r);
                if (cnt >= k) return false;
                k -= cnt;
                return true;
            } else {
                if (k > mid) {
                    tr.update(l, r, 1);
                    return false;
                } else return true;
            }
        });
        for (auto it = qmid; it != qr; ++it)
            if (it->type == 0) tr.update(it->l, it->r, -1);
        solve(solve, l, mid, ql, qmid);
        solve(solve, mid + 1, r, qmid, qr);
    };
    solve(solve, 0, (int)comp.size(), ops.begin(), ops.end());
    for (auto x : ans)
        cout << comp[x] << '\n';
}
```
{{% /collapse %}}

### Meteors

[题目链接](https://loj.ac/p/2169)

思路:
- 假设当前有一些询问的答案在某个修改区间中，我们将修改区间从中间分开
- 应用左半部分的修改
- 判断这些询问是否达到目标，将询问分为达到目标和没达到目标两个集合，同时将左半部分修改的贡献从没达到目标的询问中减去
- 撤销左半部分的修改
- 递归两个修改区间


{{% collapse "核心函数(数组)" %}}
```cpp
// 修改的范围是[low, high], 答案在[low, high]中的询问存在members里
auto solve = [&](auto & solve, int low, int high, vector<int> &members) {
    if (members.empty() && low == high) { // 区间长度为1,或者没有符合条件的询问
        for (auto x : members) // 记录答案
            ans[x] = low;
        return;
    }

    int mid = (low + high) / 2;
    for (int i = low; i <= mid; i++) {
        apply_modification(i, 1); // 应用左半部分的修改
    }
    vector<int> left, right;
    for (const auto &m : members) {
        ll has = 0;
        for (const auto &sec : own[m]) {
            has += fenwick::query<ll>(sec);
            if (has >= need[m]) break;
        }
        if (has >= need[m]) { // 询问的条件被满足，说明该询问 的答案在左半区间
            left.push_back(m);
        } else { // 反之，答案在右半区间
            need[m] -= has; // 减去左半部分修改的贡献
            right.push_back(m); 
        }
    }
    for (int i = low; i <= mid; i++) {
        apply_modification(i, -1); // 撤销修改
    }
    solve(solve, low, mid, left);
    vector<int>().swap(left); // 清空数组，优化内存使用
    solve(solve, mid + 1, high, right);
    vector<int>().swap(right);
};
```
{{% /collapse %}}
<br/>

{{% collapse "核心函数(partition)" %}}
```cpp
// 修改的范围是[low, high], 符合条件的询问的区间是[begin, end)，begin和end是迭代器，方便传给partition.
auto solve=[&](auto& solve, int low, int high, auto begin, auto end) {
    if (begin==end || low==high) {
        for (auto i=begin; i!=end; i++) ans[*i]=low; // 记录答案
        return;
    }
    int mid=(low+high)/2;
    for (int i=low; i<=mid; i++) {
        apply_modification(i, 1);
    }
    auto m=partition(begin, end, [&](int m) { // 利用partition函数直接原地划分集合，避免新开数组，优化内存
        ll has=0;
        for (const auto& sec : own[m]) {
            has+=fenwick::query<ll>(sec);
            if (has>=need[m]) break;
        }
        if (has>=need[m]) {
            return true;
        } else {
            need[m]-=has;
            return false;
        }
    });
    for (int i=low; i<=mid; i++) {
        apply_modification(i, -1);
    }
    solve(solve, low, mid, begin, m);
    solve(solve, mid+1, high, m, end);
};
```
{{% /collapse %}}

<br/>

{{% collapse 完整代码 %}}
```cpp
#include <bits/stdc++.h>

using namespace std;
#define all(x) (x).begin(),(x).end()
using ll = long long;
using pii = pair<int, int>;

constexpr int M=3e5;
namespace fenwick { // 此题时间很严，需要用静态数组实现的树状数组
  int n;
  ll t[M];

    using T=ll;
  void update(int i, T x) {
    while (i < n) {
      t[i] += x;
      i |= (i + 1);
    }
  }

  void update(int l, int r, T x) {
      update(l, x);
      if (r+1<n) update(r+1, -x);
  }

  template <typename U> U query(int i) {
    U res{};
    for (; i >= 0; i = (i & (i + 1)) - 1)
      res += t[i];
    return res;
  }

};
int main() {
    cin.tie(nullptr)->sync_with_stdio(false);
    int n, m;
    cin>>n>>m;
    vector<vector<int>> own(n);
    for (int i=0; i<m; i++) {
        int x;
        cin>>x;
        own[x-1].push_back(i);
    }
    vector<ll> need(n);
    for (auto& x : need) cin>>x;
    int q;
    cin>>q;
    vector<int> l(q), r(q), val(q);
    for (int i=0; i<q; i++) {
        cin>>l[i]>>r[i]>>val[i];
        l[i]--, r[i]--;
    }
    fenwick::n=m;
    vector<int> members(n);
    iota(all(members), 0);
    auto apply_modification=[&](int q, int flag) {
        int v=val[q]*flag;
        if (l[q]<=r[q]) fenwick::update(l[q], r[q], v);
        else {
            fenwick::update(l[q], m-1, v);
            fenwick::update(0, r[q], v);
        }
    };
    vector<int> ans(n, -1);
    auto solve=[&](auto& solve, int low, int high, auto begin, auto end) {
        if (begin==end || low==high) {
            for (auto i=begin; i!=end; i++) ans[*i]=low;
            return;
        }
        int mid=(low+high)/2;
        for (int i=low; i<=mid; i++) {
            apply_modification(i, 1);
        }
        auto m=partition(begin, end, [&](int m) {
            ll has=0;
            for (const auto& sec : own[m]) {
                has+=fenwick::query<ll>(sec);
                if (has>=need[m]) break;
            }
            if (has>=need[m]) {
                return true;
            } else {
                need[m]-=has;
                return false;
            }
        });
        for (int i=low; i<=mid; i++) {
            apply_modification(i, -1);
        }
        solve(solve, low, mid, begin, m);
        solve(solve, mid+1, high, m, end);
    };
    solve(solve, 0, q, members.begin(), members.end());
    for (auto x :  ans) {
        if (x!=q) cout<<x+1<<'\n';
        else cout<<"NIE\n";
    }
}
```
{{% /collapse %}}


### AGC002D Stamp Rally

[题目链接](https://atcoder.jp/contests/agc002/tasks/agc002_d)

这题思路其实不难，假设当前答案在$[l, r]$内，令$mid=(l+r)/2$，将编号从0到mid的边放入并查集中然后判断连通块大小即可，但问题是这题的目标修改不了，没法像前面的题一样减掉前面的贡献，而每次加边如果都从0到mid的话时间会爆炸，所以要尽可能利用并查集之前的信息，所以我们将递归改成用队列实现，这样区间的顺序就变成了从小到大，就可以很好的利用之前的信息，只有区间到头了的时候才会清空并查集。如果把区间想象成一棵线段树的话，前面的递归可以看成dfs,队列就是bfs,由于树高是$\log(n)$的，所以时间是$O(n\log(n))$的。

{{% collapse "代码" %}}
```cpp
#include <bits/stdc++.h>

#define all(x) (x).begin(),(x).end()
using namespace std;
using ll = long long;
using pii = pair<int, int>;

struct Q {
    int x, y, z, id;
};
struct UF {
    int n;
    vector<int> pa; // parent or size, positive number means parent, negative number means size
    explicit UF(int _n) : n(_n), pa(n, -1) {}

    int find(int x) {
        assert(0 <= x && x < n);
        return pa[x] < 0 ? x : pa[x]=find(pa[x]);
    }

    bool same(int x, int y) {
        return find(x)==find(y);
    }

    bool join(int x, int y) {
        assert(0 <= x && x < n);
        assert(0 <= y && y < n);
        x=find(x), y=find(y);
        if (x==y) return false;
        if (-pa[x] < -pa[y]) swap(x, y); // size of x is smaller than size of y
        pa[x]+=pa[y];
        pa[y]=x;
        return true;
    }

    int size(int x) {
        assert(0 <= x && x < n);
        return -pa[find(x)];
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin>>n>>m;
    vector<pair<int, int>> edges(m);
    for (auto& [x, y] : edges) {
        cin>>x>>y;
        x--, y--;
    }
    int q;
    cin>>q;
    vector<int> ans(q);
    vector<Q> queries(q);
    for (int i=0; i<q; i++) {
        auto& [x, y, z, id] = queries[i];
        cin>>x>>y>>z;
        x--, y--;
        id=i;
    }
    UF uf(n);
    queue<tuple<int, int, int, int>> que;
    que.emplace(0, m-1, 0, q);
    int cur=0; // cur用来记录当前哪些边被加进了并查集里
    while (!que.empty()) {
        auto [l, r, ql, qr]=que.front();
        que.pop();
        if (l==r || ql==qr) {
            for (auto it=ql; it!=qr; ++it) {
                ans[queries[it].id]=l;
            }
            continue;
        }
        int mid=(l+r)/2;
        if (cur>mid) uf=UF(n), cur=0;
        for (; cur<=mid; cur++) {
            uf.join(edges[cur].first, edges[cur].second);
        }
        auto qmid=partition(queries.begin()+ql, queries.begin()+qr, [&](Q& qu) {
            auto& [x, y, z, _]=qu;
            int sz;
            if (uf.same(x, y)) sz=uf.size(x);
            else sz=uf.size(x)+uf.size(y);
            if (sz>=z) return true;
            else return false;
        })-queries.begin();
        que.emplace(l, mid, ql, qmid);
        que.emplace(mid+1, r, qmid, qr);
    }
    for (auto x : ans) cout<<x+1<<'\n';
}
```
{{% /collapse %}}

## CTSC2008 Network 网络管理

我提交的地方是个私有题库，暂时没找到公开的提交的地方。其实基本上就是动态区间第k大，只不过区间变成了树上路径，用树剖分解成多个区间就行了。

{{% collapse 代码 %}}
```cpp
/* Author: Thallium54 {{{
 * Blog: https://blog.tgc-thallium.com/
 * Code library: https://github.com/thallium/acm-algorithm-template
 * }}}*/
#include <bits/stdc++.h>
using namespace std;
template <typename T> struct fenwick {
    int n; vector<T> t;
    fenwick(int n_) : n(n_), t(n + 1) {}
    void add(int i, T x) {
        assert(i >= 0 && i < n);
        for (i++; i <= n; i += i & -i) {
            t[i] += x;
        }
    }
    template <typename U = T> U query(int i) {
        assert(i >= 0 && i < n);
        U res{};
        for (i++; i > 0; i -= i & -i)
            res += t[i];
        return res;
    }
    template <typename U = T> U query(int l, int r) {
        assert(l >= 0 && l <= r && r < n);
        return query<U>(r) - (l ? query<U>(l - 1) : U{});
    }
};

struct Heavy_light {
    vector<vector<int>> g;
    vector<int> fa, dep, heavy, head, pos, posr; // initialize heavy with -1
    int cnt=0;
    fenwick<int> tr;
    Heavy_light(int n) : g(n), fa(n), dep(n), heavy(n, -1), head(n), pos(n), posr(n), tr(n) {}
    void add_edge(int u, int v) {
        g[u].push_back(v);
        g[v].push_back(u);
    }
    int dfs(int u) {
        int size = 1;
        int mx = 0;
        for (int v : g[u]) {
            if (v != fa[u]) {
                fa[v] = u, dep[v] = dep[u] + 1;
                int csize = dfs(v);
                size += csize;
                if (csize > mx) mx = csize, heavy[u] = v;
            }
        }
        return size;
    }
    void dfs2(int u, int h) {
        head[u] = h, pos[u] = cnt++; //1-based index, could change to 0 based but less useful
        if (heavy[u] != -1) dfs2(heavy[u], h);
        for (int v : g[u]) {
            if (v != fa[u] && v != heavy[u])
                dfs2(v, v);
        }
        posr[u] = cnt;
    }
    int pathsum(int u, int v) {
        int res = 0;
        while (head[u] != head[v]) {
            if (dep[head[u]] < dep[head[v]]) swap(u, v);
            res += tr.query(pos[head[u]], pos[u]);
            u = fa[head[u]];
        }
        if (pos[u] > pos[v]) swap(u, v);
        res += tr.query(pos[u], pos[v]);
        return res;
    }
    void add(int u, int x) {
        tr.add(pos[u], x);
    }
};

struct Q {
    int type;
    int i, j, k, id;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin>>n>>q;
    vector<int> t(n);
    for (auto& x : t) cin>>x;
    Heavy_light tr(n);
    for (int i=1; i<n; i++) {
        int u, v;
        cin>>u>>v;
        u--, v--;
        tr.add_edge(u, v);
    }
    vector<Q> qs;
    int qc=0;
    for (int i=0; i<n; i++) {
        qs.push_back({0, i, 1, t[i], -1});
    }
    for (int i=0; i<q; i++) {
        int k, a, b;
        cin>>k>>a>>b;
        if (k==0) {
            a--;
            qs.push_back({0, a, -1, t[a], -1});
            t[a]=b;
            qs.push_back({0, a, 1, b, -1});
        } else {
            qs.push_back({1, a-1, b-1, k, qc++});
        }
    }
    vector<int> ans(qc);
    tr.dfs(0);
    tr.dfs2(0, 0);
    auto solve=[&](auto& slf, int l, int r, auto begin, auto end) {
        if (l==r || begin==end) {
            for (auto it = begin; it!=end; ++it) {
                if (it->type==1) ans[it->id]=l;
            }
            return;
        }
        int mid=(l+r+1)/2;
        auto qmid = stable_partition(begin, end, [&](Q& q) {
            auto& [type, i, j, k, id] = q;
            if (type==1) {
                int cnt=tr.pathsum(i, j);
                if (cnt >= k) return false;
                k-=cnt;
                return true;
            } else {
                if (k>=mid) {
                    tr.add(i, j);
                    return false;
                } else
                    return true;
            }
        });
        for (auto it = qmid; it!=end; ++it)
            if (it->type == 0)
                tr.add(it->i, -it->j);
        slf(slf, l, mid-1, begin, qmid);
        slf(slf, mid, r, qmid, end);
    };
    solve(solve, 0, 1e6, qs.begin(), qs.end());
    for (auto x : ans) {
        if (x==0) cout<<"invalid request!\n";
        else cout<<x<<'\n';
    }
}
```
{{% /collapse %}}
