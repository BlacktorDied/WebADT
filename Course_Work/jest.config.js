const path = require("path");

module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    transformIgnorePatterns: ["/node_modules/"],
};
