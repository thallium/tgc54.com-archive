---
title: "CodeForces 5C - Longest Regular Bracket Sequence 题解"
date: 2021-07-01T12:41:39-04:00
categories: [题解]
tags: [dp]
---

<!--more-->
注：下文的regular bracket sequence 简写为RBS

首先对于每个右括号，我们找到与其配对的左括号（也就是该右括号往左最短的RBS）的位置$l$（如果没有配对的就是-1），比如样例对应的位置就是

|下标|0  |1  |2  |3  |4  |5  |6  |7  |8  |9  |10 |11 |12 |13 |
|----|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|括号|)  |(  |(  |(  |)  |)  |)  |)  |(  |(  |)  |(  |)  |)  |
|$l$ | -1|   |   |   |3  |2  |1  |-1 |   |   |9  |   |11 |8  |

$l$数组可以很容易的用一个栈求得。

那么如何求最长的RBS呢？如果两个RBS相邻的话我们可以将他们合并为一个更长的RBS，于是我们可以再遍历一遍$l$数组并尝试扩展RBS的长度，我们便得到了以$i$结尾的最长的RBS，相应地更新答案即可。更新完之后的$l$数组如下：(好吧其实没什么变化)

|下标|0  |1  |2  |3  |4  |5  |6  |7  |8  |9  |10 |11 |12 |13 |
|----|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|括号|)  |(  |(  |(  |)  |)  |)  |)  |(  |(  |)  |(  |)  |)  |
|$l$ | -1|   |   |   |3  |2  |1  |-1 |   |   |9  |   |9  |8  |

完整代码：
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    cin >> s;
    int n = (int)s.size();
    vector<int> l(n, -1);
    vector<int> stk;
    for (int i = 0; i < n; i++) {
        if (s[i] == '(') stk.push_back(i); // 如果是左括号就入栈
        else if (!stk.empty()) { // 否则就是右括号，如果栈非空就说明有对应的左括号
            l[i] = stk.back();
            stk.pop_back();
        }
    }
    for (int i = 0; i < n; i++) {
        //如果当前RBS左边也有一个RBS就更新左端点
        if (l[i] > 0 && l[l[i] - 1] != -1) l[i] = l[l[i] - 1];
    }
    int ans = 0, cnt = 1;
    for (int i = 0; i < n; i++) {
        if (l[i] == -1) continue;
        int len = i - l[i] + 1;
        if (len > ans) {
            ans = len;
            cnt = 1;
        } else if (len == ans)
            cnt++;
    }
    cout << ans << ' ' << cnt << '\n';
}
```
