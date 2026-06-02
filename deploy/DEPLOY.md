# Triển khai DOSU Gem trên VPS (/home)

Phù hợp server đang dùng PM2 tại `/home` (dosubook, dosutech-api, ...).

| Dịch vụ | Domain | Chi tiết |
|---------|--------|----------|
| Frontend | `dosugem.dosutech.site` | Nginx serve `/home/dosugem/dist` |
| API | `api-dosugem.dosutech.site` | Nginx :80 → PM2 port **5081** |

---

## 0. DNS

Trỏ A record về IP VPS:

- `dosugem.dosutech.site`
- `api-dosugem.dosutech.site`

---

## 1. Clone về /home

```bash
cd /home
git clone https://github.com/newli5737/dosugem.git dosugem
cd /home/dosugem

mkdir -p /home/logs/dosugem
```

---

## 2. Cấu hình .env

```bash
cp .env.example .env
nano .env
```

```env
DATABASE_URL="postgresql://postgres:MAT_KHAU@localhost:5432/dosugem?schema=public"
JWT_SECRET="chuoi-bi-mat-dai"
ADMIN_EMAIL="admin@dosugem.site"
ADMIN_PASSWORD="mat-khau-admin-manh"
PORT=5081
```

Tạo DB (nếu chưa có):

```bash
sudo -u postgres psql -c "CREATE DATABASE dosugem;"
```

---

## 3. Cài dependency + DB + build

```bash
cd /home/dosugem
npm ci
npm run db:setup

# Build lần đầu (HTTP — trước certbot)
VITE_API_URL=http://api-dosugem.dosutech.site npm run build
```

---

## 4. Nginx — chỉ HTTP :80 trước

```bash
sudo cp /home/dosugem/deploy/nginx/dosugem.dosutech.site.conf /etc/nginx/sites-available/
sudo cp /home/dosugem/deploy/nginx/api-dosugem.site.conf /etc/nginx/sites-available/

sudo ln -sf /etc/nginx/sites-available/dosugem.dosutech.site.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/api-dosugem.site.conf /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl reload nginx
```

Kiểm tra HTTP:

```bash
curl -I http://dosugem.dosutech.site
curl http://api-dosugem.dosutech.site/api/health
```

---

## 5. PM2 — chạy API

```bash
mkdir -p /home/logs/dosugem
cd /home/dosugem
pm2 delete dosugem-api 2>/dev/null
pm2 start deploy/ecosystem.config.cjs
pm2 save
```

Kiểm tra:

```bash
pm2 list | grep dosugem
curl http://127.0.0.1:5081/api/health
curl http://127.0.0.1:5081/api/products
```

**PM2 crash loop (`↺` tăng liên tục, connection refused):**

```bash
pm2 logs dosugem-api --lines 50 --nostream
# Hoặc test tay:
cd /home/dosugem && node --import tsx server/index.ts
```

Config dùng **`exec_mode: fork`** + `tsx` interpreter (cluster mode hay crash với `.ts`).

---

## 6. Certbot — xin SSL thủ công (DNS TXT)

**Không dùng** `certbot --nginx`. Xác thực bằng **bản ghi TXT** trên DNS:

```bash
sudo certbot certonly --manual \
  --preferred-challenges dns \
  --agree-tos \
  --email support@dosutech.site \
  -d dosugem.dosutech.site \
  -d api-dosugem.dosutech.site
```

Certbot dừng lại, in kiểu:

```
Please deploy a DNS TXT record under the name:
_acme-challenge.dosugem.dosutech.site
with the following value:
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Làm trên DNS (Cloudflare / nhà cung cấp domain)

Thêm **2 bản ghi TXT** (certbot hỏi lần lượt từng domain):

| Type | Name / Host | Value |
|------|-------------|-------|
| TXT | `_acme-challenge.dosugem` | *(value certbot in)* |
| TXT | `_acme-challenge.api-dosugem` | *(value certbot in)* |

> Nếu panel DNS tự thêm suffix `.dosutech.site` thì Host chỉ cần `_acme-challenge.dosugem` hoặc `_acme-challenge.api-dosugem`.

Đợi DNS propagate (1–5 phút, Cloudflare thường nhanh), kiểm tra:

```bash
dig TXT _acme-challenge.dosugem.dosutech.site +short
dig TXT _acme-challenge.api-dosugem.dosutech.site +short
```

Thấy đúng value → quay lại terminal certbot, **Enter**. Lặp cho domain thứ 2 nếu certbot hỏi tiếp.

Cert nằm tại:

```
/etc/letsencrypt/live/dosugem.dosutech.site/fullchain.pem
/etc/letsencrypt/live/dosugem.dosutech.site/privkey.pem
```

> **Gia hạn:** `certbot renew` với `--manual` cần TXT lại mỗi lần — nên dùng plugin DNS (Cloudflare…) hoặc renew thủ công trước khi hết hạn 90 ngày.

### Gắn SSL vào nginx (thủ công)

Thêm vào **`dosugem.dosutech.site.conf`** — block redirect 80 + block 443:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name dosugem.dosutech.site;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name dosugem.dosutech.site;

    ssl_certificate     /etc/letsencrypt/live/dosugem.dosutech.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dosugem.dosutech.site/privkey.pem;

    root /home/dosugem/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Thêm vào **`api-dosugem.site.conf`**:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api-dosugem.dosutech.site;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api-dosugem.dosutech.site;

    ssl_certificate     /etc/letsencrypt/live/dosugem.dosutech.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dosugem.dosutech.site/privkey.pem;

    client_max_body_size 10m;

    location / {
        proxy_pass http://127.0.0.1:5081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Gia hạn cert (cron certbot có sẵn):

```bash
sudo certbot renew --dry-run
```

**Sau certbot — build lại frontend với HTTPS:**

```bash
cd /home/dosugem
VITE_API_URL=https://api-dosugem.dosutech.site npm run build
# không cần restart nginx — dist/ được serve lại tự động
pm2 restart dosugem-api
```

---

## 7. Truy cập

| URL | Mô tả |
|-----|-------|
| https://dosugem.dosutech.site | Website |
| https://dosugem.dosutech.site/admin/dang-nhap | CMS |
| https://api-dosugem.dosutech.site/api/health | API |

CMS mặc định: `admin@dosugem.site` / `admin123` — **đổi ngay sau deploy**.

---

## 8. Cập nhật code

```bash
cd /home/dosugem
git pull
npm ci
npm run db:push          # nếu có migration schema mới
VITE_API_URL=https://api-dosugem.dosutech.site npm run build
pm2 restart dosugem-api
```

---

## Tóm tắt lệnh nhanh (copy-paste)

```bash
cd /home
git clone https://github.com/newli5737/dosugem.git dosugem
cd dosugem && mkdir -p /home/logs/dosugem
cp .env.example .env && nano .env
npm ci && npm run db:setup
VITE_API_URL=http://api-dosugem.dosutech.site npm run build

sudo cp deploy/nginx/*.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/dosugem.dosutech.site.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/api-dosugem.site.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

pm2 start deploy/ecosystem.config.cjs && pm2 save

# Xin SSL — DNS TXT thủ công:
sudo certbot certonly --manual --preferred-challenges dns \
  --agree-tos --email support@dosutech.site \
  -d dosugem.dosutech.site -d api-dosugem.dosutech.site
# → thêm TXT _acme-challenge.* trên DNS → dig kiểm tra → Enter
# → gắn SSL nginx thủ công (mục 6)
VITE_API_URL=https://api-dosugem.dosutech.site npm run build
```
