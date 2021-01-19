function AddPanel() {

	// var backgroundDiv = document.createElement('div');
	// backgroundDiv.id = "backgroundDiv";
	// backgroundDiv.className = 'backgroundDiv';
	// // document.body.appendChild(backgroundDiv);
	// $(backgroundDiv).on('click touchend', function (event) {
	// 	myFunction();
	// 	event.stopPropagation();
	// 	event.preventDefault();
	// });

	var InfoButtonDiv = document.createElement('div');
	InfoButtonDiv.id = "infoContainer";
	InfoButtonDiv.className = 'infoContainer';


	var panel = document.createElement('div');
	panel.className = 'panel';
	panel.id = "panel";

	var title = document.createElement('div');
	title.className = 'title';
	title.id = "title";
	title.innerHTML += '<h2>Scroll Container</h2>';
	title.innerHTML += '<h4>Scroll Container</h4>';


	var linkButton = document.createElement('div');
	linkButton.className = 'linkButton';
	linkButton.id = "linkButton";
	linkButton.textContent = 'GOOGLE';
	$(linkButton).on('click touchend', function (event) {
		linkFunction();
		event.stopPropagation();
		event.preventDefault();
	});

	var swiperContainer = document.createElement('div');
	swiperContainer.className = 'swiper-container';
	swiperContainer.id = "swiper-container";

	var swiperWrapper = document.createElement('div');
	swiperWrapper.className = 'swiper-wrapper';
	// swiperWrapper.id = "swiper-wrapper";
	swiperContainer.appendChild(swiperWrapper);

	var swiperSlide = document.createElement('div');
	swiperSlide.className = 'swiper-slide';
	// swiperSlide.id = "swiper-slide";
	swiperWrapper.appendChild(swiperSlide);

	swiperSlide.innerHTML += '<h4>Scroll Container</h4>';
	swiperSlide.innerHTML += '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In luctus, ex eu sagittis faucibus, ligula ipsum sagittis magna, et imperdiet dolor lectus eu libero. Vestibulum venenatis eget turpis sed faucibus. Maecenas in ullamcorper orci, eu ullamcorper sem. Etiam elit ante, luctus non ante sit amet, sodales vulputate odio. Aenean tristique nisl tellus, sit amet fringilla nisl volutpat cursus. Quisque dignissim lectus ac nunc consectetur mattis. Proin vel hendrerit ipsum, et lobortis dolor. Vestibulum convallis, nibh et tincidunt tristique, nisl risus facilisis lectus, ut interdum orci nisl ac nunc. Cras et aliquam felis. Quisque vel ipsum at elit sodales posuere eget non est. Fusce convallis vestibulum dolor non volutpat. Vivamus vestibulum quam ut ultricies pretium.</p>';
	swiperSlide.innerHTML += '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In luctus, ex eu sagittis faucibus, ligula ipsum sagittis magna, et imperdiet dolor lectus eu libero. Vestibulum venenatis eget turpis sed faucibus. Maecenas in ullamcorper orci, eu ullamcorper sem. Etiam elit ante, luctus non ante sit amet, sodales vulputate odio. Aenean tristique nisl tellus, sit amet fringilla nisl volutpat cursus. Quisque dignissim lectus ac nunc consectetur mattis. Proin vel hendrerit ipsum, et lobortis dolor. Vestibulum convallis, nibh et tincidunt tristique, nisl risus facilisis lectus, ut interdum orci nisl ac nunc. Cras et aliquam felis. Quisque vel ipsum at elit sodales posuere eget non est. Fusce convallis vestibulum dolor non volutpat. Vivamus vestibulum quam ut ultricies pretium.</p>';


	var swiperScrollbar = document.createElement('div');
	swiperScrollbar.className = 'swiper-scrollbar';
	// swiperScrollbar.id = "swiper-scrollbar";
	swiperContainer.appendChild(swiperScrollbar);



	var label = document.createElement('div');
	label.className = 'label';
	label.id = 'label';
	label.textContent = '+';
	$(label).on('click touchend', function (event) {
		myFunction();
		event.stopPropagation();
		event.preventDefault();
	});

	InfoButtonDiv.appendChild(panel);

	panel.appendChild(title);
	InfoButtonDiv.appendChild(label);

	panel.appendChild(swiperContainer);

	panel.appendChild(linkButton);

	InfoButton = new CSS2DObject(InfoButtonDiv);
	InfoButton.position.set(-2, 15, -1);

	InfoButton2 = new CSS2DObject(InfoButtonDiv);
	// InfoButton2.position.set(0, 15, 0);

	// backgroundButton = new CSS2DObject(backgroundDiv);
	// scene.add(backgroundButton);


	swiper = new Swiper(swiperContainer, {
		direction: 'vertical',
		slidesPerView: 'auto',
		freeMode: true,
		scrollbar: {
			el: swiperScrollbar,
		},
		mousewheel: true,
	});
}