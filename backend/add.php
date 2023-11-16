<?php
include 'condb.php';

if (isset($_GET['recipes'])) {
    $user_id = $_COOKIE["user_id"];
    $title = $_POST["title"];
    $img = $_POST["img"];
    $subtitle = $_POST["subtitle"];
    $prep_time = $_POST["prep_time"];
    $cook_time = $_POST["cook_time"];
    $serving_size = $_POST["serving_size"];
    $ingredients = join('||', $_POST["ingredients"]);
    $step = join('||', $_POST["step"]);
    $time = date("Y-m-d H:i:s");

    // Tiến hành INSERT vào cơ sở dữ liệu
    $sql = "INSERT INTO recipes (title, img, subtitle, prep_time, cook_time, serving_size, `time`, user_id, step, ingredients, `status`)
            VALUES ('$title', '$img', '$subtitle', '$prep_time', '$cook_time', '$serving_size', '$time', $user_id, '$step', '$ingredients', 0)";

    $conn->query($sql);
    $maxId = $conn->query("SELECT MAX(id) AS max_id FROM recipes")->fetch_assoc()["max_id"];
    $tags = $_POST["tags"];
    foreach ($tags as $tag) {
        $conn->query("INSERT INTO recipestags (recipes_id, tags_id) VALUES ($maxId, $tag)");
    }

    $conn->query("DELETE r
    FROM recipestags r
    JOIN (
        SELECT tags_id, recipes_id, ROW_NUMBER() OVER (PARTITION BY tags_id, recipes_id ORDER BY (SELECT NULL)) AS row_num
        FROM recipestags
    ) t ON r.tags_id = t.tags_id AND r.recipes_id = t.recipes_id
    WHERE t.row_num > 1;
    ");
    header("Location: ../recipe-pending.html");
    exit();
} elseif (isset($_GET['comment'])) {
    $recipes_id = $_GET['comment'];
    $user_id = $_COOKIE["user_id"];
    $star = $_POST["star"];
    $content = $_POST["content"];
    $time = date("Y-m-d H:i:s");

    // Tiến hành INSERT vào cơ sở dữ liệu
    $sql = "INSERT INTO comments (recipes_id, star, content, `time`, user_id)
            VALUES ($recipes_id, $star, '$content', '$time', $user_id)";

    $location = '../recipe-info.html?id=' . $recipes_id;
} elseif (isset($_GET['user'])) {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $password = $_POST["password"];

    // Tiến hành INSERT vào cơ sở dữ liệu
    $sql = "INSERT INTO user (`name`, email, `password`)
            VALUES ('$name', '$email', '$password')";

    $result = $conn->query("SELECT * FROM user WHERE email ='$email'");
    if ($result->num_rows > 0) {
        header("Location: ../sign-up.html?error=true");
        exit();
    }
    $location = '../sign-in.html';
} elseif (isset($_GET['favorite'])) {
    $recipes_id = $_POST["recipes_id"];
    if (!isset($_COOKIE["user_id"])) {
        header('Content-Type: application/json');
        echo json_encode("Lỗi");
        exit();
    }
    $user_id = $_COOKIE["user_id"];

    $result = $conn->query("SELECT * FROM favorite WHERE user_id ='$user_id' AND recipes_id ='$recipes_id'");
    if ($result->num_rows > 0) {
        exit();
    }

    $sql = "INSERT INTO favorite (`recipes_id`, user_id)
            VALUES ('$recipes_id', '$user_id')";
    $location = '../sign-in.html';

} elseif (isset($_GET['tags'])) {
    $name = $_POST['name'];
    $sql = "INSERT INTO tags (name)
            VALUES ('$name')";
    $location = '../dashboard/index.html';
}


// Thực hiện câu lệnh INSERT
if ($conn->query($sql) === TRUE) {
    header("Location: " . $location);
} else {
    echo "Lỗi khi thêm dữ liệu: " . $conn->error;
}

// Đóng kết nối
$conn->close();
