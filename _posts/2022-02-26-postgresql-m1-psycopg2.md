---
title: "[Python] Mac Silicon psycopg2 설치 오류"
categories: [파이썬]
tags: [pip, postgresql, psycopg2]
mermaid: true
math: true
comments: true
pin: false
image:
  path:
  width:
  height:
  alt:
---

# 해결 방법 (1)

```sh
pip3 uninstall psycopg2
brew install libpq --build-from-source
export LDFLAGS="-L/opt/homebrew/opt/libpq/lib"
pip3 install psycopg2 --no-cache-dir
```

# 해결 방법 (2)

```sh
❯ brew install postgresql
# If you open a new terminal tab you will see that pg_config is available
❯ export CPPFLAGS="-I/opt/homebrew/opt/openssl@1.1/include"
❯ export LDFLAGS="-L/opt/homebrew/opt/openssl@1.1/lib -L${HOME}/.pyenv/versions/3.8.10/lib"
❯ python -V
Python 3.8.10
❯ pip install psycopg2-binary==2.8.6
```

# 에러

```
Collecting psycopg2-binary
  Downloading psycopg2-binary-2.9.3.tar.gz (380 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 380.6/380.6 KB 4.6 MB/s eta 0:00:00
  Preparing metadata (setup.py) ... error
  error: subprocess-exited-with-error
  
  × python setup.py egg_info did not run successfully.
  │ exit code: 1
  ╰─> [23 lines of output]
      running egg_info
      creating /private/var/folders/0c/dl8wlh_n7z10zxrxm3dqlqlw0000gn/T/pip-pip-egg-info-r649qghy/psycopg2_binary.egg-info
      writing /private/var/folders/0c/dl8wlh_n7z10zxrxm3dqlqlw0000gn/T/pip-pip-egg-info-r649qghy/psycopg2_binary.egg-info/PKG-INFO
      writing dependency_links to /private/var/folders/0c/dl8wlh_n7z10zxrxm3dqlqlw0000gn/T/pip-pip-egg-info-r649qghy/psycopg2_binary.egg-info/dependency_links.txt
      writing top-level names to /private/var/folders/0c/dl8wlh_n7z10zxrxm3dqlqlw0000gn/T/pip-pip-egg-info-r649qghy/psycopg2_binary.egg-info/top_level.txt
      writing manifest file '/private/var/folders/0c/dl8wlh_n7z10zxrxm3dqlqlw0000gn/T/pip-pip-egg-info-r649qghy/psycopg2_binary.egg-info/SOURCES.txt'
      
      Error: pg_config executable not found.
      
      pg_config is required to build psycopg2 from source.  Please add the directory
      containing pg_config to the $PATH or specify the full executable path with the
      option:
      
          python setup.py build_ext --pg-config /path/to/pg_config build ...
      
      or with the pg_config option in 'setup.cfg'.
      
      If you prefer to avoid building psycopg2 from source, please install the PyPI
      'psycopg2-binary' package instead.
      
      For further information please check the 'doc/src/install.rst' file (also at
      <https://www.psycopg.org/docs/install.html>).
      
      [end of output]
  
  note: This error originates from a subprocess, and is likely not a problem with pip.
error: metadata-generation-failed

× Encountered error while generating package metadata.
╰─> See above for output.

note: This is an issue with the package mentioned above, not pip.
hint: See above for details.
```

# 참고

* <https://github.com/psycopg/psycopg2/issues/1286>