# Awaris

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve -- --mode=development
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Deploy
```
npm run build -- --mode=staging
```




## Apache Configuration
```
<VirtualHost *:443>
        
    SSLEngine on
    SSLCertificateFile /home/awaris/cert/prooffice.com.my.pem
    SSLCertificateKeyFile /home/awaris/cert/prooffice.com.my.key

    ServerName awaris-web.prooffice.com.my
    ServerAlias awaris-web.prooffice.com.my
    ServerAdmin webmasterawaris@localhost
    
    DocumentRoot /home/awaris/webapps/awaris-web-vue.prooffice.com.my/dist
    DirectoryIndex index.php index.html

    <Directory /home/awaris/webapps/awaris-web-vue.prooffice.com.my/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    <FilesMatch ".php$">
        SetHandler "proxy:unix:/var/run/php/php7.4-fpm-awaris.sock|fcgi://localhost/"
    </FilesMatch>

    ErrorLog /home/awaris/logs/awaris-web-vue.prooffice.com.my/error.log
    CustomLog /home/awaris/logs/awaris-web-vue.prooffice.com.myaccess.log combined
</VirtualHost>

```

## MacOS Kill Port

1. lsof -i tcp:8080 
2. sudo kill <PID>

## Deployment

1. Buka terminal
2. `ssh awaris@[47.254.243.220|47.254.230.193]`
3. `cd webapps/system.awarisgroup.com`
4. `git stash && git pull && npm i && npm run build-[dev|stg|prod]`

`npm run build-prod -- --dest dist2`