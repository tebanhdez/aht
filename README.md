[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# AHT assessment

> Concept assessment application for AHT.

## Prerequisites

This project requires NodeJS (version 18 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
9.5.0
v18.14.2
```

## Table of contents

- [AHT assessment](#aht-assessment)
    - [Prerequisites](#prerequisites)
    - [Table of contents](#table-of-contents)
    - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Usage](#usage)
        - [Serving the app](#serving-the-app)
        - [Running the tests](#running-the-tests)
        - [Compiling the project](#compiling-the-project)
    - [API](#api)
        - [Create telemetry](#create-telemetry)
        - [Retrieve telemetries](#retrieve-telemetries)
    - [Authors](#authors)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/tebanhdez/aht.git 
$ cd aht
```

## Usage

### Serving the app

```sh
$ npm start
```

### Running the tests

```sh
$ npm test
```

### Compiling the project

```sh
$ npm run build
```

This task will compile the project
inside your local `build/` folder


## API

The application serves two end points;

### Authorization

The API request to create a telemetry, require the use of a user/password. To authenticate an API request, you should provide the credentials in the `Authorization` header.
The auth password is shown at the application startup console.

```shell
> Admin user password: xxxxxxxxxxxx
```

## Create Telemetry
```http
POST /telemetry
```
### Payload
```javascript
{
  "reading" : number
}
```
#### Example:
```shell
curl -X POST localhost:8080/telemetry  -H "Content-Type: application/json" -H "Authorization: Basic YWh0YWRtaW46cGFzc3dvcnQ=" -d '{"reading": 123.456}'
```
![Postman example](./post.jpg)
### Response

Return the JSON representation of the resources created.

```javascript
{
  "id" : integer,
  "reading" : number
}
```

The `id` attribute describes de primary key of the resource created.

The `reading` attribute describes the reading value persisted in the DB.

## Retrieve Telemetries (for testing)
```http
GET /telemetry
```
#### Example:
```shell
curl localhost:8080/telemetry
```

### Response

Return an array of the JSON representation of the resources stored.

```javascript
[{
  "id" : integer,
  "reading" : number
}]
```

The `id` attribute describes de primary key of the resource created.

The `reading` attribute describes the reading value persisted in the DB.

## Status Codes

AHT API returns the following status codes in its API:

| Status Code | Description |
|:------------| :--- |
| 200         | `OK` |
| 400         | `BAD REQUEST` |
| 401         | `UNAUTHORIZE` |
| 404         | `NOT FOUND` |

## Authors

* **Esteban Hernández** - *Initial work* - [tebanhdez]( https://github.com/tebanhdez)
