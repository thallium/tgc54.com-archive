---
published: true
date: 2019-11-30
title: Two Ways to Do Segment Union
categories: [Miscellany]
tags: 
- Misc
layout: post
---
<!--more-->
# Klee's Algorithm

[origin](https://cp-algorithms.com/geometry/length-of-segments-union.html)

```cpp
int length_union(const vector<pair<int, int>> &a) {
    int n = a.size();
    vector<pair<int, bool>> x(n*2);
    for (int i = 0; i < n; i++) {
        x[i*2] = {a[i].first, false};
        x[i*2+1] = {a[i].second, true};
    }

    sort(x.begin(), x.end());

    int result = 0;
    int c = 0;
    for (int i = 0; i < n * 2; i++) {
        if (i > 0 && x[i].first > x[i-1].first && c > 0)
            result += x[i].first - x[i-1].first;
        if (x[i].second) c--;
        else c++;
    }
    return result;
}
```

# One algorithm that I learnt from other's code
```cpp
int length_union(const vector<pair<int, int>> &a) {
    int n = a.size();
    sort(a.begin(), a.end());
    int result = 0;
    int rr = 0;
    for(pii it:a){
        int l=it.fist,r=it.second;
        result+=max(0,r-max(rr,l));
        rr=max(rr,r);
    }
    return result;
}
```
