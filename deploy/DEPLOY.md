# Triển khai DOSU Gem lên VPS

## Domain & Port

| Dịch vụ | Domain | Port nội bộ |
|---------|--------|-------------|
| Frontend (static) | `dosugem.dosutech.site` | Nginx serve `/var/www/dosugem/dist` |
| Backend API | `api-dosugem.dosutech.site` | **5081** (không dùng 3001) |

## 1. DNS

Trỏ A record về IP VPS:

- `dosugem.dosutech.site` → IP
- `api-dosugem.dosutech.site` → IP

## 2. Clone & cài đặt

```bash
sudo mkdir -p /var/www/dosugem /var/log/dosugem /var/www/certbot
sudo chown -R $USER:$USER /var/www/dosugem /var/log/dosugem

git clone https://github.com/newli5737/dosugem.git /var/www/dosugem
cd /var/www/dosugem

cp .env.example .env
# Sửa DATABASE_URL, JWT_SECRET, PORT=5081

npm ci
npm run db:setup
npm run build
```

## 3. SSL (Let's Encrypt)

```bash
sudo certbot certonly --webroot -w /var/www/certbot \
  -d dosugem.dosutech.site \
  -d api-dosugem.dosutech.site
```

## 4. Nginx

```bash
sudo cp deploy/nginx/dosugem.dosutech.site.conf /etc/nginx/sites-available/
sudo cp deploy/nginx/api-dosugem.site.conf /etc/nginx/sites-available/

sudo ln -sf /etc/nginx/sites-available/dosugem.dosutech.site.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/api-dosugem.site.conf /etc/nginx/sites-enabled/

sudo nginx -t && sudo systemctl reload nginx
```

## 5. Chạy API (PM2)

```bash
npm install -g pm2 tsx
pm2 start deploy/ecosystem.config.cjs
pm2 save && pm2 startup
```

## 6. Frontend production build

Sau mỗi lần cập nhật code:

```bash
cd /var/www/dosugem
git pull
npm ci
npm run build
# dist/ được nginx serve tự động
pm2 restart dosugem-api
```

## 7. Biến môi trường production

File `/var/www/dosugem/.env`:

```env
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/dosugem?schema=public"
JWT_SECRET="your-strong-secret"
ADMIN_EMAIL="admin@dosugem.site"
ADMIN_PASSWORD="strong-password"
PORT=5081
```

## 8. Frontend gọi API

Build production cần proxy hoặc biến `VITE_API_URL`. Mặc định dev dùng `/api` qua Vite proxy.

Production: cập nhật `src/app/api/client.ts` hoặc set build arg:

```bash
VITE_API_URL=https://api-dosugem.dosutech.site npm run build
```
