echo '\n\n requesting all heroes'
curl localhost:3000/heroes


echo  '\n\n requesting NaMaria'
curl localhost:3000/heroes/1


echo  '\n\n requesting create with wrong body'
curl --silent -X POST \
     --data-binary '{"invalid": "data"}' \
     localhost:3000/heroes


echo  '\n\n requesting create Fauston'
CREATED=$(curl --silent -X POST \
     --data-binary '{"name": "Fauston", "age":60, "power": "Super annoying"}' \
     localhost:3000/heroes)
     

echo $CREATED
ID=$(echo $CREATED | jq .id) 


echo $ID
echo  '\n\n requesting fauston'
curl localhost:3000/heroes/$ID

