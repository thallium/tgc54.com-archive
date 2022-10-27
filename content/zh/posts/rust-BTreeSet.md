---
title: Rust BTreeSet
date: 2022-06-26
categories: [Rust学习笔记]
tags: [Rust]
---
<!--more-->
## 有用的函数

### [range()](https://doc.rust-lang.org/stable/std/collections/struct.BTreeSet.html#method.range)

返回set中一段区间的迭代器，可以当C++中`std::set::lower_bound()`或者`std::set::upper_bound()`用，举例：
```rust
use std::ops::Bound::*;
let mut set = BTreeSet::new();
set.insert(1);
set.insert(2);
set.insert(3);
assert_eq!(set.range(2..).next(), Some(&2));
assert_eq!(set.range((Excluded(2), Unbounded)).next(), Some(&3));
assert_eq!(set.range(..2).last(), Some(&1));
assert_eq!(set.range(..=2).last(), Some(&2));
```
