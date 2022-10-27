---
title: 区间加等差数列
date: 2021-04-29
categories: [算法笔记]
tags: []
---

顾名思义，就是在$[l, r]$区间上加上首项为$k$，公差为$d$的等差数列。分为以下这么三类情况：
<!--more-->

## 先加后询问

即先加，最后再输出整个数组，或者询问的位置和修改的左端点是有序的。这种情况我们不需要借助其他数据结构，有以下两种思路：

### 靠思维

我们先回顾一下区间加同样的数是怎么做的，我们维护当前加在原数组上的值，并用一个数组$add$标记维护的值在$i$位置该如何变化，比如说给$[l, r]$加上$x$，我们令`a[l] += x, a[r+1] -= x`，这样$[l, r]$中的数都会加$x$，然后$r-1$位置还原。

加等差数列就是上述思路的扩展，我们不仅维护当前加在原数组上的值$cur$，还维护当前的公差$inc$，以及用两个数组$cur\_add$和$inc\_add$标记两个维护的值的变化。当加一个等差数列时，我们在$l$处标记$d$代表从$l$处开始公差加$d$，在$r+1$处标记$-d$以复原公差。$cur$也需要类似的标记：在$l$处标记$k$，在$r+1$处标记$-(k+(r-l+1)\cdot d)$。总结一下：

```cpp
auto add = [&](int l, int r, int k, int d) {  
    cur_add[l] += k;
    cur_add[r+1] -= k + (r - l + 1) * d;

    inc_add[l] += d;
    inc_add[r+1] -= d;
}

auto update_current_position = [&](int i) {
    cur += cur_add[i];
    inc += inc_add[i];
    cur += inc;
}
```

####  靠数学

分析一下差分数组

|下标|$l-1$|$l$|$l+1$|$l+2$|$\dots$|$r$|$r+1$|$r+2$|
|--- |---|-|---|---|---|-|---|---|
|原数组|$0$|$k$|$k+d$|$k+2d$||$k+(len-1)d$|$0$|$0$|$
|一阶差分|$0$|$k$|$d$|$d$||$d$|$-(k+(len-1)d)$|$0$|$
|二阶差分|$0$|$k$|$d-k$|$0$||$0$|$-(k+len\cdot d)$|$k+(len-1)d$|$

 不难看出二阶差分数组上产生了四次单点修改。所以我们先在二阶差分数组上修改最后再跑两次前缀和即可得到最后的数组。

放个例题[CF1661D](https://codeforces.com/contest/1661/problem/D)


{{< code language="cpp" title="靠思维做法" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<ll> a(n);
    vector<ll> inc_add(n), sum_add(n);
    for (auto &x : a)
        cin >> x;

    ll cur = 0, inc = 0, ans = 0;

    for (int i = n - 1; i >= 0; i--) {
        inc += inc_add[i];
        cur += sum_add[i];
        cur += inc;
        auto x = a[i] + cur;
        if (x > 0) {
            int len = min(k, i + 1);
            auto need = (x + len - 1) / len;
            ans += need;
            cur -= need * len;
            inc += need;
            if (i - len >= 0) {
                inc_add[i-len] -= need;
                sum_add[i-len] += need;
            }
        }
    }
    cout << ans << endl;
}
{{< /code >}}

## 区间修改，单点查询

此时我们就需要数据结构维护差分数组了

### 维护一阶差分数组

观察上面一阶差分可以发现有两个单点修改一个区间修改，$a_i$是一阶差分的前缀和，所以用区间修改区间查询的数据结构即可（线段树，树状数组）

### 维护二阶差分数组

我们需要单点修改然后二阶前缀和，二阶前缀和可以拆成两个前缀和：

$$b_i=\sum_1^ia_i, c_i = \sum_1^ib_i$$

$$\begin{aligned}
    c_i &= i a_1 + (i-1)a_2 + \dots+2a_{i-1}+a_i\\\
    &= (i+1)(a_1+a_2+\dots+a_i) - (a_1+2a_2+\dots+ia_i)
\end{aligned}$$

维护$a_i$和$ia_i$的前缀和即可。

例题：[洛谷P1438 无聊的数列](https://www.luogu.com.cn/problem/P1438)

{{< code language="cpp" title="维护二阶差分" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<int> a(n);
    for (auto& x : a) cin >> x;

    vector<int64_t> t1(n + 1), t2(n + 1); 
    auto add = [&](int idx, int x) {
        for (int i = idx; i <= n; i += i&-i) {
            t1[i] += x;
            t2[i] += (int64_t)idx * x;
        }
    };
    auto sum = [&](int idx) {
        int64_t res = 0;
        for (int i = idx; i > 0; i -= i&-i) {
            res += (idx + 1) * t1[i] - t2[i];
        }
        return res;
    };

    while (m--) {
        int op;
        cin >> op;
        if (op == 1) {
            int l, r, k, d;
            cin >> l >> r >> k >> d;
            int len = r - l + 1;
            add(l, k);
            add(l + 1, d - k);
            add(r + 1, -(k + len * d));
            add(r + 2, k + (len-1)*d);
        } else {
            int i;
            cin >> i;
            cout << sum(i) + a[i-1] << '\n';
        }
    }
}
{{< /code >}}

## 区间修改，区间查询

要是搞三阶前缀和那可能略显麻烦了，我们不妨转变思路用线段树，其实与正常的区间加类似，懒惰标记变成了这个区间加的等差数列的首项和公差。
