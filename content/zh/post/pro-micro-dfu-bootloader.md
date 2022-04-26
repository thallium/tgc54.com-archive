---
title: "用两个Pro Micro互相给对方刷上DFU bootloader"
date: 2021-10-12T23:17:49-06:00
categories: [键盘]
tags: [键盘,客制化]
---
一篇如何用两个pro micro当作ISP(In-System Programmer)互相给对方刷上DFU bootloader.
<!--more-->

众所周知，一般pro micro自带的bootloader是caterina，有一个比较烦人的缺点就是一次reset之后只有8秒的时间在dfu模式里。而dfu bootloader就不会有这个问题。

## 免责声明

本人并不是学电子专业的，只是以一个客制化键盘爱好者的角度写的此教程，如有不慎或意外可能会导致pro micro变砖。纯小白请谨慎考虑。本文如有错误欢迎指正。

## 工具

### 软件

- [Arduino IDE](https://downloads.arduino.cc/arduino-1.8.16-windows.exe)
- [QMK toolbox](https://github.com/qmk/qmk_toolbox/releases/download/0.1.1/qmk_toolbox_install.exe)
- [bootloader文件](https://github.com/qmk/qmk_firmware/blob/master/util/bootloader_atmega32u4_1.0.0.hex)

### 硬件

两个 pro micro，6根导线

## 步骤

给两个pro micro刷bootloader的步骤稍有不同

### 给第一个pro micro刷

1. 打开Arduino IDE, Tools -> Arduino Leonardo, Tools -> Port 并记住端口号，File -> Examples -> ArduinoISP -> ArduinoISP 然后点upload，这样一个pro micro就变成了ISP。
2. 接线：

<img src="https://cdn.sparkfun.com/assets/9/c/3/c/4/523a1765757b7f5c6e8b4567.png" alt="pro micro角位示意图" width="400"/>

每行左右两侧脚位相连:
| ISP  | 目标 |
|------|------|
| VCC  | VCC  |
| GND  | GND  |
| SCLK | SCLK |
| MISO | MISO |
| MOSI | MOSI |
| 10   | RST  |

3. 刷入

Win+R然后输入cmd打开命令行，然后进到QMK Toolbox的目录，用到的程序在这个目录里。下面的`0.x.x`要换成你QMK Toolbox 的版本号(写这个教程时最新的版本为0.1.1)，所以不要直接复制粘贴。

```
cd AppData\Local\QMK\QMK Toolbox\0.x.x\
```

然后运行刷入的命令，其中`<PORT>`换成第一步中的端口号，`<PATH>`换成bootloader文件的地址

```
avrdude.exe -c arduino -p atmega32u4 -P <PORT> -U flash:w:"<PATH>":a -U hfuse:w:0xD9:m -U efuse:w:0xC3:m -U lock:w:0x3F:m
```

如果运行成功的话你就成功将dfu bootloader刷到pro micro上了。

### 给另一个pro micro刷

由于arduino不支持dfu，所以我们需要用另一个程序`dfu-programmer`（也在QMK Toolbox的目录下）来将刷入dfu的那个pro micro再变成ISP。首先要找到ArduinoISP编译后的hex文件:`AppData\Local\Temp\arduino_build_xxxxxx\ArduinoISP.ino.hex`(xxxxxx是一串数字，每个人的不一样)。接下来就准备刷入了，还是在QMK Toolbox的目录下，执行下面3条命令：(其中<PATH>换成刚才提到的ArduinoISP.ino.hex的路径)
```
dfu-programmer.exe atmega32u4 erase
dfu-programmer.exe atmega32u4 flash <PATH>
dfu-programmer.exe atmega32u4 reset
```

最后再重复上一个部分的2、3步即可。

## 参考资料

https://www.reddit.com/r/olkb/comments/9ctx37/qmk_burn_dfu_bootloader_into_keyboard_with/
https://www.reddit.com/r/olkb/comments/8sxgzb/replace_pro_micro_bootloader_with_qmk_dfu/

