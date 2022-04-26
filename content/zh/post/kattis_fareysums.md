---
published: true
date: 2019-09-25
title: Kattis - Farey Sums题解
categories: [题解]
tags: 
- 数学
- 欧拉函数
layout: post
---
> 经过长时间思考并解决调问题的感觉太好了  ——xls
<!--more-->

[题目链接](https://open.kattis.com/problems/fareysums)

网上的题解比较少而且都讲的比较跳跃，不知道是他们太聪明还是我太笨了。于是本着刨根问底的精神我详细推导了下过程。如果想麻烦了欢迎指正。

首先，farey数列的分母构成的数列一定是对称的，因为如果分子与分母互质，那么分母与分子的差也一定与分母互质，这个可以用反证法证明：设分母是$m$，分子是$n$，如果$m$与$n$不互质，那么可以写成$m=k \cdot p,n=j \cdot p$那么$m-n=(k-j)\cdot p$与$m$也不互质，所以$ \dfrac{n}{m}$与$\dfrac{m-n}{m}$要么都在数列里要么都不在数列里。

其次，设当前的order是$k$,那么当order增加到$k+1$时，将会有$\varphi(k+1)$个数被插入，这个道理很简单：如果不是互质的话就被约掉了。

下面我们看一下插入的这些数对farey sums有什么影响：

设$\dfrac{n}{m}$插到了$\dfrac{c}{a}$与$\dfrac{d}{b}$之中，我看到的题解都直接给出了结论$m=a+b$这个结论看起来很神奇（事实上还有$n=c+d$），但我怎么也想不出来这个是怎么得到的，于是我上了[维基百科](https://en.wikipedia.org/wiki/Farey_sequence)得到了思路：

首先要先证明$\dfrac{c}{a}$与$\dfrac{d}{b}$如果在order为$\max(a,b)$中是相邻的两项（假设$\dfrac{c}{a}$在后，写完才发现后面证明把两个弄反了，懒的改了……）那么有$\dfrac{c}{a}-\dfrac{d}{b}=\dfrac{1}{a\cdot b}$即$b\cdot c-a\cdot b=1$，这个维基上也没给出证明，不过比较好想，依然是反证法：如果两个数之间还有其他的数$\dfrac{n}{m}$，那么$\dfrac{n}{m}-\dfrac{c}{a}<\dfrac{1}{a\cdot b},\dfrac{d}{b}-\dfrac{n}{m}<\dfrac{1}{a\cdot b}$，如果$a< b$ 我们就看前面那个不等式$\dfrac{n}{m}-\dfrac{c}{a}<\dfrac{1}{a\cdot b}$，通分得$\dfrac{a\cdot n-c\cdot m}{a\cdot m}<\dfrac{1}{a\cdot b}$，因为$a\cdot n-c\cdot m\ge 1$所以$a\cdot m>a \cdot b$，但因为order为$b$所以m不能大于$b$，与假设矛盾。$a\ge b$的情况与前面同理。

有了这个我们就可以轻松证明当$\dfrac{c}{a}$与$\dfrac{d}{b}$之间有新的数$\dfrac{n}{m}$插入时那么有$a\cdot n-c\cdot m=d\cdot m-b\cdot n$移项得$n(a+b)=m(c+d)$，最终得到$\dfrac{n}{m}=\dfrac{c+d}{a+b}$

明白了这关键的一步之后，原来farey sums中和$\dfrac{a}{b}+\dfrac{b}{a}$（数列中对称的两项）就变成了$\dfrac{a}{a+b}+\dfrac{a+b}{b}+\dfrac{b}{a+b}+\dfrac{a+b}{a}=3+\dfrac{a}{b}+\dfrac{b}{a}$，所以每插入两项，farey sums就增加3，一共插入了$\varphi(k+1)$项，那么farey sums就增加了$\dfrac{3\cdot\varphi(k+1)}{2}$，又因为order从0变成1的时候只增加了1,比$\dfrac{3}{2}$少了$\dfrac{1}{2}$，所以最终答案应为$\sum_{i=1}^{n}{\dfrac{3\cdot \varphi(i)}{2}}-\dfrac{1}{2}$

代码

```cpp
#include <iostream>
#define forn(i, n) for (int i = 0; i < (int)(n); ++i)
#define for1(i, n) for (int i = 1; i <= (int)(n); ++i)
using namespace std;

const int N = 10005;
int phi[N], phisum[N];
void phi_table(int n) {
  phi[1] = 1;
  for (int i = 2; i <= n; i++)
    if (!phi[i])
      for (int j = i; j <= n; j += i) {
        if (!phi[j])
          phi[j] = j;
        phi[j] = phi[j] / i * (i - 1);
      }
}
int main() {
  ios::sync_with_stdio(false);
  cin.tie(0);
  int n;
  cin >> n;
  phi_table(10000);
  for1(i, 10000) phisum[i] = phisum[i - 1] + phi[i];
  for1(i, n) {
    int p, x;
    cin >> x >> p;
    cout << x << ' ' << (3 * phisum[p] - 1) << "/2\n";
  }
  return 0;
}
```
