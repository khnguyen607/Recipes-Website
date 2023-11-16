<?php
include 'condb.php';

if (isset($_GET['favorite'])) {
    // Lấy dữ liệu từ biểu mẫu
    $recipes_id=$_GET['favorite'];
    if (!isset($_COOKIE["user_id"]))
        exit();
    $user_id = $_COOKIE["user_id"];
    $sql = "DELETE FROM favorite WHERE recipes_id = $recipes_id AND user_id=$user_id";

} elseif (isset($_GET['recipe_by_me'])) {
    // Lấy dữ liệu từ biểu mẫu
    $recipes_id=$_GET['recipe_by_me'];
    $sql = "DELETE FROM recipes WHERE id = $recipes_id";
    $conn->query("DELETE FROM favorite WHERE recipes_id = $recipes_id");
    $conn->query("DELETE FROM comments WHERE recipes_id = $recipes_id");
    $location="../recipe-by-me.html";

} elseif (isset($_GET['recipe_id'])) {
    // Lấy dữ liệu từ biểu mẫu
    $recipes_id=$_GET['recipe_id'];
    $sql = "DELETE FROM recipes WHERE id = $recipes_id";
    $conn->query("DELETE FROM favorite WHERE recipes_id = $recipes_id");
    $conn->query("DELETE FROM comments WHERE recipes_id = $recipes_id");
    $conn->query("DELETE FROM recipestags WHERE recipes_id IS NULL");
    $location="../dashboard/recipes.html";

} elseif (isset($_GET['comment_id'])) {
    // Lấy dữ liệu từ biểu mẫu
    $comments_id=$_GET['comment_id'];
    $sql = "DELETE FROM comments WHERE id = $comments_id";

    $location="../dashboard/comments.html";

} elseif (isset($_GET['user_id'])) {
    // Lấy dữ liệu từ biểu mẫu
    $user_id=$_GET['user_id'];
    $sql = "DELETE FROM user WHERE id = $user_id";
    $conn->query("DELETE FROM favorite WHERE user_id = $user_id");
    $conn->query("DELETE FROM comments WHERE user_id = $user_id");
    $conn->query("DELETE FROM recipes WHERE user_id = $user_id");
    $location="../dashboard/user.html";

} elseif (isset($_GET['tag_id'])) {
    $tag_id=$_GET['tag_id'];
    $sql = "DELETE FROM tags WHERE id = $tag_id";
    $conn->query("DELETE FROM recipestags WHERE tags_id = $tag_id");
    $location="../dashboard/index.html";
}

if ($conn->query($sql) === TRUE) {
    header("Location: " . $location);
} else {
    echo "Lỗi khi cập nhật dữ liệu: " . $conn->error;
}

// Đóng kết nối
$conn->close();
?>
