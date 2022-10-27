---
title: 通配符SSL证书
---
## 安装certbot

官方网页上说用snap（虽说我不是很喜欢snap）：

```sh
sudo snap install --classic certbot
```

安装完还需要这两条命令:

```sh
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo snap set certbot trust-plugin-with-root=ok
```

## 获取证书

为了获得通配SSL证书，你必须展示出对域名的所有权，常见的做法是DNS记录挑战（即设定指定的TXT记录）。挑战可以手动完成，也可以通过DNS插件自动完成（推荐）。

## DNS插件

DNS插件的作用在于可以自动话挑战过程，所以也就可以实现证书自动续期。

[在此](https://eff-certbot.readthedocs.io/en/stable/using.html#dns-plugins)查看所有支持的dns提供商，如果不支持的话就只能手动验证了。下面以cloudflare举例，其他DNS提供商只要把下面出现的cloudflare单词替换成对应的名字就好。

### 安装插件

```sh
sudo snap install certbot-dns-cloudflare
```

### 获取API令牌（以cloudflare为例）

到 https://dash.cloudflare.com/profile/api-tokens，点「API令牌」-> 「编辑区域 DNS」，选择域名，「继续以显示摘要」，「创建令牌」，复制生成的令牌。

### 配置插件

将上一步的令牌放到一个ini文件中（比如~/certbot-creds.ini），格式如下：

```
dns_cloudflare_token = <your token>
```

修改文件权限

```sh
chmod 600 ~/certbot-creds.ini
```

### 申请证书

```sh
sudo certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials ~/certbot-creds.ini \
  -d '*.example.com'
```

## 手动验证

```sh
sudo certbot certonly --manual -d '*.example.com' --agree-tos --no-bootstrap --manual-public-ip-logging-ok --preferred-challenges dns-01 --server https://acme-v02.api.letsencrypt.org/directory
```

然后根据提示完成挑战即可。

## 查看证书

```sh
sudo certbot certificates
```

## 测试自动续期

```sh
sudo certbot renew --dry-run
```

参考资料：

https://certbot.eff.org/instructions?ws=apache&os=ubuntufocal

https://www.digitalocean.com/community/tutorials/how-to-create-let-s-encrypt-wildcard-certificates-with-certbot
