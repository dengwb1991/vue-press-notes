# brew

brew 是MacOS上的包管理工具，可以简化 macOS 和 Linux 操作系统上软件的安装。

[brew官网](https://brew.sh/)

## brew 安装更新

brew 是 `ruby` 开发的，需要确认ruby是否已安装，默认是已经安装的.

```bash
$ which ruby

$ ruby --version
```

如果 `ruby` 已安装，执行以下命令

```bash
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

**更新brew**

1. 方法一：卸载重新安装

```bash
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"

$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

2. 方法二：执行update

```bash
$ brew update
```

## brew 安装多个版本node

**查看当前安装的版本及位置**

```bash
$ ls -l `which node`
```

执行结果：

```
➜  ~ ls -l `which node`
lrwxr-xr-x  1 didi  admin  34  9  4 10:37 /usr/local/bin/node -> ../Cellar/node@12/12.18.3/bin/node
```

**查看通过 brew 安装的所有 node 版本**

```bash
$ ls /usr/local/Cellar/node*
```

执行结果：

```bash
➜  ~ ls /usr/local/Cellar/node*
/usr/local/Cellar/node:
14.9.0

/usr/local/Cellar/node@12:
12.18.3
```

**通过 brew 安装多个 node 版本**

```bash
$ brew install node@10
```

**切换版本**

```bash
$ brew unlink node && brew link --overwrite --force node@10
```