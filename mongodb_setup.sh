echo "[MongoDB]
name=MongoDB Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64
gpgcheck=0
enabled=1" | sudo tee -a /etc/yum.repos.d/mongodb.repo

sudo yum install -y mongodb-org-server mongodb-org-shell mongodb-org-tools
sudo chkconfig mongod on
sudo service mongod restart
