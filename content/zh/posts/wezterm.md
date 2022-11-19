---
title: "WezTerm 折腾记录"
date: 2022-11-18T17:28:28-05:00
summary: "记录使用WezTerm中遇到的问题，方便以后查阅"
keywords: ["WezTerm"]
tags: ["WezTerm"]
categories: []
---
最近把终端模拟器从 Kitty 换成了 WezTerm，主要是因为 WezTerm 有随系统自动切换深色主题的能力。作为一个白天用亮色主题晚上用暗色主题的人，终端主题的切换一直是一大痛点（虽说可以通过一个简单的脚本手动切换，但还是有点麻烦，不够优雅），看到 WezTerm 有这个能力之后果断换成了 WezTerm。
<!--more-->

## 主题随系统自动切换

`tokyonight_storm`和`tokyonight_day`是两个table，其中包含`colors`和`window_frame`。注意`window:set_config_overrides()`也会再次触发`window-config-reloaded`事件，所以一定要在当前主题需要改变的时候才调用`window:set_config_overrides`，不然会死循环。

```lua
local function get_color()
    local appearance = wezterm.gui.get_appearance()
    if appearance:find 'Dark' then
        return tokyonight_storm
    else
        return tokyonight_day
    end
end

wezterm.on('window-config-reloaded', function (window, pane)
    local overrides = window:get_config_overrides() or {}
    local target = get_color()
    if overrides.colors ~= target.colors then
        overrides.colors = target.colors
        overrides.window_frame = target.window_frame
        window:set_config_overrides(overrides)
    end
end)
```

## 正常渲染Neovim中的波浪线

详见官方文档中的[F.A.Q.](https://wezfurlong.org/wezterm/faq.html#how-do-i-enable-undercurl-curly-underlines)

```sh
tempfile=$(mktemp) \
  && curl -o $tempfile https://raw.githubusercontent.com/wez/wezterm/master/termwiz/data/wezterm.terminfo \
  && tic -x -o ~/.terminfo $tempfile \
  && rm $tempfile
```

然后设置环境变量`TERM=wezterm`。
