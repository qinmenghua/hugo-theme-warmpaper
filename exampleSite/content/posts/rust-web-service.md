---
title: "使用 Rust 构建高性能 Web 服务"
date: 2026-02-20
tags: ["Rust", "Web", "后端"]
categories: ["技术"]
---

Rust 以其内存安全和零成本抽象而闻名。本文将使用 Actix-web 框架构建一个高性能的 RESTful API 服务。

## 环境搭建

```bash
cargo new web-service
cd web-service
```

在 `Cargo.toml` 中添加依赖：

```toml
[dependencies]
actix-web = "4"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
```

## Hello World

```rust
use actix_web::{get, App, HttpResponse, HttpServer, Responder};

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "message": "Hello, World!"
    }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(hello)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

## RESTful API 设计

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/users | 获取用户列表 |
| POST | /api/users | 创建用户 |
| GET | /api/users/:id | 获取单个用户 |
| PUT | /api/users/:id | 更新用户 |
| DELETE | /api/users/:id | 删除用户 |

## 错误处理

```rust
#[derive(Debug)]
enum AppError {
    NotFound(String),
    Internal(String),
}

impl actix_web::ResponseError for AppError {
    fn error_response(&self) -> HttpResponse {
        match self {
            AppError::NotFound(msg) => {
                HttpResponse::NotFound().json(serde_json::json!({"error": msg}))
            }
            AppError::Internal(msg) => {
                HttpResponse::InternalServerError()
                    .json(serde_json::json!({"error": msg}))
            }
        }
    }
}
```

## 数据库集成

使用 sqlx 连接 PostgreSQL：

```rust
use sqlx::postgres::PgPoolOptions;

let pool = PgPoolOptions::new()
    .max_connections(5)
    .connect("postgres://user:pass@localhost/mydb")
    .await?;
```

## 性能优化

> Rust Web 服务在 TechEmpower 基准测试中常年位居前列。

1. 异步处理 I/O 操作
2. 使用连接池复用数据库连接
3. 启用响应压缩
4. 合理配置 worker 数量

## 总结

Rust 在 Web 开发领域正在快速成熟。虽然学习曲线陡峭，但一旦掌握，你就能构建出既安全又高性能的 Web 服务。
