---
published: true
date: 2019-10-14
title: Solution for CUGBACM Training #8
categories: [Training Solutions]
tags: 
  - CUGBACM
---
[Link](https://codeforces.com/gym/101498/problems)
<!--more-->
# A - Watching TV Gym - 101498A 

Use a `map<int,int>` to count the number of channels in each frequency. Iterate the map to find the frequency that displays the largest number of channels.

# B - Longest Prefix Gym - 101498B 

Swapping any two letters means that you can rearrange the second string so just count the number of each character in the second string and then iterate the first string to see if you can put the same in each position. When you stops, that's the longest prefix.

# C - Lunch Break Gym - 101498C 

Just output which one is the smallest among the three numbers

# D - Counting Paths Gym - 101498D 

The first direction can be chosen arbitrarily. In the rest $a-1$ nodes we need to choose $b$ nodes where to change the direction so the answer is $\dbinom{a-1}{b}\pmod {10^9+7}$. As the $a$ and $b$ are large so we need to precalculate $n!\pmod {10^9+7}$ and $(n!)^{-1}\pmod {10^9+7}$ .

# E - Car Factory Gym - 101498E 

By drawing some sketchs you can find the answer is $n+k-1$.

# H - Palindrome Number 

Start from the first digit and try to fill every digits with the largest number. If the sum is less than $s$ or there is leading zero, the answer is -1 otherwise output the constructed number.

# I - Rock Piles Gym - 101498I 

At first I counldn't find any pattern so I decided to get the sg function using brute force. Here is the pattern: only when both $N$ and $M$ are even the answer is "abdullah" otherwise the answer is hasan.

# J - Split the String Gym - 101498J 

Enumerate all the possible disstance between two splitting point and check if all the splitting points are space. If you could find such a distance the answer is "YES" and vise versa.
