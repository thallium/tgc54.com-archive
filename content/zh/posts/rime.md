---
title: RIME简介与小鹤音形
date: 2022-05-11
categories: [教程]
tags: [小鹤音形,rime,输入法]
---

## 码表

### 下载

为了最大限度的自定义，我们肯定要找到纯文本码表，官方给的Rime挂接都只有二进制文件，但是我找了找竟然发现搜狗五笔是纯文本码表：[下载链接](http://ys-d.ysepan.com/116124351/318618271/VFSKVTu5446713983MKK9a/%E5%B0%8F%E9%B9%A4%E9%9F%B3%E5%BD%A2for%E6%90%9C%E7%8B%97%E4%BA%94%E7%AC%94%E8%87%AA%E5%AE%9A%E4%B9%89%E6%96%B9%E6%A1%88.zip)

### 码表去重以及转换为Rime格式

```cpp
#include <iostream>
#include <fstream>
#include <map>
#include <vector>
using namespace std;

int main() {
    ifstream in{"sougou.txt"};
    string code, text;
    multimap<string, pair<string, int>> mp;
    int order = 0;
    auto is_substr = [&](const string& a, const string& b) {
        return a.substr(0, size(b)) == b || b.substr(0, size(a)) == a;
    };
    while (in >> code >> text) {
        if (!mp.count(text)) {
            mp.emplace(text, pair{code, order});
        } else if (size(text) == 3) { // 单字保留多音字
            auto it = mp.find(text);
            bool dup = 0;
            while (it!=end(mp) && it->first == text) {
                if (is_substr(it->second.first, code)) {
                    dup = true;
                    if (size(code) < size(it->second.first))
                        it->second = {code, order};
                }
                ++it;
            }
            if (!dup)
                mp.emplace(text, pair{code, order});
        } else if (size(text) == 6) { //两字词两码和四码优先
            auto it = mp.find(text);
            if (size(code) % 2 == 0 &&
                    (size(it->second.first) % 2 || it->second.first.size() > code.size()))
                it->second = {code, order};
        } else { //其他词短码优先
            auto it = mp.find(text);
            if (it->second.first.size() > code.size())
                it->second = {code, order};
        }
        order++;
    }
    vector<tuple<string, int, string>> v;
    for (const auto& [text, code] : mp)
        v.emplace_back(code.first, code.second, text);
    sort(begin(v), end(v));

    ofstream out{"flypy.dict.yaml"};
    out << R"(---
name: flypy
version: "0.1"
sort: original
use_preset_vocabulary: false
...
)";
    for (const auto& [code, odder, text] : v) {
        out << text << '\t' << code << '\n';
    }
}
```

## Rime

[官方输入方案设计书](https://github.com/rime/home/wiki/RimeWithSchemata)

[schema.yaml详解](https://github.com/LEOYoon-Tsaw/Rime_collections/blob/master/Rime_description.md)

常用的文件有:

- 输入方案头文件 `<方案标识>.schema.yaml`
    - 定义一个输入方案
- 输入方案码表 `<方案标识>.dict.yaml`
    - 输入方案的码表（如果用到码表的话）
- 自定义全局设定 `default.custom.yaml`
    - 比如开启了哪些输入法
- 针对不同发行版的设定 `<squirrel|weasel>.custom.yaml`
    - 比如输入法皮肤

`flypy.schema.yaml`示例

```yaml
# Rime schema settings
# encoding: utf-8

schema:
  schema_id: flypy
  name: 小鹤音形
  version: "10.8.4"
  author:
    - 方案设计：何海峰 <flypy@qq.com>
  description: |
    小鹤音形输入法

punctuator:
  import_preset: default

switches:
  - name: ascii_mode
    reset: 0
    states: [ 中文, 英文 ]
  - name: full_shape
    states: [ 半角, 全角 ]
  - name: ascii_punct
   # states: [ 。，, ．， ]
    reset: 0

engine:
  processors:
    - ascii_composer
    - recognizer
    - key_binder
    - speller
    - punctuator
    - selector
    - navigator
    - express_editor
  segmentors:
    - ascii_segmentor
    - matcher
    - abc_segmentor
    - punct_segmentor
    - fallback_segmentor
  translators:
    - punct_translator
    - table_translator
    - table_translator@user_dict
    - history_translator@history
  filters:
    - simplifier
    - reverse_lookup_filter
    - uniquifier

speller:
  alphabet: "abcdefghijklmnopqrstuvwxyz;'"
  initials: ';abcdefghijklmnopqrstuvwxyz'
  finals: "'"
  #delimiter: " '"
  max_code_length: 4
  auto_select: true   #顶字上屏
  auto_select_pattern: ^;.$|^\w{4}$
  auto_clear: max_length #manual|auto|max_length 空码按下一键确认清屏|空码自动清|达到最长码时后码顶上清屏

translator:
  dictionary: flypy
  enable_charset_filter: false
  enable_sentence: false
  enable_completion: false # 编码提示开关
  enable_user_dict: false
 

history:
   input: ;f
   size: 1 #重复前几次上屏
   initial_quality: 1 #首选


user_dict:
  dictionary: ""
  user_dict: user_dict
  db_class: tabledb
  enable_sentence: false
  enable_completion: false
  initial_quality: -1 #优先级


key_binder:
  import_preset: default #方案切换相关
  bindings:
    - {accept: bracketleft, send: Page_Up, when: paging} # [上翻页
    - {accept: bracketright, send: Page_Down, when: has_menu} # ]下翻页
    - {accept: comma, send: comma, when: paging} #注销逗号翻页
    - {accept: period, send: period, when: has_menu} #注销句号翻页
    - {accept: semicolon, send: 2, when: has_menu} #分号次选
    # - {accept: Release+semicolon, send: semicolon, when: has_menu} #如启用此行，则分号引导符号功能无效
    - {accept: Release+period, send: period, when: composing} #句号顶屏
    - {accept: Release+comma, send: comma, when: composing} #逗号顶屏
    - {accept: "Tab", send: Escape, when: composing}
    - {accept: "Shift_R", send: Escape, when: composing}
    # - {accept: "Shift+space", toggle: full_shape, when: always} #切换全半角
    - {accept: "Control+period", toggle: ascii_punct, when: always} #切换中英标点
    # - {accept: "Control+j", toggle: simplification, when: always} #切换简繁

recognizer:
  import_preset: default
  patterns:
    # reverse_lookup: "[a-z`]*`+[a-z`]*"反查应该不需要

menu:
  page_size: 5 #候选项数
  
style:
  horizontal: true #竖排为false
```
