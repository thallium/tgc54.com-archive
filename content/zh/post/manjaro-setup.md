---
published: true
date: 2020-03-27
title: Manjaro 折腾记录
categories: [Linux]
tags: 
- Linux
layout: post
math: true
---
随缘更新，想到啥就记啥
<!--more-->
## 配置

### 触摸板

一开始发现触摸板右键和左键效果是一样的，双指轻按还是中键……

解决方法：

编辑 `/etc/X11/xorg.conf.d/30-touchpad.conf`

```shell
Section "InputClass"
    Identifier "touchpad"
    MatchIsTouchpad "on"
    MatchDevicePath "/dev/input/event*"
    Driver "libinput"
    Option "Tapping" "on"
    Option "ButtonMapping" "1 3 2"
    Option "TappingButtonMap" "lmr"
EndSection
```

### 映射caps+hjkl为方向键

编辑`~/.Xmodmap`

```shell
clear lock
keycode  43 = h H Left H
keycode  44 = j J Down J
keycode  45 = k K Up K
keycode  46 = l L Right L
keycode  66 = Mode_switch Caps_Lock
keycode  31 = i I KP_Home I
keycode  32 = o O KP_End O
```

Then update xmodmap:

{% highlight shell %}
xmodmap ~/.Xmodmap
{% endhighlight %}

解决挂起后失效的问题：

{% highlight shell %}
sudo touch /usr/lib/systemd/system-sleep/xkeyboard
sudo chmod 755 /usr/lib/systemd/system-sleep/xkeyboard
{% endhighlight %}

编辑`xkeyboard`

```shell
#!/bin/bash

case $1 in
    pre)
        exit 0
    ;;
    post)
        export DISPLAY=:0
        sleep 10
        xmodmap /home/thallium/.Xmodmap
    ;;
esac
```

### 主题

[arc](https://github.com/horst3180/arc-theme)

{% highlight shell %}
sudo pacman -S arc-gtk-theme
{% endhighlight %}

## 软件

### vim配置

待更新

### fcitx码表

待更新

### Autojump

快速跳转文件夹，再也不用长长的cd了～

#### 安装

{% highlight shell %}
yay autojump
{% endhighlight %}

#### Source the correct autojump file

{% highlight shell %}
echo "/usr/share/autojump/autojump.bash" >> ~/.bashrc
chmod 755 /usr/share/autojump/autojump.bash
source ~/.bashrc
{% endhighlight %}

#### 注意事项

快速跳转的文件夹需要正常访问一次。

### 截图: Deepin screenshot

一开始用的是火焰截图，但是不能自动识别窗口，后来偶然发现deepin screenshot感觉挺不错的。

{% highlight shell %}
sudo pacman -S deepin-screenshot
{% endhighlight %}

如果不能正常复制到剪贴板，安装`xfce4-clipman`

### 词典

[Wudao dict](https://github.com/ChestnutHeng/Wudao-dict)

安装：

{% highlight shell %}
git clone https://github.com/chestnutheng/wudao-dict
cd ./wudao-dict/wudao-dict
sudo bash setup.sh
{% endhighlight %}

## 问题解决

### 修改`/etc/profile`导致循环登录

2020.03.27

一般的解决方法是从命令行登录然后恢复之前的修改，但我从命令行也是循环登录……于是想到能不能从windows修改然后发现有个软件叫linux file system for windows，然后问题就解决了。真的太不容易了，心态差点崩了……

### Gnome-shell内存泄漏问题

gnome传统艺能，`alt+F2`再输入`r`可以重新启动shell。

### 让gvim默认在新标签中启动

编辑`/usr/share/applications/gvim.desktop`

把
{% highlight shell %}
Exec=gvim -f %F
{% endhighlight %}
改成
{% highlight shell %}
Exec=gvim -p --remote-tab-silent %F
{% endhighlight %}

### i3wm下运行QQ/TIM/Wechat

2020-04-13

[原作者](http://www.waimaosns.cc/arch-linux-i3wm-run-deepin-qq-tim/)

{% highlight shell %}
nohup /usr/lib/gsd-xsettings > /dev/null 2>&1 &
cd /opt/deepinwine/apps/Deepin-TIM
./run.sh
{% endhighlight %}

最后将第一步添加到i3启动项里。
