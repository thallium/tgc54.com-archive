---
published: true
date: 2020-03-13
title: PB_DS的基础用法
categories: [杂项]
tags: [数据结构]
layout: post
---
Policy-Based Data Structure(PB_DS)的基础用法
<!--more-->
# 哈希表

## 用法
```cpp
#include <ext/pb_ds/assoc_container.hpp>
using namespace __gnu_pbds;
cc_hash_table<int, int> table;//collision-chaining hash table
gp_hash_table<int, int> table;//probing hash table
```

可以像`unordered_map`一样用。

## 稍微好一点的哈希函数
```cpp
struct custom_hash {
    size_t operator()(uint64_t x) const {
        static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
        x ^= FIXED_RANDOM;
        return x ^ (x >> 16);
    }
};
```

## 无敌哈希函数
```cpp
struct custom_hash {
    static uint64_t splitmix64(uint64_t x) {
        // http://xorshift.di.unimi.it/splitmix64.c
        x += 0x9e3779b97f4a7c15;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
        x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
        return x ^ (x >> 31);
    }

    size_t operator()(uint64_t x) const {
        static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x + FIXED_RANDOM);
    }
};
```
# 平衡树

## 声明

### 头文件
```cpp
#include <ext/pb_ds/tree_policy.hpp>
#include <ext/pb_ds/assoc_container.hpp>
using namespace __gnu_pbds;
```
### 用作`std::map`
```cpp
tree<int, int, less<int>, rb_tree_tag, tree_order_statistics_node_update> t;
```
### 用作`std::set`
```cpp
tree<int, null_type, less<int>, rb_tree_tag, tree_order_statistics_node_update> t;
```
### 用作`std::multiset`

```cpp
tree<pair<int,int>, null_type, less<pair<int,int>>, rb_tree_tag, tree_order_statistics_node_update> t;
```

也可以用`std::less_equal`，但`lower_bound` 和 `upper_bound` 函数会交换功能并且`find`会失效，所以谨慎使用。

```cpp
tree<int, null_type, less_equal<int>, rb_tree_tag, tree_order_statistics_node_update> t;
```
## 比`std::set`更强的功能：排名

必须在声明里用`tree_order_statistics_node_update`以获得与排名相关的功能:
```cpp
size_type order_of_key(key_const_reference);// 返回比key小的元素的个数
iterator find_by_order(size_type order) // 返回排名为order的元素的迭代器，排名从0开始
```

e.g. 求[逆序对](https://www.luogu.com.cn/problem/P1908)

```cpp
#include <bits/extc++.h>
using namespace std;
using namespace __gnu_pbds;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // 注意此处用了less_equal以允许重复的元素
    tree<int, null_type, less_equal<int>, rb_tree_tag, tree_order_statistics_node_update> st;
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto& x : a) cin >> x;
    long long ans=0;
    for (int i=n-1; i>=0; i--) {
        ans += st.order_of_key(a[i]);
        st.insert(a[i]);
    }
    cout << ans << '\n';
}
```

## 使用 `lower_bound` 和 `upper_bound` 找前驱和后继

前驱：
```cpp
*prev(t.lower_bound(x))//set
prev(t.lower_bound({x,0}))->first//multi-set
```

后继：
```cpp
*t.upper_bound(x);//set
*t.lower_bound({x+1,0});
```

# 优先队列

## 原型
```cpp
template<typename  Value_Type,
	  typename  Cmp_Fn = std::less<Value_Type>,
	  typename  Tag = pairing_heap_tag,
	  typename  Allocator = std::allocator<char > >
	  class priority_queue;
```

## 用法

默认的模板参数就是性能最好的，注意必须要带上`__gnu_pbds`命名空间以区分`std::priority_queue`。
```cpp
#include<ext/pb_ds/priority_queue.hpp>
__gnu_pbds::priority_queue<int>;
```

所有的5种tag:
- `binary_heap_tag`
- `binomial_heap_tag`
- **`pairing_heap_tag`**
- `thin_heap_tag`
- `rc_binomial_heap_tag`

## 和 `std::priority_queue`的不同之处

```cpp
point_iterator push(const_reference r_val); //push会返回指向插入后元素的point迭代器（和遍历迭代器不一样）
void PB_DS_CLASS_C_DEC:: join(PB_DS_CLASS_C_DEC& other) //合并两个堆同时清空other
void split(Pred prd,priority_queue &other) // 根据prd函数的返回值（true或false）分裂两个堆
void modify(point_iterator it,const key) // 某些堆支持快速修改堆中的元素，比如用在dijkstra中
begin();
end();//begin 和 end 迭代器
```
# 参考资料

[Policy-Based Data Structure](https://gcc.gnu.org/onlinedocs/libstdc++/manual/policy_data_structures.html)

[Blowing up unordered_map, and how to stop getting hacked on it](https://codeforces.com/blog/entry/62393)

[pb_ds库的一些常用方法](https://blog.csdn.net/riba2534/article/details/80454602?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task)

[用 pbds 过 luogu P3369【模板】普通平衡树](https://zhuanlan.zhihu.com/p/90104614)
