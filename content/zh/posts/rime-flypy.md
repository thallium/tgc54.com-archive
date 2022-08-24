---
title: "Rime配置码表输入法（以小鹤音形为例）"
date: 2021-07-20T23:31:37-03:00
categories: [教程]
tags: [小鹤音形,rime,输入法]
---
rime输入法框架配置码表输入法的简单教程，以windows上小鹤音形为例。
<!--more-->
最近由于wayland有点受不了了，决定换成windows+wsl试试，虽说windows上有现成的小鹤音形，但相信大多数码表用户和我一样在标准词库上有所删减，所以需要一个输入法框架。用linux的时候久闻rime之大名，但并没有找到很好配置码表的教程，而官方文档有点长再加上是繁体写的读起来有点费事，遂决定记录一下自己配置的过程供大家参考。

其实码表配置起来很简单，一共只需要两个文件：名为`<name>.schema.yaml`的方案定义文件和名为`<name>.dict.yaml`的码表文件。方案定义文件一般都有现成的，比如小鹤音形的[在这(挂接第三方平台里)](http://flypy.ys168.com/)。码表格式要求[看这](https://github.com/rime/home/wiki/RimeWithSchemata#%E7%A2%BC%E8%A1%A8%E8%88%87%E8%A9%9E%E5%85%B8)，如果你像我一样之前是用fcitx格式的码表，可以很简单的用`awk '{ OFS="\t"; print $2, $1 }' flypy_rime.txt > flypy.dict.yaml`修改格式。然后将两个文件放入默认文件夹（windows上默认为`%APPDATA%\Rime`），并修改`build/default.yaml`:在`schema_list`里加一行`- schema: flypy`。最后右键输入法图标点“重新部署”即可。
