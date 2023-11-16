<?php
include 'condb.php';

if (isset($_GET['user_id'])) {
    // Lấy dữ liệu từ biểu mẫu
    $id = $_GET['user_id'];

    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Câu lệnh SQL UPDATE
    $sql = "UPDATE user SET 
    name = '$name', 
    email = '$email', 
    password = '$password'
    WHERE id = $id";

    $location = "../dashboard/user.html";
} elseif (isset($_GET['recipes_id'])) {
    $id = $_GET['recipes_id'];
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

    // Tiến hành UPDATE cơ sở dữ liệu với thông tin mới
    $sql = "UPDATE recipes 
            SET title = '$title', img = '$img', subtitle = '$subtitle', prep_time = '$prep_time', cook_time = '$cook_time', serving_size = '$serving_size', `time` = '$time', step = '$step', ingredients = '$ingredients'
            WHERE id = $id AND user_id = $user_id";

    if ($conn->query($sql) === TRUE) {
        // Cập nhật xong thông tin cơ sở dữ liệu, bạn có thể tiếp tục với việc thêm tags.
        $tags = $_POST["tags"];
        foreach ($tags as $tag) {
            $conn->query("INSERT INTO recipestags (recipes_id, tags_id) VALUES ($id, $tag)");
        }
        $conn->query("DELETE r
    FROM recipestags r
    JOIN (
        SELECT tags_id, recipes_id, ROW_NUMBER() OVER (PARTITION BY tags_id, recipes_id ORDER BY (SELECT NULL)) AS row_num
        FROM recipestags
    ) t ON r.tags_id = t.tags_id AND r.recipes_id = t.recipes_id
    WHERE t.row_num > 1;
    ");
        header("Location: ../recipe-by-me.html");
        exit();
    } else {
        // Xử lý lỗi nếu cần thiết
        echo "Lỗi: " . $conn->error;
    }
} elseif (isset($_GET['recipes_active'])) {
    $id = $_GET['recipes_active'];
    // Tiến hành UPDATE cơ sở dữ liệu với thông tin mới
    $sql = "UPDATE recipes 
            SET `status` = 1
            WHERE id = $id";
    $location = "../dashboard/recipes.html?status=pending";
}

if ($conn->query($sql) === TRUE) {
    header("Location: " . $location);
} else {
    echo "Lỗi khi cập nhật dữ liệu: " . $conn->error;
}

// Đóng kết nối
$conn->close();
