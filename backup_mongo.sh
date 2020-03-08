#!/bin/bash

set -e

BACKUP_NAME=$(date +%Y%m%d_%H%M%S).gz
DB=carparts

echo "Dumping MongoDB $DB database to compressed archive"
docker exec -d mongo mongodump --db $DB --archive=/data/db/backup/$BACKUP_NAME --gzip

echo 'Backup complete!'