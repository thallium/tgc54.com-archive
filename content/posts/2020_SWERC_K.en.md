---
title: "Solution for 2020 ICPC SWERC K - Unique Activities"
date: 2021-05-18T11:00:38-04:00
categories: [Solutions]
tags: [Suffix Array, Binary Search, Hashing]
---

<!--more-->
## Solution 1: Suffix Array

For each suffix starting from $i$, the length of the shortest unique substring which is a prefix of that suffix is $\max(lcp_i, lcp_{i+1})+1$ where $lcp_0$ and $lcp_{n}$ is defined to be $0$. Note that if that length is greater than the length of suffix, it's an invalid substring

Code:

```cpp
#include <bits/stdc++.h>

#define all(x) (x).begin(),(x).end()
using namespace std;
using ll = long long;
using pii = pair<int, int>;

vector<int> suffix_array(string s) {
    s+="#";
    int n = s.size(), N = n + 256;
    vector<int> sa(n), ra(n);
    for(int i = 0; i < n; i++) sa[i] = i, ra[i] = s[i];
    for(int k = 0; k < n; k ? k *= 2 : k++) {
        vector<int> nsa(sa), nra(n), cnt(N);
        for(int i = 0; i < n; i++) nsa[i] = (nsa[i] - k + n) % n;
        for(int i = 0; i < n; i++) cnt[ra[i]]++;
        for(int i = 1; i < N; i++) cnt[i] += cnt[i - 1];
        for(int i = n - 1; i >= 0; i--) sa[--cnt[ra[nsa[i]]]] = nsa[i];
 
        int r = 0;
        for(int i = 1; i < n; i++) {
            if(ra[sa[i]] != ra[sa[i - 1]]) r++;
            else if(ra[(sa[i] + k) % n] != ra[(sa[i - 1] + k) % n]) r++;
            nra[sa[i]] = r;
        }
        ra = nra;
    }
    sa.erase(sa.begin());
    return sa;
}

vector<int> build_lcp(const string& s, const vector<int>& sa) {
    int n=s.size();
    vector<int> pos(n);
    for (int i = 0; i < n; i++) pos[sa[i]] = i;

    vector<int> lcp(n);
    int k = 0;
    for (int i = 0; i < n; i++) {
        if (pos[i]==0) continue;
        if (k) k--;
        while (s[i+k] == s[sa[pos[i]-1]+k]) k++;
        lcp[pos[i]] = k;
    }
    return lcp;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    cin>>s;
    auto sa=suffix_array(s);
    auto lcp=build_lcp(s, sa);
    lcp.push_back(0);
    int ans=s.size();
    int l=0;
    for (int i=1; i<(int)s.size(); i++) {
        int len=max(lcp[i], lcp[i+1])+1;
        if (len>s.size()-sa[i]) continue;
        if (len<ans) {
            ans=len;
            l=sa[i];
        } else if (len==ans) l=min(l, sa[i]);
    }
    cout<<s.substr(l, ans);
}
```

## Solution 2: Binary Search + String Hashing

Note that if a substring is unique, then all the other substrings containing that substring is also unique. So we can binary search the length of the substring.

For each length, we check if there is a unique substring in all the substrings of that length using hashing. One way of calculating hash value of a substring efficiently is to precalculate hash value of all prefixes (like prefix sum). Note that in the implementation, we let the left position be more significant bit in order to avoid division.

Code:

```cpp
#include <bits/stdc++.h>

#define all(x) (x).begin(),(x).end()
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    cin>>s;
    int n=(int)s.size();
    constexpr int mod=1e9+7;
    vector<ll> pow(n+1), ha(n+1);
    pow[0]=1;
    for (int i=1; i<=n; i++) {
        pow[i]=pow[i-1]*233%mod;
        ha[i]=(ha[i-1]*233+s[i-1])%mod;
    }
    auto get_hash=[&](int l, int r) {
        l++, r++;
        return (ha[r]-ha[l-1]*pow[r-l+1]%mod+mod)%mod;
    };
    auto check=[&](int len) {
        unordered_map<int, int> cnt;
        for (int i=0; i+len-1<n; i++) {
            cnt[get_hash(i, i+len-1)]++;
        }
        for (int i=0; i+len-1<n; i++) {
            if(cnt[get_hash(i, i+len-1)]==1) return i;
        }
        return -1;
    };
    int l=1, r=n;
    while (l<=r) {
        int mid = (l+r)/2;
        if (check(mid)!=-1) {
            r=mid-1;
        } else {
            l=mid+1;
        }
    }
    int ans=check(l);
    cout<<s.substr(ans, l);
}
```
