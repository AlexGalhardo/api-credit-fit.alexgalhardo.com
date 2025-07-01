## Objectives and Bussiness Rules

Manage the registration of rural producers with the following data:

- CPF or CNPJ (Brazilian individual or company taxpayer number)  
- Producer's name  
- Farm (property) name  
- City  
- State  
- Total farm area (in hectares)  
- Arable area (in hectares)  
- Vegetation area (in hectares)  
- Harvests (e.g., Harvest 2021, Harvest 2022)  
- Planted crops (e.g., Soybean in Harvest 2021, Corn in Harvest 2021, Coffee in Harvest 2022)

### **Business Requirements**

1. Allow the creation, editing, and deletion of rural producers.  
2. Validate the CPF or CNPJ provided by the user.  
3. Ensure that the sum of the arable area and vegetation area does not exceed the total farm area.  
4. Allow the registration of multiple crops per producer's farm.  
5. A producer can be associated with 0, 1, or more rural properties.  
6. A rural property can have 0, 1, or more crops planted per harvest.  
7. Display a dashboard with:
   - Total number of registered farms.  
   - Total registered area (in hectares).  
   - Pie charts:
     - By state.  
     - By planted crop.  
     - By land use (arable area and vegetation).

## Development Setup Localhost

- After step 4 previously, comment `api` service in `docker-compose.yaml`
- Setup in your `.env` the value: `DATABASE_URL="postgres://postgres:postgres@localhost:5432/farm_nestjs_api?schema=public"`
- Run: `sudo docker-compose up` to up Postgres only
- Run: `npm run prisma:migrate` to create migrations
- If you wanna seed database, run: `npm run prisma:db:seed`
- Start Server locally: `npm run dev`
- Go to: <http://localhost:3000>
