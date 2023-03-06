# Biscuit Machine

Biscuit machine system build with [React][react] and [Typescript][typescript].

## Description

The application cover the following requirements:

- When switched on, the machine must wait for the oven to warm up before starting the conveyor belt.

- Biscuits must be cooked at a temperature of 220 - 240°C (the oven will overheat if the heating element is on all the time).

- If the operator selects “Pause", all movement must be stopped immediately but the oven should be kept heated.

- When “Off” is selected, the machine should be shut down leaving nothing on the conveyor belt.

## Tech Stack 

* [React][react], [Typescript][typescript], [Lambda TS][lambda-ts], [Yarn][yarn]

## Prerequisites

* [Node] v18 or higher

## Getting Started

Clone the repository

```
git@github.com:aYo-dev/biscuit-machine.git
```

Install dependencies and run the project

```
yarn install
yarn start
```

The application will be opened in the browser with the following url: `http://127.0.0.1:3000`


[react]: https://reactjs.org
[typescript]: https://github.com/kriasoft/
[node]: https://nodejs.org/
[lambda-ts]: https://github.com/aYo-dev/lambda-ts
[yarn]: https://yarnpkg.com/
