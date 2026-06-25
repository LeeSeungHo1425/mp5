#!/bin/bash
set -e

mkdir -p /opt/bookapp
mkdir -p /opt/bookapp/videos
mkdir -p /opt/bookapp/data
mkdir -p /etc/bookapp

chown -R ec2-user:ec2-user /opt/bookapp

cat > /etc/systemd/system/bookapp.service <<'EOF'
[Unit]
Description=BookApp Spring Boot Backend
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/opt/bookapp
EnvironmentFile=-/etc/bookapp/bookapp.env
ExecStart=/usr/bin/java -jar /opt/bookapp/app.jar
Restart=always
RestartSec=10
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable bookapp