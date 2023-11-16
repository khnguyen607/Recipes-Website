document.addEventListener("DOMContentLoaded", function () {
	fetch('layout.html')
		.then(response => response.text())
		.then(data => {
			var myDiv = document.createElement("div");
			myDiv.innerHTML = data

			document.getElementById('header').innerHTML = myDiv.querySelector('#lheader').innerHTML;
			document.getElementById('footer').innerHTML = myDiv.querySelector('#lfooter').innerHTML;
			document.getElementById('offcanvas').innerHTML = myDiv.querySelector('#lheader-mobile').innerHTML;

			if (window.location.href.includes("index.html")) {
				var maindata = []
				// document.querySelector('#menu__index').classList.add('uk-active')
				fetch('backend/get_data.php?table=recipes__user')
					.then(response => response.json())
					.then(data => {
						data = data.filter(function (number) {
							return number.status == 1;
						});
						maindata = data
						maindata.sort((a, b) => b.id - a.id)
						let DivtoClone = document.querySelector(".uk-child-width-1-2.list .uk-card").cloneNode(true);
						document.querySelector(".uk-child-width-1-2.list .uk-card").remove()
						// Load Danh mục của bài viết
						fetch('backend/get_data.php?table=star__comments')
							.then(response => response.json())
							.then(star => {
								var ObjStar = {}
								star.forEach(item => {
									ObjStar[item.recipes_id] = {
										quantity_review: item.quantity_review,
										star_avg: item.star_avg
									}
								})

								data.forEach(item => {
									let cloneDiv = DivtoClone.cloneNode(true)
									cloneDiv.setAttribute('recipes_id', item.id);
									cloneDiv.querySelector('.uk-position-xsmall a').setAttribute('recipes_id', item.id);
									cloneDiv.querySelector('img').src = item.img;
									cloneDiv.querySelector('h3').textContent = item.title
									cloneDiv.querySelector('.uk-width-expand.uk-text-right').textContent = 'bởi: ' + item.name;
									cloneDiv.querySelector('a.uk-position-cover').href = 'recipe-info.html?id=' + item.id;

									if (ObjStar[item.id]) {
										cloneDiv.querySelectorAll('.uk-width-auto span')[1].textContent = ObjStar[item.id].star_avg
										cloneDiv.querySelectorAll('.uk-width-auto span')[2].textContent = `(${ObjStar[item.id].quantity_review})`
										item.quantity_review = ObjStar[item.id].quantity_review
										item.star_avg = ObjStar[item.id].star_avg
									}
									else {
										cloneDiv.querySelectorAll('.uk-width-auto span')[1].textContent = 'Chưa có đánh giá'
										cloneDiv.querySelectorAll('.uk-width-auto span')[2].remove()
										item.quantity_review = 0
										item.star_avg = 0
									}
									document.querySelector(".uk-child-width-1-2.list").appendChild(cloneDiv)
								})

								document.querySelector('.uk-select').addEventListener('change', () => {
									if (document.querySelector('.uk-select').value == 'Mới nhất')
										maindata.sort((a, b) => b.id - a.id)
									if (document.querySelector('.uk-select').value == 'Đánh giá')
										maindata.sort((a, b) => b.star_avg - a.star_avg)
									filterAndDisplayData()
								})

							})

						var data_search = document.querySelector('#recipes_search');
						var user_search = document.querySelector('#user_search');
						data_search.addEventListener('input', filterAndDisplayData);
						user_search.addEventListener('input', filterAndDisplayData);
						document.querySelector('.uk-nav-sub').addEventListener('change', filterAndDisplayData);

						async function filterAndDisplayData() {
							function isSubset(set1, set2) {
								for (let value of set1) {
									if (!set2.has(value)) {
										return false;
									}
								}
								return true;
							}
							document.querySelector(".uk-child-width-1-2.list").innerHTML = "";
							const searchData = data_search.value.toLowerCase();
							const userData = user_search.value.toLowerCase();
							maindata.forEach(item => {
								// Load Danh mục của bài viết
								check = (item.title.toLowerCase().includes(searchData) || (searchData.length == 0))
									&& (item.name.toLowerCase().includes(userData) || (userData.length == 0))
									&& ((isSubset(checkbox_tags, myObject[item.id])) || (checkbox_tags.size == 0))

								if (check) {
									let cloneDiv = DivtoClone.cloneNode(true);
									cloneDiv.querySelector('.uk-position-xsmall a').setAttribute('recipes_id', item.id);
									cloneDiv.querySelector('img').src = item.img;
									cloneDiv.querySelector('h3').textContent = item.title;
									cloneDiv.querySelector('.uk-width-expand.uk-text-right').textContent = 'bởi: ' + item.name;
									cloneDiv.querySelector('a.uk-position-cover').href = 'recipe-info.html?id=' + item.id;

									if (item.quantity_review != 0) {
										cloneDiv.querySelectorAll('.uk-width-auto span')[1].textContent = item.star_avg
										cloneDiv.querySelectorAll('.uk-width-auto span')[2].textContent = `(${item.quantity_review})`
									}
									else {
										cloneDiv.querySelectorAll('.uk-width-auto span')[1].textContent = 'Chưa có đánh giá'
										cloneDiv.querySelectorAll('.uk-width-auto span')[2].remove()
									}

									document.querySelector(".uk-child-width-1-2.list").appendChild(cloneDiv);
								}
							});
						}
					});

				// Load nội dung các Danh mục
				fetch('backend/get_data.php?table=tags')
					.then(response => response.json())
					.then(data => {
						let DivtoClone = document.querySelector(".uk-nav-sub li").cloneNode(true);
						document.querySelector(".uk-nav-sub li").remove()
						data.forEach(item => {
							let cloneDiv = DivtoClone.cloneNode(true)
							cloneDiv.querySelector('input').value = item.id;
							cloneDiv.querySelector('input').id = 'tag' + item.id;
							cloneDiv.querySelector('label').textContent = item.name;
							cloneDiv.querySelector('label').setAttribute('for', 'tag' + item.id);

							document.querySelector(".uk-nav-sub").appendChild(cloneDiv)
						})
					})
			}

			else if (window.location.href.includes("recipe-add.html")) document.querySelector('#menu__recipe-add').classList.add('uk-active')
			else if (window.location.href.includes("recipe-favorite.html")) document.querySelector('#menu__recipe-favorite').classList.add('uk-active')
			else if (window.location.href.includes("recipe-by-me.html")) document.querySelector('#menu__recipe-by-me').classList.add('uk-active')
			else if (window.location.href.includes("recipe-pending.html")) document.querySelector('#menu__recipe-pending').classList.add('uk-active')
			// Hàm lấy giá trị của cookie
			function getCookie(name) {
				var value = "; " + document.cookie;
				var parts = value.split("; " + name + "=");
				if (parts.length === 2) return parts.pop().split(";").shift();
			}

			if (getCookie("name")) {
				document.querySelector("#buttonSignup").textContent = ` Xin chào ${decodeURIComponent(getCookie("name"))}`
				document.querySelector("#buttonSignin").innerHTML = `<a class="uk-button uk-button-primary" href="backend/diecookie.php">Đăng xuất</a>`
				document.querySelector("#mbuttonSignin").textContent = ` Xin chào ${decodeURIComponent(getCookie("name"))}`
				document.querySelector("#menu__recipe-add").style.display = 'block'
				document.querySelector("#menu__recipe-favorite").style.display = 'block'
				document.querySelector("#menu__recipe-by-me").style.display = 'block'
				document.querySelector("#menu__recipe-pending").style.display = 'block'
			} else {
				var urlParams = new URLSearchParams(window.location.search);
				var error = urlParams.get('error');
				if (error === "true") {
					alert("Sai tài khoản mật khẩu!");
				}
				var check = window.location.href.includes("recipe-add.html")
					|| window.location.href.includes("recipe-favorite.html")
					|| window.location.href.includes("recipe-by-me.html")
					|| window.location.href.includes("recipe-pending.html");

				if (check) window.location.href='index.html?login=false'
				if(window.location.href.includes("?login=false")){
					showToast('Tính năng yêu cầu đăng nhập')
					setTimeout(hideToast, 5000)
				}
			}

			if (window.location.href.includes("recipe-info.html")) {
				var id = new URLSearchParams(window.location.search).get('id')
				if (!id) window.location.href = 'index.html'
				fetch('backend/get_data.php?recipes__id=' + id)
					.then(response => response.json())
					.then(data => {
						let item = data[0]
						document.querySelector(".uk-border-rounded-large").src = item.img
						document.querySelector(".uk-flex.uk-flex-middle.info1 h1").textContent = item.title
						document.querySelector(".uk-flex.uk-flex-middle.info1 p").textContent = item.subtitle
						document.querySelectorAll("span.uk-text-small")[0].textContent = item.prep_time + " phút"
						document.querySelectorAll("span.uk-text-small")[1].textContent = item.cook_time + " phút"
						document.querySelectorAll("span.uk-text-small")[2].textContent = item.serving_size + " người"

						// Load nội dung tác giả và số lượng bài viết
						fetch('backend/get_data.php?table=user__recipes_all')
							.then(response => response.json())
							.then(user => {
								user.forEach(u => {
									if (u.id == item.user_id) {
										document.querySelector("p.uk-margin-small-top a").textContent = u.name
										document.querySelector("span.uk-text-muted strong").textContent = u.recipes_quantity
									}
								})
							})

						// Load nội dung comment của bài viết
						fetch('backend/get_data.php?recipes__comments=' + id)
							.then(response => response.json())
							.then(comment => {
								let divComments = document.querySelector(".comment_list").cloneNode(true)
								document.querySelector(".comment_list").remove()
								comment.forEach(c => {
									console.log(c)
									let cloneDiv = divComments.cloneNode(true)
									cloneDiv.querySelector('h4').textContent = c.user_name
									cloneDiv.querySelector('.uk-comment-body p').textContent = c.content

									let time = c.time.split(' ')[0].split('-')
									cloneDiv.querySelector('a.uk-link-reset.time').textContent = `${time[2]}/${time[1]}/${time[0]} vào ${c.time.split(' ')[1]}`
									cloneDiv.querySelectorAll("span").forEach((star, index) => {
										if ((index + 1) <= c.star) star.classList.add('uk-rating-filled')
									})
									document.querySelector('ul.uk-comment-list').appendChild(cloneDiv)
								})
							})

						// Load Danh mục của bài viết
						fetch('backend/get_data.php?tags__comments=' + id)
							.then(response => response.json())
							.then(tags => {
								let divTags = document.querySelector(".uk-margin-medium-top.tags a").cloneNode(true)
								document.querySelector(".uk-margin-medium-top.tags a").remove()
								tags.forEach(tag => {
									let cloneDiv = divTags.cloneNode(true)
									cloneDiv.querySelector('a span').textContent = tag.name
									document.querySelector('.uk-margin-medium-top.tags').appendChild(cloneDiv)
								})
							})

						let divStep = document.querySelector(".stepList").cloneNode(true)
						document.querySelector("#step_").remove()
						item.step.split('||').forEach((step, index) => {
							let cloneDiv = divStep.cloneNode(true)
							cloneDiv.innerHTML = cloneDiv.innerHTML.replace(/step_/g, 'step_' + index)
							cloneDiv.querySelector('h5.uk-step-title').textContent = 'Bước ' + (index + 1)
							cloneDiv.querySelector('div.uk-step-content').textContent = step
							document.querySelector('.uk-article .stepList').appendChild(cloneDiv)
						})
						item.ingredients.split('||').forEach(ingred => {
							let ingreds = document.createElement('li')
							ingreds.textContent = ingred
							document.querySelector('.uk-list.uk-list-large').appendChild(ingreds)
						})
					});
			}

			if (window.location.href.includes("recipe-by-me.html")) {
				var id = getCookie("user_id")
				var maindata = []
				fetch('backend/get_data.php?action=recipes&user__recipes_id=' + id)
					.then(response => response.json())
					.then(data => {
						let DivtoClone = document.querySelector(".uk-child-width-1-2 .uk-card").cloneNode(true);
						document.querySelector(".uk-child-width-1-2 .uk-card").remove()
						maindata = data
						data = data.filter(function (number) {
							return number.status == 1;
						});
						fetch('backend/get_data.php?table=star__comments')
							.then(response => response.json())
							.then(star => {
								var ObjStar = {}
								star.forEach(item => {
									ObjStar[item.recipes_id] = {
										quantity_review: item.quantity_review,
										star_avg: item.star_avg
									}
								})
								data.forEach(item => {
									let cloneDiv = DivtoClone.cloneNode(true)
									cloneDiv.querySelectorAll('.uk-position-xsmall a')[0].href = 'recipe-add.html?id=' + item.id;
									cloneDiv.querySelectorAll('.uk-position-xsmall a')[1].href = 'backend/delete.php?recipe_by_me=' + item.id;
									cloneDiv.querySelector('img').src = item.img;
									cloneDiv.querySelector('h3').textContent = item.title
									cloneDiv.querySelector('a.uk-position-cover').href = 'recipe-info.html?id=' + item.id;

									if (ObjStar[item.id]) {
										cloneDiv.querySelectorAll('.uk-width-auto span')[1].textContent = ObjStar[item.id].star_avg
										cloneDiv.querySelectorAll('.uk-width-auto span')[2].textContent = `(${ObjStar[item.id].quantity_review})`
										item.quantity_review = ObjStar[item.id].quantity_review
										item.star_avg = ObjStar[item.id].star_avg
									}
									else {
										cloneDiv.querySelectorAll('.uk-width-auto span')[1].textContent = 'Chưa có đánh giá'
										cloneDiv.querySelectorAll('.uk-width-auto span')[2].remove()
										item.quantity_review = 0
										item.star_avg = 0
									}
									document.querySelector(".uk-child-width-1-2").appendChild(cloneDiv)
								})

							})

						var data_search = document.querySelector('#recipes_search');
						data_search.addEventListener('input', () => {
							document.querySelector(".uk-child-width-1-2").innerHTML = ""
							maindata.forEach(item => {
								let cloneDiv = DivtoClone.cloneNode(true)
								cloneDiv.querySelectorAll('.uk-position-xsmall a')[0].href = 'recipe-add.html?id=' + item.id;
								cloneDiv.querySelectorAll('.uk-position-xsmall a')[1].href = 'backend/delete.php?recipe_by_me=' + item.id;
								cloneDiv.querySelector('img').src = item.img;
								cloneDiv.querySelector('h3').textContent = item.title
								cloneDiv.querySelector('a.uk-position-cover').href = 'recipe-info.html?id=' + item.id;

								if (item.title.toLowerCase().includes(data_search.value.toLowerCase()))
									document.querySelector(".uk-child-width-1-2").appendChild(cloneDiv)
							})
						})
					});
			}

			if (window.location.href.includes("recipe-pending.html")) {
				var id = getCookie("user_id")
				var maindata = []
				fetch('backend/get_data.php?action=recipes&user__recipes_id=' + id)
					.then(response => response.json())
					.then(data => {
						data = data.filter(function (number) {
							return number.status == 0;
						});
						let DivtoClone = document.querySelector(".uk-child-width-1-2 .uk-card").cloneNode(true);
						document.querySelector(".uk-child-width-1-2 .uk-card").remove()
						maindata = data
						fetch('backend/get_data.php?table=star__comments')
							.then(response => response.json())
							.then(star => {
								var ObjStar = {}
								star.forEach(item => {
									ObjStar[item.recipes_id] = {
										quantity_review: item.quantity_review,
										star_avg: item.star_avg
									}
								})
								data.forEach(item => {
									let cloneDiv = DivtoClone.cloneNode(true)
									cloneDiv.querySelectorAll('.uk-position-xsmall a')[0].href = 'recipe-add.html?id=' + item.id;
									cloneDiv.querySelectorAll('.uk-position-xsmall a')[1].href = 'backend/delete.php?recipe_by_me=' + item.id;
									cloneDiv.querySelector('img').src = item.img;
									cloneDiv.querySelector('h3').textContent = item.title
									cloneDiv.querySelector('a.uk-position-cover').href = 'recipe-info.html?id=' + item.id;

									if (ObjStar[item.id]) {
										cloneDiv.querySelectorAll('.uk-width-auto span')[1].textContent = ObjStar[item.id].star_avg
										cloneDiv.querySelectorAll('.uk-width-auto span')[2].textContent = `(${ObjStar[item.id].quantity_review})`
										item.quantity_review = ObjStar[item.id].quantity_review
										item.star_avg = ObjStar[item.id].star_avg
									}
									else {
										cloneDiv.querySelectorAll('.uk-width-auto span')[1].textContent = 'Chưa có đánh giá'
										cloneDiv.querySelectorAll('.uk-width-auto span')[2].remove()
										item.quantity_review = 0
										item.star_avg = 0
									}
									document.querySelector(".uk-child-width-1-2").appendChild(cloneDiv)
								})

							})

						var data_search = document.querySelector('#recipes_search');
						data_search.addEventListener('input', () => {
							document.querySelector(".uk-child-width-1-2").innerHTML = ""
							maindata.forEach(item => {
								let cloneDiv = DivtoClone.cloneNode(true)
								cloneDiv.querySelectorAll('.uk-position-xsmall a')[0].href = 'recipe-add.html?id=' + item.id;
								cloneDiv.querySelectorAll('.uk-position-xsmall a')[1].href = 'backend/delete.php?recipe_by_me=' + item.id;
								cloneDiv.querySelector('img').src = item.img;
								cloneDiv.querySelector('h3').textContent = item.title
								cloneDiv.querySelector('a.uk-position-cover').href = 'recipe-info.html?id=' + item.id;

								if (item.title.toLowerCase().includes(data_search.value.toLowerCase()))
									document.querySelector(".uk-child-width-1-2").appendChild(cloneDiv)
							})
						})
					});
			}
			if (window.location.href.includes("recipe-favorite.html")) {
				var id = getCookie("user_id")
				var maindata = []
				fetch('backend/get_data.php?action=favorite&user__recipes_id=' + id)
					.then(response => response.json())
					.then(data => {
						maindata = data
						let DivtoClone = document.querySelector(".uk-child-width-1-2 .uk-card").cloneNode(true);
						document.querySelector(".uk-child-width-1-2 .uk-card").remove()
						fetch('backend/get_data.php?table=star__comments')
							.then(response => response.json())
							.then(star => {
								var ObjStar = {}
								star.forEach(item => {
									ObjStar[item.recipes_id] = {
										quantity_review: item.quantity_review,
										star_avg: item.star_avg
									}
								})

								data.forEach(item => {
									let cloneDiv = DivtoClone.cloneNode(true)
									cloneDiv.querySelector('.uk-position-xsmall a').setAttribute('recipes_id', item.recipes_id);
									cloneDiv.querySelector('img').src = item.img;
									cloneDiv.querySelector('h3').textContent = item.title
									cloneDiv.querySelector('.uk-width-expand').textContent = 'bởi: ' + item.name
									cloneDiv.querySelector('a.uk-position-cover').href = 'recipe-info.html?id=' + item.recipes_id;

									if (ObjStar[item.id]) {
										cloneDiv.querySelectorAll('.uk-width-auto span')[1].textContent = ObjStar[item.id].star_avg
										cloneDiv.querySelectorAll('.uk-width-auto span')[2].textContent = `(${ObjStar[item.id].quantity_review})`
										item.quantity_review = ObjStar[item.id].quantity_review
										item.star_avg = ObjStar[item.id].star_avg
									}
									else {
										cloneDiv.querySelectorAll('.uk-width-auto span')[1].textContent = 'Chưa có đánh giá'
										cloneDiv.querySelectorAll('.uk-width-auto span')[2].remove()
										item.quantity_review = 0
										item.star_avg = 0
									}
									document.querySelector(".uk-child-width-1-2").appendChild(cloneDiv)
								})

							})

						var data_search = document.querySelector('#recipes_search');
						data_search.addEventListener('input', () => {
							document.querySelector(".uk-child-width-1-2").innerHTML = ""
							maindata.forEach(item => {
								let cloneDiv = DivtoClone.cloneNode(true)
								cloneDiv.querySelector('.uk-position-xsmall a').setAttribute('recipes_id', item.recipes_id);
								cloneDiv.querySelector('img').src = item.img;
								cloneDiv.querySelector('h3').textContent = item.title
								cloneDiv.querySelector('.uk-width-expand').textContent = 'bởi: ' + item.name
								cloneDiv.querySelector('a.uk-position-cover').href = 'recipe-info.html?id=' + item.recipes_id;

								if (item.title.toLowerCase().includes(data_search.value.toLowerCase()))
									document.querySelector(".uk-child-width-1-2").appendChild(cloneDiv)
							})
						})
					});
			}
		});
});
