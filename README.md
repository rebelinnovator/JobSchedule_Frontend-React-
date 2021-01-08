# Step to run on local
1. Create .env file in root folder
For example:
```javascript
REACT_APP_API_ENDPOINT=''
SKIP_PREFLIGHT_CHECK=false
REACT_APP_NOTIFICATIONS_ADDRESS=""
REACT_APP_GOOGLE_MAP_AIP_KEY=""
REACT_APP_MAP_CENTER_LAT=46.6558
REACT_APP_MAP_CENTER_LNG= 32.6178
REACT_APP_CLIENT_DOMAIN=""
```
2. To install npm packages
```
yarn install
```
3. Start react app
```
yarn start
```

# Step to run on server
1. Go to folder
```
cd /home/ubuntu/projects/ConEd_Solution_Web
```
2. Pull newest code from branch
```
 git pull origin *branch*
```

3. Go to project folder
```
cd /home/ubuntu/projects
```
4. To build web app
```
sudo bash run_frontend.sh
```
