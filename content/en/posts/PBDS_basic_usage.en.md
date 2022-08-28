---
published: true
date: 2020-03-13
title: Basic Usage of PB_DS
categories: [Alg Notes]
tags: 
layout: post
---
Basic usage of Policy-Based Data Structure (PB_DS)
<!--more-->
# Hash Table

## Usage
```cpp
#include <ext/pb_ds/assoc_container.hpp>
using namespace __gnu_pbds;
cc_hash_table<int, int> table;//collision-chaining hash table
gp_hash_table<int, int> table;//probing hash table
```

Use it like a `unordered_map`.

## A slightly better hash Function
```cpp
struct custom_hash {
    size_t operator()(uint64_t x) const {
        static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
        x ^= FIXED_RANDOM;
        return x ^ (x >> 16);
    }
};
```

## Unbeatable hash function
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
# Balanced BST

## Declaration

### Header
```cpp
#include <ext/pb_ds/tree_policy.hpp>
#include <ext/pb_ds/assoc_container.hpp>
using namespace __gnu_pbds;
```
### Make a map
```cpp
tree<int, int, less<int>, rb_tree_tag, tree_order_statistics_node_update> t;
```
### Make a set
```cpp
tree<int, null_type, less<int>, rb_tree_tag, tree_order_statistics_node_update> t;
```
### Make a multi-set

```cpp
tree<pair<int,int>, null_type, less<pair<int,int>>, rb_tree_tag, tree_order_statistics_node_update> t;
```

Alternatively, you can use `std::less_equal`, but `lower_bound` and `upper_bound` will swap their functionality.

```cpp
tree<int, null_type, less_equal<int>, rb_tree_tag, tree_order_statistics_node_update> t;
```
## Beyond std::set : ranking

Your must use `tree_order_statistics_node_update` to get order statistic:
```cpp
size_type order_of_key(key_const_reference);// returns the number of elements that are smaller than key
iterator find_by_order(size_type order)// order starts from 0
```
## Use lower_bound and upper_bound to find precursor and successor

Find precursor:
```cpp
*prev(t.lower_bound(x))//set
prev(t.lower_bound({x,0}))->first//multi-set
```

Find successor
```cpp
*t.upper_bound(x);//set
*t.lower_bound({x+1,0});
```

# Priority Queue

## Prototype
```cpp
template<typename  Value_Type,
	  typename  Cmp_Fn = std::less<Value_Type>,
	  typename  Tag = pairing_heap_tag,
	  typename  Allocator = std::allocator<char > >
	  class priority_queue;
```

## Usage

Just use the default parameter and you will get the best performance(must include the namespace):
```cpp
#include<ext/pb_ds/priority_queue.hpp>
__gnu_pbds::priority_queue<int>;
```

All the five tags:
- `binary_heap_tag`
- `binomial_heap_tag`
- **`pairing_heap_tag`**
- `thin_heap_tag`
- `rc_binomial_heap_tag`

## What's different from `std::priority_queue`

```cpp
point_iterator push(const_reference r_val);//return a iterator after push
void PB_DS_CLASS_C_DEC:: join(PB_DS_CLASS_C_DEC& other)//clean other after join
void split(Pred prd,priority_queue &other)  
void modify(point_iterator it,const key) 
begin();
end();//begin and end iterator
```
# Reference

[Policy-Based Data Structure](https://gcc.gnu.org/onlinedocs/libstdc++/manual/policy_data_structures.html)

[Blowing up unordered_map, and how to stop getting hacked on it](https://codeforces.com/blog/entry/62393)

[pb_ds库的一些常用方法](https://blog.csdn.net/riba2534/article/details/80454602?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task)

[用 pbds 过 luogu P3369【模板】普通平衡树](https://zhuanlan.zhihu.com/p/90104614)
