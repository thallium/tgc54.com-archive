---
title: "CUGBACM21级组队训练（四）题解"
date: 2023-05-16T22:18:16-04:00
summary: ""
keywords: []
tags: []
categories: []
---
<!--more-->

## 出题思路

- 没有很水的签到，中档题为主
- 思维题为主，穿插一些算法知识/思维
- 两个码农题练一下码力

## A. 座位安排

把每对朋友的要求看成一条边，那么每个点的度数最多为2，说明每个连通分量要么是环要么是链。是链的话每个要求都能满足，是环的话除非整个图是一个大环，否则必然有一条边不能满足，那么舍弃掉钱最少的条件。


{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>


using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    cin >> n >> m;

    vector<vector<array<int, 2>>> g(n);
    ll sum = 0;
    for (int i = 0; i < m; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        u--, v--;
        sum += w;
        g[u].push_back({v, w});
        g[v].push_back({u, w});
    }

    vector<int> vis(n);
    // mn: 当前连通分量中的最小边，sz: 当前连通分量的大小
    auto dfs = [&](auto& slf, int u, int p, int mn, int sz) -> void {
        vis[u] = 1;
        for (auto [v, w] : g[u]) {
            if (v == p) continue;
            if (vis[v] == 1) { // 成环了
                if (sz != n) {
                    sum -= min(mn, w);
                }
            } else if (vis[v] == 0) {
                slf(slf, v, u, min(mn, w), sz + 1);
            }
        }
        vis[u] = 2;
    };

    for (int i = 0; i < n; i++) {
        if (!vis[i]) {
            dfs(dfs, i, i, 1e9, 1);
        }
    }

    cout << sum << endl;
    return 0;
}
{{< /code >}}

## B. 左撇子与右撇子

非常简单的 dp，令 $dp_{i, j}$ 为考虑了前 $i$ 个问题，且左撇子与右撇子数量之差为 $j$ 时所需要采访的最少的老师个数。

我们遍历每个问题，对于每个问题，我们要么只采访左撇子，要么只采访右撇子，要么左撇子右撇子各采访一个。具体状态转移可以看代码~

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t, n;
    cin >> t >> n;

    vector<int> cnt1(t), cnt2(t);
    for (int i = 0; i < n; i++) {
        int x;
        char c;
        cin >> x >> c;
        x--;
        if (c == 'L') cnt1[x]++;
        else cnt2[x]++;
    }

    const int INF = 1e9;
    vector<int> dp(2 * n + 1, INF);
    dp[n] = 0;

    for (int i = 0; i < t; i++) {
        vector<int> ndp(2 * n + 1, INF);

        for (int j = 0; j <= 2 * n; j++) {
            // 只采访左撇子
            for (int k = 1; k <= cnt1[i]; k++) {
                if (j - k >= 0)
                    ndp[j - k] = min(ndp[j - k], dp[j] + k);
            }
            // 只采访右撇子
            for (int k = 1; k <= cnt2[i]; k++) {
                if (j + k <= 2 * n)
                    ndp[j + k] = min(ndp[j + k], dp[j] + k);
            }

            // 各采访一个
            if (cnt1[i] && cnt2[i]) {
                ndp[j] = min(ndp[j], dp[j] + 2);
            }
        }
        swap(dp, ndp);
    }

    cout << (dp[n] == INF ? -1 : dp[n]) << endl;
    return 0;
}
{{< /code >}}

## C. 打扫道路

一种比较简单的判断一条边 $(u, v)$ 是否在 $a$ 到 $b$ 的最短路上的方法是检查 $a$ 到 $u$ 的最短距离加 $b$ 到 $v$ 的最短距离（也可能反过来）加 $(u, v)$ 边的长度是否是 $a$ 到 $b$ 的最短距离，也就是检查：

$$\min(disa_u + disb_v, disa_v + disb_u) + w = disa_b$$

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

vector<int> dijkstra(const vector<vector<array<int, 2>>>& g, int start) {
    constexpr int INF = 1e9;
    int n = (int)g.size();

    vector dis(n, INF);

    using node = std::pair<int, int>;
    std::priority_queue<node, std::vector<node>, std::greater<>> q;

    dis[start] = 0;
    q.emplace(0, start);

    while (!q.empty()) {
        auto [d, u] = q.top();
        q.pop();

        if (d != dis[u]) continue;

        for (auto [v, cost] : g[u]) {
            if (dis[v] > d + cost) {
                dis[v] = d + cost;
                q.emplace(dis[v], v);
            }
        }
    }
    return dis;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, a, b;
    cin >> n >> m >> a >> b;
    a--, b--;

    vector<vector<array<int, 2>>> g(n);
    vector<array<int, 3>> edges(m);

    for (auto& [u, v, w] : edges) {
        cin >> u >> v >> w;
        u--, v--;
        g[u].push_back({v, w});
        g[v].push_back({u, w});
    }

    auto disa = dijkstra(g, a);
    auto disb = dijkstra(g, b);

    int ans = 0;
    int mndis = disa[b];
    for (auto [u, v, w] : edges) {
        int mn = min(disa[u] + disb[v], disa[v] + disb[u]) + w;
        if (mn == mndis) {
            ans += w;
        }
    }

    cout << ans << endl;

    return 0;
}
{{< /code >}}

还有一种做法是利用从 $a$ 开始的最短路 DAG（K 题题解中有介绍），将其中的边反转后后从 $b$ 出发，所有经过的边就是在 $a$ 到 $b$ 的最短路上的边。

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

vector<int> dijkstra(const vector<vector<array<int, 2>>>& g, int start) {
    constexpr int INF = 1e9;
    int n = (int)g.size();

    vector dis(n, INF);

    using node = std::pair<int, int>;
    std::priority_queue<node, std::vector<node>, std::greater<>> q;

    dis[start] = 0;
    q.emplace(0, start);

    while (!q.empty()) {
        auto [d, u] = q.top();
        q.pop();

        if (d != dis[u]) continue;

        for (auto [v, cost] : g[u]) {
            if (dis[v] > d + cost) {
                dis[v] = d + cost;
                q.emplace(dis[v], v);
            }
        }
    }
    return dis;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, a, b;
    cin >> n >> m >> a >> b;
    a--, b--;

    vector<vector<array<int, 2>>> g(n);
    vector<array<int, 3>> edges(m);

    for (auto& [u, v, w] : edges) {
        cin >> u >> v >> w;
        u--, v--;
        g[u].push_back({v, w});
        g[v].push_back({u, w});
    }

    auto dis = dijkstra(g, a);

    vector<int> vis(n);
    int ans = 0;
    auto dfs = [&](auto& slf, int u) -> void {
        vis[u] = 1;
        for (auto [v, cost] : g[u]) {
            if (dis[v] + cost == dis[u]) {
                ans += cost;
                if (vis[v]) continue;
                slf(slf, v);
            }
        }
    };
    dfs(dfs, b);

    cout << ans << endl;

    return 0;
}
{{< /code >}}

## D. 厕所管理员

首先把所有人按 deadline 归类，然后从小到大遍历 deadline，我们维护到当前时间点，两种坑位能让多少人上完厕所，假设当前的 deadline 为 $t$，上一个 deadline 为 $prev$，那么我们能多让 $(t - prev) \cdot (s - 1)$ 的不需要厕纸的人上完厕所，能多让 $t - prev$ 需要厕纸的人上完厕所。

对于当前 deadline，我们先让不需要厕纸的人尽量去没有厕纸的坑位，如果剩下的不需要厕纸的人（如果有）加上需要厕纸的人大于有厕纸的坑位能让人上完厕所是数量，答案就是 No，否则我们继续处理下一个 deadline。

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int s, n;
    cin >> s >> n;

    map<int, array<int, 2>> cnt;
    for (int i = 0; i < n; i++) {
        int deadline;
        char c;
        cin >> deadline >> c;
        cnt[deadline][c == 'y']++;
    }

    ll have[2] {}; // 到当前时间点，两种坑位能让多少人上完厕所
    int prev = 0;

    for (const auto [deadline, v] : cnt) {
        have[1] += deadline - prev;
        have[0] += ll(deadline - prev) * (s - 1);
        prev = deadline;

        auto [dont_need, need] = v;

        ll no_paper = min((ll)dont_need, have[0]); // 去没有厕纸的坑位的人数
        dont_need -= no_paper;
        have[0] -= no_paper;

        if (dont_need + need > have[1]) { // 剩下的人只能去有厕纸的坑位，如果超出了就是no
            cout << "No\n";
            return 0;
        }
        have[1] -= dont_need + need;
    }
    cout << "Yes\n";
    return 0;
}
{{< /code >}}

## E. 这一样吗？

模拟题，没什么思维难度。一种比较好想的做法可能是先预处理出配对的括号，每一对括号就是一个子树，然后跑一遍 dfs。下面给出一个只遍历一次的实现。

一个比较容易错的输入是两棵树都只有一个节点，且编号不一样，如果你给 $1-10^6$ 每个节点都开了一个邻接表，那么你将判断不出来 No。一种解决方法是把根节点连到节点 0 上。

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string s, t;
    getline(cin, s);
    getline(cin, t);
    s = "0(" + s + ")";
    t = "0(" + t + ")";

    auto build = [&](const string& s) {
        const int N = 1e6;
        vector<vector<int>> g(N + 1);

        string current_num;
        vector<int> stack;

        for (auto c : s) {
            if (c == ' ') continue;

            if (c == '(') {
                if (!current_num.empty()) {
                    int num = stoi(current_num);
                    current_num.clear();
                    if (!stack.empty()) {
                        g[stack.back()].push_back(num);
                    }
                    stack.push_back(num);
                }
            } else if (c == ')') {
                if (!current_num.empty()) {
                    int num = stoi(current_num);
                    current_num.clear();
                    if (!stack.empty()) {
                        g[stack.back()].push_back(num);
                    }
                    stack.push_back(num);
                }
                stack.pop_back();
            } else {
                current_num += c;
            }
        }

        for (int i = 0; i <= N; i++) {
            sort(begin(g[i]), end(g[i]));
        }

        return g;
    };

    auto gs = build(s), gt = build(t);
    cout << (gs == gt ? "Yes\n" : "No\n");
    return 0;
}
{{< /code >}}

## F. 电影之夜

如果我们把依赖关系（$i\to x_i$）看成是图的话，这种每个点出度为 1 的图被称为函数图（functional graph）。图的结构由一个环以及一些挂在环上的树构成。对于环上的人，他们要么都去要么都不去，所以我们可以把他们看成一个点，这样图就变成了一个有向的树。我们在树上 dp，定义 $dp_u$ 为：邀请 $u$ 且同时让 $u$ 的子树里的人的要求都满足的邀请方式的数量，那么状态转移为：

$$dp_u = \prod_{v \in \operatorname{child}(u)} dp_v + 1$$

如果怕 dfs 找环写错的话也可以利用强连通分量来缩点。

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>


using namespace std;
using ll = long long;

inline auto scc(const std::vector<std::vector<int>>& g) -> std::pair<int, std::vector<int>> {
    int n = (int)size(g);
    int pos = 0;
    std::vector<bool> on_stk(n);
    std::vector<int> low(n), ord(n, -1), color(n), stk;
    int cnt = 0;

    auto dfs = [&](auto& slf, int u) -> void {
        low[u] = ord[u] = pos++;
        stk.push_back(u);
        on_stk[u] = true;
        for (auto v : g[u]) {
            if (ord[v] == -1) slf(slf, v);
            if (on_stk[v]) low[u] = std::min(low[u], low[v]);
        }
        if (low[u] == ord[u]) {
            while (true) {
                int v = stk.back();
                stk.pop_back();
                on_stk[v] = false;
                color[v] = cnt;
                if (u == v) break;
            }
            cnt++;
        }
    };

    for (int i = 0; i < n; i++) {
        if (ord[i] == -1) {
            dfs(dfs, i);
        }
    }

    return {cnt, color};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<vector<int>> g(n);
    vector<int> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        a[i]--;
        g[i].push_back(a[i]);
    }

    auto [cnt, color] = scc(g);

    const int mod = 1e9+7;
    int ans = 1;
    vector<vector<int>> g2(cnt); // 缩点之后的图
    vector<int> deg(cnt);
    for (int i = 0; i < n; i++) {
        if (color[a[i]] != color[i]) {
            g2[color[a[i]]].push_back(color[i]);
            deg[color[i]]++;
        }
    }

    vector<int> dp(cnt, 1);
    for (int i = cnt - 1; i >= 0; i--) {
        for (auto v : g2[i]) {
            dp[i] = (ll)dp[i] * (dp[v] + 1) % mod;
        }
    }

    for (int i = 0; i < cnt; i++) {
        if (deg[i] == 0) { // 不同分量之间互相独立
            ans = (ll)ans * (dp[i] + 1) % mod;
        }
    }
    cout << (ans - 1 + mod) % mod << endl;
    return 0;
}
{{< /code >}}

## G. 送礼物

不妨考虑按 $a_i$ 的大小遍历礼物，假设送给小明礼物 $i$，那么送给小红任意 $i$ 之前的礼物都不会使小明嫉妒。同时我们还要不能使小红嫉妒，所以我们要知道在前 $i$ 个礼物中有多少个 $j$ 使得 $b_j \ge b_i$，我们可以将 $b$ 离散化之后用树状数组维护。

更本质地说，这个题是二维偏序问题，二维偏序问题通常先按其中一个维度排序然后用树状数组解决。感兴趣的同学可以自行了解。

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

template <typename T> struct Fenwick {
    int n;
    std::vector<T> t;

    Fenwick(int n_) : n(n_), t(n + 1) {}
    Fenwick(const std::vector<T> &v) : Fenwick((int)v.size()) {
        for (int i = 1; i <= n; i++) {
            t[i] += v[i - 1];
            int j = i + (i & -i);
            if (j <= n) t[j] += t[i];
        }
    }

    void add(int i, const T& x) {
        assert(i >= 0 && i < n);
        for (i++; i <= n; i += i & -i) {
            t[i] += x;
        }
    }

    // Returns `data[0] + ... + data[i - 1]`.
    template <typename U = T> U get(int i) {
        assert(i >= 0 && i <= n);
        U res{};
        for (; i > 0; i -= i & -i)
            res += t[i];
        return res;
    }

    // Returns `data[l] + ... + data[r - 1]`.
    template <typename U = T> U get(int l, int r) {
        assert(l >= 0);
        assert(l <= r);
        assert(r <= n);
        return get<U>(r) - get<U>(l);
    }
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;

    vector<int> a(n), b(n);
    for (auto& x : a) {
        cin >> x;
    }
    for (auto& x : b) {
        cin >> x;
    }

    auto compress = b;
    sort(begin(compress), end(compress));
    compress.erase(unique(begin(compress), end(compress)), end(compress));
    for (auto& x : b) {
        x = lower_bound(begin(compress), end(compress), x) - begin(compress);
    }

    vector<int> order(n);
    iota(begin(order), end(order), 0);
    sort(begin(order), end(order), [&](int i, int j) { return a[i] < a[j]; });

    Fenwick<int> tr(n);
    ll ans = 0;
    for (int i = 0, j = 0; i < n; ) {
        while (j < n && a[order[i]] == a[order[j]]) {
            tr.add(b[order[j]], 1);
            j++;
        }

        while (i < j) {
            ans += tr.get(b[order[i]], n);
            i++;
        }
    }

    cout << ans << endl;
    return 0;
}
{{< /code >}}

## H. 循环排序

如果 $a$ 中有重复的元素的话，不失一般性地，假设有两个 1，首先我们可以利用一次操作将两个 1 放到 1 和 2 的位置。然后我们可以利用这两个 1 来交换任意两个位置：假设我们要交换 $i, j$ ($i < j$)，我们只需要应用操作 $(2, i, j)$ 和 $(1, 2, i)$ 即可交换 $i, j$。

如果 $a$ 中没有重复的元素，说明 $a$ 是一个长为 $n$ 的排列。我们不妨从逆元的角度入手，题目中的操作本质上就是先交换 $a_i, a_j$，再交换 $a_i, a_k$，由于一次交换操作会使整个序列的逆元个数的奇偶性改变（想想为什么），所以循环操作不会使整个序列的逆元个数的奇偶性改变，所以不妨大胆猜想当且仅当整个序列的逆元的个数为偶数个时，我们可以通过循环操作排序。下面给出当逆元个数为偶数个时可以通过循环操作排序的证明：

考虑将 $i = 1\dots n - 2$ 依次放到第 $i$ 个位置，对于每一个 $i$ 我们可以用一次循环操作在不破坏之前排好序的元素的情况下把 $i$ 放到位置 $i$。在排好前 $n - 2$ 个元素之后，由于我们没有改变逆序对的奇偶性，所以最后剩下的两个元素也一定是有序的。

更本质的，我们也可以从排列（permutation）的角度来看这个问题，定义一个排列的奇偶性为它的逆序对数量的奇偶性。三循环可以用排列来表示，所有偶排列都可以表示为三循环排列的复合。想深入了解的话可以看[这篇](https://codeforces.com/blog/entry/111187)英文博客（不用全看，挑自己感兴趣的即可）。

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>

// 归并排序求逆序对个数
template<typename T>
int64_t count_inversion(const std::vector<T>& v) {
    auto a(v);
    std::vector<T> tmp(v.size());
    int64_t cnt{};
    auto merge = [&](auto& slf, int l, int r) {
        if (r - l <= 1) {
            return;
        }
        int mid = l + (r - l) / 2;
        slf(slf, l, mid);
        slf(slf, mid, r);
        for (int i = l, j = mid, k = l; k < r; k++) {
            if (j == r || (i < mid && a[i] <= a[j])) {
                tmp[k] = a[i++];
            } else {
                tmp[k] = a[j++];
                cnt += mid - i;
            }
        }
        std::copy(tmp.begin() + l, tmp.begin() + r, a.begin() + l);
    };
    merge(merge, 0, (int)v.size());
    return cnt;
}

using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;

    vector<int> a(n);
    for (auto& x : a) {
        cin >> x;
        x--;
    }

    if (set(begin(a), end(a)).size() != n) {
        cout << "Yes\n";
        return 0;
    }

    cout << (count_inversion(a) % 2 ? "No\n" : "Yes\n");
    return 0;
}
{{< /code >}}

## I. 送礼物2

本题做法不唯一，下面介绍 dp 做法：

不难想到一种 dp 状态 $dp_{i, sum, size}$，代表前 $i$ 个数中，是否存在和为 $sum$ 且大小为 $size$ 的子集。本来想卡掉这个做法的，和易老师以及伍老师讨论之后还是放弃了，下面是优化后的做法：

设 $dp_{i, sum}$ 为前 $i$ 个数中，和为 $sum$ 的子集的大小的集合。例如，假设$a = 1, 2, 3$，因为 $\operatorname{sum}(\\{1, 2\\}) = 3, \operatorname{sum}(\\{3\\}) = 3$，那么 $dp_{3, 3} = \\{1, 2\\}$。那么状态转移是显然的：

$$dp_{i, sum + a_i} \coloneqq dp_{i, sum + a_i} \cup \\{ s + 1 | s \in dp_{i - 1, sum}\\}$$

如果我们用二进制表示集合的话，这个状态转移可以被非常容易的写成 

```cpp
dp[i][sum + a[i]] |= dp[i - 1][sum] << 1;
```

这个优化技巧在[找哈密顿路径算法](https://codeforces.com/blog/entry/337)中也有应用。
{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;

    vector<int> a(n);
    for (auto &x : a) {
        cin >> x;
    }

    int sum = accumulate(begin(a), end(a), 0);

    vector dp(sum + 1, 0);
    dp[0] = 1;

    for (auto x : a) {
        for (int i = sum - x; i >= 0; i--) {
            dp[i + x] |= dp[i] << 1;
        }
    }

    for (int j = 0; j <= sum; j++) {
        for (int i = 1; i < n; i++) {
            if ((dp[j] >> i & 1) && i * (sum - j) == j * (n - i)) {
                cout << "Yes\n";
                return 0;
            }
        }
    }
    cout << "No\n";
    return 0;
}
{{< /code >}}

## J. 寻宝

不难看出这个是 bfs（只是状态有点复杂），由于数据范围比较小，所以我们可以直接记录当前在第几个单词的第几个位置。由于不能经过同一个位置两次，也就是说在一行里只能向左或者向右，所以我们还要记录当前的方向。所以我们 bfs 的状态就是 `dis[row][col][idx][pos][dir]`，代表到达 $(row, col)$ 这个位置，当前字母是第 $idx$ 个单词的第 $pos$ 位置，且当前方向是 $dir$ 的最短路径。具体实现细节请看代码。

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

constexpr int N = 50;
int dis[N][N][N][N][3];
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, k;
    cin >> n >> m >> k;

    vector a(n, vector<char>(m));
    vector<string> words(k);

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> a[i][j];
        }
    }
    for (auto &s : words) {
        cin >> s;
    }

    queue<array<int, 5>> q;
    memset(dis, -1, sizeof(dis));

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < k; j++) {
            if (a[0][i] == words[j][0]) {
                dis[0][i][j][0][0] = 0;
                q.push({0, i, j, 0, 0});
            }
        }
    }

    const vector<pair<int, int>> dir{{1, 0}, {0, 1}, {0, -1}};
    auto update_dis = [](int &x, const int y) {
        if (x == -1) {
            x = y + 1;
            return true;
        }
        return false;
    };
    while (!q.empty()) {
        auto [i, j, word_idx, char_idx, d] = q.front();
        q.pop();

        for (int dir_idx = 0; dir_idx < 3; dir_idx++) {
            auto [di, dj] = dir[dir_idx];
            if (d != 0 && dir_idx != 0 && dir_idx != d) {
                continue;
            }
            int next_i = i + di, next_j = j + dj;
            if (next_i < n && next_j >= 0 && next_j < m) {
                if (char_idx == words[word_idx].size() - 1) { // 当前是一个单词的结尾
                    for (int next_word = 0; next_word < k; next_word++) { // 检查是否匹配任意单词的第一个字符
                        if (a[next_i][next_j] == words[next_word][0]) {
                            if (update_dis(dis[next_i][next_j][next_word][0][dir_idx],
                                           dis[i][j][word_idx][char_idx][d])) {
                                q.push({next_i, next_j, next_word, 0, dir_idx});
                            }
                        }
                    }
                } else {
                    if (a[next_i][next_j] == words[word_idx][char_idx + 1]) { // 检查是否匹配下一个字符
                        if (update_dis(
                                dis[next_i][next_j][word_idx][char_idx + 1][dir_idx],
                                dis[i][j][word_idx][char_idx][d])) {
                            q.push({next_i, next_j, word_idx, char_idx + 1, dir_idx});
                        }
                    }
                }
            }
        }
    }

    int ans = 1e9;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < k; j++) {
            for (int d = 0; d < 3; d++) {
                auto x = dis[n - 1][i][j][words[j].size() - 1][d];
                if (x != -1) {
                    ans = min(ans, x);
                }
            }
        }
    }
    if (ans == 1e9) {
        cout << "impossible\n";
    } else {
        cout << ans + 1 << '\n';
    }
    return 0;
}
{{< /code >}}

## K. 旅行记录

首先我们跑一遍最短路，对于每个点，如果到这个点的最短距离在里程记录里出现过，我们就标记这个点。我们要找的就是一条经过 $d$ 个标记过的点到达点 $n$ 的路径，并且路径是最短路。

考虑从点 1 起始的所有最短路上的所有边所构成的子图，如果我们将这些边定向（从离点 1 近的点指向离点 1 远的点），我们将会得到一个 DAG。这个DAG上从点 1 到点 $n$ 的任意路径都是一条最短路。由于是 DAG，我们可以按拓扑序 dp，令 $dp_u$ 为到达 $u$ 时经过的最多标记的点的数量，令 $multi_u$ 是否有多条这样的路径。状态转移的代码：

```cpp
for (int v : g[u]) { // g 是上面提到的DAG
    if (dp[u] + marked[v] > dp[v]) {
        dp[v] = dp[u] + seen[v];
        multi[v] = multi[u];
        prev[v] = u;
    } else if (dp[u] + seen[v] == dp[v]) {
        multi[v] = 1;
    }
}
```

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, d;
    cin >> n >> m >> d;
    vector<vector<array<int, 2>>> g(n);

    for (int i = 0; i < m; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        u--, v--;
        g[u].push_back({v, w});
    }

    set<ll> log;
    for (int i = 0; i < d; i++) {
        ll t;
        cin >> t;
        log.insert(t);
    }

    constexpr long long INF = 1e18;
    vector dis(n, INF);

    using node = std::pair<long long, int>;
    priority_queue<node, vector<node>, greater<>> q;
    dis[0] = 0;
    q.emplace(0, 0);
    while (!q.empty()) {
        auto [d, u] = q.top();
        q.pop();
        if (d != dis[u]) continue;
        for (auto [v, cost] : g[u]) {
            if (dis[v] > d + cost) {
                dis[v] = d + cost;
                q.emplace(dis[v], v);
            }
        }
    }

    vector<int> seen(n);
    for (int i = 0; i < n; i++) {
        if (log.count(dis[i])) {
            seen[i] = 1;
        }
    }

    vector<int> order(n);
    iota(begin(order), end(order), 0);
    // 按距离排序是一种合法的拓扑序
    sort(begin(order), end(order), [&](int i, int j) { return dis[i] < dis[j]; });

    vector<int> dp(n, -1), multi(n), prev(n);
    dp[0] = seen[0];
    for (auto u : order) {
        for (auto [v, w] : g[u]) {
            if (dis[u] + w == dis[v]) { // 这是一条最短路上的边
                if (dp[u] + seen[v] > dp[v]) {
                    dp[v] = dp[u] + seen[v];
                    multi[v] = multi[u];
                    prev[v] = u;
                } else if (dp[u] + seen[v] == dp[v]) {
                    multi[v] = 1;
                }
            }
        }
    }

    if (dp[n - 1] != d) {
        cout << "0\n";
    } else if (multi[n - 1]) {
        cout << "1\n";
    } else {
        vector<int> path;
        int u = n - 1;
        while (u != 0) {
            path.push_back(u);
            u = prev[u];
        }
        path.push_back(0);
        reverse(begin(path), end(path));
        cout << size(path) << '\n';
        for (auto x : path) {
            cout << x + 1 << '\n';
        }
    }
    return 0;
}
{{< /code >}}

## L. 彩票

枚举被涂黑两次的格子的个数，假设有 $i$ 个格子被涂黑了两次。首先我们先选择第 $p$ 个球的编号，它可以是我们填的 $2n$ 个数中的任意一个。前 $p - 1$ 个球中，有 $n - 1 + i$ 个数是我们填的，我们先选被涂黑两次的格子，有 $\binom{n - 1}{i}$ 种选法，在剩下每个只涂黑一次的格子中我们选一个数，有 $2^{n - 1 - i}$ 中选法。前 $p - 1$ 个球中没出现在纸上的有 $\binom{m - 2 n}{p - 1 - (n - 1 + i)}$。最后前 $p - 1$ 个球有 $(p - 1)!$ 种顺序，第 $p$ 个球后面的 $m - p$ 个球有 $(m - p)!$种顺序。所以答案为：

$$
\left(\sum_{i = 0}^{p - n} 2 \cdot n \cdot \binom{n - 1}{i} \cdot 2^{n - 1 - i} \cdot \binom{m - 2 n}{p - 1 - (n - 1 + i)} \cdot (p - 1)! \cdot (m - p)!\right) \div m!
$$

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

template <int MOD>
struct ModInt {
    int val;
    ModInt(ll v = 0) : val(v % MOD) { if (val < 0) val += MOD; };
    ModInt operator+() const { return ModInt(val); }
    ModInt operator-() const { return ModInt(MOD - val); }
    ModInt inv() const {
        auto a = val, m = MOD, u = 0, v = 1;
        while (a != 0) { auto t = m / a; m -= t * a; swap(a, m); u -= t * v; swap(u, v); }
        assert(m == 1);
        return u;
    }
    ModInt pow(ll n) const {
        auto x = ModInt(1);
        auto b = *this;
        while (n > 0) {
            if (n & 1) x *= b;
            n >>= 1;
            b *= b;
        }
        return x;
    }
    friend ModInt operator+ (ModInt lhs, const ModInt& rhs) { return lhs += rhs; }
    friend ModInt operator- (ModInt lhs, const ModInt& rhs) { return lhs -= rhs; }
    friend ModInt operator* (ModInt lhs, const ModInt& rhs) { return lhs *= rhs; }
    friend ModInt operator/ (ModInt lhs, const ModInt& rhs) { return lhs /= rhs; }
    ModInt& operator+=(const ModInt& x) { if ((val += x.val) >= MOD) val -= MOD; return *this; }
    ModInt& operator-=(const ModInt& x) { if ((val -= x.val) < 0) val += MOD; return *this; }
    ModInt& operator*=(const ModInt& x) { val = int64_t(val) * x.val % MOD; return *this; }
    ModInt& operator/=(const ModInt& x) { return *this *= x.inv(); }
    bool operator==(const ModInt& b) const { return val == b.val; }
    bool operator!=(const ModInt& b) const { return val != b.val; }
    friend std::istream& operator>>(std::istream& is, ModInt& x) noexcept { return is >> x.val; }
    friend std::ostream& operator<<(std::ostream& os, const ModInt& x) noexcept { return os << x.val; }
};
using mint = ModInt<1'000'000'007>;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, p;
    cin >> m >> n >> p;
    if (n == 0 && p == 0) {
        cout << 1 << endl;
        return 0;
    }

    if (p < n || p == m) {
        cout << 0 << endl;
        return 0;
    }

    vector<mint> fac(m + 1), pow(m + 1), invfac(m + 1);
    fac[0] = pow[0] = 1;
    for (int i = 1; i <= m; i++) {
        fac[i] = fac[i - 1] * i;
        pow[i] = pow[i - 1] * 2;
    }

    invfac[m] = fac[m].inv();
    for (int i = m - 1; i >= 0; i--) {
        invfac[i] = invfac[i + 1] * (i + 1);
    }

    auto C = [&](int n, int k) -> mint {
        if (k > n || k < 0) return 0;
        return fac[n] * invfac[k] * invfac[n - k];
    };

    mint tot = fac[m];
    mint win = 0;

    for (int i = 0; i < n; i++) { // 枚举被涂了两次的格子的个数
        win += C(n - 1, i) * pow[n - 1 - i] * C(m - 2 * n, p - 1 - (n - 1 + i)) * 2 * n * fac[p - 1] * fac[m - p];
    }

    cout << win / tot << endl;
    return 0;
}
{{< /code >}}

## M. 连通分量计数

考虑树形 dp，设 $dp_{i, j, k}$ 为选择 $i$ 的子树中的节点的方式，使得导出子图中有 $j$ 个连通分量，$k$ 代表节点 $i$ 是否被选择。转移比较暴力，我们直接看 dfs 的代码：

```cpp
auto dfs(int u, int p) -> vector<vector<mint>> {
    vector dp(2, vector<mint>(2));
    dp[0][0] = 1;
    dp[1][1] = 1;

    for (auto v : g[u]) {
        if (v == p) continue;

        auto res = dfs(v, u);

        // 每次将 v 子树的结果加入当前结果中，所以新的结果最多有dp.size() + res.size() 
        // 个连通分量
        vector ndp(dp.size() + res.size() - 1, vector<mint>(2, 0));
        for (int i = 0; i < (int)dp.size(); i++) {
            for (int j = 0; j < (int)res.size(); j++) {
                // 不选 u 的时候，子树中的连通分量互不干扰，
                // 所以连通分量的个数为 i + j
                ndp[i + j][0] += dp[i][0] * (res[j][0] + res[j][1]);
                // 选 u 的时候，如果 v 不选，连通分量的个数也是直接相加
                ndp[i + j][1] += dp[i][1] * res[j][0];
                // 如果选 u 并且选 v 的话，会有两个连通分量相连，
                // 所以总的连通分量个数为 i + j - 1
                if (i + j > 0) {
                    ndp[i + j - 1][1] += dp[i][1] * res[j][1];
                }
            }
        }
        swap(dp, ndp);
    }

    return dp;
};
```

整个 dfs 乍一看是 $O(n^3)$ 的，如果我们像上面那样只转移到当前处理过子树的大小之和，整个过程其实是 $O(n^2)$ 的（证明略，我也不会）。

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
template <typename T, T MOD>
struct ModInt {
    using prod_type = std::conditional_t<std::is_same_v<T, int>, long long, __int128>;
    T val;
    ModInt(const prod_type v = 0) : val(v % MOD) { if (val < 0) val += MOD; };
    ModInt operator+() const { return ModInt(val); }
    ModInt operator-() const { return ModInt(MOD - val); }
    ModInt inv() const {
        auto a = val, m = MOD, u = 0, v = 1;
        while (a != 0) {
            auto t = m / a;
            m -= t * a;
            std::swap(a, m);
            u -= t * v;
            std::swap(u, v);
        }
        assert(m == 1);
        return u;
    }
    ModInt pow(prod_type n) const {
        auto x = ModInt(1);
        auto b = *this;
        while (n > 0) {
            if (n & 1)
                x *= b;
            n >>= 1;
            b *= b;
        }
        return x;
    }
    friend ModInt operator+(ModInt lhs, const ModInt &rhs) { return lhs += rhs; }
    friend ModInt operator-(ModInt lhs, const ModInt &rhs) { return lhs -= rhs; }
    friend ModInt operator*(ModInt lhs, const ModInt &rhs) { return lhs *= rhs; }
    friend ModInt operator/(ModInt lhs, const ModInt &rhs) { return lhs /= rhs; }
    ModInt &operator+=(const ModInt &x) {
        if ((val += x.val) >= MOD)
            val -= MOD;
        return *this;
    }
    ModInt &operator-=(const ModInt &x) {
        if ((val -= x.val) < 0)
            val += MOD;
        return *this;
    }
    ModInt &operator*=(const ModInt &x) {
        val = prod_type(val) * x.val % MOD;
        return *this;
    }
    ModInt &operator/=(const ModInt &x) { return *this *= x.inv(); }
    bool operator==(const ModInt &b) const { return val == b.val; }
    bool operator!=(const ModInt &b) const { return val != b.val; }
    friend std::istream &operator>>(std::istream &is, ModInt &x) noexcept {
        return is >> x.val;
    }
    friend std::ostream &operator<<(std::ostream &os, const ModInt &x) noexcept {
        return os << x.val;
    }
};
using ModInt1000000007 = ModInt<int, 1'000'000'007>;
using ModInt998244353 = ModInt<int, 998244353>;
using namespace std;
using ll = long long;
using mint = ModInt998244353;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;

    vector<vector<int>> g(n);
    for (int i = 1; i < n; i++) {
        int u, v;
        cin >> u >> v;
        u--, v--;
        g[u].push_back(v);
        g[v].push_back(u);
    }

    auto dfs = [&](auto& slf, int u, int p) -> vector<vector<mint>> {
        vector dp(2, vector<mint>(2));
        dp[0][0] = 1;
        dp[1][1] = 1;

        for (auto v : g[u]) {
            if (v == p) continue;

            auto res = slf(slf, v, u);

            vector ndp(dp.size() + res.size() - 1, vector<mint>(2, 0));
            for (int i = 0; i < (int)dp.size(); i++) {
                for (int j = 0; j < (int)res.size(); j++) {
                    ndp[i + j][0] += dp[i][0] * (res[j][0] + res[j][1]);
                    ndp[i + j][1] += dp[i][1] * res[j][0];
                    if (i + j > 0) {
                        ndp[i + j - 1][1] += dp[i][1] * res[j][1];
                    }
                }
            }
            swap(dp, ndp);
        }

        return dp;
    };

    auto res = dfs(dfs, 0, 0);
    for (int i = 1; i <= n; i++) {
        cout << res[i][0] + res[i][1] << '\n';
    }

    return 0;
}
{{< /code >}}
