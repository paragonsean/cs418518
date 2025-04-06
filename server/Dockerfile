FROM node:18

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Rebuild native modules (like bcrypt)
RUN npm rebuild bcrypt --build-from-source

COPY . .

RUN pnpm build

EXPOSE 8000
CMD ["pnpm", "start"]
