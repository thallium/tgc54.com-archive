---
title: "关于右值引用的一些知识点"
date: 2023-06-07T20:22:37-04:00
summary: ""
keywords: []
tags: ["C++"]
categories: ["C++"]
---
感觉一直都没怎么搞明白，遂决定仔细学一下并记录一些零散的知识点。（包含个人理解，不一定严谨正确）
<!--more-->

## 值类别与类型

C++ 表达式具有值类别与类型两种属性。

C++ 有三种基本类别：左值，纯右值，亡值。纯右值和亡值统称为右值，右值不能由内建的取址运算符取地址。大部分右值都是纯右值，与这篇文章关系比较大的亡值有：

- 返回类型是对象的右值引用的函数调用或重载运算符表达式，例如 `std::move(x)`
- 转换到对象的右值引用类型的转型表达式，例如 `static_cast<char&&>(x)`

类型有基础类型：`int`、`bool`等，复合类型。我们这里主要讨论复合类型中的引用类型，引用类型又包含左值引用类型与右值引用类型。

注意区别值类别与类型，比如 `int&& a = 1;`，变量 `a` 的类型是右值引用类型，但是 `a` 这个表达式是左值。

## 不是 `&&` 都是右值引用

只有确定的类型加`&&`才是右值引用，否则被称为 universal reference(万能引用)/forwarding reference(转发引用？)，万能引用可能会被推导为做左值引用。

```cpp
int x = 1;
int& lref = x;
int&& rref = 1;
auto&& y = lref;
auto&& z = std::move(rref);
auto& yy = lref;
const auto& zz = std::move(rref);
static_assert(is_same_v<decltype(y), int&>);
static_assert(is_same_v<decltype(z), int&&>);
static_assert(is_same_v<decltype(yy), int&>);
static_assert(is_same_v<decltype(zz), const int&>);
```

## `std::move` 与 `std::forward`

`std::move` 本质就是无条件转换成右值引用，`std::forward` 是有条件的类型转换：

- 如果 `T` 是右值引用类型，函数表达式为右值
- 否则 `T` 为左值引用类型或非引用类型，函数表达式为左值

注意我们不能通过简单的赋值来实现右值引用的转发，即：

```cpp
void foo(int&& x) {}

void bar(int&& x) {
    foo(x);
}
```

会导致编译错误，因为在 `bar()` 中，表达式 `x` 是左值，不能作为 `foo()` 的参数。
