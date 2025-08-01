<p align="center">
  <img src="./public/logo-light.png" lt="Logo" width="80" />
<p>

# RED CAT PICTURES

<p align="center">
  <a href="https://redcatpictures.betteruptime.com">
    <img src="https://uptime.betterstack.com/status-badges/v3/monitor/10v2y.svg" alt="Better Stack Badge">
  </a>
</p>

![Landing](public/previews/landing.webp)

> Nurture the essence of your product with our photography & videography services in kolkata

- 📦 SSR
- 🖼️ OG Tags
- 🚀 PWA
- ✋ Push Notification
- 🌙 Light/Dark Mode
- 🗂️ CMS (Notion)
- 🤖 Automation (Email, Whatsapp)
- 🐋 Containerized
- 🪄 CI/CD (Github Action)
- ⚡️ API Route Caching
- 📐 Analytics

https://g.page/r/CaroFd9d81EjEBM/review

- [x] Modify About Us page
- [x] Update photos and videos url slug
- [x] Update task sync:meta-data for optimistic cached update

- [ ] Modify content page to show gallery view
- [ ] Whatsapp Automation

- [ ] Facebook Automation
- [ ] Image Search
- [ ] Update Photo page with title and description
- [ ] Instagram Automation
- [ ] Share Url
- [ ] Modify Photo page to Project page
- [ ] Videos and Video page
- [ ] Like/Dislike Count Content
- [ ] Add live streaming page
- [ ] Audio Dictation of Content

## How to Deploy

1. Initialize Swarm on the Manager Node

```bash
docker swarm init --advertise-addr <MANAGER-IP>
```

2. Join Worker Nodes to the Swarm

```bash
docker swarm join --token <WORKER-TOKEN> <MANAGER-IP>:2377
```

3. Check Node Status

```bash
docker node ls
```

4. Create a docker volume

```bash
docker volume create \
  --name red-cat-pictures_static \
  --driver local \
  --opt type=none \
  --opt device=~/Algostract/red-cat-pictures/static \
  --opt o=bind

docker volume create \
  --name red-cat-pictures_data \
  --driver local \
  --opt type=none \
  --opt device=~/Algostract/red-cat-pictures/.data \
  --opt o=bind
```

5. Use Docker Stack to deploy multi-container application

```bash
docker stack deploy --compose-file docker-compose.prod.yml red-cat-pictures
```

6. Scale service

```bash
docker service scale red-cat-pictures_app=2
```

7. Verify

```bash
docker service ls
docker service ps red-cat-pictures_app
```

## License

Published under the [MIT](https://github.com/Algostract/red-cat-pictures/blob/main/LICENSE) license.
<br><br>
<a href="https://github.com/Algostract/red-cat-pictures/graphs/contributors">
<img src="https://contrib.rocks/image?repo=Algostract/red-cat-pictures" />
</a>
