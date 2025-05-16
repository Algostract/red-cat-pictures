<p align="center">
  <img src="./public/logo-light.png" lt="Logo" width="80" />
<p>

# RED CAT PICTURES

> Nurture the essence of your product with our photography & videography services in kolkata

<p align="center">
  <a href="https://redcatpictures.betteruptime.com">
    <img src="https://uptime.betterstack.com/status-badges/v3/monitor/10v2y.svg" alt="Better Stack Badge">
  </a>
</p>

![Landing](public/previews/landing.webp)

https://g.page/r/CaroFd9d81EjEBM/review

<!-- 2:1 -> 1680:840 (Univisium) -->

16:9 -> 1680:945 (Widescreen HD) (Video)
3:2 -> 1680:1120 (Classic) (Photo)

<!-- 7:5 -> 1680:1200 (Print) -->

4:3 -> 1680:1260 (Full-Screen SD) (Photo)(Video)

<!-- 5:4 -> 1680:1344 (SXGA) -->

1:1 -> 1680:1680 (Square) (Photo)

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
```

5. Use Docker Stack to deploy multi-container application

```bash
export $(cat .env.prod) && docker stack deploy --compose-file docker-compose.prod.yml red-cat-pictures
```

6. Scale the service

```bash
docker service scale red-cat-pictures_app=5
```

7. Check

```bash
docker service ls
docker service ps red-cat-pictures_app
```
