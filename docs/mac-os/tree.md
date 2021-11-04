# tree

```bash
find . -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g'
```