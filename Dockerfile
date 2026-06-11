# ── Task 4: Dockerize Blog API ──
# build เป็น Node server (ใช้ @astrojs/node ผ่าน BUILD_TARGET=node)

# ---------- Build stage ----------
FROM node:22-alpine AS build
WORKDIR /app

# ติดตั้ง dependencies ก่อน (cache layer)
COPY package*.json ./
RUN npm ci

# คัดลอกซอร์สแล้ว build แบบ Node adapter
COPY . .
ENV BUILD_TARGET=node
RUN npm run build

# ---------- Runtime stage ----------
FROM node:22-alpine
WORKDIR /app

# เอาเฉพาะของที่ต้องใช้รันจริงมาจาก build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

# Astro Node server ฟังที่ HOST/PORT นี้
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production
EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
