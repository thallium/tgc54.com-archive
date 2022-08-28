---
title: "Manage Python Version With Pyenv"
subtitle: ""
summary: "It's not a good idea to manage python with your package manager"
tags: []
categories: []
date: 2022-07-22T22:45:35-04:00
lastmod: 2022-07-22T22:45:35-04:00
draft: false
profile: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

projects: []
---
There is problem managing python version with your package manager. An easy solution is to use [pyenv](https://github.com/pyenv/pyenv):

1. Install pyenv with your package manager. For MacOS, it's `brew install pyenv`.
2. Install desired python version: `pyenv install <version>`
3. Set global python version `pyenv global <version>`
4. Set up your shell environment for Pyenv, for zsh, add this to your `.zshrc`:
```bash
export PYENV_ROOT="$HOME/.pyenv"
command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"
```
