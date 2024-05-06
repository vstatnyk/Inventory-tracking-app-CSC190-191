cd client
npm install
npm run build
pm2 serve dist 80
cd ../server
npm install
pm2 start start.sh