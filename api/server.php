<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Нет данных"
    ]);
    exit;
}

$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

if (!$email || !$password) {
    echo json_encode([
        "success" => false,
        "message" => "Заполните все поля"
    ]);
    exit;
}

$file = "../data/user.json";

if (!file_exists($file)) {
    file_put_contents($file, "[]");
}

$users = json_decode(file_get_contents($file), true);
if (!is_array($users)) {
    $users = [];
}
foreach ($users as $user) {
    if ($user["email"] === $email) {
        echo json_encode([
            "success" => false,
            "message" => "Пользователь уже существует"
        ]);
        exit;
    }
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "message" => "Некорректный email"
    ]);
    exit;
}

if (
    strlen($password) < 8 ||
    strlen($password) > 16 ||
    !preg_match('/[A-Za-z]/', $password) ||
    !preg_match('/\d/', $password)
) {
    echo json_encode([
        "success" => false,
        "message" => "Некорректный пароль"
    ]);
    exit;
}

$users[] = [
    "email" => $email,
    "password" => $password
];

file_put_contents(
    $file,
    json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);

echo json_encode([
    "success" => true,
    "message" => "Регистрация успешна"
]);