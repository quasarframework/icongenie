![Icon Genie logo](https://cdn.quasar.dev/img/iconfactory.png)

# Quasar Framework Icon Genie

> A Quasar tool for generating all your Quasar App's icons and splashscreens
>
> Note: **Icon Genie v2 is in the works**

<!--
<img src="https://img.shields.io/npm/v/%40quasar/icongenie.svg?label=@quasar/icongenie">
-->

[![Join the chat at https://chat.quasar.dev](https://img.shields.io/badge/chat-on%20discord-7289da.svg)](https://chat.quasar.dev)
<a href="https://forum.quasar.dev" target="_blank"><img src="https://img.shields.io/badge/community-forum-brightgreen.svg"></a>
[![https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg](https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg)](https://good-labs.github.io/greater-good-affirmation)

## What is Icon Genie

This node module outputs a set of **SQUARE** favicons, webicons, pwa-icons and electron-icons as well as iOS, Windows Store and MacOS icons from an original 1240x1240 square icon that retains transparency and also **minifies** the assets. It will also create splash screens for Cordova/Capacitor and even a minified svg.

It works cross-platform to generate those pesky `.icns` and `.ico` files used by Electron apps and in the case of the latter preferred by some browsers and webscrapers (favicon.ico) - even though modern development guidelines for Apple and Windows recommend using `.png`.

It has two primary interfaces (with Quasar CTX and as a standalone CLI) and although it is built for the Quasar Framework, it should work anywhere you can run node. You can even import it and use it in your own pipelines if that's your thing. It is designed to be a very useful tool that you will be glad to have lying around.

> You **MUST** use PNG. If you use a source image that is smaller than 1240x1240 some icons will be naively upscaled. If you do not use a square original, it will be cropped square from the center using the smaller dimension as width and height - but will never upscale - which can potentially result in non-square results. You have been warned.

A final note: You should always pad your icon design with about 1% of empty space. This is because you will lose aliasing resolution when downscaling, which means at smaller sizes your round icon (if it doesn't have padding) will seem to have flattened top, bottom, left and right sides.

## Supporting Quasar
Quasar Framework is an MIT-licensed open source project. Its ongoing development is made possible thanks to the support by these awesome [backers](https://github.com/rstoenescu/quasar-framework/blob/dev/backers.md).

**Please read our manifest on [Why donations are important](https://quasar.dev/why-donate)**. If you'd like to become a donator, check out [Quasar Framework's Donator campaign](https://donate.quasar.dev).

## Documentation

Head on to the Quasar Framework official website: [https://quasar.dev](https://quasar.dev)

## Stay in Touch

For latest releases and announcements, follow on Twitter: [@quasarframework](https://twitter.com/quasarframework)

## Chat Support

Ask questions at the official community Discord server: [https://chat.quasar.dev](https://chat.quasar.dev)

## Community Forum

Ask questions at the official community forum: [https://forum.quasar.dev](https://forum.quasar.dev)

## Semver
Quasar Icon Genie is following [Semantic Versioning 2.0](https://semver.org/).

## License

Copyright (c) 2018-present Razvan Stoenescu

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
