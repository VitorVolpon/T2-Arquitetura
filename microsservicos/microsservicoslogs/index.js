// mss de logs
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const { PORT } = process.env

const logs = [];

const registrarLog = (tipoEvento) => {
    const log = {
        id: uuidv4(), 
        tipo_evento: tipoEvento,
        data_hora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) 
    };
    logs.push(log);
    console.log(`Log registrado: ${log.tipo_evento} - ${log.data_hora}`);
};

app.post('/eventos', (req, res) => {
    const { type } = req.body;
    registrarLog(type); 
    res.status(200).send({ msg: 'Log registrado com sucesso' });
});

app.get('/logs', (req, res) => {
    res.status(200).json(logs);
});


app.listen(PORT, async () => {
    console.log(`Microsserviço de Logs. Porta: ${PORT}.`);
    try {
        const resp = await axios.get('http://localhost:10000/eventos'); 
        resp.data.forEach((evento) => registrarLog(evento.type)); 
    } catch (error) {
        console.error("Erro ao sincronizar eventos anteriores:", error.message);
    }
}); 