---
title: Nginx Proxy Manager
---

[Nginx Proxy Manager](https://nginxproxymanager.com/)(以下简称NPM)可以实现反向代理（reverse proxy），即只暴露80和443端口然后由代理根据域名将请求发送给对应的服务。NPM集成了Let's Encrypt所以可以很简单的申请到SSL证书。
<!--more-->

## 安装

使用dock-compose，根据情况修改路径（尤其是如果你用portainer的话）

```yaml
version: '3'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

Web UI在81端口，初始账号邮箱：admin@example.com 密码：changeme

## 申请通配符SSL证书

SSL Certificates -> Add SSL Certificate -> Let's Encrypt

Domain names: `*.<your domain>.com` (`<your domain>`换成你的域名）

打开Use a DNS Challenge，选择你的提供商，Credentials File Content的填写可以参照[申请通配SSL证书](./wildcard-ssl.md)。

## 添加配置

Hosts -> Proxy Hosts -> Add Proxy Host

Domain Names没什么好说的。

Forward Hostname / IP 填服务器的内网IP，不要填127.0.0.1因为会访问到NPM容器内网络

Forward Port：对应应用的端口，如果有防火墙请确保端口是打开的，如果不想动防火墙设置请看Tips

建议打开Cache Assets和Block Common Exploits

SSL证书里选前面申请到的证书

打开Force SSL, HTTP/2 Support, HSTS Enabled。

## Tips

### 利用docker网络

在docker-compose文件最后加上

```yaml
networks:
  default:
    external:
      name: nginx-proxy-manager_default
```

让应用加入NPM的网络，这样就相当于让NPM和容器处于同一个docker网络，于是就避免了前面所说的防火墙的问题。这样的话添加配置时host要填应用的名字（不是很确定，也可能是sevice的名字，不过一般情况两个名字是一样的，比如nextcloud)，端口要填内部端口，比如一个应用的端口映射是90:8080那么你应该填8080.

## 参考资料

https://nginxproxymanager.com/
