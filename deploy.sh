#!/bin/bash

DEST_DIR=/var/www/ssr-new           # Директория на сервере для деплоя
HOST=root@188.225.80.100             # Хост для SSH
PROJECT_DIR=/Users/alizhan_nh/Documents/work/kipish/client-nuxt  # Папка с вашим проектом на локальной машине

echo "Начало деплоя..."

# Переходим в директорию проекта
cd "$PROJECT_DIR" || exit

# Устанавливаем зависимости и собираем проект
npm install || { echo "Ошибка установки зависимостей"; exit 1; }
npm run build || { echo "Ошибка сборки"; exit 1; }

# Архивируем папку проекта, исключая node_modules и .git
tar --exclude='./node_modules' --exclude='./.git' --exclude='./package-lock.json' -czvf /tmp/client_nuxt_ssr.tar.gz . .nuxt/*

# Копируем архив на сервер
scp /tmp/client_nuxt_ssr.tar.gz "$HOST:/tmp/"

NPM_PATH="/root/.nvm/versions/node/v14.21.3/bin/npm"
PM2_PATH="/root/.nvm/versions/node/v14.21.3/bin/pm2"

# Подключаемся к серверу, распаковываем архив, устанавливаем зависимости и запускаем через PM2
ssh "$HOST" "
rm -rf $DEST_DIR &&
mkdir -p $DEST_DIR &&
tar -xzvf /tmp/client_nuxt_ssr.tar.gz -C $DEST_DIR &&
cd $DEST_DIR &&
$NPM_PATH install &&
$PM2_PATH delete client-nuxt || true &&
$PM2_PATH start $NPM_PATH --name 'client-nuxt' -- start &&
$PM2_PATH pm2 save || true
"

