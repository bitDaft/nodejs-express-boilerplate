# Setting up env on EC2 instance

Copy and paste the following in the `Advances` > `user data` section while setting up an EC2 instance

```bash
Content-Type: multipart/mixed; boundary="//"
MIME-Version: 1.0

--//
Content-Type: text/cloud-config; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="cloud-config.txt"

#cloud-config
cloud_final_modules:
- [scripts-user, always]

--//
Content-Type: text/x-shellscript; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="userdata.txt"

#!/bin/bash
rm /etc/profile.d/vars.sh
touch /etc/profile.d/vars.sh
echo "export APP_PORT=5000" | tee -a /etc/profile.d/vars.sh
echo "export APP_PROXY=false" | tee -a /etc/profile.d/vars.sh
echo "export APP_URL=http://localhost:5000" | tee -a /etc/profile.d/vars.sh
echo "export APP_JWT_SECRET=secret" | tee -a /etc/profile.d/vars.sh
echo "export APP_SMTP__host=smtp.ethereal.email" | tee -a /etc/profile.d/vars.sh
echo "export APP_SMTP__port=587" | tee -a /etc/profile.d/vars.sh
echo "export APP_SMTP__auth__user=viviane.gerlach@ethereal.email" | tee -a /etc/profile.d/vars.sh
echo "export APP_SMTP__auth__pass=SfpxxZzDZTag585CSW" | tee -a /etc/profile.d/vars.sh
echo "export APP_DB__0__client=mysql2" | tee -a /etc/profile.d/vars.sh
echo "export APP_DB__0__host=127.0.0.1" | tee -a /etc/profile.d/vars.sh
echo "export APP_DB__0__port=3306" | tee -a /etc/profile.d/vars.sh
echo "export APP_DB__0__user=root" | tee -a /etc/profile.d/vars.sh
echo "export APP_DB__0__pass=root" | tee -a /etc/profile.d/vars.sh
echo "export APP_DB__0__db=test" | tee -a /etc/profile.d/vars.sh
echo "export APP_DB__0__debug=true" | tee -a /etc/profile.d/vars.sh
echo "export APP_DB__0__pool_min=2" | tee -a /etc/profile.d/vars.sh
echo "export APP_DB__0__pool_max=10" | tee -a /etc/profile.d/vars.sh
echo "export APP_REDIS__host=127.0.0.1" | tee -a /etc/profile.d/vars.sh
echo "export APP_REDIS__port=6379" | tee -a /etc/profile.d/vars.sh
echo "export APP_REDIS__password=" | tee -a /etc/profile.d/vars.sh
echo "export APP_REDIS__db=0" | tee -a /etc/profile.d/vars.sh
echo "export APP_REDIS__enableOfflineQueue=false" | tee -a /etc/profile.d/vars.sh
--//--
```