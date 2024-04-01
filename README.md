# Improcode API

1. Clone Project
2. Run ```npm install```
3. Clone ```.env.template``` file and rename it to ```.env```
4. Modify environment variables
5. Run MongoDB
```
docker-compose up -d
```

6. Execute SEED with a POST request to fill the DB with test data 
```
http://localhost:3000/api/seed
```

7. Run app: ```npm run start:dev```
