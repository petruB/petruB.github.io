var vp_path="https://tshop-virtuelles-regal.telekom-dienste.de/#/?deeplink=true&vp=123";

var startVp = () => {
    var iframe = document.createElement('iframe');
    var app = document.getElementById('app');
    iframe.style.position = "fixed";
	iframe.style.top = 0;
	iframe.style.left = 0;
	iframe.style.right = 0;
	iframe.style.bottom = 0;
	iframe.style.width = "100%";
	iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.src = vp_path;
    document.body.prepend(iframe);
    app.style.display = 'none';
    window.addEventListener('message', function (event) {
        if (iframe.parentNode && event.data == "closeVirtualShelf") {
            iframe.parentNode.removeChild(iframe);
            app.style.display = 'block';
        }

    });
}
