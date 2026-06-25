#!/bin/bash
set -e

sleep 10

curl -f http://localhost:8080/books || curl -f http://localhost:8080/debug/books