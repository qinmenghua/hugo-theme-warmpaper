---
title: "从浏览器远程访问家里 Mac 终端：RemoteTTYs 部署指南"
date: 2026-04-13
lastmod: 2026-05-20
tags: ["技术分享", "Claude Code", "远程终端", "Docker"]
categories: ["技术分享"]
---

想在咖啡厅、办公室或手机上用 Claude Code、vim 操作家里的 Mac，但 Mac 在 NAT 后面没有公网 IP？RemoteTTYs 是一个基于 WebSocket 中继的远程终端工具，Agent 主动外连服务器，无需内网穿透、无需开放端口，终端内容端到端加密。本文介绍三种服务端部署方式（公网 HTTPS、局域网、自带反向代理）以及客户端 Agent 的安装配置，帮你在 10 分钟内搭建完成。

## 什么是 RemoteTTYs

RemoteTTYs 由三个组件构成：运行在本地 Mac/Linux 上的 **Agent**（Go 单文件）主动向远端的 **Relay** 服务器发起 WebSocket 连接，浏览器通过 **Web UI** 打开终端会话。由于连接方向是从内网向外发起的，所以不需要公网 IP、不需要端口映射、不需要 frp/Tailscale 等穿透工具。

```text
本地机器                       远端服务器                   浏览器
┌──────────────┐             ┌──────────────┐            ┌──────────┐
│  rttys-agent │──outbound──▶│  rttys-relay │◀───HTTPS───│ Web UI   │
│  (Go binary, │   WSS       │  (Node.js)   │   + WSS    │ ghostty  │
│   no open    │◀────────────│              │───────────▶│  -web    │
│   ports)     │             └──────────────┘            └──────────┘
└──────────────┘
```

**核心特性：**

- 无需内网穿透 —— Agent 主动外连 Relay，本地无需开放任何端口
- 端到端加密（ECDH P-256 + AES-256-GCM）—— Relay 服务器无法读取终端内容
- Ed25519 质询-响应认证 + 机器指纹绑定，防止 Token 被盗用
- Agent 身份密钥 + TOFU 信任模型（类似 SSH），防止中间人攻击
- ghostty-web 驱动的浏览器终端 —— 真实终端体验，支持颜色、滚动回放、鼠标事件
- 多机器仪表盘 + 多标签终端会话
- Go 单文件 Agent，零依赖，守护进程模式自动重连
- JWT 多用户认证，审计日志记录所有操作
- MIT 开源协议，完全自托管

> **项目地址：** [GitHub - finch-xu/RemoteTTYs](https://github.com/finch-xu/RemoteTTYs) | [官方文档](https://docs.pidan.dev/zh/remotettys/)

## 方式一：公网部署（推荐）

适合需要从任意网络访问家里机器的场景。Relay 和 Caddy 反向代理一起部署，Caddy 自动签发 HTTPS 证书。

### 前置要求

- 一台有公网 IP 的服务器，已安装 Docker
- 一个域名，DNS 解析指向该服务器

### 1. 克隆项目

```bash
git clone https://github.com/finch-xu/RemoteTTYs.git
cd RemoteTTYs
```

### 2. 配置 Caddy

```bash
cp Caddyfile.example Caddyfile
```

编辑 `Caddyfile`，将 `rttys.example.com` 替换为你的域名：

```caddy
rttys.example.com {
	encode gzip zstd

	# deny robots
	handle /robots.txt {
                respond `User-agent: *
                Disallow: /` 200
    }

	# Security headers
	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
		X-Frame-Options "DENY"
		Referrer-Policy "strict-origin-when-cross-origin"
		Permissions-Policy "camera=(), microphone=(), geolocation=(), usb=()"
		X-Robots-Tag "noindex, nofollow, noarchive"
		-Server
	}

	# Limit request body size (WebSocket upgrades are exempt)
	request_body {
		max_size 1MB
	}

	reverse_proxy 172.17.0.1:8080 {
		# Pass real client IP to backend for rate limiting
		header_up X-Real-IP {remote_host}
		header_up X-Forwarded-For {remote_host}
		header_up X-Forwarded-Proto {scheme}

		# Disable response buffering for real-time terminal I/O
		flush_interval -1

		# WebSocket: max session duration (terminal sessions can reconnect)
		stream_timeout 24h

		# Graceful delay before closing WebSocket on config reload
		stream_close_delay 5s

		# Upstream connection tuning
		transport http {
			keepalive        30s
			keepalive_interval 15s
		}
	}
}
```

### 3. 启动服务

```bash
docker compose up -d
```

`docker-compose.yml` 包含 Relay 和 Caddy 两个服务：

```yaml
services:
  remotettys:
    image: ghcr.io/finch-xu/remotettys:latest
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  remotettys-caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"   # HTTP/3 (QUIC)
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy-data:/data
      - caddy-config:/config
    depends_on:
      - remotettys
    restart: unless-stopped

volumes:
  caddy-data:
  caddy-config:
```

Caddy 会自动通过 Let's Encrypt 签发 TLS 证书，无需额外配置。启动后访问 `https://rttys.你的域名.com` 即可进入初始设置页面。

## 方式二：局域网部署

适合仅在家庭或办公局域网内使用的场景，无需域名和 HTTPS。

### 1. 克隆项目

```bash
git clone https://github.com/finch-xu/RemoteTTYs.git
cd RemoteTTYs
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```env
JWT_SECRET=change-me-to-a-random-secret
# PORT=8080
```

### 3. 启动服务

```bash
docker compose -f docker-compose-lan.yml up -d
```

`docker-compose-lan.yml` 仅包含 Relay 服务：

```yaml
services:
  remotettys:
    image: ghcr.io/finch-xu/remotettys:latest
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
    env_file:
      - path: .env
        required: false
    restart: unless-stopped
```

启动后访问 `http://服务器IP:8080` 进入初始设置。

## 方式三：自带反向代理

如果你已经有 nginx、Caddy 或其他反向代理，可以只部署 Relay 后端，自行配置反向代理转发到 8080 端口。

```bash
docker compose -f docker-compose-only-backend.yml up -d
```

```yaml
services:
  remotettys:
    image: ghcr.io/finch-xu/remotettys:latest
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

反向代理配置要点：

- WebSocket 支持（`/ws/` 路径需要升级为 WebSocket 连接）
- 禁用响应缓冲（对应 Caddy 的 `flush_interval -1` / nginx 的 `proxy_buffering off`）
- 传递真实客户端 IP（`X-Real-IP`、`X-Forwarded-For`、`X-Forwarded-Proto`）

## 三种方式对比

| 维度 | 公网部署 | 局域网部署 | 自带反向代理 |
|------|---------|-----------|-------------|
| 适用场景 | 任意网络远程访问 | 仅局域网内使用 | 已有反向代理基础设施 |
| HTTPS | Caddy 自动签发 | 不需要 | 自行配置 |
| 域名 | 需要 | 不需要 | 视情况 |
| 复杂度 | 最简单 | 最简单 | 需要额外配置 |

## 初始设置

三种部署方式启动后，首次访问 Web UI 都会进入初始设置页面。

### 1. 创建管理员账号

打开浏览器访问你的 Relay 地址，按提示创建管理员用户名和密码。

### 2. 获取 Server Key

登录后进入 **Settings** 页面，复制 **Server Public Key**（Ed25519 公钥）。Agent 用它来验证服务器身份，防止连接到伪造的 Relay。

### 3. 创建 Agent Token

在 Settings 页面点击创建新的 Agent Token，为你的机器设置一个标签（如 "Home Mac"）。复制生成的 Token，稍后配置 Agent 时使用。

## 安装 Agent

Agent 是运行在你本地 Mac 或 Linux 上的 Go 单文件程序，零依赖。

### 1. 下载

访问 [Releases 页面](https://github.com/finch-xu/RemoteTTYs/releases/latest)，根据你的平台下载对应的二进制文件：

| 平台 | 文件名 |
|------|--------|
| macOS (Apple Silicon) | `rttys-agent-macOS-arm64` |
| macOS (Intel) | `rttys-agent-macOS-x64` |
| Linux (x86_64) | `rttys-agent-Linux-x64` |
| Linux (ARM64) | `rttys-agent-Linux-arm64` |

```bash
chmod +x rttys-agent-*
mv rttys-agent-* rttys-agent
```

### 2. 初始化配置

```bash
./rttys-agent init
```

这会在同目录下生成 `config.yaml`：

```yaml
relay: wss://your-server.com/ws/agent
token: your-agent-token
server_key: <base64-encoded-server-public-key>
name: my-machine
shell: /bin/zsh
```

将 `relay`、`token`、`server_key` 替换为你在上一步中获取的值：

- **relay**：你的 Relay 地址（公网用 `wss://你的域名/ws/agent`，局域网用 `ws://IP:8080/ws/agent`）
- **token**：从 Web UI Settings 页面创建的 Agent Token
- **server_key**：从 Web UI Settings 页面复制的 Server Public Key

### 3. 启动

```bash
# 前台运行（调试用）
./rttys-agent

# 后台守护进程模式
./rttys-agent -d

# 查看运行状态
./rttys-agent status

# 停止守护进程
./rttys-agent stop
```

Agent 会自动重连，退避间隔从 1 秒递增到最大 30 秒。

## 开始使用

Agent 启动并连接成功后，打开浏览器访问你的 Relay Web UI，就能在设备列表中看到你的机器显示为在线状态。点击机器名称即可打开一个终端会话。

终端由 ghostty-web（Ghostty 的 VT100 解析器编译为 WebAssembly）驱动，支持完整的终端特性：256 色、滚动回放、鼠标事件。你可以直接运行：

- `claude` —— 远程使用 Claude Code
- `vim` / `nvim` —— 编辑代码
- `htop` —— 监控系统资源
- `ssh` —— 跳板到其他机器

支持同时打开多个终端标签页，浏览器断开重连后自动恢复滚动缓冲区（每个会话 1MB）。

## 安全模型

RemoteTTYs 在 Agent 与 Relay 之间建立了三层安全防护：

1. **HTTP Token 认证** —— Agent 在 WebSocket 升级请求中通过 `X-Token` 头发送 Token，无效 Token 在连接建立前即被拒绝
2. **Ed25519 质询-响应** —— WebSocket 建立后，服务器用私钥签名 Agent Token 作为质询，Agent 用预配置的服务器公钥验签，通过后才发送数据
3. **机器指纹绑定** —— Agent 上报机器唯一 ID 的 SHA-256 哈希，服务器在首次连接时记录，后续连接若不匹配则拒绝，防止 Token 在其他机器上被盗用

在此基础上，所有终端内容（击键和输出）都经过端到端加密：

- **密钥交换**：每个会话使用 ECDH P-256 临时密钥对，提供前向保密
- **对称加密**：AES-256-GCM，基于计数器的 nonce 防重放
- **MITM 防护**：每个 Agent 有一个 Ed25519 身份密钥，浏览器在首次连接时存储（TOFU 模型，类似 SSH），密钥变化时会弹出警告

## 参考链接

- GitHub 仓库：[finch-xu/RemoteTTYs](https://github.com/finch-xu/RemoteTTYs)
- 官方文档：[docs.pidan.dev/zh/remotettys](https://docs.pidan.dev/zh/remotettys/)
