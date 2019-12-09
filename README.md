# DmiStorageClient

[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)

DmiStorageClient is a **Vue.js based** GUI that uses [DmiStorageServer](https://github.com/LemuelPuglisi/DmiStorageServer)  APIs.

*****

## Requirements 

- A working [DmiStorageServer](https://github.com/LemuelPuglisi/DmiStorageServer) intallation
- **Vue.js** requirements 

*****

## Installation

Clone or Download the repository

```bash
$ git clone https://github.com/LemuelPuglisi/DmiStorageClient.git
```

cd into the project directory and Install dependencies

```bash
$ npm install
```

copy .env.example to .env 

```bash
$ cp .env.example .env
```

Set the following parameters in .env file: 

> VUE_APP_HOST= // insert here the DmiStorageServer Url 
>
> VUE_APP_OAUTH_ID= // insert here the DmiStorageServer Password client id
>
> VUE_APP_OAUTH_TOKEN= // insert here the DmiStorageServer Password client token
>
> VUE_APP_AES_SECRET= // insert here an strong arbitrary encryption key 



#### Compiles and hot-reloads for development 

```bash
$ npm run serve 
```

#### Run your tests 

```bash
$ npm run test
```

#### Compiles and minifies for production 

```bash
$ npm run build 
```



## Other libraries 

- [Materialize CSS](https://materializecss.com/)

   
