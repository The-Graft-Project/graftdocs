---
title: Installation
description: How to install Graft on different platforms.
---

Graft is a lightweight CLI tool written in Go. You can install it on Linux, macOS, and Windows using various package managers or a simple shell script.

### Linux & macOS (Quick Install)

The fastest way to install Graft on any Unix-like system is via our installation script:

```bash
curl -sSL https://graftdocs.vercel.app/install.sh | sh
```

### Windows (Quick Install)

Open PowerShell as Administrator and run:

```powershell
powershell -ExecutionPolicy ByPass -Command "iwr -useb https://graftdocs.vercel.app/install.ps1 | iex"
```

---

### Package Managers

#### <span id="winget">WinGet</span>
```bash
winget install graft
```

#### <span id="homebrew">Homebrew</span>
```bash
brew tap skssmd/tap
brew install graft
```

#### <span id="apt">Debian / Ubuntu (APT)</span>
```bash
echo "deb [trusted=yes] https://apt.fury.io/skssmd/ /" | sudo tee /etc/apt/sources.list.d/graft.list
sudo apt update
sudo apt install graft
```

#### <span id="yum">Fedora / RHEL / Amazon Linux (YUM/DNF)</span>
```bash
echo "[graft]
name=Graft Repository
baseurl=https://yum.fury.io/skssmd/
enabled=1
gpgcheck=0" | sudo tee /etc/yum.repos.d/graft.repo
sudo yum install graft
```

#### <span id="aur">Arch Linux (AUR)</span>
```bash
yay -S graft-bin
# or
paru -S graft-bin
```

---

### From Source

If you have Go installed, you can build Graft from source:

```bash
git clone https://github.com/skssmd/Graft
cd Graft
go build -o graft cmd/graft/main.go
```

**Requirements:** Go 1.24+, SSH access to a Linux server (Docker is installed automatically on the host during `graft init`).
