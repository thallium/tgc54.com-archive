---
title: "方便无 Language Server 开发的 Neovim 插件"
date: 2022-09-18T20:40:12-04:00
summary: ""
keywords: ["neovim", "treesitter", "development"]
tags: ["Neovim", "dev"]
categories: ["小技巧"]
---
最近实习工作开始写C/C++了，由于项目结构过于复杂导致 VSCode 的 language server 几乎是不可用的状态，所以心想不如换回最顺手的 neovim，但从来没有用 neovim 做过大项目，所以要研究如何实现我在 VSCode 里常用的一些功能：
<!--more-->

## 搜索

这里用的是 [nvim-spectre](https://github.com/windwp/nvim-spectre)，用起来和 VSCode 差不多，默认搜索用的是ripgrep所以速度很快，目前在用的快捷键：
```lua
local map = vim.keymap.set -- 之后不再重复

map('n', '<leader>S', require('spectre').open)
map('n', '<leader>fw', function() require('spectre').open_visual({select_word=true}) end) -- 查找函数定义或引用很有用
```

## 文件相关

VSCode 里`ctrl + p`(Windows)/`cmd + p`(MacOS) 可以呼出文件跳转，在 Neovim 里可以用 [telescope](https://github.com/nvim-telescope/telescope.nvim) 的 find_files picker 实现，唯一美中不足就是不会优先显示最近打开的文件且没有缓存所以加载会稍慢一点点。
```lua
map('n', '<Leader>ff', require"telescope.builtin".find_files)
```

常用文件跳转可以用[harpoon](https://github.com/ThePrimeagen/harpoon)
```lua
map('n', '<Leader>fm', require("harpoon.ui").toggle_quick_menu)
map('n', '<Leader>ma', require("harpoon.mark").add_file)
```

## 大纲/Symbol

之前用的 [symbols-outline.nvim](https://github.com/simrat39/symbols-outline.nvim) 但可惜不支持 treesitter，然后发现了更好用的 [aerial](https://github.com/stevearc/aerial.nvim)：不仅支持 treesitter 还有lualine扩展（显示当前函数），telescope picker（比telescope自带的symbol picker）好用。

```lua
require('telescope').load_extension('aerial')

map('n', '<Leader>s', require'telescope'.extensions.aerial.aerial)
```

## 终端

用[nvim-toggleterm.lua](https://github.com/akinsho/nvim-toggleterm.lua)管理终端，一个很好用的功能是自定义终端，比如定义一个默认打开lazygit的终端：
{{< figure src="https://user-images.githubusercontent.com/22454918/116447435-e69f1480-a84f-11eb-86dd-19fa29646aa1.png" alt="自定义lazygit示意图" position="center" caption="自定义lazygit示意图(来自官方README)" captionPosition="center" >}}
```lua
local Terminal  = require('toggleterm.terminal').Terminal
local lazygit = Terminal:new({
    cmd = "lazygit",
    hidden = true,
    direction = 'float',
    float_opts = {
        border = 'double'
    }
})
map('n', '<Leader>g', function() lazygit:toggle() end)
```
