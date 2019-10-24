//----------------------------------------------------------
function getPosts() {
    let listPosts = [];
    $.ajax({
        url: '/api/blog-posts',
        method: 'GET'
    }).done((result) => {

        for(let post of result) {
            console.log(post.id);
            let date = new Date(post.publishDate);
            listPosts.push(
                '<div class="card">' +
                '<div class="card-body">' +
                '<h4 class="card-title">'+ post.title+'</h4>' +
                '<div class="card-subtitle mb-2 text-muted">' +
                '<h6>'+ post.author +'</h6>' +
                '<h6>'+ date.toLocaleTimeString() + " "+ date.toDateString() +'</h6>' +
                '</div>'+
                '<p>'+ post.content +'</p>'+
                '<div class="Buttons">' +
                '<button id="Edit" type="button" class="btn btn-primary">EDIT</button>'+
                '<button id="Delete" type="button" class="btn btn-danger" onclick="deletePost(\''+ post.id + '\')">DELETE</button>'+
                '</div>'+
                '</div>' +
                '</div>'
            );
        }

        $('#ListOfPosts').append(listPosts);
    });
}

//----------------------------------------------------------
function deletePost(postId) {
    $.ajax({
        url: '/api/blog-posts/' + postId,
        method: 'DELETE'
    }).done((result) => {
        addAlert(result.message, 'success');
        $('#ListOfPosts').empty();
        getPosts();
    }).fail((error) => {
        addAlert(
            error.status + " " + error.responseJSON.error,
            'danger'
        );
    });
}

//----------------------------------------------------------
function addAlert(strMessage, strType) {
    $('.AlertContainter').append(
        '<div class="alert alert-'+ strType +'" role="alert">' +
        strMessage +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '    <span aria-hidden="true">&times;</span>' +
        '  </button>'+
        '</div>'
    );
    _dissmissAlert();
}

//----------------------------------------------------------
function _dissmissAlert() {
    $(".alert").fadeTo(2000, 500).slideUp(500, function(){
        $(".alert").slideUp(500);
        $('.AlertContainter').innerHTML.remove();
    });
}

getPosts();