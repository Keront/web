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

$action = $data["action"] ?? "";

$file = "../data/user.json";

if (!file_exists($file)) {
    file_put_contents($file, "[]");
}

$users = json_decode(file_get_contents($file), true);

if (!is_array($users)) {
    $users = [];
}

/*
|--------------------------------------------------------------------------
| Проверка email
|--------------------------------------------------------------------------
*/
if ($action === "checkEmail") {

    $email = trim($data["email"] ?? "");

    $exists = false;

    foreach ($users as $user) {
        if ($user["email"] === $email) {
            $exists = true;
            break;
        }
    }

    echo json_encode([
        "success" => true,
        "exists" => $exists
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| Регистрация
|--------------------------------------------------------------------------
*/
if ($action === "register") {

    $email = trim($data["email"] ?? "");
    $password = trim($data["password"] ?? "");

    if (!$email || !$password) {
        echo json_encode([
            "success" => false,
            "message" => "Заполните все поля"
        ]);
        exit;
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

    foreach ($users as $user) {
        if ($user["email"] === $email) {
            echo json_encode([
                "success" => false,
                "message" => "Пользователь уже существует"
            ]);
            exit;
        }
    }

    $users[] = [
        "email" => $email,
        "password" => $password
    ];

    file_put_contents(
        $file,
        json_encode(
            $users,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
        )
    );

    echo json_encode([
        "success" => true,
        "message" => "Регистрация успешна"
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| Вход
|--------------------------------------------------------------------------
*/
if ($action === "login") {

    $email = trim($data["email"] ?? "");
    $password = trim($data["password"] ?? "");

    foreach ($users as $user) {

        if ($user["email"] === $email) {

            if ($user["password"] === $password) {

                echo json_encode([
                    "success" => true,
                    "message" => "Вход выполнен",
                    "email" => $email
                ]);

                exit;
            }

            echo json_encode([
                "success" => false,
                "message" => "Неверный пароль"
            ]);

            exit;
        }
    }

    echo json_encode([
        "success" => false,
        "message" => "Пользователь не найден"
    ]);

    exit;
}
/*
|--------------------------------------------------------------------------
| Лайки
|--------------------------------------------------------------------------
*/

if ($action === "getLikes") {

    $likesFile = "../data/likes.json";

    if (!file_exists($likesFile)) {
        file_put_contents(
            $likesFile,
            json_encode(["lamps" => 0])
        );
    }

    $likes = json_decode(
        file_get_contents($likesFile),
        true
    );

    echo json_encode([
        "success" => true,
        "likes" => $likes["lamps"]
    ]);

    exit;
}

if ($action === "addLike") {

    $likesFile = "../data/likes.json";

    if (!file_exists($likesFile)) {
        file_put_contents(
            $likesFile,
            json_encode(["lamps" => 0])
        );
    }

    $likes = json_decode(
        file_get_contents($likesFile),
        true
    );
    

    $likes["lamps"]++;

    file_put_contents(
        $likesFile,
        json_encode(
            $likes,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
        )
    );

    echo json_encode([
        "success" => true,
        "likes" => $likes["lamps"]
    ]);

    exit;
}
echo json_encode([
    "success" => false,
    "message" => "Неизвестное действие"
]);