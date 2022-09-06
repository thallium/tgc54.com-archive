---
title: "COMPFEST 14部分题解（ABCEFGHKLM）"
date: 2022-09-04T19:00:40-04:00
summary: "难度适中的比赛"
keywords: ["COMPFEST 14"]
tags: ["COMPFEST"]
categories: ["比赛题解"]
---
## A. Accumulation of Dominoes

签到题，如果 $m = 1$ 输出 $n - 1$，否则输出 $n \cdot (m - 1)$。

## B. Basketball Together

贪心，排序后用大的数配小的数。

## C. Circular Mirror

直径所对圆周角为90度，所以当直径上两个点颜色相同时，其他的点不能与直径的颜色相同。设直径的条数为 $d$，于是我们可以枚举直径颜色相同的条数 $k$，首先选 $k$条直径，然后为每条直径选一个颜色，然后从剩下的 $M - k$ 个颜色中给剩下的每条直径选两个颜色，再从剩下的 $M - k$个颜色中给每个剩下的非直径的点选一个颜色，所以答案为:
$$\sum_{k=0}^{\min(d, M)} {d \choose k}{M \choose k}k!\left({M - k \choose 2}\cdot 2!\right)^{d - k}(M - i)^{N - 2 * d}$$

## E. Electrical Efficiency

考虑每条边对答案的贡献，遍历所有质数，设当前的质数为 $p$，令 $S$ 为因子含 $p$ 的点的集合，当 $x, y, z\in S$ 中任意两点的路径经过某条边时，该边会对答案产生1的贡献。以任意点为根，对边 $(u, v)$ （$u$ 为 $v$ 的父亲）来说，有$\binom{|S|}{3} - \binom{s}{3} - \binom{|S|-s}{3}$（$s$ 为 $v$ 子树的大小）个三元组经过这条边，用树型dp就能求解，但要是对于每个质数都遍历一遍整个树的话必然要超时所以我们以 $S$ 中的点构造虚树，在虚树上跑dp，由于 $A_x$ 最多有 $\log(A_x)$ 个不重复的质因子，所以所有 $|S|$ 的和是 $O(N\log(\max(A)))$ 的。

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>

constexpr unsigned lg(int x) {
    return sizeof(int) * 8 - 1 - __builtin_clz(x);
}
constexpr unsigned lg(unsigned int x) {
    return sizeof(unsigned) * 8 - 1 - __builtin_clz(x);
}
constexpr unsigned lg(long x) {
    return sizeof(long) * 8 - 1 - __builtin_clzl(x);
}
constexpr unsigned lg(unsigned long x) {
    return sizeof(unsigned long) * 8 - 1 - __builtin_clzl(x);
}
constexpr unsigned lg(long long x) {
    return sizeof(long long) * 8 - 1 - __builtin_clzll(x);
}
constexpr unsigned lg(unsigned long long x) {
    return sizeof(unsigned long long) * 8 - 1 - __builtin_clzll(x);
}
constexpr unsigned ceil_lg(int n) {
    return n == 0 ? 0 : 32 - __builtin_clz(n - 1);
}

template <typename T> struct SparseTable {
    size_t n, logn;
    std::vector<std::vector<T>> v;
    std::function<T(T, T)> F;
    SparseTable() = default;
    SparseTable(const std::vector<T> &a, std::function<T(T, T)> func)
        : n(a.size()), logn(lg(n)), v(logn + 1, std::vector<T>(n + 1)), F(func) {
        v[0] = a;
        for (size_t i = 1; i <= logn; i++)
            for (size_t j = 0; j + (1 << i) - 1 < n; j++)
                v[i][j] = F(v[i - 1][j], v[i - 1][j + (1 << (i - 1))]);
    }
    T query(size_t l, size_t r) {
        assert(l < r);
        assert(l < n);
        assert(r <= n);
        int s = lg(r - l);
        return F(v[s][l], v[s][r - (1 << s)]);
    }
};

struct EulerLCA {
    int n;
    std::vector<int> pos, seq, dep;
    SparseTable<int> st;
    EulerLCA(const std::vector<std::vector<int>>& g, int root) : n(g.size()), pos(n), dep(n) {
        seq.reserve(2 * n);
        dfs(root, root, g);
        st = SparseTable<int>(seq, [&](int u, int v) { return pos[u] < pos[v] ? u : v; });
    }
    void dfs(int u, int p, const std::vector<std::vector<int>>& g) {
        pos[u] = seq.size();
        seq.push_back(u);
        for (auto v : g[u]) {
            if (v == p) continue;
            dep[v] = dep[u] + 1;
            dfs(v, u, g);
            seq.push_back(u);
        }
    }
    int lca(int u, int v) {
        if (pos[u] > pos[v]) std::swap(u, v);
        return st.query(pos[u], pos[v] + 1);
    }
};
struct VirtualTree {
    int n;
    EulerLCA lca;
    std::vector<std::vector<int>> tree;
    VirtualTree(const std::vector<std::vector<int>> &g, int root)
        : n(g.size()), lca(g, root), tree(n) {}
    auto build_tree(const std::vector<int> &vertices)
        -> std::pair<int, const std::vector<std::vector<int>> &> {
        auto v(vertices);
        std::sort(v.begin(), v.end(), [&](int u, int v) { return lca.pos[u] < lca.pos[v]; });
        int len = v.size();
        for (int i = 1; i < len; i++) {
            v.push_back(lca.lca(v[i - 1], v[i]));
        }
        std::sort(v.begin(), v.end(), [&](int u, int v) { return lca.pos[u] < lca.pos[v]; });
        v.erase(std::unique(v.begin(), v.end()), v.end());
        for (int i = 1; i < (int)v.size(); i++) {
            tree[lca.lca(v[i - 1], v[i])].push_back(v[i]);
        }
        return {v[0], tree};
    }
    void clear(const std::vector<int> v) {
        for (auto u : v) {
            tree[u].clear();
        }
    }
    void clear(int root) {
        for (auto v : tree[root]) {
            clear(v);
        }
        tree[root].clear();
    }
};
template <typename mint> struct Factorial {
    std::vector<mint> fac, invfac;
    Factorial(int n) : fac(n + 1), invfac(n + 1) {
        fac[0] = 1;
        for (int i = 1; i <= n; i++) {
            fac[i] = fac[i - 1] * i;
        }
        invfac[n] = fac[n].inv();
        for (int i = n - 1; i >= 0; i--) {
            invfac[i] = invfac[i + 1] * (i + 1);
        }
    }
    mint C(int n, int k) {
        if (k < 0 || k > n) return 0;
        assert((int)size(fac) > n);
        return fac[n] * invfac[n - k] * invfac[k];
    }
    mint P(int n, int m) {
        assert(!fac.empty());
        return fac[n] * invfac[n - m];
    }
    template<typename... Args>
    constexpr mint eval(Args... args) {
        return ((args > 0 ? fac[args] : invfac[-args]) * ...);
    }
};
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
using mint = ModInt<998244353>;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> a(n);
    int mx = 0;
    for (auto& x : a) {
        cin >> x;
        mx = max(mx, x);
    }
    vector<int> minp(mx + 1), primes;
    for (int i = 2; i <= mx; i++) {
        if (minp[i] == 0) {
            minp[i] = i;
            primes.push_back(i);
        }
        for (auto p : primes) {
            if (i * p > mx) {
                break;
            }
            minp[i * p] = p;
            if (i % p == 0) {
                break;
            }
        }
    }
    vector<vector<int>> p(mx + 1);
    for (int i = 0; i < n; i++) {
        int x = a[i];
        while (x > 1) {
            int f = minp[x];
            p[f].push_back(i);
            while (x % f == 0) {
                x /= f;
            }
        }
    }
    vector<vector<int>> g(n);
    for (int i = 1; i < n; i++) {
        int u, v;
        cin >> u >> v;
        u--, v--;
        g[u].push_back(v);
        g[v].push_back(u);
    }
    VirtualTree tr(g, 0);
    Factorial<mint> f(n);
    mint ans = 0;
    for (int fac = 1; fac <= mx; fac++) {
        if (p[fac].size() < 3) {
            continue;
        }
        auto res = tr.build_tree(p[fac]);
        auto root = res.first;
        const auto& tree = res.second;
        auto dfs = [&](auto& slf, int u) -> int {
            int size = a[u] % fac == 0;
            for (auto v : tree[u]) {
                int sz = slf(slf, v);
                size += sz;
                ans += (tr.lca.dep[v] - tr.lca.dep[u]) * (f.C(p[fac].size(), 3) - f.C(sz, 3) - f.C(p[fac].size() - sz, 3));
            }
            return size;
        };
        dfs(dfs, root);
        tr.clear(root);
    }
    cout << ans << '\n';
}
{{< /code >}}

## F. Field Photography

OR的条件很好满足：只要先都往右移动若干个 $W$ 就可以了，不难看出最小的移动单位为$LSB(W)$（Least Significant Bit，最低位），所以线段覆盖的点的位置模$LSB(W)$是不变的，于是这个问题就变成了模$LSB(W)$意义下的线段覆盖问题。由于$LSB(W)$只有31种情况，可以预处理然后$O(1)$回答询问。
{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;

    vector<int> ans(30);

    vector<int> l(n), r(n);
    for (int i = 0; i < n; i++) {
        cin >> l[i] >> r[i];
        l[i]--;
    }

    for (int j = 0; j < 30; j++) {
        vector<array<int, 2>> events;
        for (int i = 0; i < n; i++) {
            if (r[i] - l[i] >= (1 << j)) {
                events.push_back({0, 1});
            } else {
                int L = l[i] % (1 << j);
                int R = r[i] % (1 << j);
                if (L < R) {
                    events.push_back({L, 1});
                    events.push_back({R, -1});
                } else {
                    events.push_back({0, 1});
                    events.push_back({L, 1});
                    events.push_back({R, -1});
                }
            }
        }

        int cur = 0;
        sort(events.begin(), events.end());
        for (auto [_, v] : events) {
            cur += v;
            ans[j] = max(ans[j], cur);
        }
    }

    int q;
    cin >> q;
    while (q--) {
        int x;
        cin >> x;
        cout << ans[__builtin_ctz(x)] << "\n";
    }
}
{{< /code >}}

## G. Garage

不会数学，打表+[OEIS](https://oeis.org/A024352)查的。。。

## H. Hot Black Hot White

首先不难证明 $\operatorname{concat}(A_i, A_j)\bmod 3 = (A_i + A_j) \bmod 3$。于是题目中的等式就变成了:
$$\begin{align*} \text{concat}(A_i, A_j) \times \text{concat}(A_j, A_i) + A_i A_j & \equiv Z \mod 3 \\\ (A_i + A_j) (A_i + A_j) + A_i A_j & \equiv Z \mod 3 \\\ A_i^2 + 2 A_i A_j + A_j^2 + A_i A_j & \equiv Z \mod 3 \\\ A_i^2 + A_j^2 + 3 A_i A_j & \equiv Z \mod 3 \\\ A_i^2 + A_j^2 & \equiv Z \mod 3\end{align*}$$

然后可以发现 $A_i^2\bmod 3$ 只可能是0或者1。于是我们得到两种情况：
- 如果 $A_i^2\bmod 3 = 0$ 的石头的个数小于等于$\frac N 2$的话，将所有 $A_i^2\bmod 3 = 0$ 的时候分到一组并取$Z=2$就可以避免上述等式成立。
- 否则 $A_i^2\bmod 3 = 1$ 的石头的个数小于等于$\frac N 2$，类似地我们将$A_i^2\bmod 3 = 1$ 的石头分到一组并取$Z=0$。

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<vector<int>> a(2);
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x % 3 == 0) {
            a[0].push_back(i);
        } else {
            a[1].push_back(i);
        }
    }
    string ans(n, '0');
    if (a[0].size() <= n / 2) {
        cout << "0\n";
        for (auto& x : a[0]) ans[x] = '1';
        for (int i = 0; i < n / 2 - a[0].size(); i++){
            ans[a[1][i]] = '1';
        }
    } else {
        cout << "2\n";
        for (auto& x : a[1]) ans[x] = '1';
        for (int i = 0; i < n / 2 - a[1].size(); i++){
            ans[a[0][i]] = '1';
        }
    }
    cout << ans << endl;
}
{{< /code >}}

## K. Kingdom of Criticism

由于第三种询问会使高度的种类减小2到若干种而第一种询问只会使高度的种类增加1，所以所有第三种操作减少的高度的种类不超过 $K + Q$ ($K$为初初始的高度的种类)。所以可以将高度相同的建筑归为一组，第三种操作也就相当于把高度在 $[L, R]$ 中的建筑与高度为 $L - 1$ 的建筑或高度为 $R + 1$ 的建筑合并（根据离哪个端点近）。于是我们想到可以使用并查集来实现合并操作，同时记录每个高度的组在并查集中所对应的树的根,这样可以快速知道高度在并查集中所对应的树。但第一种询问对应的却是一种删除的操作，但并查集不支持删除操作，所以我们直接给建筑 $k$ 赋予一个新的编号，这样就变相实现了删除的效果。

{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;

struct UF {
    vector<int> fa, sz;
    UF(int n) : fa(n), sz(n, 1) { iota(fa.begin(), fa.end(), 0); }

    int find(int x) { return fa[x] == x ? x : fa[x] = find(fa[x]); }

    bool same(int x, int y) { return find(x) == find(y); }

    bool join(int x, int y) {
        x = find(x), y = find(y);
        if (x == y) return false;
        // if (sz[x] > sz[y]) swap(x, y);
        fa[x] = y;
        sz[y] += sz[x];
        return true;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> a(n);
    map<int, int> leader;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    int q;
    cin >> q;
    UF uf(n + q);
    vector<int> value(n + q), cur(n);
    for (int i = 0; i < n; i++) {
        value[i] = a[i];
        cur[i] = i;
        if (leader.count(a[i])) {
            uf.join(i, leader[a[i]]);
        } else {
            leader[a[i]] = i;
        }
    }
    int cnt = n;
    while (q--) {
        int op;
        cin >> op;
        if (op == 1) {
            int k, w;
            cin >> k >> w;
            k--;
            cur[k] = cnt++;
            value[cur[k]] = w;
            if (leader.count(w)) {
                uf.join(cur[k], leader[w]);
            } else {
                leader[w] = cur[k];
            }
        } else if (op == 2) {
            int k;
            cin >> k;
            k--;
            cout << value[uf.find(cur[k])] << '\n';
        } else {
            int l, r;
            cin >> l >> r;
            auto it = leader.lower_bound(l);
            while (it != end(leader) && it->first <= r) {
                int change_to = it->first <= (l + r) / 2 ? l - 1 : r + 1;
                if (leader.contains(change_to)) {
                    uf.join(it->second, leader[change_to]);
                } else {
                    leader[change_to] = it->second;
                    value[it->second] = change_to;
                }
                it = leader.erase(it);
            }
        }
    }
}
{{< /code >}}

## L. Lemper Cooking Competition

观察到操作对于前缀和数组的影响就是交换位置 $i - 1$ 与位置 $i$，由于最后要求 $A_i$ 为非负，那么最终的前缀和数组便是非降的，于是问题就变成了数逆序对，但要注意位置 $n - 1$ 与位置 $n$ 是不能交换的，提前特判一下即可。
{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <algorithm>
#include <bits/stdc++.h>
using namespace std;
#define all(x) begin(x),end(x)
using ll = long long;

template <typename T> struct fenwick {
    int n; std::vector<T> t;
    fenwick(int n_) : n(n_), t(n + 1) {}
    fenwick(const std::vector<T> &v) : fenwick((int)v.size()) {
        for (int i = 1; i <= n; i++) {
            t[i] += v[i - 1];
            int j = i + (i & -i);
            if (j <= n) t[j] += t[i];
        }
    }
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
    int search(T prefix) { // finds first pos s.t. sum(0, pos)>=prefix
        int pos = 0;
        T sum = 0;
        for (int i = __lg(n); i >= 0; i--) {
            // could change < to <= to make it find upper bound
            if (pos + (1 << i) <= n && (sum + t[pos + (1 << i)] < prefix)) {
                pos += (1 << i);
                sum += t[pos];
            }
        }
        return pos;
    }
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<ll> a(n);
    for (auto& x : a) cin >> x;
    for (int i = 1; i < n; i++) {
        a[i] += a[i - 1];
    }
    auto b = a;
    sort(begin(b), end(b) - 1);
    if (!is_sorted(all(b)) || b[0] < 0) {
        cout << "-1\n";
        return 0;
    }
    b.erase(unique(all(b)), end(b));
    fenwick<int> tr(b.size());
    ll ans = 0;
    for (int i = n - 1; i >= 0; i--) {
        auto idx = lower_bound(all(b), a[i]) - begin(b);
        if (idx > 0)
            ans += tr.query(idx - 1);
        tr.add(idx, 1);
    }
    cout << ans << '\n';
}
{{< /code >}}

## M. Moving Both Hands

新建一层图为原图的反向图，然后每个节点连一条从原图到新图，长度为0的边，然后跑最最短路看到新图每个节点的距离即可。
{{< code language="cpp" title="代码" isCollapsed="true" >}}
#include <bits/stdc++.h>
using namespace std;

constexpr long long INF = 1e18;
template <typename G>
std::vector<long long> dijkstra(const G &g, int start) {
    std::vector dis(g.size(), INF);
    using node = std::pair<long long, int>;
    std::priority_queue<node, std::vector<node>, std::greater<>> q;
    dis[start] = 0;
    q.emplace(0, start);
    while (!q.empty()) {
        auto [d, u] = q.top();
        q.pop();
        if (d != dis[u]) continue;
        for (auto [v, cost] : g[u]) {
            if (dis[v] > dis[u] + cost) {
                dis[v] = dis[u] + cost;
                q.emplace(dis[v], v);
            }
        }
    }
    return dis;
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<vector<pair<int, int>>> g(n * 2);
    for (int i = 0; i < m; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        u--, v--;
        g[u].push_back({v, w});
        g[v + n].push_back({u + n, w});
    }
    for (int i = 0; i < n; i++) {
        g[i].push_back({i + n, 0});
    }
    auto dis = dijkstra(g, 0);
    for (int i = n + 1; i < 2 * n; i++) {
        cout << (dis[i] == INF ? -1 : dis[i]) << " ";
    }
    cout << endl;
}
{{< /code >}}
