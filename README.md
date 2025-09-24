# Intro
_TODO_

# Requirements
The project is installed using ____

Dependencies:
_TODO_

# Get started
_TODO_

# Run image in kubernetes
Use the helm-chart https://github.com/KvalitetsIT/helm-kitTyAct-chart . The chart is also used here https://github.com/KvalitetsIT/medcom-sdn-apps/tree/main/medcom-sdn-ui

The image build from the dockerfile, should be run as a initContainer. This initContainer will create everything that is needed, and copy it over to the /temp folder. The idea is to mount this to a empty dir, and share it with a clean nginx image. This way the initContainer will run root, and the running container will run nonRoot.

__The container will not run if not all the volumes are mounted exactly like the example below.__

The following example is from medcom-sdn-ui where the service-chart is being used
```
service:
  revisionHistoryLimit: 3
  image:
    repository: nginxinc/nginx-unprivileged
    tag: alpine3.17
    

  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.class: nginx
  replicaCount: 1

  initContainers:
    init:
      image:
        repository: kvalitetsit/medcom-sdn-ui
        tag: e1aab1b0abd33f1d8f1d5529e64c2ed37a2cb54c
      extraVolumeMounts:
        init:
          mountPath: /temp/docker-entrypoint.d
        etc:
          mountPath: /temp/etc/nginx
        var:
          mountPath: /temp/var/run
        nginx-cache:
          mountPath: /temp/var/cache/nginx
      env:
        REACT_APP_DSDN_DOMAIN:
          value: "dsdn.dk"
        REACT_APP_NODE_ENV:
          value: "production"
        REACT_APP_DISABLE_BUTTONS_NOT_WORKING:
          value: false
        REACT_APP_INACTIVITY_MAX_MINUTES:
          value: "30"
        REACT_APP_SUPPORT_IPV6:
          value: "false"

  deployment:
    containerport: 80
    extraVolumes:
      init: |
        emptyDir:  {}
      etc: |
        emptyDir:  {}
      var: |
        emptyDir:  {}
      nginx-cache: |
        emptyDir:  {}

    extraVolumeMounts:
      init:
        mountPath: /docker-entrypoint.d
      etc:
        mountPath: /etc/nginx
      var:
        mountPath: /var/run
      nginx-cache:
        mountPath: /var/cache/nginx
     
    
```
