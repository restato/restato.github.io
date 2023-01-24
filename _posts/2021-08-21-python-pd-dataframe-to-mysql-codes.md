---
title: "[Python] Pandas DataFrame을 MySQL로 INSERT"
categories: [파이썬]
tags: [python, mysql, pandas, dataframe]
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

### Pandas Dataframe을 MySQL로 INSERT

```python
df = pd.read_csv('./data/preprocessed/apt-trade/11110/202106.csv')
logger.info(df.head(10))

with connection:
    with connection.cursor() as cursor:
        # Create a new record
        columns = f"`{f'`,`'.join(df.columns)}`"
        values = (','.join(['%s'] * len(df.columns)))
        logger.info(columns)
        sql = f"INSERT INTO `transaction` ({columns}) VALUES ({values})"
        logger.info(sql)
        for row in df.iterrows():
            values = row[1].values
```

이렇게 시작하다가 `dataframe2mysql`이 있을것 같아서 찾아보니 있..다
pandas dataframe의 `to_sql`을 사용하면 그냥 끝

```sh
pip install SQLAlchemy
pip isntall pymysql
```

```python
df.to_sql(con=con, name='table_name_for_df', if_exists='replace', flavor='mysql')
```

* <https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_sql.html#r689dfd12abe5-1>
* <https://docs.sqlalchemy.org/en/14/dialects/mysql.html#module-sqlalchemy.dialects.mysql.mysqlconnector>

`sqlalchemy`를 이용해서 `mysql`을 접속해야 하니까 아래와 같이 수정이 필요

```python
from sqlalchemy.ext.asyncio import create_async_engine
# mysql+mysqlconnector://<user>:<password>@<host>[:<port>]/<dbname>
# engine = create_async_engine("mysql+aiomysql://user:pass@hostname/dbname")
engine = create_async_engine("mysql+pymysql://user:pass@hostname/dbname")
```

* `mysqlconnector`로 `pymysql`을 사용했음 `mysqlconnector` 사용하다 아래와 같이 삽질했는데 결국 나는 해결 못함

### MySQL-Python (하지마)

```
WARNING: Discarding https://files.pythonhosted.org/packages/9a/81/924d6799494cf7fb24370335c2f782088d6ac4f79e4137d4df94cea3582c/MySQL-python-1.2.3.tar.gz#sha256=7de66fbbf923634e7c965aeaefa74642ba75ae20ee1cefcefc3009595b7a7e6e (from https://pypi.org/simple/mysql-python/). Command errored out with exit status 1: python setup.py egg_info Check the logs for full command output.
ERROR: Could not find a version that satisfies the requirement mysql-python (from versions: 1.2.3b1, 1.2.3b2, 1.2.3rc1, 1.2.3, 1.2.4b1, 1.2.4b2, 1.2.4b3, 1.2.4b4, 1.2.4b5, 1.2.4rc1, 1.2.4, 1.2.5)
ERROR: No matching distribution found for mysql-python
```

```
    return __import__("MySQLdb")
ModuleNotFoundError: No module named 'MySQLdb'
```

```
# Assume you are activating Python 3 venv
$ brew install mysql-client
$ echo 'export PATH="/usr/local/opt/mysql-client/bin:$PATH"' >> ~/.bash_profile
$ export PATH="/usr/local/opt/mysql-client/bin:$PATH"
$ pip install mysqlclient
```

```
Using legacy 'setup.py install' for mysqlclient, since package 'wheel' is not installed.
Installing collected packages: mysqlclient
    Running setup.py install for mysqlclient ... error
    ERROR: Command errored out with exit status 1:
     command: /Users/direcision/.pyenv/versions/3.8.10/envs/venv/bin/python3.8 -u -c 'import io, os, sys, setuptools, tokenize; sys.argv[0] = '"'"'/private/var/folders/0c/dl8wlh_n7z10zxrxm3dqlqlw0000gn/T/pip-install-t6ghh4r8/mysqlclient_3a026d1aeb2944d588fa59504027b3b2/setup.py'"'"'; __file__='"'"'/private/var/folders/0c/dl8wlh_n7z10zxrxm3dqlqlw0000gn/T/pip-install-t6ghh4r8/mysqlclient_3a026d1aeb2944d588fa59504027b3b2/setup.py'"'"';f = getattr(tokenize, '"'"'open'"'"', open)(__file__) if os.path.exists(__file__) else io.StringIO('"'"'from setuptools import setup; setup()'"'"');code = f.read().replace('"'"'\r\n'"'"', '"'"'\n'"'"');f.close();exec(compile(code, __file__, '"'"'exec'"'"'))' install --record /private/var/folders/0c/dl8wlh_n7z10zxrxm3dqlqlw0000gn/T/pip-record-rsewsaur/install-record.txt --single-version-externally-managed --compile --install-headers /Users/direcision/.pyenv/versions/3.8.10/envs/venv/include/site/python3.8/mysqlclient
         cwd: /private/var/folders/0c/dl8wlh_n7z10zxrxm3dqlqlw0000gn/T/pip-install-t6ghh4r8/mysqlclient_3a026d1aeb2944d588fa59504027b3b2/
    Complete output (43 lines):
    mysql_config --version
    ['8.0.26']
    mysql_config --libs
    ['-L/opt/homebrew/Cellar/mysql/8.0.26/lib', '-lmysqlclient', '-lz', '-lzstd', '-lssl', '-lcrypto', '-lresolv']
    mysql_config --cflags
    ['-I/opt/homebrew/Cellar/mysql/8.0.26/include/mysql']
    ext_options:
      library_dirs: ['/opt/homebrew/Cellar/mysql/8.0.26/lib']
      libraries: ['mysqlclient', 'zstd', 'resolv']
      extra_compile_args: ['-std=c99']
      extra_link_args: []
      include_dirs: ['/opt/homebrew/Cellar/mysql/8.0.26/include/mysql']
      extra_objects: []
      define_macros: [('version_info', "(2,0,3,'final',0)"), ('__version__', '2.0.3')]
    running install
    running build
    running build_py
    creating build
    creating build/lib.macosx-11.4-arm64-3.8
    creating build/lib.macosx-11.4-arm64-3.8/MySQLdb
    copying MySQLdb/__init__.py -> build/lib.macosx-11.4-arm64-3.8/MySQLdb
    copying MySQLdb/_exceptions.py -> build/lib.macosx-11.4-arm64-3.8/MySQLdb
    copying MySQLdb/connections.py -> build/lib.macosx-11.4-arm64-3.8/MySQLdb
    copying MySQLdb/converters.py -> build/lib.macosx-11.4-arm64-3.8/MySQLdb
    copying MySQLdb/cursors.py -> build/lib.macosx-11.4-arm64-3.8/MySQLdb
    copying MySQLdb/release.py -> build/lib.macosx-11.4-arm64-3.8/MySQLdb
    copying MySQLdb/times.py -> build/lib.macosx-11.4-arm64-3.8/MySQLdb
    creating build/lib.macosx-11.4-arm64-3.8/MySQLdb/constants
    copying MySQLdb/constants/__init__.py -> build/lib.macosx-11.4-arm64-3.8/MySQLdb/constants
    copying MySQLdb/constants/CLIENT.py -> build/lib.macosx-11.4-arm64-3.8/MySQLdb/constants
    copying MySQLdb/constants/CR.py -> build/lib.macosx-11.4-arm64-3.8/MySQLdb/constants
    copying MySQLdb/constants/ER.py -> build/lib.macosx-11.4-arm64-3.8/MySQLdb/constants
    copying MySQLdb/constants/FIELD_TYPE.py -> build/lib.macosx-11.4-arm64-3.8/MySQLdb/constants
    copying MySQLdb/constants/FLAG.py -> build/lib.macosx-11.4-arm64-3.8/MySQLdb/constants
    running build_ext
    building 'MySQLdb._mysql' extension
    creating build/temp.macosx-11.4-arm64-3.8
    creating build/temp.macosx-11.4-arm64-3.8/MySQLdb
    clang -Wno-unused-result -Wsign-compare -Wunreachable-code -DNDEBUG -g -fwrapv -O3 -Wall -I/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include -I/opt/homebrew/opt/xz/include -I/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include -I/opt/homebrew/opt/xz/include -Dversion_info=(2,0,3,'final',0) -D__version__=2.0.3 -I/opt/homebrew/Cellar/mysql/8.0.26/include/mysql -I/Users/direcision/.pyenv/versions/3.8.10/envs/venv/include -I/Users/direcision/.pyenv/versions/3.8.10/include/python3.8 -c MySQLdb/_mysql.c -o build/temp.macosx-11.4-arm64-3.8/MySQLdb/_mysql.o -std=c99
    clang -bundle -undefined dynamic_lookup -L/opt/homebrew/opt/readline/lib -L/opt/homebrew/opt/readline/lib -L/Users/direcision/.pyenv/versions/3.8.10/lib -L/opt/homebrew/opt/xz/lib -L/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/lib -L/opt/homebrew/opt/readline/lib -L/opt/homebrew/opt/readline/lib -L/Users/direcision/.pyenv/versions/3.8.10/lib -L/opt/homebrew/opt/xz/lib -L/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/lib build/temp.macosx-11.4-arm64-3.8/MySQLdb/_mysql.o -L/opt/homebrew/Cellar/mysql/8.0.26/lib -lmysqlclient -lzstd -lresolv -o build/lib.macosx-11.4-arm64-3.8/MySQLdb/_mysql.cpython-38-darwin.so
    ld: library not found for -lzstd
    clang: error: linker command failed with exit code 1 (use -v to see invocation)
    error: command 'clang' failed with exit status 1
    ----------------------------------------
ERROR: Command errored out with exit status 1: /Users/direcision/.pyenv/versions/3.8.10/envs/venv/bin/python3.8 -u -c 'import io, os, sys, setuptools, tokenize; sys.argv[0] = '"'"'/private/var/folders/0c/dl8wlh_n7z10zxrxm3dqlqlw0000gn/T/pip-install-t6ghh4r8/mysqlclient_3a026d1aeb2944d588fa59504027b3b2/setup.py'"'"'; __file__='"'"'/private/var/folders/0c/dl8wlh_n7z10zxrxm3dqlqlw0000gn/T/pip-install-t6ghh4r8/mysqlclient_3a026d1aeb2944d588fa59504027b3b2/setup.py'"'"';f = getattr(tokenize, '"'"'open'"'"', open)(__file__) if os.path.exists(__file__) else io.StringIO('"'"'from setuptools import setup; setup()'"'"');code = f.read().replace('"'"'\r\n'"'"', '"'"'\n'"'"');f.close();exec(compile(code, __file__, '"'"'exec'"'"'))' install --record /private/var/folders/0c/dl8wlh_n7z10zxrxm3dqlqlw0000gn/T/pip-record-rsewsaur/install-record.txt --single-version-externally-managed --compile --install-headers /Users/direcision/.pyenv/versions/3.8.10/envs/venv/include/site/python3.8/mysqlclient Check the logs for full command output.
```

* <https://github.com/PyMySQL/mysqlclient#macos-homebrew>

```
brew install zstd
CFLAGS="-I$(brew --prefix)/include" LDFLAGS="-L$(brew --prefix)/lib" pip install mysqlclient
```

### 참고

* <https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_sql.html>