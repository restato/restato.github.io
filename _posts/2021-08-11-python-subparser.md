---
title: "[Python] Subparser"
categories: [파이썬]
tags: [python, subparser]
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

`subparser`를 이용하면 task 별로 parameters를 정의 가능

```python
import argparse

def cmd1(args):
    print('cmd1', args)
def cmd2(args):
    print('cmd2', args)

parser1 = argparse.ArgumentParser()

parser1.add_argument("-i", "--info",  help="Display more information")

parser2 = argparse.ArgumentParser()
subparsers = parser2.add_subparsers(dest='cmd')

parserCmd1 = subparsers.add_parser("cmd1", help="First Command")
parserCmd1.add_argument("-r", "--output", help="Redirect Output")
parserCmd1.set_defaults(func=cmd1)

parserCmd2 = subparsers.add_parser("cmd2", help="Second Command")
parserCmd2.add_argument("-o", "--output", help="Redirect Output")
parserCmd2.set_defaults(func=cmd2)

args, extras = parser1.parse_known_args()
if len(extras)>0 and extras[0] in ['cmd1','cmd2']:
    args = parser2.parse_args(extras, namespace=args)
    args.func(args)
else:
    print('doing system with', args, extras)v
```