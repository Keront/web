const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static('public'));

const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Проверка существования email
app.get('/api/user-exists', (req, res) => {
    const email = req.query.email;

    const users = JSON.parse(
        fs.readFileSync(USERS_FILE, 'utf8')
    );

    const exists = users.some(
        user => user.email === email
    );

    res.json({ exists });
});

// Регистрация
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;

    const users = JSON.parse(
        fs.readFileSync(USERS_FILE, 'utf8')
    );

    const exists = users.some(
        user => user.email === email
    );

    if (exists) {
        return res.status(400).json({
            success: false,
            message: 'Пользователь уже существует'
        });
    }

    users.push({
        id: Date.now(),
        email,
        password
    });

    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(users, null, 4)
    );

    res.json({
        success: true
    });
});

// Вход
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const users = JSON.parse(
        fs.readFileSync(USERS_FILE, 'utf8')
    );

    const user = users.find(
        user => user.email === email
    );

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Пользователь не найден'
        });
    }

    if (user.password !== password) {
        return res.status(401).json({
            success: false,
            message: 'Неверный пароль'
        });
    }

    res.json({
        success: true,
        message: 'Успешный вход'
    });
});

app.listen(3000, () => {
    console.log('Server started: http://localhost:3000');
});