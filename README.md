# soapy-dl

Download TV series and movies from [soap2day](https://soapy2day.ac) in your terminal

## Overview

- [Installation](#installation)
  1. [Package Manager Installation](#installation)
  2. [Installation from Source](#Source)
- [Usage](#Usage)
  1. [download](download)
  2. [clear](clear)

## Installation

1. Install with any package manager as global

```bash
  npm i -g soapy-dl
    or
  yarn global add soapy-dl
    or
  pnpm i -g soapy-dl
```

2. Install from source

```sh
    git clone https://github.com/iamstarcode/soapy-dl.git \
    && cd soapy-dl \
    && npm install \
    or
    && yarn install \
    or
    && pnpm i \
    && npm install -g .
```

## Usage

```bash
Usage: soapy-dl [options] [command]

Options:
  -d, --debug
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  download        Download a TV series or Movie
  clear           Clear cache
  help [command]  display help for command
```

#### `download`

```bash
Usage:
  soapy-dl download [<name>] -f -ep "/data/data/com.termux/files/usr/bin/chromium-browser"
Options:
    -f, --force  Force refecth for cookie, links and searches
    -ep, --executablePath <string>  Path to browser executable for puppeter
```

```bash
soapy-dl  download "game of thrones"
```

The downloaded video will be saved in the relative path where the command was run, for movies `./downloads/Batman:-The Dark-Knight-Returns.mp4`, and for series `./downloads/See/S1/s1ep1.mp4`

## How to use

This package installs Puppeteer, when you install Puppeteer, it automatically downloads a recent version of Chrome that is guaranteed to work with Puppeteer. The browser is downloaded to the $HOME/.cache/puppeteer folder by default (starting with Puppeteer v19.0.0).

For whatever reason Puppeteer might fail in installing the browser(like in termux android terminal), you can however point to the executable path for where you have a browser installed, by passing the -ep=<chrome|chromium-path> when using the download command.
eg "soapy-dl download <movie|series name to search> -ep=/data/data/com.termux/files/usr/bin/chromium-browser

Examples of browser location tested and working

1. X-11 termux repo for Chromium [/data/data/com.termux/files/usr/bin/chromium-browser]
2. Debian Linux Flavours for Google Chrome [/usr/bin/google-chrome]

```bash
 $ npx soapy-dl download <movie|series name to search> -ep="/data/data/com.termux/files/usr/bin/chromium-browser"
    or
 $ soapy-dl download <movie|series name to search>
```
