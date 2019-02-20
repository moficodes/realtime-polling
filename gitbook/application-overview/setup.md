# Setup

In this section, you will create your own IBM Cloud account, and then get access to a IBM Cloud Lab account which contains pre-provisioned clusters. Each lab attendee will be granted access to one cluster.

## Create your IBM Cloud account <a id="create-your-ibm-cloud-account"></a>

​[Sign up for IBM Cloud](https://ibm.biz/Bd2Gpv)​

## Install IBM Cloud CLI

You use the [IBM Cloud CLI installer](https://console.bluemix.net/docs/cli/reference/ibmcloud/download_cli.html#install_use) or the OS-specific shell installers below.

* MacOS

  ```bash
  curl -fsSL https://clis.ng.bluemix.net/install/osx | sh
  ```

* Linux

  ```bash
  curl -fsSL https://clis.ng.bluemix.net/install/linux | sh
  ```

* Windows Powershell \(Run as Administrator\)

  ```bash
  iex(New-Object Net.WebClient).DownloadString('https://clis.ng.bluemix.net/install/powershell')
  ```

## Install IBM CLI Plugins

For the lab we will need a few plugins.

* Cloud Functions

  ```bash
  ibmcloud plugin install cloud-functions
  ```



## Setup Cloud Function

For most people the Cloud Functions works out of the box.

Setup IBM Cloud Functions [https://github.com/jthomas/openwhisk-workshops/tree/master/bootcamp/ex0%20-%20setting%20up%20development%20environment](https://github.com/jthomas/openwhisk-workshops/tree/master/bootcamp/ex0%20-%20setting%20up%20development%20environment)

Okay, Finally we are ready to get started with the workshop. If something is still missing work through this thorough bootcamp step by step. [https://github.com/jthomas/openwhisk-workshops/tree/master/bootcamp](https://github.com/jthomas/openwhisk-workshops/tree/master/bootcamp)

## Clone the repository

In this step, we'll clone the istio101 and guestbook repository. Istio101 holds istio related yaml files. Guestbook is the application we will deploy.

```bash
git clone https://github.com/moficode/realtime-polling
```

