<?php
include 'condb.php';

// Lấy dữ liệu từ bảng bất kỳ
if (isset($_GET['table'])) {
    $table = $_GET['table'];
    $sql = "SELECT * FROM $table";

    // Thống kê số lượng công thức đã đăng của từng người
    if ($_GET['table'] == "user__recipes_all")
        $sql = "SELECT user.*,COUNT(user_id) AS recipes_quantity
                FROM user
                LEFT JOIN recipes ON user.id = recipes.user_id
                GROUP BY user_id";

    // Lấy thông tin bài viết và tên người viết
    if ($_GET['table'] == 'recipes__user') {
        $sql = "SELECT recipes.*,user.name
        FROM recipes 
        LEFT JOIN user ON recipes.user_id=user.id";
    }

    // Lấy thông tin bài viết và tên người viết
    if ($_GET['table'] == 'comments_db') {
        $sql = "SELECT comments.*, recipes.title, user.name
            FROM comments
            LEFT JOIN recipes ON comments.recipes_id = recipes.id
            LEFT JOIN user ON comments.user_id = user.id";
    }

    if ($_GET['table'] == 'star__comments') {
        $sql = "SELECT comments.recipes_id,COUNT(id) AS quantity_review, ROUND(AVG(star), 1) AS star_avg
        FROM comments
        GROUP BY recipes_id";
    }
    
    if ($_GET['table'] == 'star__comments') {
        $sql = "SELECT comments.recipes_id,COUNT(id) AS quantity_review, ROUND(AVG(star), 1) AS star_avg
        FROM comments
        GROUP BY recipes_id";
    }

    if ($_GET['table'] == 'recipes_active') {
        $sql = "SELECT * FROM recipes
        WHERE `status` = 1";
    }
    // Lấy thông tin về công thức cá nhận và công thức yêu thích của 1 người cụ thể
} elseif (isset($_GET['user__recipes_id'])) {
    $id = $_GET['user__recipes_id'];
    // Thông tin cá nhân
    if ($_GET['action'] == "user") {
        $sql = "SELECT * FROM user WHERE id = $id";
    }

    // Tổng hợp những công thức cá nhân
    if ($_GET['action'] == "recipes") {
        $sql = "SELECT * FROM recipes WHERE user_id = $id";
    }

    // Tổng hợp những công thức yêu thích
    if ($_GET['action'] == "favorite") {
        $sql = "SELECT recipes_id,title,img,name
        FROM favorite
        LEFT JOIN recipes ON favorite.recipes_id=recipes.id
        LEFT JOIN user ON recipes.user_id=user.id
        WHERE favorite.user_id = $id";
    }

    // Lấy ra thông tin của 1 bài viết cụ thể
} elseif (isset($_GET['recipes__id'])) {
    $id = $_GET['recipes__id'];
    $sql = "SELECT * FROM recipes WHERE id = $id";

    // Lấy ra những comment của 1 bài viết
} elseif (isset($_GET['recipes__comments'])) {
    $id = $_GET['recipes__comments'];
    $sql = "SELECT star, content, user.name AS user_name, `time`
    FROM comments 
    LEFT JOIN user ON comments.user_id = user.id
    WHERE recipes_id = $id";

    // Lấy ra Danh mục của 1 bài viết
} elseif (isset($_GET['tags__comments'])) {
    $id = $_GET['tags__comments'];
    $sql = "SELECT tags.id,name
    FROM recipestags 
    LEFT JOIN tags ON recipestags.tags_id = tags.id
    WHERE recipes_id = $id";
}



$result = $conn->query($sql);
$data = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    $data = [];
}

// Trả về dữ liệu dưới dạng JSON
header('Content-Type: application/json');
echo json_encode($data);

// Đóng kết nối đến cơ sở dữ liệu
$result->close();
