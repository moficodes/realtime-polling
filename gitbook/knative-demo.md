# Knative Demo

## Setup the Cluster

```text
export KUBECONFIG=/Users/mofi/.bluemix/plugins/container-service/clusters/mofi/kube-config-wdc04-mofi.yml
```

```text
kubectl get nodes
```

```text
kubectl get po
```

```text
kubectl get ns
```

```text
watch 'kubectl get po --all-namespaces | grep "istio\|knative"'
```

## Deploy and Autoscale

```text
cd deploy
```

```text
kubectl create -f fib-service.yaml
```

```text
watch kubectl get po
```

```text
kubectl get ksvc
```

```text
export MY_DOMAIN=
```

```text
hey -c 50 -z 30s "$MY_DOMAIN/50"
```

```text
hey -c 500 -z 30s "$MY_DOMAIN/50"
```

```text
kubectl delete -f fib-service.yaml
```

## Build

```text
kubectl create secret docker-registry ibm-cr-secret \
--docker-server=https://us.icr.io \
--docker-username=iamapikey \
--docker-password=GxzrDUqB5qdTQsxC0IsYNHa1PEbBtJQhVTGhrmnI_N3B \
--docker-email="a@b.com"
```

```text
cd ../secrets
```

```text
kubectl apply -f docker-secrets.yaml
```

```text
kubectl apply -f service-account.yaml
```

```text
ibmcloud cr images | grep mofi/fib-knative
```

```text
cd ../Build
```

```text
kubectl apply -f kaniko.yaml
```

```text
kubectl apply -f build-v1.yaml
```

```text
kubectl apply -f build-v2.yaml
```

```text
ibmcloud cr images | grep mofi/fib-knative
```

##  Build and Deploy

```text
cd ../build-and-deploy
```

```text
kubectl apply -f kaniko.yaml
```

```text
kubectl get buildtemplates.build.knative.dev
```

```text
kubectl apply -f service.yaml
```

```text
watch kubectl get po
```

```text
kubectl get ksvc
```

```text
export MY_DOMAIN=
```

```text
ibmcloud cr images | grep mofi/fib-knative
```

```text
curl $MY_DOMAIN/5
```

```text
kubectl delete -f service.yaml
```

## Blue Green Deployment

```text
cd ../blue-green
```

```text
kubectl apply -f config-v1.yaml
```

```text
kubectl apply -f route-v1-100.yaml
```

```text
export MY_DOMAIN=
```

```text
while sleep 0.2; do curl "$MY_DOMAIN/1"; done
```

```text
kubectl apply -f config-v2.yaml
```

```text
kubectl apply -f route-v1-100-v2-0.yaml
```

```text
while sleep 0.2; do curl "$MY_DOMAIN/1"; done
```

```text
kubectl apply -f route-v1-50-v2-50.yaml
```

```text
while sleep 0.2; do curl "$MY_DOMAIN/1"; done
```

```text
kubectl apply -f route-v1-0-v2-100.yaml
```

```text
while sleep 0.2; do curl "$MY_DOMAIN/1"; done
```

## NOT GONNA DO THAT

## Blue Green with knctl

```text
knctl deploy \
    --service fib-knative \
    --git-url https://github.com/IBM/fib-knative \
    --git-revision vnext \
    --service-account build-bot \
    --image us.icr.io/mofi/fib-knative:v2 \
    --managed-route=false \
    --annotation "autoscaling.knative.dev/target"="10"
```

```text
ibmcloud cr images | grep mofi/fib-knative
```

```text
knctl rollout --route fib-knative \
 -p fib-knative:latest=0% \
 -p fib-knative:previous=100%
```

```text
knctl revisions list --service fib-knative
```

```text
while sleep 0.2; do curl "$MY_DOMAIN/1"; done
```

```text
knctl rollout --route fib-knative \
-p fib-knative:latest=50% \
-p fib-knative:previous=50%
```

```text
knctl revisions list --service fib-knative
```

```text
while sleep 0.2; do curl "$MY_DOMAIN/1"; done
```

```text
knctl rollout --route fib-knative -p fib-knative:latest=100%
```

```text
knctl revisions list --service fib-knative
```

```text
while sleep 0.2; do curl "$MY_DOMAIN/1"; done
```

