---
title: "Algorithm note: Modular Multiplicative Inverse and Modulo of Combinations"
date: 2019-10-13
categories: [Alg Notes]
tags: 
- Math
- Number Theory
- Modular Inverse
- Combinatorics
math: true
---
# What is Modular Multiplicative Inverse?

If $a\cdot x \equiv 1\pmod p$, $x$ is called a inverse of a(modulo p), referred to as $a^{-1}$. We usually use the minimum positive inverse.
<!--more-->
# The use of Inverse

The inverse is used when calculating the modulo of division.
$$\dfrac{a}{b} \equiv a \cdot b^{-1}\pmod p$$

# The ways to calculate the inverse of a number

## The Extended Euclidean algorithm

We can rewrite $a\cdot x \equiv 1\pmod p$ as $a\cdot x +p\cdot k\equiv \gcd(p,a)\pmod p$ which can be solved using the Extended Euclidean algorithm.
```cpp
void exgcd(int a, int b, int& x, int& y) {
  if (b == 0) {
    x = 1, y = 0;
    return;
  }
  exgcd(b, a % b, y, x);
  y -= a / b * x;
}
```

## The Fermat's Little Theorem

According to Fermat's Little Theorem $a^{p-1} \equiv 1\pmod p$, thus $a\cdot x \equiv a^{p-1}\pmod p$, $x \equiv a^{p-2}\pmod p$. We can calculate it using Exponentiation by squaring.

```cpp
inline int qpow(long long a, int b) {
  int ans = 1;
  a = (a % p + p) % p;
  for (; b; b >>= 1) {
    if (b & 1) ans = (a * ans) % p;
    a = (a * a) % p;
  }
  return ans;
}
```
## Calculate consecutive inverses in linear time

```cpp
inv[1] = 1;
for (int i = 2; i <= n; ++i) inv[i] = (long long)(p - p / i) * inv[p % i] % p;
```

# Modulo of Combinations

Calculate $\dbinom{n}{m} \bmod p$

## When n and m are not too big

We can use the inverse to calculate $\dfrac{n!}{m!\cdot (n-m)!}\equiv(n!\mod p\cdot (m!\mod p)^{-1}\cdot ((n-m)!\mod p)^{-1})\pmod p$

### Calculate the inverse of factorial
$$\because n!\cdot(n!)^{-1}\equiv 1 \pmod p\\
\therefore (n-1)!\cdot (n\cdot (n!)^{-1})\equiv 1 \pmod p$$

Therefore$(n\cdot (n!)^{-1})$is an inverse of $(n-1)!$.
```cpp
fact[0] = 1;
for (int i = 1; i < maxn; i++) {
    fact[i] = fact[i - 1] * i %mod;
}
inv[maxn - 1] = power(fact[maxn - 1], mod - 2);
for (int i = maxn - 2; i >= 0; i--) {
    inv[i] = inv[i + 1] * (i + 1) %mod;
}
```
## When n and m are really big but p is not too big

$$\binom{n}{m}\bmod p=\binom{\lfloor\frac{n}{p}\rfloor }{\lfloor\frac{m}{p}\rfloor }\binom{n\bmod p }{m\bmod p}\bmod p$$

```cpp

long long Lucas(long long n, long long m, long long p) {
  if (m == 0) return 1;
  return (C(n % p, m % p, p) * Lucas(n / p, m / p, p)) % p;
}
```
