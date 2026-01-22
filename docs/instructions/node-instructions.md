# Installing Node.js and npm from the CLI (Windows & Mac)

Node.js comes bundled with npm (the Node package manager). Follow these instructions to install the **latest version** of Node.js (and npm) using the command line on **Windows** and **Mac**.

---

## Windows (via Command Prompt or PowerShell)

**Option 1: Using winget (Windows Package Manager)**
```sh
winget install OpenJS.NodeJS
```
> This will install the latest stable Node.js and npm.

**Option 2: Using Chocolatey (if you have it installed)**
```sh
choco install nodejs-lts
```
> If you want a specific "Current" (latest) version, use:
```sh
choco install nodejs
```

---

## Mac (Using Homebrew)

**1. If you don’t have Homebrew, install it:**
```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**2. Install Node.js (and npm):**
```sh
brew install node
```

This installs the latest stable Node.js and npm version.

---

## Verify Installation

Check versions to confirm installation:

```sh
node -v
npm -v
```

---

## Resources

- [Node.js Downloads](https://nodejs.org/)
- [npm Documentation](https://docs.npmjs.com/)
- [Homebrew](https://brew.sh/)
- [Chocolatey](https://community.chocolatey.org/packages/nodejs)
- [winget Node.js](https://winget.run/pkg/OpenJS/NodeJS)