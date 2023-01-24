---
title:
categories: []
tags: []
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

```sql
CREATE TABLE `transcripts` (
`ensembl_transcript_id` varchar(20) NOT NULL,
`transcript_chrom_start` int(10) unsigned NOT NULL,
`transcript_chrom_end` int(10) unsigned NOT NULL,
PRIMARY KEY (`ensembl_transcript_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```

### 참고

* <https://stackoverflow.com/questions/1361340/how-can-i-do-insert-if-not-exists-in-mysql>