# Setup

In this section, you will create your own IBM Cloud account, and then get access to a IBM Cloud Lab account which contains pre-provisioned clusters. Each lab attendee will be granted access to one cluster.

## Create your IBM Cloud account <a id="create-your-ibm-cloud-account"></a>

​[Sign up for IBM Cloud](https://ibm.biz/Bd2Gpv)​

## Install IBM Cloud CLI

You use the [IBM Cloud CLI installer](https://console.bluemix.net/docs/cli/reference/ibmcloud/download_cli.html#install_use) or the OS-specific shell installers below.

{% tabs %}
{% tab title="MacOS" %}
```text
curl -fsSL https://clis.ng.bluemix.net/install/osx | sh
```
{% endtab %}

{% tab title="Linux" %}
```text
curl -fsSL https://clis.ng.bluemix.net/install/linux | sh
```
{% endtab %}

{% tab title="Windows" %}
```text
iex(New-Object Net.WebClient).DownloadString('https://clis.ng.bluemix.net/install/powershell')
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
Some windows user may see an error saying _"Exception calling "DownloadString" with "1" argument\(s\): "The underlying connection was closed: An unexpected error occurred on a send." At line:1 char:1"_  Its an issue with Powershell Mutual TLS Setting. Use installer found on the link right above.
{% endhint %}

## **Install IBM CLI Plugins**

For the lab we will need a few plugins.

* Cloud Functions

  ```bash
  ibmcloud plugin install cloud-functions
  ```

## Install Node NPM

Install node

[https://nodejs.org/en/download/](https://nodejs.org/en/download/)

## Setup Cloud Function

IBM Cloud Functions should be setup with your account creation. 

If for some reason the cloud foundry space doesn't get created automatically, setup IBM Cloud Functions [https://github.com/jthomas/openwhisk-workshops/tree/master/bootcamp/ex0%20-%20setting%20up%20development%20environment](https://github.com/jthomas/openwhisk-workshops/tree/master/bootcamp/ex0%20-%20setting%20up%20development%20environment)

Okay, Finally we are ready to get started with the workshop. If something is still missing work through this thorough bootcamp step by step. [https://github.com/jthomas/openwhisk-workshops/tree/master/bootcamp](https://github.com/jthomas/openwhisk-workshops/tree/master/bootcamp)

## Clone the repository

In this step, we'll clone the realtime-polling  git repository. This repository contains both the web application and code for our functions that we will deploy.

```bash
git clone https://github.com/moficodes/realtime-polling.git
```

