---
title: "多模式串匹配的3种方法"
date: 2021-06-29T18:25:46-04:00
categories: [算法笔记,题解]
tags: [哈希,AC自动机,后缀自动机]
---

<!--more-->

例题： [Another Substring Query Problem](https://open.kattis.com/problems/anothersubstringqueryproblem)

由于次题中模式串有重复，会影响时间复杂度，所以我们要提前处理相同的字符串。下面的方法均假设无重复模式串。并以$n$为模式串的总长度，$m$为文本串的长度。

## 方法一：字符串哈希

由于总长为$n$的模式串最多只有$O(\sqrt{n})$种长度，所以我们可以遍历每种长度$l$然后遍历每个位置$i$然后判断从$i$开始长度为$l$的子串是否是模式串。时间复杂度为$O(\sqrt{n}m)$。


{{% collapse 代码 %}}
```cpp
#include <bits/stdc++.h>

using namespace std;
using ll = long long;
using ull = unsigned long long;

struct PolyHash {
    static constexpr int mod = (int)1e9 + 123;
    static vector<int> pow;
    static constexpr int base = 233;

    vector<int> pref;
    PolyHash(const string &s) : pref(s.size() + 1) {
        assert(base < mod);
        int n = (int)s.size();
        while ((int)pow.size() <= n) {
            pow.push_back((ll)pow.back() * base % mod);
        }
        for (int i = 0; i < n; i++) {
            pref[i + 1] = ((ll)pref[i] * base + s[i]) % mod;
        }
    }

    int get_hash() { return pref.back(); }

    int substr(int pos, int len) {
        return (pref[pos + len] - (ll)pref[pos] * pow[len] % mod + mod) % mod;
    }
};
vector<int> PolyHash::pow{1};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    cin >> s;
    int len = (int)s.size();
    PolyHash ha(s);
    int q;
    cin >> q;
    vector<string> qstr(q);
    vector<int> qk(q);
    vector<vector<int>> lens(len + 1);
    vector<int> ans(q);
    for (int i = 0; i < q; i++) {
        cin >> qstr[i] >> qk[i];
        if ((int)qstr[i].size() <= len)
            lens[qstr[i].size()].push_back(i);
        else
            ans[i] = -1;
    }
    for (int l = 1; l <= len; l++) {
        if (lens[l].empty()) continue;
        unordered_map<int, vector<int>> mp, poss;
        for (auto i : lens[l]) {
            mp[PolyHash(qstr[i]).get_hash()].push_back(i);
        }
        for (int p = 0; p + l <= len; p++) {
            if (mp.count(ha.substr(p, l))) {
                poss[ha.substr(p, l)].push_back(p);
            }
        }
        for (auto &[h, v] : mp) {
            auto &pos = poss[h];
            for (auto i : v) {
                if (pos.size() >= qk[i]) ans[i] = pos[qk[i] - 1] + 1;
                else
                    ans[i] = -1;
            }
        }
    }
    for (auto x : ans)
        cout << x << '\n';
}
```
{{% /collapse %}}

## 方法二：AC自动机

先将所有模式串加入AC自动机，然后再匹配文本串。注意AC自动机中要维护output link（沿fail link跳转时第一个模式串）。时间复杂度$O(n+m+m\sqrt{n})$。

{{% collapse 代码 %}}
```cpp
#include <bits/stdc++.h>

using namespace std;

struct AhoCorasick {
    enum { alpha = 26, first = 'a' }; // change this!
    struct Node {
        // (nmatches is optional)
        int back, end = -1, nmatches = 0, output = -1;
        array<int, alpha> next;
        Node(int v = -1) { fill(next.begin(), next.end(), v); }
    };
    vector<Node> N;

    AhoCorasick() : N(1) {}

    void insert(string &s, int j) { // j: id of string s
        assert(!s.empty());
        int n = 0;
        for (char c : s) {
            int &m = N[n].next[c - first];
            if (m == -1) {
                n = m = (int)N.size();
                N.emplace_back();
            } else
                n = m;
        }
        N[n].end = j;
        N[n].nmatches++;
    }

    void build() {
        N[0].back = (int)N.size();
        N.emplace_back(0);

        queue<int> q;
        q.push(0);
        while (!q.empty()) {
            int n = q.front();
            q.pop();
            for (int i = 0; i < alpha; i++) {
                int pnx = N[N[n].back].next[i];
                auto &nxt = N[N[n].next[i]];
                if (N[n].next[i] == -1) N[n].next[i] = pnx;
                else {
                    nxt.back = pnx;
                    nxt.output = N[pnx].end == -1 ? N[pnx].output : pnx;
                    q.push(N[n].next[i]);
                }
            }
        }
    }

    vector<vector<int>> find(const string &text) {
        int n = 0;
        vector<vector<int>> res(text.size()); // ll count = 0;
        for (int i = 0; i < (int)text.size(); i++) {
            n = N[n].next[text[i] - first];
            if (N[n].end != -1) {
                res[i].push_back(N[n].end);
            }
            for (int ind = N[n].output; ind != -1; ind = N[ind].output) {
                res[i].push_back(N[ind].end);
            }
        }
        return res;
    }
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    cin >> s;
    AhoCorasick ac;
    int q;
    cin >> q;
    unordered_map<string, int> mp;
    vector<string> qstr(q);
    vector<int> qk(q), ans(q);
    vector<vector<int>> same(q);
    for (int i = 0; i < q; i++) {
        cin >> qstr[i] >> qk[i];
        if (!mp.count(qstr[i])) {
            mp[qstr[i]] = mp.size();
            ac.insert(qstr[i], mp.size() - 1);
        }
        same[mp[qstr[i]]].push_back(i);
    }
    ac.build();
    auto v = ac.find(s);
    vector<vector<int>> pos(mp.size());
    for (int i = 0; i < (int)v.size(); i++) {
        for (auto p : v[i]) {
            pos[p].push_back(i);
        }
    }
    for (int i = 0; i < (int)mp.size(); i++) {
        for (auto qi : same[i]) {
            if (pos[i].size() >= qk[qi]) {
                ans[qi] = pos[i][qk[qi] - 1] - qstr[qi].size() + 2;
            } else {
                ans[qi] = -1;
            }
        }
    }
    for (auto x : ans)
        cout << x << '\n';
}
```
{{% /collapse %}}

## 方法三：后缀数据结构

后缀数据结构也能是很擅长字符串匹配的，后缀树和后缀自动机都可以解决本题，由于没学过后缀树就只写后缀自动机的做法了：

[英文原文](https://cp-algorithms.com/string/suffix-automaton.html#toc-tgt-21)

[中文翻译](https://oi-wiki.org/string/sam/#_20)

注意后缀自动机是这三种做法中唯一可以在线处理询问的做法，处理单次询问的时间复杂度为$O(|s|+occurrence)$，occurrence为出现次数。整体时间复杂度$O(m+n+m\sqrt{n})$。

{{% collapse 代码 %}}
```cpp
#include <bits/extc++.h>
using namespace std;

struct SAM {
    struct state {
        int len = 0, link = -1;
        unordered_map<char, int> next;
        bool is_clone;
        int first_pos;
        vector<int> inv_link;
    };

    int last = 0; // the index of the equivalence class of
                  // the whole string
    vector<state> st;

    void extend(char c) {
        int cur = (int)st.size();
        st.emplace_back();
        st[cur].len = st[last].len + 1;
        st[cur].first_pos = st[cur].len - 1;

        int p = last;
        while (p != -1 && !st[p].next.count(c)) {
            st[p].next[c] = cur;
            p = st[p].link;
        }
        if (p == -1) st[cur].link = 0;
        else {
            int q = st[p].next[c];
            if (st[p].len + 1 == st[q].len) {
                st[cur].link = q;
            } else {
                int clone = (int)st.size();
                st.push_back(st[q]);
                st[clone].len = st[p].len + 1;
                st[clone].is_clone = true;
                while (p != -1 && st[p].next[c] == q) {
                    st[p].next[c] = clone;
                    p = st[p].link;
                }
                st[q].link = st[cur].link = clone;
            }
        }
        last = cur;
    }

    SAM() { st.emplace_back(); }

    SAM(const string &s) : SAM() {
        for (auto c : s)
            extend(c);
        for (int v = 1; v < (int)st.size(); v++) {
            st[st[v].link].inv_link.push_back(v);
        }
    }
    vector<int> get_all_occur(const string &s) {
        vector<int> pos;
        int cur = 0;
        for (auto c : s) {
            if (!st[cur].next.count(c)) return pos;
            cur = st[cur].next[c];
        }
        auto dfs = [&](auto &slf, int v) -> void {
            if (!st[v].is_clone)
                pos.push_back(st[v].first_pos - s.size() + 1);
            for (int u : st[v].inv_link)
                slf(slf, u);
        };
        dfs(dfs, cur);
        return pos;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    cin >> s;
    SAM sam(s);
    int q;
    cin >> q;
    unordered_map<string, vector<int>> mp;
    vector<string> qstr(q);
    vector<int> qk(q), ans(q);
    for (int i = 0; i < q; i++) {
        cin >> qstr[i] >> qk[i];
        mp[qstr[i]].push_back(i);
    }
    for (auto &[str, idxs] : mp) {
        auto pos = sam.get_all_occur(str);
        sort(pos.begin(), pos.end());
        for (auto i : idxs) {
            if (pos.size() >= qk[i]) ans[i] = pos[qk[i] - 1] + 1;
            else
                ans[i] = -1;
        }
    }
    for (auto x : ans)
        cout << x << '\n';
    return 0;
}
```
{{% /collapse %}}

## 总结

三种做法各有各的优缺点，就本题来看三种做法的时间复杂度相同，时间如下：

1. AC自动机 2.55秒 （但我有一种很愚蠢的写法竟然只要1.32秒）
2. 哈希 3.41秒
3. 后缀自动机 4.83秒 (可能因为后缀自动机本身常数比较大)
