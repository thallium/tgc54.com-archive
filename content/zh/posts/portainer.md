---
title: Portainer
---
[Portainer](https://www.portainer.io/)是一个Docker和Kubernetes管理软件（本文只涉及Docker)。
<!--more-->

## 安装
先创建一个volumn
```sh
docker volume create portainer_data
```

安装
```sh
docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:2.11.1
```
其中9443是web ui的端口，可以根据情况修改。

## 使用
### docker-compose

stacks -> add stack -> 复制docker-compose文件 -> deploy the stack

### Quick Actions

常用两个quick actions:
- Logs: 查看log
- Exec Console: 连进container里面干一些骚操作，比如装个包什么的。。。

## Tips
### 设置内网IP

左侧边栏Environment -> 选择服务器（默认叫Local）-> Public IP里填入服务器的内网IP这样点击端口就能自动跳转到正确的地址了。

## 参考资料

https://docs.portainer.io/v/ce-2.11/start/install/server/docker/linux

https://www.youtube.com/watch?v=ljDI5jykjE8#1
