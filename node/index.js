const express = require('express');
const axios = require('axios').default;
const mysql = require('mysql');

const app = express();
const PORT = 3000;

const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb',
};

app.get('/', async (req, res) => {
  const name = await getRandomName();
  PeopleHandler(res, name);
});

app.listen(PORT, () => {
  console.log('Rodando na porta' + PORT);
});

async function getRandomName() {
  const RANDOM = Math.floor(Math.random() * 10);
  const response = await axios.get('https://swapi.dev/api/people');
  personName = response.data.results;
  return personName[RANDOM].name;
}

function PeopleHandler(res, name) {  
  const connection = mysql.createConnection(config);
  
  const insertSql = `INSERT INTO people(name) values('${name}')`;
  connection.query(insertSql);    

  const selectSql = `SELECT name FROM people`;  
  connection.query(selectSql, (error, results, fields) => {
    if (error) {
      throw error
    };
    
    let table = '<table>';
    table += '<tr><th>Inserted Names</th></tr>';
    for(let people of results) {      
      table += `<tr><td>${people.name}</td></tr>`;
    }

    table += '</table>';    
    res.send('<h1>FullCycle Rocks!</h1>' + table);    
    connection.end();
  });   
}