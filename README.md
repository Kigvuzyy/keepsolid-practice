# Keepsolid Practice 2025

Мне тут очень лень что-то описывать. Поэтому напишу только про deploy.

## Deployment

Я тестировал только на Windows 11. И если с minikube еще спорно, будет ли он работать также, то докер должен работать на всех платформах amd64.

### 1) С помощью Minikube:

Первым делом создаем локальный кластер minikube (НЕ НА ДОКЕР ДРАЙВЕРЕ)

Пишем любые нужные конфигурации:

```bash
  minikube config set driver hyperv
  minikube config set cpus 4
  minikube config set memory 10240
  minikube config set disk 20000
```

И запускаем:

```bash
  minikube start
```

После запуска, нам нужно будет встроенное дополнение от Kubernetes, но по умолчанию оно выключено, поэтому включаем:

```bash
  minikube addons enable ingress
```

Далее создаем файл backend-secrets.yaml в `/deploy/k8s/overlays/minikube/secrets` по примеру backend-secrets.example.yaml.

Заполняем все нужные ключи (в формате base64). И после этого применяем все manifest файлы командой:

```bash
  kubectl apply -k .\deploy\k8s\overlays\minikube\
```

### 2) С помощью Docker Compose:

Тут еще все проще. Создаем .env файл в директории `/deploy/docker` и заполняем его по примеру .env.example. И далее просто выполняем команду:

```bash
  docker compose -f .\deploy\docker\docker-compose.yaml up -d
```

Ну и если мы хотим забилдить все образы докера сами, то делаем так:

```bash
  docker compose -f .\deploy\docker\docker-compose.build.yaml up -d
```
