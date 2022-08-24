---
title: "后缀自动机应用之求字典序第k小子串（包括与不包括相同子串）"
date: 2021-07-01T10:43:44-04:00
categories: [算法笔记]
tags: [后缀自动机]
---

<!--more-->

## 不包括相同子串

后缀自动机中每一个路径都代表一个子串，所以第k小子串就对应第k小路径，所以我们可以先计算从每个状态开始有多少条路径，然后再根据k判断走哪条路径。计算路径的方法如下：
$$path_u=1+\sum_{v\in next}path_v$$

## 包括相同子串

由于标准的后缀自动机里是体现不出重复路径的信息的，所以我们要在上问的基础上维护每个状态代表的子串们出现的次数$occur$:

$$occur_u=\sum_{v\in next}occur_v$$

如何理解？当前状态的子串们都是下一个状态子串们的前缀，所以下一个状态的出现次数应当加到当前状态上。特别的，如果当前状态是终止状态，它的出现次数应为1。

路径数的计算与前面类似：
$$path_u=occur_u+\sum_{v\in next}path_v$$

例题：[[TJOI2015]弦论](https://www.luogu.com.cn/problem/P3975)

代码：

```cpp
#include <bits/stdc++.h>

using namespace std;
using ll = long long;

int t;
struct SAM {
    struct state {
        int len = 0, link = -1;
        unordered_map<char, int> next;
        bool is_term;
        ll occur = 0, path_cnt=0;
    };
    // the index of the equivalence class of the whole string
    int last = 0;
    vector<state> st;

    void extend(char c) {
        int cur = (int)st.size();
        st.emplace_back();
        st[cur].len = st[last].len + 1;

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
        int p = last;
        while (p != 0) {
            st[p].is_term = true;
            p = st[p].link;
        }
    }

    void dfs(int i) {
        if (st[i].occur) return;
        if (st[i].is_term) st[i].occur++;
        for (auto [_, v] : st[i].next) {
            dfs(v);
            st[i].occur += st[v].occur;
            st[i].path_cnt += st[v].path_cnt;
        }
        st[i].path_cnt += t ? st[i].occur : 1;
    }

    string query(ll k) {
        string ans;
        int cur = 0;
        while (k > 0) {
            for (char c = 'a'; c <= 'z'; c++) {
                if (!st[cur].next.count(c)) continue;
                auto &nxt = st[st[cur].next[c]];
                if (nxt.path_cnt < k) k -= nxt.path_cnt;
                else {
                    ans += c;
                    cur = st[cur].next[c];
                    k -= t ? st[cur].occur : 1;
                    break;
                }
            }
        }
        return ans;
    }
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    int k;
    cin >> s >> t >> k;
    int len = (int)s.size();
    SAM sa(s);
    sa.dfs(0);
    if (sa.st[0].path_cnt<k) cout<< -1 <<'\n';
    else cout << sa.query(k);
    return 0;
}
```
